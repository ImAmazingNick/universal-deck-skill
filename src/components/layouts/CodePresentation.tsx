"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, createRichTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface CodePresentationProps {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  explanation?: string;
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const CodePresentation: React.FC<CodePresentationProps> = ({
  title = "Code Example",
  description = "Understanding the implementation",
  code = `function helloWorld() {
  console.log("Hello, World!");
  return "success";
}`,
  language = "javascript",
  explanation = "This function demonstrates a basic greeting pattern. It logs a message to the console and returns a success status.",
  layout,
  theme,
  className
}) => {
  const defaultHeader = createDefaultHeader(title, description);

  const defaultItems: DeckItem[] = [
    {
      i: 'code',
      x: 0,
      y: 3,
      w: 8,
      h: 8,
      type: 'code',
      data: {
        code: code,
        language: language,
        showLineNumbers: true,
        theme: 'auto'
      }
    },
    createRichTextItem('explanation', explanation, 8, 3, 4, 8, {
      type: 'paragraph',
      size: 'sm',
      align: 'left',
      variant: 'default'
    })
  ];

  const { items, header } = mergeLayoutItems(layout, defaultItems, defaultHeader);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      header={header}
      backgroundPattern="radial"
      patternIntensity="subtle"
      className={className}
    />
  );
};


