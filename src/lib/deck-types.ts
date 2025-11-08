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

// Rich text formatting for inline styles
export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string; // hex color override
  fontSize?: number; // specific font size in points
}

export interface TextSegment {
  text: string;
  formatting?: TextFormatting;
}

export interface TextData {
  text: string | TextSegment[]; // Support both plain text and rich text segments
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  align: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  fontFamily?: string; // font family override
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  textShadow?: boolean;
  color?: string; // hex color override for entire text
}

export interface RichTextData {
  content: string | TextSegment[]; // Support rich text segments
  type: 'paragraph' | 'header' | 'subheader' | 'lead' | 'blockquote';
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  align?: 'left' | 'center' | 'right' | 'justify';
  variant?: 'default' | 'muted' | 'accent' | 'highlight';
  fontFamily?: string;
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  textShadow?: boolean;
}

export interface ListData {
  items: string[];
  type: 'bullet' | 'numbered' | 'checklist';
  size?: 'sm' | 'base' | 'lg';
  variant?: 'default' | 'compact' | 'spacious';
  icon?: 'dot' | 'dash' | 'arrow' | 'check';
}

export interface QuoteData {
  text: string;
  author?: string;
  role?: string;
  company?: string;
  variant?: 'default' | 'large' | 'minimal';
  align?: 'left' | 'center';
}

export interface CodeData {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'base' | 'lg';
}

export interface NoteData {
  title?: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'tip';
  variant?: 'default' | 'bordered' | 'filled';
  size?: 'sm' | 'base' | 'lg';
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

export type ItemType =
  | 'text'
  | 'rich-text'
  | 'list'
  | 'quote'
  | 'code'
  | 'note'
  | 'header'
  | 'kpi-card'
  | 'photo-card'
  | 'chart'
  | 'table'
  | 'testimonial'
  | 'timeline'
  | 'metric-card'
  | 'button';

interface DeckItemBase {
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
  type: ItemType;
}

export interface TextItem extends DeckItemBase { type: 'text'; data: TextData }
export interface RichTextItem extends DeckItemBase { type: 'rich-text'; data: RichTextData }
export interface ListItem extends DeckItemBase { type: 'list'; data: ListData }
export interface QuoteItem extends DeckItemBase { type: 'quote'; data: QuoteData }
export interface CodeItem extends DeckItemBase { type: 'code'; data: CodeData }
export interface NoteItem extends DeckItemBase { type: 'note'; data: NoteData }
export interface HeaderItem extends DeckItemBase { type: 'header'; data: HeaderData }
export interface KpiCardItem extends DeckItemBase { type: 'kpi-card'; data: KpiCardData }
export interface PhotoCardItem extends DeckItemBase { type: 'photo-card'; data: PhotoCardData }
export interface ChartItem extends DeckItemBase { type: 'chart'; data: ChartData }
export interface TableItem extends DeckItemBase { type: 'table'; data: TableData }
export interface TestimonialItem extends DeckItemBase { type: 'testimonial'; data: TestimonialData }
export interface TimelineItem extends DeckItemBase { type: 'timeline'; data: TimelineData }
export interface MetricCardItem extends DeckItemBase { type: 'metric-card'; data: MetricCardData }
export interface ButtonItem extends DeckItemBase { type: 'button'; data: ButtonData }

export type DeckItem =
  | TextItem
  | RichTextItem
  | ListItem
  | QuoteItem
  | CodeItem
  | NoteItem
  | HeaderItem
  | KpiCardItem
  | PhotoCardItem
  | ChartItem
  | TableItem
  | TestimonialItem
  | TimelineItem
  | MetricCardItem
  | ButtonItem;

export interface LayoutConfig {
  description: string;
  grid: {
    cols: number;
    rowHeight: number;
    margin: number[];
  };
  autoHeader?: boolean;
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
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string; // for code blocks
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
      '5xl': number;
    };
    lineHeight: {
      none: number;
      tight: number;
      snug: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
      wider: string;
    };
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

