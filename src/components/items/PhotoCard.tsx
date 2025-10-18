"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { PhotoCardData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  data: PhotoCardData;
  theme: ThemeConfig;
  className?: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ data, theme, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg",
          "bg-gradient-to-br from-card to-card/50"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardContent className="p-0">
          <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
            {data.src ? (
              <img
                src={data.src}
                alt={data.alt}
                className="w-full h-full object-cover"
                style={{
                  filter: theme.name === 'metallic-earth' ? 'contrast(1.1) brightness(1.05)' : undefined,
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center bg-muted"
                style={{ backgroundColor: theme.colors.muted }}
              >
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.colors.foreground }}
                  >
                    {data.alt || 'Image'}
                  </p>
                </div>
              </div>
            )}

            {/* Overlay for caption */}
            {data.caption && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              >
                <p
                  className="text-white text-sm font-medium"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {data.caption}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
