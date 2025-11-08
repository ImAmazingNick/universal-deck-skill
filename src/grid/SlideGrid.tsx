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

  return (
    <motion.div
      layout
      className={cn(
        "grid-item relative group cursor-pointer overflow-hidden",
        "border border-border/30 rounded-xl shadow-sm",
        "hover:border-border/60 hover:shadow-md hover:shadow-primary/5 transition-all duration-300",
        theme.colors.background === '#FFFFFF' ? 'bg-white/95 backdrop-blur-sm' : 'bg-gray-900/95 backdrop-blur-sm'
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
        <div className="absolute top-6 left-6 right-6 z-20">
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
        margin={[12, 12]}
        containerPadding={[15, 15]}
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
