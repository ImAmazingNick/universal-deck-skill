"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface RichTextCardProps {
  data: RichTextData;
  theme: ThemeConfig;
  className?: string;
}

export const RichTextCard: React.FC<RichTextCardProps> = ({ data, theme, className }) => {
  // Helper to render rich text content
  const renderTextContent = () => {
    if (typeof data.content === 'string') {
      return data.content;
    }

    // Handle rich text segments
    return data.content.map((segment, index) => {
      const segmentStyle: React.CSSProperties = {
        color: segment.formatting?.color,
        fontSize: segment.formatting?.fontSize ? `${segment.formatting.fontSize}px` : undefined,
      };

      return (
        <span
          key={index}
          className={cn(
            segment.formatting?.bold && "font-bold",
            segment.formatting?.italic && "italic",
            segment.formatting?.underline && "underline"
          )}
          style={segmentStyle}
        >
          {segment.text}
        </span>
      );
    });
  };

  // Get font size from theme typography
  const getFontSize = () => {
    const baseSize = data.size || 'base';
    const themeFontSize = theme.typography?.fontSize?.[baseSize] || 14;

    // Adjust based on type
    switch (data.type) {
      case 'header':
        return `${Math.max(themeFontSize + 4, 18)}px`;
      case 'subheader':
        return `${Math.max(themeFontSize + 2, 16)}px`;
      case 'lead':
        return `${Math.max(themeFontSize + 2, 18)}px`;
      default:
        return `${themeFontSize}px`;
    }
  };

  // Get line height from theme
  const getLineHeight = () => {
    return theme.typography?.lineHeight?.[data.lineHeight || 'normal'] || 1.5;
  };

  // Get letter spacing from theme
  const getLetterSpacing = () => {
    return theme.typography?.letterSpacing?.[data.letterSpacing || 'normal'] || '0em';
  };

  // Get font family based on type
  const getFontFamily = () => {
    if (data.fontFamily) return data.fontFamily;

    switch (data.type) {
      case 'header':
      case 'subheader':
        return theme.typography?.fontFamily?.heading;
      default:
        return theme.typography?.fontFamily?.body;
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    if (data.variant === 'muted') {
      return theme.colors.muted;
    } else if (data.variant === 'accent' || data.variant === 'highlight') {
      return theme.colors.primary;
    }
    return theme.colors.foreground;
  };

  // Get font weight based on type
  const getFontWeight = () => {
    switch (data.type) {
      case 'header':
        return 'bold';
      case 'subheader':
        return 'semibold';
      case 'lead':
        return 'normal';
      case 'blockquote':
        return 'medium';
      default:
        return 'medium';
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
        <CardContent className={cn(
          "p-10 flex h-full",
          data.type === 'blockquote' && "border-l-4 border-primary pl-12"
        )}>
          <div
            className={cn(
              "w-full font-features-text",
              // Alignment classes
              data.align === 'left' && "text-left",
              data.align === 'center' && "text-center",
              data.align === 'right' && "text-right",
              data.align === 'justify' && "text-justify",
              // Type-specific styles
              data.type === 'lead' && "tracking-wide",
              data.type === 'blockquote' && "italic"
            )}
            style={{
              fontSize: getFontSize(),
              fontWeight: getFontWeight(),
              lineHeight: getLineHeight(),
              letterSpacing: getLetterSpacing(),
              color: getTextColor(),
              fontFamily: getFontFamily(),
              textShadow: data.textShadow ? '0 1px 2px rgba(0,0,0,0.1)' : (theme.name === 'metallic-earth' ? '0 1px 2px rgba(0,0,0,0.1)' : undefined),
            }}
          >
            {renderTextContent()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
