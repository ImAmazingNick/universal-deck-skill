"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ListData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface ListCardProps {
  data: ListData;
  theme: ThemeConfig;
  className?: string;
}

const getListIcon = (type: ListData['type'], icon: ListData['icon'], index: number, theme: ThemeConfig) => {
  const baseClasses = "flex-shrink-0 w-6 h-6 mr-4 mt-0.5 flex items-center justify-center";

  switch (type) {
    case 'bullet':
      switch (icon) {
        case 'dot':
          return (
            <div
              className={cn(baseClasses, "rounded-full")}
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: theme.colors.primary,
                marginTop: '0.625rem'
              }}
            />
          );
        case 'dash':
          return (
            <div
              className="w-4 h-0.5 mr-4 mt-3 flex-shrink-0"
              style={{ backgroundColor: theme.colors.primary }}
            />
          );
        case 'arrow':
          return (
            <svg
              className="w-4 h-4 mr-4 mt-1 flex-shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: theme.colors.primary }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          );
        default:
          return (
            <div
              className={cn(baseClasses, "rounded-full")}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: theme.colors.primary,
                boxShadow: `0 0 0 2px ${theme.colors.background} inset`
              }}
            />
          );
      }

    case 'numbered':
      return (
        <span
          className="flex-shrink-0 w-7 h-7 mr-4 mt-0.5 flex items-center justify-center text-sm font-bold font-features-stats rounded-full border-2"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
            borderColor: theme.colors.primary,
            fontFamily: theme.typography?.fontFamily?.mono,
          }}
        >
          {index + 1}
        </span>
      );

    case 'checklist':
      return (
        <div
          className={cn(baseClasses, "rounded-lg border-2")}
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};

export const ListCard: React.FC<ListCardProps> = ({ data, theme, className }) => {
  const getListStyles = () => {
    const baseStyles = "space-y-4";

    switch (data.variant) {
      case 'compact':
        return "space-y-3";
      case 'spacious':
        return "space-y-5";
      default:
        return baseStyles;
    }
  };

  const getItemStyles = () => {
    const baseStyles = "flex items-start font-features-text";

    switch (data.size) {
      case 'sm':
        return cn(baseStyles, "text-sm leading-relaxed");
      case 'lg':
        return cn(baseStyles, "text-lg leading-relaxed");
      default:
        return cn(baseStyles, "text-base leading-relaxed");
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
          "bg-gradient-to-br from-card via-card/95 to-card/80",
          "rounded-xl shadow-md"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardContent className="p-10 flex h-full">
          <div className="w-full">
            <ul className={getListStyles()}>
              {data.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={getItemStyles()}
                >
                  {getListIcon(data.type, data.icon, index, theme)}
                  <span className="flex-1">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
