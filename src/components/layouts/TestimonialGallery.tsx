"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, mergeLayoutItems } from './utils/layout-helpers';

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
  const defaultItems: DeckItem[] = [
    { 
      i: "testimonial1", 
      x: 0, 
      y: 0, 
      w: 6, 
      h: 4, 
      type: "testimonial", 
      data: { 
        quote: "This product transformed our workflow completely.", 
        author: "Sarah Johnson", 
        role: "CTO", 
        company: "TechCorp" 
      } 
    },
    { 
      i: "testimonial2", 
      x: 6, 
      y: 0, 
      w: 6, 
      h: 4, 
      type: "testimonial", 
      data: { 
        quote: "Outstanding results that exceeded our expectations.", 
        author: "Mike Chen", 
        role: "CEO", 
        company: "StartupXYZ" 
      } 
    }
  ];

  const defaultHeader = createDefaultHeader(
    "Customer Testimonials",
    "What Our Clients Say"
  );

  const { items, header } = mergeLayoutItems(layout, defaultItems, defaultHeader);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      header={header}
      backgroundPattern="subtle-dots"
      patternIntensity="subtle"
      className={className}
    />
  );
};
