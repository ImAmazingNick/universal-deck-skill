"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  headers?: string[];
  rows?: string[][];
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
  theme,
  className
}) => {
  const items: DeckItem[] = [
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

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Table-focused clean background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${theme.colors.border} 1px, transparent 1px)`,
          backgroundSize: '0 50px',
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
