"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, mergeLayoutItems } from './utils/layout-helpers';

interface MetricsBreakdownProps {
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    { 
      i: "metric1", 
      x: 0, 
      y: 0, 
      w: 4, 
      h: 3, 
      type: "metric-card", 
      data: { 
        value: 85, 
        unit: "%", 
        label: "Conversion Rate", 
        change: 12, 
        changeLabel: "vs last month" 
      } 
    },
    { 
      i: "metric2", 
      x: 4, 
      y: 0, 
      w: 4, 
      h: 3, 
      type: "metric-card", 
      data: { 
        value: 120, 
        unit: "days", 
        label: "Retention Time", 
        change: 8, 
        changeLabel: "increase" 
      } 
    },
    { 
      i: "metric3", 
      x: 8, 
      y: 0, 
      w: 4, 
      h: 3, 
      type: "metric-card", 
      data: { 
        value: 4.8, 
        unit: "/5", 
        label: "User Rating", 
        change: 0.3, 
        changeLabel: "improvement" 
      } 
    }
  ];

  const defaultHeader = createDefaultHeader(
    "Performance Metrics",
    "Detailed KPI Analysis"
  );

  const { items, header } = mergeLayoutItems(layout, defaultItems, defaultHeader);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      header={header}
      backgroundPattern="grid"
      patternIntensity="subtle"
      className={className}
    />
  );
};
