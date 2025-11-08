"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CodeData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface CodeCardProps {
  data: CodeData;
  theme: ThemeConfig;
  className?: string;
}

const getCodeTheme = (theme: ThemeConfig, codeTheme: CodeData['theme']) => {
  const isDark = theme.colors.background === '#0F0F0F' || theme.colors.background === '#000000';

  switch (codeTheme) {
    case 'light':
      return {
        background: '#ffffff',
        foreground: '#000000',
        border: '#e5e7eb',
        accent: '#3b82f6'
      };
    case 'dark':
      return {
        background: '#1f2937',
        foreground: '#f9fafb',
        border: '#374151',
        accent: '#60a5fa'
      };
    case 'auto':
    default:
      return isDark ? {
        background: '#1f2937',
        foreground: '#f9fafb',
        border: '#374151',
        accent: theme.colors.primary
      } : {
        background: '#f8fafc',
        foreground: '#1e293b',
        border: '#e2e8f0',
        accent: theme.colors.primary
      };
  }
};

const renderLineNumbers = (lines: string[], theme: ReturnType<typeof getCodeTheme>) => {
  return (
    <div className="flex flex-col pr-3 text-right select-none" style={{ color: theme.accent }}>
      {lines.map((_, index) => (
        <span key={index} className="text-xs leading-6 opacity-60">
          {index + 1}
        </span>
      ))}
    </div>
  );
};

export const CodeCard: React.FC<CodeCardProps> = ({ data, theme, className }) => {
  const codeTheme = getCodeTheme(theme, data.theme);
  const lines = data.code.split('\n');

  const getCodeStyles = () => {
    const baseStyles = "font-mono leading-6 overflow-x-auto";

    switch (data.size) {
      case 'sm':
        return cn(baseStyles, "text-sm");
      case 'lg':
        return cn(baseStyles, "text-lg leading-7");
      default:
        return cn(baseStyles, "text-base");
    }
  };

  const renderCodeContent = () => {
    return (
      <pre className="whitespace-pre">
        <code
          className={getCodeStyles()}
          style={{
            color: codeTheme.foreground,
            backgroundColor: 'transparent',
          }}
        >
          {data.code}
        </code>
      </pre>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
          "rounded-xl shadow-md overflow-hidden"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        {/* Code header with language indicator */}
        {(data.language || data.showLineNumbers) && (
          <CardHeader className="py-3 px-6 border-b" style={{ borderColor: theme.colors.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {data.language && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: codeTheme.accent + '20',
                      color: codeTheme.accent
                    }}
                  >
                    {data.language.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Window controls */}
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-60" />
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-60" />
                </div>
              </div>
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0">
          <div
            className="p-6 overflow-auto"
            style={{ backgroundColor: codeTheme.background }}
          >
            <div className="flex">
              {data.showLineNumbers && renderLineNumbers(lines, codeTheme)}
              <div className="flex-1 min-w-0">
                {renderCodeContent()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


