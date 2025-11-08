"use client";

import React from 'react';
import { DeckItem, ThemeConfig, LayoutConfig } from '@/lib/deck-types';
import { BaseLayout } from './BaseLayout';
import { createDefaultHeader, createRichTextItem, mergeLayoutItems } from './utils/layout-helpers';

interface DocumentationSlideProps {
  title?: string;
  section?: string;
  lead?: string;
  features?: string[];
  codeExample?: string;
  note?: string;
  layout?: LayoutConfig;
  theme: ThemeConfig;
  className?: string;
}

export const DocumentationSlide: React.FC<DocumentationSlideProps> = ({
  title = "API Documentation",
  section = "Getting Started",
  lead = "Learn how to integrate our API into your applications with these comprehensive examples and best practices.",
  features = [
    "RESTful endpoints with JSON responses",
    "OAuth 2.0 authentication",
    "Rate limiting and error handling",
    "Comprehensive SDK libraries"
  ],
  codeExample = `const client = new APIClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.example.com'
});

const response = await client.get('/users');`,
  note = "Remember to handle API errors gracefully in production environments.",
  layout,
  theme,
  className
}) => {
  const defaultHeader = createDefaultHeader(title, section);

  const defaultItems: DeckItem[] = [
    createRichTextItem('lead', lead, 0, 3, 12, 2, {
      type: 'lead',
      size: 'base',
      align: 'left',
      variant: 'default'
    }),
    {
      i: 'features',
      x: 0,
      y: 5,
      w: 6,
      h: 5,
      type: 'list',
      data: {
        items: features,
        type: 'bullet',
        size: 'sm',
        variant: 'default'
      }
    },
    {
      i: 'code',
      x: 6,
      y: 5,
      w: 6,
      h: 5,
      type: 'code',
      data: {
        code: codeExample,
        language: 'javascript',
        showLineNumbers: true,
        theme: 'auto'
      }
    },
    {
      i: 'note',
      x: 0,
      y: 10,
      w: 12,
      h: 2,
      type: 'note',
      data: {
        content: note,
        type: 'tip',
        variant: 'bordered'
      }
    }
  ];

  const { items, header } = mergeLayoutItems(layout, defaultItems, defaultHeader);

  return (
    <BaseLayout
      items={items}
      theme={theme}
      layout={layout}
      header={header}
      backgroundPattern="minimal-grid"
      patternIntensity="subtle"
      className={className}
    />
  );
};


