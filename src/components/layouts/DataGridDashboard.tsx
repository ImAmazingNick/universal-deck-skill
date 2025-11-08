"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

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
  // Use layout configuration if provided, otherwise use default items
  const defaultItems: DeckItem[] = [
    { i: "kpi1", x: 0, y: 0, w: 3, h: 4, type: "kpi-card", data: { metric: "24%", label: "Growth", icon: "trending-up" } },
    { i: "kpi2", x: 3, y: 0, w: 3, h: 4, type: "kpi-card", data: { metric: "$2.5M", label: "Revenue", icon: "dollar-sign" } },
    { i: "kpi3", x: 6, y: 0, w: 3, h: 4, type: "kpi-card", data: { metric: "150k", label: "Users", icon: "users" } },
    { i: "kpi4", x: 9, y: 0, w: 3, h: 4, type: "kpi-card", data: { metric: "95%", label: "Satisfaction", icon: "smile" } }
  ];

  const defaultHeader: DeckItem = { i: "header", x: 0, y: 0, w: 12, h: 3, type: "header", data: { title: "Key Performance Indicators", subtitle: "Q4 2024 Dashboard" } };

  // Use layout configuration if provided, otherwise use defaults
  const gridItems = layout?.items || defaultItems;
  const headerItem = layout?.header || defaultHeader;

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.colors.border} 1px, transparent 1px),
                           linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <SlideGrid
        items={gridItems}
        header={headerItem}
        theme={theme}
        className="relative z-10"
      />
    </div>
  );
};
