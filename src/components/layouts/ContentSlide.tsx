"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createRichTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface ContentSlideProps {
  title?: string;
  subtitle?: string;
  content?: string;
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  title = "Content Title",
  subtitle = "Content Subtitle",
  content = "This is a content slide with modern typography. Use this layout for detailed explanations, documentation, or any text-heavy content that needs clear hierarchy and readability.",
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    createRichTextItem('title', title, 0, 0, 12, 3, {
      type: 'header',
      size: 'xl',
      align: 'left',
      variant: 'default'
    }),
    createRichTextItem('subtitle', subtitle, 0, 3, 12, 2, {
      type: 'subheader',
      size: 'base',
      align: 'left',
      variant: 'muted'
    }),
    createRichTextItem('content', content, 0, 5, 12, 8, {
      type: 'paragraph',
      size: 'base',
      align: 'left',
      variant: 'default'
    })
  ];

  const { items } = mergeLayoutItems(layout, defaultItems);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      backgroundPattern="grid"
      patternIntensity="subtle"
      className={className}
    />
  );
};


