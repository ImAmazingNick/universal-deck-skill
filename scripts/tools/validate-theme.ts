#!/usr/bin/env node
/**
 * Validate contrast ratios for HTML deck theme overrides.
 *
 * Usage examples:
 *   node scripts/dist/tools/validate-theme.js --config theme.json
 *   node scripts/dist/tools/validate-theme.js --json '{"--slide-background":"#101320","--slide-text-color":"#f5f7ff"}'
 *   node scripts/dist/tools/validate-theme.js --background-color=#0b0d14 --base-text-color=#f4f6ff
 */

import fs from 'fs';
import path from 'path';

type ThemeKeys =
  | 'backgroundColor'
  | 'baseTextColor'
  | 'slideBackground'
  | 'slideTextColor'
  | 'subtitleColor'
  | 'mutedTextColor'
  | 'accentColor';

type ThemeSpec = Record<ThemeKeys, string>;

const DEFAULT_THEME: ThemeSpec = {
  backgroundColor: '#000000',
  baseTextColor: '#ffffff',
  slideBackground: '#ffffff',
  slideTextColor: '#1c1f27',
  subtitleColor: '#343a4a',
  mutedTextColor: '#666d80',
  accentColor: '#ff6b35',
};

const KEY_ALIASES: Record<string, ThemeKeys> = {
  'background-color': 'backgroundColor',
  'base-text-color': 'baseTextColor',
  'slide-background': 'slideBackground',
  'slide-text-color': 'slideTextColor',
  'subtitle-color': 'subtitleColor',
  'muted-text-color': 'mutedTextColor',
  'accent-color': 'accentColor',
};

interface ContrastResult {
  label: string;
  ratio: number;
  threshold: number;
  status: 'PASS' | 'WARN' | 'FAIL';
  details?: string;
}

function usage(): never {
  const scriptName = path.basename(process.argv[1] ?? 'validate-theme.js');
  console.log(`HTML Deck Theme Contrast Validator

Usage:
  node scripts/dist/tools/${scriptName} --config path/to/theme.json
  node scripts/dist/tools/${scriptName} --json '{"--slide-background":"#111827","--slide-text-color":"#f9fafb"}'
  node scripts/dist/tools/${scriptName} --slide-background=#111827 --slide-text-color=#f9fafb

Accepted keys (camelCase or CSS variable form):
  backgroundColor / --background-color
  baseTextColor / --base-text-color
  slideBackground / --slide-background
  slideTextColor / --slide-text-color
  subtitleColor / --subtitle-color
  mutedTextColor / --muted-text-color
  accentColor / --accent-color
`);
  process.exit(0);
}

function normalizeKey(rawKey: string): ThemeKeys | undefined {
  const cleaned = rawKey.replace(/^--/, '').trim();
  if ((KEY_ALIASES as Record<string, ThemeKeys>)[cleaned]) {
    return KEY_ALIASES[cleaned];
  }
  if ((KEY_ALIASES as Record<string, ThemeKeys>)[cleaned.toLowerCase()]) {
    return KEY_ALIASES[cleaned.toLowerCase()];
  }
  if ((Object.keys(DEFAULT_THEME) as ThemeKeys[]).includes(cleaned as ThemeKeys)) {
    return cleaned as ThemeKeys;
  }
  return undefined;
}

function parseArgs(): Partial<ThemeSpec> {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    usage();
  }

  const overrides: Partial<ThemeSpec> = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--config' || arg === '-c') {
      const filePath = args[i + 1];
      if (!filePath) throw new Error('Missing value for --config');
      i += 1;
      const contents = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(contents) as Record<string, string>;
      Object.entries(parsed).forEach(([key, value]) => {
        const normalizedKey = normalizeKey(key);
        if (normalizedKey) {
          overrides[normalizedKey] = value;
        }
      });
      continue;
    }

    if (arg === '--json') {
      const jsonString = args[i + 1];
      if (!jsonString) throw new Error('Missing value for --json');
      i += 1;
      const parsed = JSON.parse(jsonString) as Record<string, string>;
      Object.entries(parsed).forEach(([key, value]) => {
        const normalizedKey = normalizeKey(key);
        if (normalizedKey) {
          overrides[normalizedKey] = value;
        }
      });
      continue;
    }

    const [rawKey, rawValue] = arg.split('=');
    if (rawValue) {
      const normalizedKey = normalizeKey(rawKey.replace(/^--?/, ''));
      if (normalizedKey) {
        overrides[normalizedKey] = rawValue;
        continue;
      }
    }

    throw new Error(`Unrecognized argument: ${arg}`);
  }

  return overrides;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function parseColor(value: string): RGB | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith('linear-gradient') || trimmed.startsWith('radial-gradient')) {
    const match = trimmed.match(/#([\da-fA-F]{3,8})/);
    if (match) {
      return parseColor(match[0]);
    }
    return null;
  }

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(',').map((token) => parseFloat(token.trim()));
    if ([r, g, b].every((channel) => Number.isFinite(channel))) {
      return { r, g, b };
    }
  }

  return null;
}

