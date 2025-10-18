"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { HeaderCard } from '@/components/items/HeaderCard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface SlideGridProps {
  items: DeckItem[];
  theme: ThemeConfig;
  header?: DeckItem;
  isEditable?: boolean;
  onLayoutChange?: (layout: Layout[]) => void;
  onItemChange?: (item: DeckItem) => void;
  className?: string;
}

interface GridItemProps {
  item: DeckItem;
  theme: ThemeConfig;
  isEditable?: boolean;
  onItemChange?: (item: DeckItem) => void;
}

const GridItem: React.FC<GridItemProps> = ({ item, theme, isEditable, onItemChange }) => {
  const handleClick = () => {
    if (isEditable && onItemChange) {
      // In edit mode, allow clicking to modify items
      onItemChange(item);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "grid-item relative group cursor-pointer overflow-hidden",
        "border border-border/20 rounded-lg",
        "hover:border-border/50 transition-colors",
        theme.colors.background === '#FFFFFF' ? 'bg-white' : 'bg-gray-900'
      )}
      onClick={handleClick}
      whileHover={{ scale: isEditable ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        borderColor: theme.colors.border,
      }}
    >
      {/* Render different item types */}
      <div className="w-full h-full p-4 flex items-center justify-center">
        {item.type === 'text' && (
          <div
            className={cn(
              "text-center font-medium",
              (item.data as any).size === '4xl' && "text-4xl",
              (item.data as any).size === '3xl' && "text-3xl",
              (item.data as any).size === '2xl' && "text-2xl",
              (item.data as any).size === 'xl' && "text-xl",
              (item.data as any).size === 'lg' && "text-lg",
              (item.data as any).size === 'base' && "text-base",
              (item.data as any).size === 'sm' && "text-sm",
              (item.data as any).size === 'xs' && "text-xs",
              (item.data as any).align === 'left' && "text-left",
              (item.data as any).align === 'center' && "text-center",
              (item.data as any).align === 'right' && "text-right"
            )}
            style={{ color: theme.colors.foreground }}
          >
            {(item.data as any).text}
          </div>
        )}

        {item.type === 'header' && (
          <HeaderCard
            data={item.data as any}
            theme={theme}
          />
        )}

        {item.type === 'kpi-card' && (
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2"
              style={{ color: theme.colors.primary }}
            >
              {(item.data as any).metric}
            </div>
            <div
              className="text-lg opacity-80"
              style={{ color: theme.colors.foreground }}
            >
              {(item.data as any).label}
            </div>
          </div>
        )}

        {item.type === 'photo-card' && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-full h-full bg-muted rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.muted }}
            >
              <span className="text-muted-foreground text-sm">
                {(item.data as any).alt || 'Image Placeholder'}
              </span>
            </div>
          </div>
        )}

        {item.type === 'chart' && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-full h-full bg-muted rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.muted }}
            >
              <span className="text-muted-foreground text-sm">
                Chart: {(item.data as any).type}
              </span>
            </div>
          </div>
        )}

        {item.type === 'table' && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-full h-full bg-muted rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.muted }}
            >
              <span className="text-muted-foreground text-sm">
                Table
              </span>
            </div>
          </div>
        )}

        {item.type === 'testimonial' && (
          <div className="text-center">
            <blockquote
              className="text-lg italic mb-4"
              style={{ color: theme.colors.foreground }}
            >
              &ldquo;{(item.data as any).quote}&rdquo;
            </blockquote>
            <cite
              className="text-sm font-medium"
              style={{ color: theme.colors.primary }}
            >
              — {(item.data as any).author}
            </cite>
          </div>
        )}

        {item.type === 'timeline' && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-full h-full bg-muted rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.muted }}
            >
              <span className="text-muted-foreground text-sm">
                Timeline
              </span>
            </div>
          </div>
        )}

        {item.type === 'metric-card' && (
          <div className="text-center">
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: theme.colors.accent }}
            >
              {(item.data as any).value}{(item.data as any).unit}
            </div>
            <div
              className="text-base opacity-80"
              style={{ color: theme.colors.foreground }}
            >
              {(item.data as any).label}
            </div>
          </div>
        )}

        {item.type === 'button' && (
          <div className="w-full h-full flex items-center justify-center">
            <button
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-colors",
                (item.data as any).variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
                (item.data as any).variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                (item.data as any).variant === 'outline' && "border border-border bg-background hover:bg-accent"
              )}
              style={{
                backgroundColor: (item.data as any).variant === 'primary' ? theme.colors.primary : undefined,
                color: (item.data as any).variant === 'primary' ? theme.colors.background : theme.colors.foreground,
                borderColor: theme.colors.border,
              }}
            >
              {(item.data as any).text}
            </button>
          </div>
        )}

        {/* Placeholder for unknown types */}
        {!['text', 'header', 'kpi-card', 'photo-card', 'chart', 'table', 'testimonial', 'timeline', 'metric-card', 'button'].includes(item.type) && (
          <div className="text-center text-muted-foreground">
            Unknown item type: {item.type}
          </div>
        )}
      </div>

      {/* Edit indicator */}
      {isEditable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const SlideGrid: React.FC<SlideGridProps> = ({
  items,
  theme,
  header,
  isEditable = false,
  onLayoutChange,
  onItemChange,
  className
}) => {
  const layouts = {
    lg: items.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static || !isEditable,
    })),
    md: items.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: Math.min(item.w, 10),
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static || !isEditable,
    })),
    sm: items.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: Math.min(item.w, 6),
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static || !isEditable,
    })),
  };

  const handleLayoutChange = (currentLayout: Layout[]) => {
    if (onLayoutChange) {
      onLayoutChange(currentLayout);
    }
  };

  return (
    <div className={cn("w-full h-full relative", className)}>
      {/* Fixed Header - positioned outside grid */}
      {header && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <GridItem
            item={header}
            theme={theme}
            isEditable={isEditable}
            onItemChange={onItemChange}
          />
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        isDraggable={isEditable}
        isResizable={isEditable}
        useCSSTransforms={true}
        preventCollision={false}
        compactType={null}
      >
        {items.map(item => (
          <div key={item.i}>
            <GridItem
              item={item}
              theme={theme}
              isEditable={isEditable}
              onItemChange={onItemChange}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
