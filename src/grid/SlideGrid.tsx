"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DeckItem, ThemeConfig } from '@/lib/deck-types';
import { HeaderCard } from '@/components/items/HeaderCard';
import { TextCard, KpiCard, PhotoCard, ChartCard, TestimonialCard, MetricCard, TimelineCard, RichTextCard, ListCard, QuoteCard, CodeCard, NoteCard, TableCard } from '@/components/items';
import { Button } from '@/components/ui/button';
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

  const isHeader = item.type === 'header';

  return (
    <motion.div
      layout
      className={cn(
        "grid-item relative group cursor-pointer overflow-hidden",
        "border border-border/20 rounded-xl",
        "shadow-sm shadow-black/5",
        "hover:border-border/40 hover:shadow-lg hover:shadow-primary/10",
        "transition-all duration-300 ease-out",
        "backdrop-blur-sm",
        isHeader && "z-10", // Ensure header appears on top
        theme.colors.background === '#FFFFFF' || theme.colors.background === '#ffffff' 
          ? 'bg-white/98' 
          : 'bg-gray-900/98'
      )}
      onClick={handleClick}
      whileHover={{ scale: isEditable ? 1.01 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        backgroundColor: `${theme.colors.background}FA`,
        color: theme.colors.foreground,
        borderColor: `${theme.colors.border}33`,
        boxShadow: `0 1px 3px 0 ${theme.colors.primary}08, 0 1px 2px -1px ${theme.colors.primary}08`,
        zIndex: isHeader ? 10 : 1, // Header on top visually
      }}
    >
      {/* Render different item types using shared components */}
      <div className="w-full h-full p-3 flex items-stretch">
        {item.type === 'text' && (
          <TextCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'rich-text' && (
          <RichTextCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'list' && (
          <ListCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'quote' && (
          <QuoteCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'code' && (
          <CodeCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'note' && (
          <NoteCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'header' && (
          <HeaderCard data={item.data as any} theme={theme} />
        )}

        {item.type === 'kpi-card' && (
          <KpiCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'photo-card' && (
          <PhotoCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'chart' && (
          <ChartCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'table' && (
          <TableCard data={item.data as any} theme={theme} className="w-full h-full" />
        )}

        {item.type === 'testimonial' && (
          <TestimonialCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'timeline' && (
          <TimelineCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'metric-card' && (
          <MetricCard data={item.data as any} theme={theme} className="w-full" />
        )}

        {item.type === 'button' && (
          <div className="w-full h-full flex items-center justify-center">
            <Button variant={(item.data as any).variant === 'outline' ? 'outline' : (item.data as any).variant === 'secondary' ? 'secondary' : 'default'}>
              {(item.data as any).text || 'Click Here'}
            </Button>
          </div>
        )}

        {!['text', 'rich-text', 'list', 'quote', 'code', 'note', 'header', 'kpi-card', 'photo-card', 'chart', 'table', 'testimonial', 'timeline', 'metric-card', 'button'].includes(item.type) && (
          <div className="text-center text-muted-foreground w-full">Unknown item type: {item.type}</div>
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
  // Calculate header height in grid units if header exists
  const headerHeight = header?.h || 0;
  
  // Combine header and items, ensuring header is first and items are offset
  const allItems: DeckItem[] = [];
  
  // Add header as first item in grid if provided
  if (header) {
    allItems.push({
      ...header,
      // Ensure header is at the top (y: 0) and spans full width
      x: header.x ?? 0,
      y: header.y ?? 0,
      w: header.w ?? 12,
      h: header.h ?? 3,
      // Make header static (non-draggable) by default
      static: header.static !== false,
    });
  }
  
  // Add regular items, offsetting their y position if header exists
  items.forEach(item => {
    // Skip if this item is the header (already added)
    if (header && item.i === header.i) {
      return;
    }
    
    // Always offset items by header height if header exists
    // This ensures header has space at the top and items don't overlap
    const offsetY = header ? item.y + headerHeight : item.y;
    
    allItems.push({
      ...item,
      y: offsetY,
    });
  });

  // Create layouts for all items including header
  const layouts = {
    lg: allItems.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static !== undefined ? item.static : (!isEditable || item.i === header?.i),
    })),
    md: allItems.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: Math.min(item.w, 10),
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static !== undefined ? item.static : (!isEditable || item.i === header?.i),
    })),
    sm: allItems.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: Math.min(item.w, 6),
      h: item.h,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW,
      maxH: item.maxH,
      static: item.static !== undefined ? item.static : (!isEditable || item.i === header?.i),
    })),
  };

  const handleLayoutChange = (currentLayout: Layout[]) => {
    if (onLayoutChange) {
      onLayoutChange(currentLayout);
    }
  };

  return (
    <div className={cn("w-full h-full relative", className)}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={30}
        margin={[12, 12]}
        containerPadding={[15, 15]}
        isDraggable={isEditable}
        isResizable={isEditable}
        useCSSTransforms={true}
        preventCollision={false}
        compactType={null}
      >
        {allItems.map(item => (
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
