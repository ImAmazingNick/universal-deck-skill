"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface BoldMinimalistHeroProps {
  title?: string;
  subtitle?: string;
  theme: ThemeConfig;
  className?: string;
}

export const BoldMinimalistHero: React.FC<BoldMinimalistHeroProps> = ({
  title = "Bold Title",
  subtitle = "Compelling subtitle that captures attention",
  theme,
  className
}) => {
  const items: DeckItem[] = [
    {
      i: 'title',
      x: 1,
      y: 2,
      w: 10,
      h: 6,
      type: 'text',
      data: {
        text: title,
        size: '5xl',
        align: 'center',
        weight: 'extrabold'
      }
    },
    {
      i: 'subtitle',
      x: 1,
      y: 8,
      w: 10,
      h: 3,
      type: 'text',
      data: {
        text: subtitle,
        size: 'xl',
        align: 'center',
        weight: 'medium'
      }
    }
  ];

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.colors.primary} 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, ${theme.colors.accent} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <SlideGrid
        items={items}
        theme={theme}
        className="relative z-10"
      />
    </div>
  );
};
