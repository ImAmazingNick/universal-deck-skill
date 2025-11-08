"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, mergeLayoutItems } from './utils/layout-helpers';

interface DataGridDashboardProps {
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const DataGridDashboard: React.FC<DataGridDashboardProps> = ({
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    { 
      i: "kpi1", 
      x: 0, 
      y: 0, 
      w: 3, 
      h: 4, 
      type: "kpi-card", 
      data: { 
        metric: "24%", 
        label: "Growth", 
        icon: "trending-up" 
      } 
    },
    { 
      i: "kpi2", 
      x: 3, 
      y: 0, 
      w: 3, 
      h: 4, 
      type: "kpi-card", 
      data: { 
        metric: "$2.5M", 
        label: "Revenue", 
        icon: "dollar-sign" 
      } 
    },
    { 
      i: "kpi3", 
      x: 6, 
      y: 0, 
      w: 3, 
      h: 4, 
      type: "kpi-card", 
      data: { 
        metric: "150k", 
        label: "Users", 
        icon: "users" 
      } 
    },
    { 
      i: "kpi4", 
      x: 9, 
      y: 0, 
      w: 3, 
      h: 4, 
      type: "kpi-card", 
      data: { 
        metric: "95%", 
        label: "Satisfaction", 
        icon: "smile" 
      } 
    }
  ];

  const defaultHeader = createDefaultHeader(
    "Key Performance Indicators",
    "Q4 2024 Dashboard"
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
