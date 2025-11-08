"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface PhotoNarrativeFlowProps {
  imageSrc?: string;
  imageAlt?: string;
  text?: string;
  theme: ThemeConfig;
  className?: string;
}

export const PhotoNarrativeFlow: React.FC<PhotoNarrativeFlowProps> = ({
  imageSrc,
  imageAlt = "Product Image",
  text = "Tell your story here. This layout combines compelling visuals with narrative text to create an engaging flow that captures attention and communicates your message effectively.",
  theme,
  className
}) => {
  const items: DeckItem[] = [
    {
      i: 'image',
      x: 0,
      y: 1,
      w: 7,
      h: 10,
      type: 'photo-card',
      data: {
        src: imageSrc || '',
        alt: imageAlt
      }
    },
    {
      i: 'text',
      x: 7,
      y: 1,
      w: 5,
      h: 10,
      type: 'text',
      data: {
        text: text,
        size: 'lg',
        align: 'left',
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
      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${theme.colors.background} 70%)`,
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
