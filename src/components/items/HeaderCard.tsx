"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HeaderData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface HeaderCardProps {
  data: HeaderData;
  theme: ThemeConfig;
  className?: string;
}


export const HeaderCard: React.FC<HeaderCardProps> = ({ data, theme, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      <div className="space-y-2">
        {/* Header Content */}
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight leading-heading font-features-text"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography?.fontFamily?.heading
              }}
            >
              {data.title}
            </motion.h1>

            {data.subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl md:text-2xl font-medium opacity-90 font-features-text"
                style={{
                  color: theme.colors.foreground,
                  fontFamily: theme.typography?.fontFamily?.body
                }}
              >
                {data.subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {/* Decorative Divider */}
        {data.showDivider !== false && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div
              className="h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                boxShadow: `0 2px 8px ${theme.colors.primary}40`,
              }}
            />
            <div
              className="absolute inset-0 h-1 rounded-full opacity-50 blur-sm"
              style={{
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
