"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface DocumentationSlideProps {
  title?: string;
  section?: string;
  lead?: string;
  features?: string[];
  codeExample?: string;
  note?: string;
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
  theme,
  className
}) => {
  const items: DeckItem[] = [
    {
      i: 'header',
      x: 0,
      y: 0,
      w: 12,
      h: 3,
      type: 'header',
      data: {
        title: title,
        subtitle: section
      }
    },
    {
      i: 'lead',
      x: 0,
      y: 3,
      w: 12,
      h: 2,
      type: 'rich-text',
      data: {
        content: lead,
        type: 'lead',
        size: 'base',
        align: 'left',
        variant: 'default'
      }
    },
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

  return (
    <div
      className={cn("w-full h-full relative", className)}
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Documentation-style background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <SlideGrid
        items={items}
        header={items[0]}
        theme={theme}
        className="relative z-10"
      />
    </div>
  );
};


