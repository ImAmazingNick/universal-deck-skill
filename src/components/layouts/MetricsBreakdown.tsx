"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

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
  // Use layout configuration if provided, otherwise use default items
  const defaultItems: DeckItem[] = [
    { i: "metric1", x: 0, y: 0, w: 4, h: 3, type: "metric-card", data: { value: 85, unit: "%", label: "Conversion Rate", change: 12, changeLabel: "vs last month" } },
    { i: "metric2", x: 4, y: 0, w: 4, h: 3, type: "metric-card", data: { value: 120, unit: "days", label: "Retention Time", change: 8, changeLabel: "increase" } },
    { i: "metric3", x: 8, y: 0, w: 4, h: 3, type: "metric-card", data: { value: 4.8, unit: "/5", label: "User Rating", change: 0.3, changeLabel: "improvement" } }
  ];

  const defaultHeader: DeckItem = { i: "header", x: 0, y: 0, w: 12, h: 3, type: "header", data: { title: "Performance Metrics", subtitle: "Detailed KPI Analysis" } };

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
      {/* Metric-focused grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.colors.border} 1px, transparent 1px),
                           linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)`,
          backgroundSize: '25px 25px',
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
