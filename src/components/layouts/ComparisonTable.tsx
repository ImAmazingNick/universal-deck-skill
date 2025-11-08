"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { mergeLayoutItems } from './utils/layout-helpers';

interface ComparisonTableProps {
  headers?: string[];
  rows?: string[][];
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  headers = ["Feature", "Our Solution", "Competitor A", "Competitor B"],
  rows = [
    ["Speed", "Lightning Fast", "Fast", "Slow"],
    ["Reliability", "99.9% Uptime", "99.5% Uptime", "98% Uptime"],
    ["Cost", "$29/month", "$49/month", "$39/month"],
    ["Support", "24/7 Premium", "Business Hours", "Email Only"]
  ],
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    {
      i: 'table',
      x: 0,
      y: 0,
      w: 12,
      h: 8,
      type: 'table',
      data: {
        headers,
        rows
      }
    }
  ];

  const { items } = mergeLayoutItems(layout, defaultItems);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      backgroundPattern="minimal-grid"
      patternIntensity="subtle"
      className={className}
    />
  );
};
