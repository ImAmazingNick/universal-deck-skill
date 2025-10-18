// Type definitions for the Marketing Deck Generator

export interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

// Component-specific data types
export interface KpiCardData {
  metric: string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface PhotoCardData {
  src: string;
  alt: string;
  caption?: string;
}

export interface TextData {
  text: string;
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  align: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  config?: Record<string, unknown>;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TestimonialData {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface TimelineData {
  events: {
    date: string;
    title: string;
    description: string;
  }[];
}

export interface ButtonData {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export interface MetricCardData {
  value: number;
  unit: string;
  label: string;
  change?: number;
  changeLabel?: string;
}

export interface HeaderData {
  title: string;
  subtitle?: string;
  showDivider?: boolean;
}

export type DeckItemData =
  | KpiCardData
  | PhotoCardData
  | TextData
  | ChartData
  | TableData
  | TestimonialData
  | TimelineData
  | ButtonData
  | MetricCardData
  | HeaderData;

export interface DeckItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  type: string;
  data: DeckItemData;
}

export interface LayoutConfig {
  description: string;
  grid: {
    cols: number;
    rowHeight: number;
    margin: number[];
  };
  items: DeckItem[];
  header?: DeckItem;
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  gradients: {
    primary: string;
    background: string;
  };
}

export interface SlideConfig {
  layout: string;
  title?: string;
  items?: DeckItem[];
  data?: Record<string, unknown>;
}

export interface DeckProps {
  layout?: string;
  slides?: SlideConfig[];
  theme: string;
  items?: DeckItem[];
  data?: Record<string, unknown>;
}

export interface SlideProps {
  layout: LayoutConfig;
  theme: ThemeConfig;
  items: DeckItem[];
}

// Component-specific data types
export interface KpiCardData {
  metric: string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface PhotoCardData {
  src: string;
  alt: string;
  caption?: string;
}

export interface TextData {
  text: string;
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  align: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  config?: Record<string, unknown>;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TestimonialData {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface TimelineData {
  events: {
    date: string;
    title: string;
    description: string;
  }[];
}

export interface ButtonData {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export interface MetricCardData {
  value: number;
  unit: string;
  label: string;
  change?: number;
  changeLabel?: string;
}
