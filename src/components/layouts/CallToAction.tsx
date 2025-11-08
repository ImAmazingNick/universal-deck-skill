"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface CallToActionProps {
  headline?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  theme: ThemeConfig;
  className?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  headline = "Ready to Get Started?",
  buttonText = "Contact Us Today",
  buttonVariant = 'primary',
  theme,
  className
}) => {
  const items: DeckItem[] = [
    {
      i: 'headline',
      x: 1,
      y: 2,
      w: 10,
      h: 5,
      type: 'text',
      data: {
        text: headline,
        size: '4xl',
        align: 'center',
        weight: 'bold'
      }
    },
    {
      i: 'button',
      x: 4,
      y: 7,
      w: 4,
      h: 3,
      type: 'button',
      data: {
        text: buttonText,
        variant: buttonVariant
      }
    }
  ];

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.background} 100%)`,
      }}
    >
      {/* Action-oriented background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${theme.colors.accent},
            ${theme.colors.accent} 10px,
            transparent 10px,
            transparent 20px
          )`,
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
