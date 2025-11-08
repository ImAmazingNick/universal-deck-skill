"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface PhotoNarrativeFlowProps {
  imageSrc?: string;
  imageAlt?: string;
  text?: string;
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const PhotoNarrativeFlow: React.FC<PhotoNarrativeFlowProps> = ({
  imageSrc,
  imageAlt = "Product Image",
  text = "Tell your story here. This layout combines compelling visuals with narrative text to create an engaging flow that captures attention and communicates your message effectively.",
  layout,
  theme,
  className
}) => {
  const defaultItems: DeckItem[] = [
    {
      i: 'image',
      x: 0,
      y: 1,
      w: 7,
      h: 10,
      type: 'photo-card',
      data: {
        src: imageSrc || '',
        alt: imageAlt
      }
    },
    createTextItem('text', text, 7, 1, 5, 10, {
      size: 'lg',
      align: 'left',
      weight: 'medium'
    })
  ];

  const { items } = mergeLayoutItems(layout, defaultItems);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      backgroundPattern="vignette"
      patternIntensity="subtle"
      className={className}
    />
  );
};
