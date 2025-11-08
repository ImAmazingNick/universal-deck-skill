"use client";

import React from 'react';
import { SlideGrid } from '@/grid/SlideGrid';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface CodePresentationProps {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  explanation?: string;
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
        subtitle: description
      }
    },
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
    {
      i: 'explanation',
      x: 8,
      y: 3,
      w: 4,
      h: 8,
      type: 'rich-text',
      data: {
        content: explanation,
        type: 'paragraph',
        size: 'sm',
        align: 'left',
        variant: 'default'
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
      {/* Terminal-inspired background */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${theme.colors.primary} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${theme.colors.accent} 0%, transparent 50%)`,
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


