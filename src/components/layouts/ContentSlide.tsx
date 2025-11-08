"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface ContentSlideProps {
  title?: string;
  subtitle?: string;
  content?: string;
  theme: ThemeConfig;
  className?: string;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  title = "Content Title",
  subtitle = "Content Subtitle",
  content = "This is a content slide with modern typography. Use this layout for detailed explanations, documentation, or any text-heavy content that needs clear hierarchy and readability.",
  theme,
  className
}) => {
  const items: DeckItem[] = [
    {
      i: 'title',
      x: 0,
      y: 0,
      w: 12,
      h: 3,
      type: 'rich-text',
      data: {
        content: title,
        type: 'header',
        size: 'xl',
        align: 'left',
        variant: 'default'
      }
    },
    {
      i: 'subtitle',
      x: 0,
      y: 3,
      w: 12,
      h: 2,
      type: 'rich-text',
      data: {
        content: subtitle,
        type: 'subheader',
        size: 'base',
        align: 'left',
        variant: 'muted'
      }
    },
    {
      i: 'content',
      x: 0,
      y: 5,
      w: 12,
      h: 8,
      type: 'rich-text',
      data: {
        content: content,
        type: 'paragraph',
        size: 'base',
        align: 'left',
        variant: 'default'
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
          backgroundImage: `linear-gradient(${theme.colors.border} 1px, transparent 1px),
                           linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
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


