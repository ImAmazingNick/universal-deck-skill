"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCardData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  data: KpiCardData;
  theme: ThemeConfig;
  className?: string;
}

const getIcon = (iconName?: string) => {
  const icons: Record<string, React.ReactNode> = {
    'trending-up': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    'trending-down': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    'dollar-sign': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v22m11-11H1" />
      </svg>
    ),
    'users': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'smile': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  };

  return icons[iconName || ''] || null;
};

export const KpiCard: React.FC<KpiCardProps> = ({ data, theme, className }) => {
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
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle
              className="text-lg font-medium"
              style={{ color: theme.colors.foreground }}
            >
              {data.label}
            </CardTitle>
            {data.icon && (
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                }}
              >
                {getIcon(data.icon)}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div
              className="text-4xl font-bold tracking-tight"
              style={{ color: theme.colors.primary }}
            >
              {data.metric}
            </div>
            {data.trend && (
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    data.trend === 'up' && "text-green-500",
                    data.trend === 'down' && "text-red-500",
                    data.trend === 'neutral' && "text-muted-foreground"
                  )}
                >
                  {getIcon(data.trend === 'up' ? 'trending-up' : data.trend === 'down' ? 'trending-down' : '')}
                  <span>
                    {data.trend === 'up' && 'Trending up'}
                    {data.trend === 'down' && 'Trending down'}
                    {data.trend === 'neutral' && 'Stable'}
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
