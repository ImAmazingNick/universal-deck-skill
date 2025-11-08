import { DeckItem, LayoutConfig, ThemeConfig } from '@/lib/deck-types';

/**
 * Creates a default header item for layouts
 */
export const createDefaultHeader = (
  title: string,
  subtitle?: string
): DeckItem => ({
  i: 'header',
  x: 0,
  y: 0,
  w: 12,
  h: 3,
  type: 'header',
  data: {
    title,
    subtitle: subtitle || ''
  }
});

/**
 * Merges layout config items with defaults
 */
export const mergeLayoutItems = (
  layout: LayoutConfig | undefined,
  defaultItems: DeckItem[],
  defaultHeader?: DeckItem
): { items: DeckItem[]; header?: DeckItem } => {
  return {
    items: layout?.items || defaultItems,
    header: layout?.header || defaultHeader
  };
};

/**
 * Creates a text item with consistent styling
 */
export const createTextItem = (
  id: string,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  options?: {
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    align?: 'left' | 'center' | 'right' | 'justify';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  }
): DeckItem => ({
  i: id,
  x,
  y,
  w,
  h,
  type: 'text',
  data: {
    text,
    size: options?.size || 'base',
    align: options?.align || 'left',
    weight: options?.weight || 'normal'
  }
});

/**
 * Creates a rich text item
 */
export const createRichTextItem = (
  id: string,
  content: string | string[],
  x: number,
  y: number,
  w: number,
  h: number,
  options?: {
    type?: 'paragraph' | 'header' | 'subheader' | 'lead' | 'blockquote';
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    align?: 'left' | 'center' | 'right' | 'justify';
    variant?: 'default' | 'muted' | 'accent' | 'highlight';
  }
): DeckItem => ({
  i: id,
  x,
  y,
  w,
  h,
  type: 'rich-text',
  data: {
    content: Array.isArray(content) ? content.join('\n') : content,
    type: options?.type || 'paragraph',
    size: options?.size || 'base',
    align: options?.align || 'left',
    variant: options?.variant || 'default'
  }
});

