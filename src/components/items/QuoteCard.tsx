"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface QuoteCardProps {
  data: QuoteData;
  theme: ThemeConfig;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ data, theme, className }) => {
  const getQuoteStyles = () => {
    switch (data.variant) {
      case 'large':
        return "text-2xl leading-relaxed italic";
      case 'minimal':
        return "text-lg leading-normal";
      default:
        return "text-xl leading-relaxed";
    }
  };

  const getAlignmentStyles = () => {
    switch (data.align) {
      case 'center':
        return "text-center";
      default:
        return "text-left";
    }
  };

  const renderQuoteMark = (position: 'start' | 'end') => {
    const markClasses = cn(
      "text-6xl font-serif leading-none opacity-20 select-none",
      position === 'start' && "mr-2",
      position === 'end' && "ml-2"
    );

    return (
      <span className={markClasses} style={{ color: theme.colors.primary }}>
        {position === 'start' ? '"' : '"'}
      </span>
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
          "bg-gradient-to-br from-card via-card/95 to-card/80",
          "rounded-xl shadow-md"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardContent className="p-8 flex flex-col h-full justify-center">
          <div className="w-full">
            {/* Quote content */}
            <blockquote
              className={cn(
                "font-medium tracking-tight",
                getQuoteStyles(),
                getAlignmentStyles()
              )}
              style={{
                color: theme.colors.foreground,
                textShadow: theme.name === 'metallic-earth' ? '0 1px 2px rgba(0,0,0,0.1)' : undefined,
              }}
            >
              {data.variant !== 'minimal' && renderQuoteMark('start')}
              {data.text}
              {data.variant !== 'minimal' && renderQuoteMark('end')}
            </blockquote>

            {/* Author attribution */}
            {(data.author || data.role || data.company) && (
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cn(
                  "mt-6",
                  getAlignmentStyles()
                )}
              >
                <div className="flex flex-col">
                  {data.author && (
                    <cite
                      className="font-semibold text-primary not-italic"
                      style={{ color: theme.colors.primary }}
                    >
                      — {data.author}
                    </cite>
                  )}
                  {(data.role || data.company) && (
                    <span
                      className="text-sm text-muted-foreground mt-1"
                      style={{ color: theme.colors.muted }}
                    >
                      {[data.role, data.company].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </motion.footer>
            )}

            {/* Decorative element for large quotes */}
            {data.variant === 'large' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <div
                  className="w-16 h-1 rounded-full opacity-30"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


