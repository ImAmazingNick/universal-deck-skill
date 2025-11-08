"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { NoteData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  data: NoteData;
  theme: ThemeConfig;
  className?: string;
}

const getNoteConfig = (type: NoteData['type'], theme: ThemeConfig) => {
  const configs = {
    info: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colors: {
        primary: '#3b82f6',
        background: '#eff6ff',
        border: '#dbeafe',
        text: '#1e40af'
      },
      title: 'Info'
    },
    warning: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      colors: {
        primary: '#f59e0b',
        background: '#fffbeb',
        border: '#fef3c7',
        text: '#92400e'
      },
      title: 'Warning'
    },
    success: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colors: {
        primary: '#10b981',
        background: '#ecfdf5',
        border: '#d1fae5',
        text: '#065f46'
      },
      title: 'Success'
    },
    error: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colors: {
        primary: '#ef4444',
        background: '#fef2f2',
        border: '#fee2e2',
        text: '#991b1b'
      },
      title: 'Error'
    },
    tip: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      colors: {
        primary: '#8b5cf6',
        background: '#faf5ff',
        border: '#f3e8ff',
        text: '#6b21a8'
      },
      title: 'Tip'
    }
  };

  return configs[type] || configs.info;
};

export const NoteCard: React.FC<NoteCardProps> = ({ data, theme, className }) => {
  const noteConfig = getNoteConfig(data.type, theme);

  const getNoteStyles = () => {
    const baseStyles = "text-base leading-relaxed";

    switch (data.size) {
      case 'sm':
        return cn(baseStyles, "text-sm");
      case 'lg':
        return cn(baseStyles, "text-lg");
      default:
        return baseStyles;
    }
  };

  const getVariantStyles = () => {
    switch (data.variant) {
      case 'bordered':
        return {
          backgroundColor: 'transparent',
          borderColor: noteConfig.colors.border,
          borderWidth: '2px'
        };
      case 'filled':
        return {
          backgroundColor: noteConfig.colors.background,
          borderColor: noteConfig.colors.border
        };
      default:
        return {
          backgroundColor: noteConfig.colors.background + '80',
          borderColor: noteConfig.colors.border
        };
    }
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
          "rounded-xl shadow-md"
        )}
        style={getVariantStyles()}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="flex-shrink-0 mt-1"
              style={{ color: noteConfig.colors.primary }}
            >
              {noteConfig.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              {(data.title || data.type !== 'info') && (
                <div className="flex items-center gap-2 mb-2">
                  <h4
                    className="font-semibold text-sm uppercase tracking-wide"
                    style={{ color: noteConfig.colors.primary }}
                  >
                    {data.title || noteConfig.title}
                  </h4>
                </div>
              )}

              {/* Content */}
              <div
                className={getNoteStyles()}
                style={{ color: noteConfig.colors.text }}
              >
                {data.content}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
