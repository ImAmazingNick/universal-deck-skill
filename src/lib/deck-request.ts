export type DeckTone =
  | 'professional'
  | 'visionary'
  | 'persuasive'
  | 'analytical'
  | 'celebratory'
  | 'educational';

export interface MetricDatumInput {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  description?: string;
}

export interface TestimonialInput {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
}

export interface TimelineEventInput {
  date?: string;
  title: string;
  description?: string;
}

export interface ChartSeriesInput {
  name: string;
  values: Array<number | null>;
  colorHex?: string;
}

export interface ChartDataInput {
  type?: 'bar' | 'line' | 'area' | 'pie';
  categories: string[];
  series: ChartSeriesInput[];
  summary?: string;
}

export interface TableDataInput {
  headers: string[];
  rows: Array<Array<string>>;
}

export interface CallToActionInput {
  headline: string;
  subheadline?: string;
  buttonLabel?: string;
  url?: string;
}

export interface DeckSectionInput {
  id?: string;
  title?: string;
  focus?:
    | 'hero'
    | 'overview'
    | 'metrics'
    | 'chart'
    | 'narrative'
    | 'product'
    | 'comparison'
    | 'timeline'
    | 'testimonials'
    | 'cta'
    | 'custom';
  narrative?: string;
  bullets?: Array<string>;
  metrics?: Array<MetricDatumInput>;
  chart?: ChartDataInput;
  table?: TableDataInput;
  testimonials?: Array<TestimonialInput>;
  timeline?: Array<TimelineEventInput>;
  callToAction?: CallToActionInput;
  image?: {
    src?: string;
    alt?: string;
    caption?: string;
  };
  layoutHint?: string;
  rawContext?: string;
}

export interface DeckRequestInput {
  topic: string;
  subtitle?: string;
  audience?: string;
  tone?: DeckTone;
  goals?: Array<string>;
  keyMessages?: Array<string>;
  takeaways?: Array<string>;
  context?: string | Array<string>;
  sections?: Array<DeckSectionInput>;
  metrics?: Array<MetricDatumInput>;
  timeline?: Array<TimelineEventInput>;
  testimonials?: Array<TestimonialInput>;
  callToAction?: CallToActionInput;
  theme?: string;
  titleSlide?: {
    title?: string;
    subtitle?: string;
    date?: string;
    author?: string;
    company?: string;
    logo?: string;
  };
  assetsBasePath?: string;
}

export interface MetricDatum extends MetricDatumInput {
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface TestimonialDatum extends TestimonialInput {
  quote: string;
}

export interface TimelineEvent extends TimelineEventInput {
  title: string;
}

export interface ChartSeries extends ChartSeriesInput {
  values: Array<number | null>;
}

export interface ChartData extends ChartDataInput {
  type: 'bar' | 'line' | 'area' | 'pie';
  categories: string[];
  series: ChartSeries[];
}

export interface TableData extends TableDataInput {
  headers: string[];
  rows: Array<Array<string>>;
}

export interface NormalizedSection {
  id: string;
  title: string;
  focus:
    | 'hero'
    | 'overview'
    | 'metrics'
    | 'chart'
    | 'narrative'
    | 'product'
    | 'comparison'
    | 'timeline'
    | 'testimonials'
    | 'cta'
    | 'custom';
  narrative?: string;
  bullets: string[];
  metrics: MetricDatum[];
  chart?: ChartData;
  table?: TableData;
  testimonials: TestimonialDatum[];
  timeline: TimelineEvent[];
  callToAction?: CallToActionInput;
  image?: {
    src?: string;
    alt?: string;
    caption?: string;
  };
  layoutHint?: string;
  rawContext?: string;
}

export interface NormalizedDeckRequest {
  topic: string;
  subtitle?: string;
  audience?: string;
  tone: DeckTone;
  goals: string[];
  keyMessages: string[];
  takeaways: string[];
  contextParagraphs: string[];
  sections: NormalizedSection[];
  theme?: string;
  titleSlide?: DeckRequestInput['titleSlide'];
  assetsBasePath?: string;
}

export interface DeckRequestValidationResult {
  normalized: NormalizedDeckRequest;
  warnings: string[];
  errors: string[];
}

export function normalizeDeckRequest(input: DeckRequestInput): DeckRequestValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input || typeof input !== 'object') {
    throw new Error('Deck request must be an object.');
  }

  const topic = safeString(input.topic);
  if (!topic) {
    errors.push('Topic is required.');
  }

  const tone = input.tone ?? 'professional';
  const goals = uniqueStrings(coerceStringArray(input.goals));
  const keyMessages = uniqueStrings(coerceStringArray(input.keyMessages));
  const takeaways = uniqueStrings(coerceStringArray(input.takeaways));
  const contextParagraphs = normalizeContext(input.context);

  const normalizedSections = buildSections({
    inputSections: input.sections,
    fallbackMetrics: input.metrics,
    fallbackTimeline: input.timeline,
    fallbackTestimonials: input.testimonials,
    fallbackCta: input.callToAction,
    fallbackNarrative: contextParagraphs.length ? contextParagraphs.join('\n\n') : undefined,
    warnings
  });

  if (normalizedSections.length === 0) {
    warnings.push('No sections provided; generator will synthesize defaults.');
  }

  const normalized: NormalizedDeckRequest = {
    topic: topic || 'Untitled Presentation',
    subtitle: safeString(input.subtitle),
    audience: safeString(input.audience),
    tone,
    goals,
    keyMessages,
    takeaways,
    contextParagraphs,
    sections: normalizedSections,
    theme: safeString(input.theme),
    titleSlide: input.titleSlide,
    assetsBasePath: safeString(input.assetsBasePath),
  };

  return { normalized, warnings, errors };
}

