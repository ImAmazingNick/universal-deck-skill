"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

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
  // Use layout configuration if provided, otherwise use default items
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
    {
      i: 'legend',
      x: 8,
      y: 0,
      w: 4,
      h: 6,
      type: 'text',
      data: {
        text: "This chart shows our growth trajectory over the past 5 months, demonstrating consistent upward momentum and strong performance indicators.",
        size: 'sm',
        align: 'left'
      }
    }
  ];

  const defaultHeader: DeckItem = { i: "header", x: 0, y: 0, w: 12, h: 3, type: "header", data: { title: "Data Visualization", subtitle: "Performance Analytics" } };

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
      {/* Clean grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(45deg, ${theme.colors.border} 25%, transparent 25%),
                           linear-gradient(-45deg, ${theme.colors.border} 25%, transparent 25%),
                           linear-gradient(45deg, transparent 75%, ${theme.colors.border} 75%),
                           linear-gradient(-45deg, transparent 75%, ${theme.colors.border} 75%)`,
          backgroundSize: '20px 20px',
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
