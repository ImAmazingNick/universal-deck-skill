"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';
import { BackgroundPattern, PatternType } from './utils/background-patterns';

interface BaseLayoutProps {
  items: DeckItem[];
  theme: ThemeConfig;
  header?: DeckItem;
  layout?: LayoutConfig;
  backgroundPattern?: PatternType;
  patternIntensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
  children?: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  items,
  theme,
  header,
  layout,
  backgroundPattern = 'subtle-dots',
  patternIntensity = 'subtle',
  className,
  children
}) => {
  // Use header from layout config if provided, otherwise use prop
  const headerItem = layout?.header || header;

  return (
    <div
      className={cn(
        "w-full h-full relative overflow-hidden",
        "transition-all duration-500 ease-out",
        "before:absolute before:inset-0 before:pointer-events-none",
        "before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-black/5",
        "before:opacity-50",
        className
      )}
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Background Pattern */}
      <BackgroundPattern
        pattern={backgroundPattern}
        theme={theme}
        intensity={patternIntensity}
      />

      {/* Elegant overlay gradient for depth and visual interest */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            135deg,
            ${theme.colors.primary}06 0%,
            transparent 40%,
            transparent 60%,
            ${theme.colors.accent}04 100%
          )`,
        }}
      />

      {/* Subtle radial gradient overlay for focus */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(
            ellipse 80% 50% at 50% 50%,
            transparent 0%,
            ${theme.colors.background}15 100%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        <SlideGrid
          items={items}
          header={headerItem}
          theme={theme}
          className="h-full"
        />
        {children}
      </div>
    </div>
  );
};