function relativeLuminance({ r, g, b }: RGB): number {
  const transform = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  const R = transform(r);
  const G = transform(g);
  const B = transform(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(colorA: RGB, colorB: RGB): number {
  const L1 = relativeLuminance(colorA);
  const L2 = relativeLuminance(colorB);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

function evaluate(theme: ThemeSpec): ContrastResult[] {
  const results: ContrastResult[] = [];

  const checks: Array<{
    label: string;
    foreground: string;
    background: string;
    threshold: number;
    notes?: string;
  }> = [
    {
      label: 'Body text vs background',
      foreground: theme.baseTextColor,
      background: theme.backgroundColor,
      threshold: 4.5,
      notes: 'Adjust --base-text-color or --background-color to meet WCAG AA.',
    },
    {
      label: 'Slide text vs slide background',
      foreground: theme.slideTextColor,
      background: theme.slideBackground,
      threshold: 4.5,
      notes: 'Tweaking --slide-text-color or --slide-background will improve readability.',
    },
    {
      label: 'Subtitle vs slide background',
      foreground: theme.subtitleColor,
      background: theme.slideBackground,
      threshold: 4.5,
    },
    {
      label: 'Muted text vs slide background',
      foreground: theme.mutedTextColor,
      background: theme.slideBackground,
      threshold: 3,
      notes: 'Muted text may be short copy; 3:1 contrast is recommended.',
    },
    {
      label: 'Accent vs slide background',
      foreground: theme.accentColor,
      background: theme.slideBackground,
      threshold: 3,
      notes: 'Ensures CTAs, nav dots, or badges remain visible.',
    },
  ];

  checks.forEach((check) => {
    const fg = parseColor(check.foreground);
    const bg = parseColor(check.background);
    if (!fg || !bg) {
      results.push({
        label: check.label,
        ratio: NaN,
        threshold: check.threshold,
        status: 'WARN',
        details: `Skipped – unable to parse colors for ${check.foreground} or ${check.background}.`,
      });
      return;
    }

    const ratio = contrastRatio(fg, bg);
    const status: ContrastResult['status'] =
      ratio >= check.threshold ? 'PASS' : ratio >= check.threshold * 0.85 ? 'WARN' : 'FAIL';

    const formattedRatio = Math.round(ratio * 100) / 100;
    results.push({
      label: check.label,
      ratio: formattedRatio,
      threshold: check.threshold,
      status,
      details: ratio >= check.threshold ? undefined : check.notes,
    });
  });

  return results;
}

function main(): void {
  try {
    const overrides = parseArgs();
    const theme: ThemeSpec = { ...DEFAULT_THEME, ...overrides };
    const results = evaluate(theme);
    const hasFailure = results.some((result) => result.status === 'FAIL');
    const hasWarning = results.some((result) => result.status === 'WARN');

    console.log('HTML Deck Theme Contrast Report');
    console.log('================================');
    results.forEach((result) => {
      const statusLabel = result.status.padEnd(4, ' ');
      if (Number.isNaN(result.ratio)) {
        console.log(`- ${statusLabel} ${result.label}: ${result.details}`);
      } else {
        console.log(`- ${statusLabel} ${result.label}: ${result.ratio.toFixed(2)}:1 (target ≥ ${result.threshold})`);
        if (result.details) {
          console.log(`    › ${result.details}`);
        }
      }
    });

    if (hasFailure) {
      process.exitCode = 2;
    } else if (hasWarning) {
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  } catch (error) {
    console.error('Theme validation failed:', (error as Error).message);
    process.exitCode = 2;
  }
}

main();


