"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, mergeLayoutItems, createTextItem } from './utils/layout-helpers';

interface ChartShowcaseProps {
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const ChartShowcase: React.FC<ChartShowcaseProps> = ({
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    {
      i: 'chart',
      x: 0,
      y: 0,
      w: 8,
      h: 6,
      type: 'chart',
      data: {
        type: 'bar',
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 },
          { name: 'May', value: 500 }
        ]
      }
    },
    createTextItem('legend', 
      "This chart shows our growth trajectory over the past 5 months, demonstrating consistent upward momentum and strong performance indicators.",
      8, 0, 4, 6,
      { size: 'sm', align: 'left' }
    )
  ];

  const defaultHeader = createDefaultHeader(
    "Data Visualization",
    "Performance Analytics"
  );

  const { items, header } = mergeLayoutItems(layout, defaultItems, defaultHeader);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      header={header}
      backgroundPattern="diagonal"
      patternIntensity="subtle"
      className={className}
    />
  );
};
