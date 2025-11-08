"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCardData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  data: MetricCardData;
  theme: ThemeConfig;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data, theme, className }) => {
  const isPositiveChange = data.change ? data.change > 0 : false;
  const isNegativeChange = data.change ? data.change < 0 : false;

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
          "bg-gradient-to-br from-card to-card/50"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle
            className="text-lg font-semibold font-features-text"
            style={{ color: theme.colors.foreground }}
          >
            {data.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold tracking-tight font-features-stats leading-stats"
                style={{ color: theme.colors.accent }}
              >
                {data.value.toLocaleString()}
              </span>
              <span
                className="text-lg font-medium opacity-80"
                style={{ color: theme.colors.foreground }}
              >
                {data.unit}
              </span>
            </div>

            {data.change !== undefined && (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                    isPositiveChange && "bg-green-100 text-green-700",
                    isNegativeChange && "bg-red-100 text-red-700",
                    !isPositiveChange && !isNegativeChange && "bg-gray-100 text-gray-600"
                  )}
                >
                  <svg
                    className={cn(
                      "w-3 h-3",
                      isPositiveChange && "text-green-600",
                      isNegativeChange && "text-red-600",
                      !isPositiveChange && !isNegativeChange && "text-gray-500"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isPositiveChange && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    )}
                    {isNegativeChange && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    )}
                    {!isPositiveChange && !isNegativeChange && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    )}
                  </svg>
                  <span>
                    {isPositiveChange && '+'}
                    {data.change > 0 ? data.change : Math.abs(data.change || 0)}
                    {data.changeLabel && ` ${data.changeLabel}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
