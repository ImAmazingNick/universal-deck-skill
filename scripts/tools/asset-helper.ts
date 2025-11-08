#!/usr/bin/env node
/**
 * Asset helper CLI
 * -----------------
 * Supports:
 *   1. Simple Chart.js chart rendering via QuickChart -> data URI
 *   2. Generic asset encoding/compression to data URIs
 *
 * Examples:
 *   node scripts/dist/tools/asset-helper.js chart --type bar --labels Q1,Q2,Q3 --values 12,18,25 --title "Quarterly Revenue"
 *   node scripts/dist/tools/asset-helper.js chart --json '{"type":"line","data":{"labels":["W1","W2"],"datasets":[{"label":"Signups","data":[42,61]}]}}'
 *   node scripts/dist/tools/asset-helper.js encode --input path/to/logo.svg --mime image/svg+xml
 *   node scripts/dist/tools/asset-helper.js encode --input embeds/widget.html --mime text/html --gzip
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import QuickChart from 'quickchart-js';

type Command = 'chart' | 'encode' | 'help';

interface ChartOptions {
  type: string;
  labels: string[];
  values: number[];
  datasetLabel?: string;
  title?: string;
  backgroundColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  jsonConfig?: Record<string, unknown>;
  outputPath?: string;
}

interface EncodeOptions {
  inputPath: string;
  mimeType?: string;
  gzip?: boolean;
  outputPath?: string;
}

function parseCommand(): { command: Command; args: string[] } {
  const [maybeCommand, ...rest] = process.argv.slice(2);
  if (!maybeCommand || maybeCommand === 'help' || maybeCommand === '--help' || maybeCommand === '-h') {
    return { command: 'help', args: rest };
  }
  if (maybeCommand !== 'chart' && maybeCommand !== 'encode') {
    console.error(`Unknown command: ${maybeCommand}`);
    return { command: 'help', args: rest };
  }
  return { command: maybeCommand, args: rest };
}

function showHelp(): void {
  console.log(`Asset Helper CLI
=================

Usage:
  node scripts/dist/tools/asset-helper.js chart [options]
  node scripts/dist/tools/asset-helper.js encode [options]

Chart options (auto-build simple charts):
  --type <bar|line|doughnut|pie|radar>   Chart.js chart type (default: bar)
  --labels a,b,c                         Comma-separated labels
  --values 10,20,30                      Comma-separated numeric values
  --dataset-label "Series A"             Dataset label
  --title "Quarterly Revenue"            Optional chart title
  --background #0047ff                   Dataset background color
  --border #002d99                       Dataset border color
  --width 800                            Chart width (px)
  --height 400                           Chart height (px)
  --json '{...}'                         Provide full Chart.js config; overrides other options
  --output path/to/chart.txt             Write data URI to a file instead of stdout

Encode options (generic data URI helper):
  --input path/to/file.ext               Input file to encode
  --mime image/png                       Override MIME type (auto-detected when possible)
  --gzip                                 Compress content before encoding (data:application/gzip;base64,...)
  --output path/to/output.txt            Write data URI to file instead of stdout
`);
}

function parseChartOptions(args: string[]): ChartOptions {
  const options: ChartOptions = {
    type: 'bar',
    labels: [],
    values: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--type':
        options.type = args[++i] ?? options.type;
        break;
      case '--labels':
        options.labels = (args[++i] ?? '').split(',').map((label) => label.trim()).filter(Boolean);
        break;
      case '--values':
        options.values = (args[++i] ?? '')
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value));
        break;
      case '--dataset-label':
        options.datasetLabel = args[++i];
        break;
      case '--title':
        options.title = args[++i];
        break;
      case '--background':
        options.backgroundColor = args[++i];
        break;
      case '--border':
        options.borderColor = args[++i];
        break;
      case '--width':
        options.width = Number(args[++i]);
        break;
      case '--height':
        options.height = Number(args[++i]);
        break;
      case '--json': {
        const jsonString = args[++i];
        if (!jsonString) throw new Error('Missing value for --json');
        options.jsonConfig = JSON.parse(jsonString);
        break;
      }
      case '--output':
        options.outputPath = args[++i];
        break;
      default:
        throw new Error(`Unknown option for chart command: ${arg}`);
    }
  }

  if (!options.jsonConfig && (!options.labels.length || !options.values.length)) {
    throw new Error('Chart mode requires --labels and --values (or a full --json config).');
  }

  return options;
}

function parseEncodeOptions(args: string[]): EncodeOptions {
  const options: EncodeOptions = { inputPath: '' };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--input':
        options.inputPath = args[++i] ?? '';
        break;
      case '--mime':
        options.mimeType = args[++i];
        break;
      case '--gzip':
        options.gzip = true;
        break;
      case '--output':
        options.outputPath = args[++i];
        break;
      default:
        throw new Error(`Unknown option for encode command: ${arg}`);
    }
  }

  if (!options.inputPath) {
    throw new Error('Encode mode requires --input path/to/file');
  }

  return options;
}

async function buildChartDataUri(options: ChartOptions): Promise<string> {
  const qc = new QuickChart();
  let config: Record<string, unknown>;

  if (options.jsonConfig) {
    config = options.jsonConfig;
  } else {
    config = {
      type: options.type,
      data: {
        labels: options.labels,
        datasets: [
          {
            label: options.datasetLabel ?? 'Series A',
            data: options.values,
            backgroundColor: options.backgroundColor ?? 'rgba(255, 107, 53, 0.7)',
            borderColor: options.borderColor ?? '#ff6b35',
            borderWidth: 2,
            fill: options.type !== 'line',
            tension: options.type === 'line' ? 0.32 : undefined,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#1c1f27',
            },
          },
          title: options.title
            ? {
                display: true,
                text: options.title,
                color: '#1c1f27',
                font: { size: 20, weight: '600' },
              }
            : undefined,
        },
        scales:
          options.type === 'doughnut' || options.type === 'pie'
            ? undefined
            : {
                x: {
                  ticks: { color: '#1c1f27' },
                  grid: { display: false },
                },
                y: {
                  ticks: { color: '#1c1f27' },
                  beginAtZero: true,
                },
              },
      },
    };
  }

  qc.setConfig(config);
  if (options.width) qc.setWidth(options.width);
  if (options.height) qc.setHeight(options.height);
  qc.setBackgroundColor('transparent');

  return qc.toDataUrl({ format: 'png', devicePixelRatio: 2 });
}

function detectMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.json':
      return 'application/json';
    case '.html':
    case '.htm':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
}

function buildDataUri(options: EncodeOptions): string {
  const fileBuffer = fs.readFileSync(options.inputPath);
  const mimeType = options.mimeType ?? detectMimeType(options.inputPath);
  const payload = options.gzip ? zlib.gzipSync(fileBuffer) : fileBuffer;
  const encoded = payload.toString('base64');
  const suffix = options.gzip ? 'application/gzip' : mimeType;
  return `data:${suffix};base64,${encoded}`;
}

async function run(): Promise<void> {
  const { command, args } = parseCommand();

  if (command === 'help') {
    showHelp();
    return;
  }

  try {
    if (command === 'chart') {
      const options = parseChartOptions(args);
      const dataUri = await buildChartDataUri(options);
      if (options.outputPath) {
        fs.writeFileSync(options.outputPath, dataUri, 'utf8');
        console.log(`Chart data URI written to ${options.outputPath}`);
      } else {
        console.log(dataUri);
      }
      return;
    }

    if (command === 'encode') {
      const options = parseEncodeOptions(args);
      const dataUri = buildDataUri(options);
      if (options.outputPath) {
        fs.writeFileSync(options.outputPath, dataUri, 'utf8');
        console.log(`Data URI written to ${options.outputPath}`);
      } else {
        console.log(dataUri);
      }
      return;
    }
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}

void run();


