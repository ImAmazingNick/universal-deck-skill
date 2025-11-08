"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface BoldMinimalistHeroProps {
  title?: string;
  subtitle?: string;
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const BoldMinimalistHero: React.FC<BoldMinimalistHeroProps> = ({
  title = "Bold Title",
  subtitle = "Compelling subtitle that captures attention",
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    createTextItem('title', title, 1, 2, 10, 6, {
      size: '5xl',
      align: 'center',
      weight: 'extrabold'
    }),
    createTextItem('subtitle', subtitle, 1, 8, 10, 3, {
      size: 'xl',
      align: 'center',
      weight: 'medium'
    })
  ];

  const { items } = mergeLayoutItems(layout, defaultItems);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      backgroundPattern="subtle-dots"
      patternIntensity="subtle"
      className={className}
    />
  );
};
