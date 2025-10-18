"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TextData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface TextCardProps {
  data: TextData;
  theme: ThemeConfig;
  className?: string;
}

export const TextCard: React.FC<TextCardProps> = ({ data, theme, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full border-2 transition-all duration-300 hover:shadow-lg",
          "bg-gradient-to-br from-card to-card/50"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div
            className={cn(
              "text-center font-medium leading-relaxed",
              // Size classes
              data.size === 'xs' && "text-xs",
              data.size === 'sm' && "text-sm",
              data.size === 'base' && "text-base",
              data.size === 'lg' && "text-lg",
              data.size === 'xl' && "text-xl",
              data.size === '2xl' && "text-2xl",
              data.size === '3xl' && "text-3xl",
              data.size === '4xl' && "text-4xl",
              // Alignment classes
              data.align === 'left' && "text-left",
              data.align === 'center' && "text-center",
              data.align === 'right' && "text-right",
              // Weight classes
              data.weight === 'normal' && "font-normal",
              data.weight === 'medium' && "font-medium",
              data.weight === 'semibold' && "font-semibold",
              data.weight === 'bold' && "font-bold"
            )}
            style={{
              color: theme.colors.foreground,
              textShadow: theme.name === 'metallic-earth' ? '0 1px 2px rgba(0,0,0,0.1)' : undefined,
            }}
          >
            {data.text}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
