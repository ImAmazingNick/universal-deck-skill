"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface CallToActionProps {
  headline?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  headline = "Ready to Get Started?",
  buttonText = "Contact Us Today",
  buttonVariant = 'primary',
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    createTextItem('headline', headline, 1, 2, 10, 5, {
      size: '4xl',
      align: 'center',
      weight: 'bold'
    }),
    {
      i: 'button',
      x: 4,
      y: 7,
      w: 4,
      h: 3,
      type: 'button',
      data: {
        text: buttonText,
        variant: buttonVariant
      }
    }
  ];

  const { items } = mergeLayoutItems(layout, defaultItems);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      backgroundPattern="gradient-mesh"
      patternIntensity="medium"
      className={className}
    />
  );
};