function buildSections(params: {
  inputSections?: Array<DeckSectionInput>;
  fallbackMetrics?: Array<MetricDatumInput>;
  fallbackTimeline?: Array<TimelineEventInput>;
  fallbackTestimonials?: Array<TestimonialInput>;
  fallbackCta?: CallToActionInput;
  fallbackNarrative?: string;
  warnings: string[];
}): NormalizedSection[] {
  const {
    inputSections,
    fallbackMetrics,
    fallbackTimeline,
    fallbackTestimonials,
    fallbackCta,
    fallbackNarrative,
    warnings
  } = params;

  const sections: NormalizedSection[] = [];

  if (Array.isArray(inputSections)) {
    inputSections.forEach((section, index) => {
      const focus = section.focus ?? inferFocus(section);
      const title = safeString(section.title) || deriveDefaultTitle(focus, index);
      sections.push({
        id: section.id || generateSectionId(title, focus),
        title,
        focus,
        narrative: safeMultiline(section.narrative),
        bullets: uniqueStrings(coerceStringArray(section.bullets)),
        metrics: normalizeMetrics(section.metrics),
        chart: section.chart ? normalizeChart(section.chart, warnings) : undefined,
        table: section.table ? normalizeTable(section.table, warnings) : undefined,
        testimonials: normalizeTestimonials(section.testimonials),
        timeline: normalizeTimeline(section.timeline),
        callToAction: section.callToAction ?? (focus === 'cta' ? fallbackCta : undefined),
        image: section.image,
        layoutHint: section.layoutHint,
        rawContext: safeMultiline(section.rawContext),
      });
    });
  }

  if (!sections.some(section => section.focus === 'metrics') && Array.isArray(fallbackMetrics) && fallbackMetrics.length) {
    sections.push({
      id: generateSectionId('Key Metrics', 'metrics'),
      title: 'Key Metrics',
      focus: 'metrics',
      bullets: [],
      metrics: normalizeMetrics(fallbackMetrics),
      testimonials: [],
      timeline: [],
      narrative: fallbackNarrative,
    });
  }

  if (!sections.some(section => section.focus === 'timeline') && Array.isArray(fallbackTimeline) && fallbackTimeline.length) {
    sections.push({
      id: generateSectionId('Roadmap', 'timeline'),
      title: 'Roadmap',
      focus: 'timeline',
      bullets: [],
      metrics: [],
      testimonials: [],
      timeline: normalizeTimeline(fallbackTimeline),
      narrative: undefined,
    });
  }

  if (!sections.some(section => section.focus === 'testimonials') && Array.isArray(fallbackTestimonials) && fallbackTestimonials.length) {
    sections.push({
      id: generateSectionId('Testimonials', 'testimonials'),
      title: 'Testimonials',
      focus: 'testimonials',
      bullets: [],
      metrics: [],
      testimonials: normalizeTestimonials(fallbackTestimonials),
      timeline: [],
      narrative: undefined,
    });
  }

  if (!sections.some(section => section.focus === 'cta') && fallbackCta) {
    sections.push({
      id: generateSectionId('Call to Action', 'cta'),
      title: fallbackCta.headline || 'Next Steps',
      focus: 'cta',
      bullets: [],
      metrics: [],
      testimonials: [],
      timeline: [],
      callToAction: fallbackCta,
      narrative: fallbackCta.subheadline,
    });
  }

  if (sections.length === 0 && fallbackNarrative) {
    sections.push({
      id: generateSectionId('Overview', 'overview'),
      title: 'Overview',
      focus: 'overview',
      bullets: [],
      metrics: [],
      testimonials: [],
      timeline: [],
      narrative: fallbackNarrative,
    });
  }

  return sections;
}

function normalizeMetrics(metrics?: Array<MetricDatumInput>): MetricDatum[] {
  if (!Array.isArray(metrics)) return [];
  return metrics
    .map(metric => ({
      label: safeString(metric.label) || '',
      value: metric.value,
      change: typeof metric.change === 'number' ? metric.change : undefined,
      changeLabel: safeString(metric.changeLabel),
      description: safeString(metric.description),
    }))
    .filter(metric => Boolean(metric.label && metric.value !== undefined && metric.value !== null));
}

