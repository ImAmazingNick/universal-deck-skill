"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TimelineData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface TimelineCardProps {
  data: TimelineData;
  theme: ThemeConfig;
  className?: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ data, theme, className }) => {
  const events = Array.isArray(data.events) ? data.events : [];

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
        <CardContent className="p-6 h-full">
          <div className="relative h-full">
            <div
              className="absolute left-0 right-0 h-[2px]"
              style={{ top: '40%', backgroundColor: theme.colors.border }}
            />

            <div className="relative w-full h-full">
              {(events.length > 0 ? events : [{ date: '', title: 'Milestone' }, { date: '', title: 'Milestone' }, { date: '', title: 'Milestone' }]).map((ev, idx) => {
                const count = Math.max(events.length, 3);
                const ratio = count === 1 ? 0.5 : idx / (count - 1);
                return (
                  <div key={idx} className="absolute" style={{ left: `calc(${ratio * 100}% - 6px)`, top: 'calc(40% - 6px)' }}>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div className="mt-2 w-40 text-center" style={{ color: theme.colors.foreground }}>
                      <div className="text-xs opacity-80">{ev.date}</div>
                      <div className="text-sm font-medium">{ev.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};






