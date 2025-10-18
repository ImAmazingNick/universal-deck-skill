"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonialData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  data: TestimonialData;
  theme: ThemeConfig;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ data, theme, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full border-2 transition-all duration-300 hover:shadow-lg",
          "bg-gradient-to-br from-card to-card/50 relative overflow-hidden"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        {/* Quote mark decoration */}
        <div
          className="absolute top-4 left-4 text-6xl opacity-10 font-serif"
          style={{ color: theme.colors.primary }}
        >
          &ldquo;
        </div>

        <CardContent className="p-6 pt-12 flex flex-col justify-center h-full">
          <blockquote
            className={cn(
              "text-lg italic leading-relaxed mb-6 relative z-10",
              "before:content-['\"'] before:text-4xl before:font-serif before:absolute before:-top-2 before:-left-2 before:opacity-20"
            )}
            style={{ color: theme.colors.foreground }}
          >
            &ldquo;{data.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
              }}
            >
              {data.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <cite
                className="font-semibold not-italic block"
                style={{ color: theme.colors.foreground }}
              >
                {data.author}
              </cite>
              {data.role && (
                <span
                  className="text-sm opacity-75"
                  style={{ color: theme.colors.foreground }}
                >
                  {data.role}
                  {data.company && ` at ${data.company}`}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