function normalizeTestimonials(testimonials?: Array<TestimonialInput>): TestimonialDatum[] {
  if (!Array.isArray(testimonials)) return [];
  return testimonials
    .map(testimonial => ({
      quote: safeMultiline(testimonial.quote) || '',
      author: safeString(testimonial.author),
      role: safeString(testimonial.role),
      company: safeString(testimonial.company),
    }))
    .filter(testimonial => Boolean(testimonial.quote));
}

function normalizeTimeline(events?: Array<TimelineEventInput>): TimelineEvent[] {
  if (!Array.isArray(events)) return [];
  return events
    .map(event => ({
      date: safeString(event.date),
      title: safeString(event.title) || '',
      description: safeMultiline(event.description),
    }))
    .filter(event => Boolean(event.title));
}

function normalizeChart(chart: ChartDataInput, warnings: string[]): ChartData | undefined {
  if (!chart || !Array.isArray(chart.categories) || !Array.isArray(chart.series)) {
    warnings.push('Chart data is incomplete; skipping chart.');
    return undefined;
  }

  const categories = uniqueStrings(chart.categories.map(safeString).filter(Boolean) as string[]);
  const series = chart.series
    .map(seriesEntry => ({
      name: safeString(seriesEntry.name) || 'Series',
      values: Array.isArray(seriesEntry.values) ? seriesEntry.values.map(value => (value === null ? null : Number(value))) : [],
      colorHex: safeColor(seriesEntry.colorHex),
    }))
    .filter(seriesEntry => seriesEntry.values.some(value => typeof value === 'number' && !Number.isNaN(value)));

  if (!categories.length || !series.length) {
    warnings.push('Chart data lacks categories or values; skipping chart.');
    return undefined;
  }

  const normalizedType: ChartData['type'] = chart.type ?? 'bar';

  return {
    type: normalizedType,
    categories,
    series,
    summary: safeMultiline(chart.summary),
  };
}

function normalizeTable(table: TableDataInput, warnings: string[]): TableData | undefined {
  if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) {
    warnings.push('Table data is incomplete; skipping table.');
    return undefined;
  }

  const headers = table.headers.map(header => safeString(header) || '').filter(Boolean);
  const rows = table.rows.map(row => row.map(cell => safeString(cell) || '').filter(Boolean)).filter(row => row.length === headers.length);

  if (!headers.length || !rows.length) {
    warnings.push('Table data lacks headers or rows; skipping table.');
    return undefined;
  }

  return { headers, rows };
}

function inferFocus(section: DeckSectionInput): NormalizedSection['focus'] {
  if (section.focus) return section.focus;
  if (section.metrics?.length) return 'metrics';
  if (section.timeline?.length) return 'timeline';
  if (section.testimonials?.length) return 'testimonials';
  if (section.callToAction) return 'cta';
  if (section.chart) return 'chart';
  if (section.table) return 'comparison';
  if (section.bullets?.length) return 'overview';
  if (section.narrative) return 'narrative';
  return 'custom';
}

function deriveDefaultTitle(focus: NormalizedSection['focus'], index: number): string {
  switch (focus) {
    case 'hero':
      return 'Introduction';
    case 'overview':
      return 'Overview';
    case 'metrics':
      return 'Key Metrics';
    case 'chart':
      return 'Data Insights';
    case 'product':
      return 'Product Highlights';
    case 'comparison':
      return 'Competitive Comparison';
    case 'timeline':
      return 'Roadmap';
    case 'testimonials':
      return 'Testimonials';
    case 'cta':
      return 'Next Steps';
    default:
      return `Section ${index + 1}`;
  }
}

function normalizeContext(context: DeckRequestInput['context']): string[] {
  if (!context) return [];
  if (Array.isArray(context)) {
    return uniqueStrings(context.map(paragraph => safeMultiline(paragraph) || '').filter(Boolean));
  }
  if (typeof context === 'string') {
    const cleaned = safeMultiline(context) || '';
    if (!cleaned) return [];
    return uniqueStrings(
      cleaned
        .split(/\n{2,}|\r\n{2,}/)
        .map(section => section.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    );
  }
  return [];
}

function safeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function safeMultiline(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/\r\n/g, '\n').trim();
  return cleaned.length ? cleaned : undefined;
}

function coerceStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => (typeof item === 'string' ? item : String(item ?? '')));
  if (typeof value === 'string') {
    return value
      .split(/[\n\r;,]+/)
      .map(entry => entry.trim())
      .filter(Boolean);
  }
  return [String(value)];
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  values.forEach(value => {
    const key = value.toLowerCase();
    if (!seen.has(key) && value.trim()) {
      seen.add(key);
      unique.push(value.trim());
    }
  });
  return unique;
}

let uidCounter = 0;

function generateSectionId(title: string, focus: NormalizedSection['focus']): string {
  const slug = slugify(title || focus);
  if (slug) return slug;
  uidCounter += 1;
  return `${focus}-${Date.now().toString(36)}-${uidCounter.toString(36)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function safeColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const hex = value.trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
    return hex.startsWith('#') ? hex : `#${hex}`;
  }
  return undefined;
}


