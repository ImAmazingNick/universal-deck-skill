"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface TestimonialGalleryProps {
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const TestimonialGallery: React.FC<TestimonialGalleryProps> = ({
  layout,
  theme,
  className
}) => {
  // Use layout configuration if provided, otherwise use default items
  const defaultItems: DeckItem[] = [
    { i: "testimonial1", x: 0, y: 0, w: 6, h: 4, type: "testimonial", data: { quote: "This product transformed our workflow completely.", author: "Sarah Johnson", role: "CTO", company: "TechCorp" } },
    { i: "testimonial2", x: 6, y: 0, w: 6, h: 4, type: "testimonial", data: { quote: "Outstanding results that exceeded our expectations.", author: "Mike Chen", role: "CEO", company: "StartupXYZ" } }
  ];

  const defaultHeader: DeckItem = { i: "header", x: 0, y: 0, w: 12, h: 3, type: "header", data: { title: "Customer Testimonials", subtitle: "What Our Clients Say" } };

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
      {/* Subtle quote pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, ${theme.colors.primary} 2px, transparent 2px)`,
          backgroundSize: '40px 40px',
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
