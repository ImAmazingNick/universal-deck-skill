import React from 'react';
import { ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

export type PatternType = 
  | 'subtle-dots'
  | 'grid'
  | 'diagonal'
  | 'radial'
  | 'vignette'
  | 'gradient-mesh'
  | 'minimal-grid'
  | 'none';

interface BackgroundPatternProps {
  pattern: PatternType;
  theme: ThemeConfig;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  pattern,
  theme,
  className,
  intensity = 'subtle'
}) => {
  const opacityMap = {
    subtle: 0.03,
    medium: 0.05,
    strong: 0.08
  };

  const opacity = opacityMap[intensity];

  if (pattern === 'none') return null;

  // Helper to create color with opacity
  const withOpacity = (color: string, op: number) => {
    // Convert hex to rgba if needed
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${op})`;
    }
    return color;
  };

  const patterns: Record<PatternType, React.CSSProperties> = {
    'subtle-dots': {
      backgroundImage: `radial-gradient(circle at 25% 25%, ${withOpacity(theme.colors.primary, opacity * 30)} 1px, transparent 1px),
                       radial-gradient(circle at 75% 75%, ${withOpacity(theme.colors.accent, opacity * 30)} 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    },
    'grid': {
      backgroundImage: `linear-gradient(${withOpacity(theme.colors.border, opacity * 20)} 1px, transparent 1px),
                       linear-gradient(90deg, ${withOpacity(theme.colors.border, opacity * 20)} 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    },
    'diagonal': {
      backgroundImage: `linear-gradient(45deg, ${withOpacity(theme.colors.border, opacity * 20)} 25%, transparent 25%),
                       linear-gradient(-45deg, ${withOpacity(theme.colors.border, opacity * 20)} 25%, transparent 25%),
                       linear-gradient(45deg, transparent 75%, ${withOpacity(theme.colors.border, opacity * 20)} 75%),
                       linear-gradient(-45deg, transparent 75%, ${withOpacity(theme.colors.border, opacity * 20)} 75%)`,
      backgroundSize: '20px 20px',
    },
    'radial': {
      backgroundImage: `radial-gradient(circle at 20% 80%, ${withOpacity(theme.colors.primary, opacity * 40)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${withOpacity(theme.colors.accent, opacity * 40)} 0%, transparent 50%)`,
    },
    'vignette': {
      background: `radial-gradient(ellipse at center, transparent 0%, ${withOpacity(theme.colors.background, opacity * 60)} 70%)`,
    },
    'gradient-mesh': {
      backgroundImage: `radial-gradient(circle at 0% 0%, ${withOpacity(theme.colors.primary, opacity * 30)} 0%, transparent 50%),
                       radial-gradient(circle at 100% 100%, ${withOpacity(theme.colors.accent, opacity * 30)} 0%, transparent 50%)`,
    },
    'minimal-grid': {
      backgroundImage: `linear-gradient(${withOpacity(theme.colors.border, opacity * 20)} 1px, transparent 1px)`,
      backgroundSize: '0 50px',
    },
    'none': {}
  };

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={patterns[pattern]}
    />
  );
};

