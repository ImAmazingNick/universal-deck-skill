import { DeckRequestInput, normalizeDeckRequest, NormalizedDeckRequest, NormalizedSection, MetricDatum, ChartData } from './deck-request';

export interface GeneratedDeck {
  theme?: string;
  titleSlide?: DeckRequestInput['titleSlide'];
  assetsBasePath?: string;
  slides: GeneratedSlide[];
  warnings: string[];
}

export interface GeneratedSlide {
  layout: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items: Array<{ i: string; data: Record<string, unknown> }>;
  notes?: string;
}

export class DeckGenerationError extends Error {
  constructor(message: string, public readonly details?: { warnings?: string[]; errors?: string[] }) {
    super(message);
  }
}

export function generateDeckFromRequest(input: DeckRequestInput): GeneratedDeck {
  const { normalized, warnings, errors } = normalizeDeckRequest(input);
  if (errors.length) {
    throw new DeckGenerationError('Deck request validation failed.', { errors, warnings });
  }

  const slides: GeneratedSlide[] = [];

  slides.push(createHeroSlide(normalized));

  normalized.sections.forEach((section) => {
    if (section.focus === 'hero') {
      return;
    }
    const sectionSlides = createSlidesForSection(section, normalized);
    slides.push(...sectionSlides);
  });

  if (!normalized.sections.some(section => section.focus === 'cta') && normalized.takeaways.length) {
    slides.push(createTakeawaysSlide(normalized));
  }

  return {
    theme: normalized.theme,
    titleSlide: buildTitleSlide(normalized),
    assetsBasePath: normalized.assetsBasePath,
    slides,
    warnings,
  };
}

export function extractDeckRequestFromPayload(payload: unknown): DeckRequestInput | null {
  if (!payload || typeof payload !== 'object') return null;
  const candidate = payload as Record<string, unknown>;

  if (Array.isArray(candidate.slides) && candidate.slides.length) {
    return null;
  }

  if (candidate.deckRequest && typeof candidate.deckRequest === 'object') {
    const deckRequest = { ...(candidate.deckRequest as DeckRequestInput) };
    if (!deckRequest.theme && typeof candidate.theme === 'string') deckRequest.theme = candidate.theme as string;
    if (!deckRequest.titleSlide && candidate.titleSlide) deckRequest.titleSlide = candidate.titleSlide as DeckRequestInput['titleSlide'];
    if (!deckRequest.assetsBasePath && typeof candidate.assetsBasePath === 'string') deckRequest.assetsBasePath = candidate.assetsBasePath as string;
    return deckRequest;
  }

  const keys: Array<keyof DeckRequestInput> = [
    'topic',
    'subtitle',
    'audience',
    'tone',
    'goals',
    'keyMessages',
    'takeaways',
    'context',
    'sections',
    'metrics',
    'timeline',
    'testimonials',
    'callToAction'
  ];

  const hasData = keys.some((key) => key in candidate);
  if (!hasData) return null;

  const deckRequest: DeckRequestInput = { topic: 'Untitled Presentation' };
  keys.forEach((key) => {
    if (key in candidate) {
      (deckRequest as any)[key] = candidate[key];
    }
  });

  if (typeof candidate.topic === 'string') {
    deckRequest.topic = candidate.topic as string;
  }

  if (typeof candidate.theme === 'string') deckRequest.theme = candidate.theme as string;
  if (candidate.titleSlide) deckRequest.titleSlide = candidate.titleSlide as DeckRequestInput['titleSlide'];
  if (typeof candidate.assetsBasePath === 'string') deckRequest.assetsBasePath = candidate.assetsBasePath as string;

  return deckRequest;
}

function buildTitleSlide(request: NormalizedDeckRequest): DeckRequestInput['titleSlide'] {
  const existing = request.titleSlide ?? {};
  const title = existing.title ?? request.topic;
  const subtitle = existing.subtitle ?? request.subtitle ?? buildSubtitle(request);

  return {
    ...existing,
    title,
    subtitle,
    author: existing.author ?? undefined,
    company: existing.company ?? (request.audience ? `For ${request.audience}` : undefined),
  };
}

function createHeroSlide(request: NormalizedDeckRequest): GeneratedSlide {
  const subtitle = buildSubtitle(request);
  const supporting = request.goals.length ? request.goals.join(' • ') : request.keyMessages.slice(0, 2).join(' • ');

  return {
    layout: 'bold-minimalist-hero',
    title: request.topic,
    subtitle,
    description: supporting || request.contextParagraphs[0],
    items: [
      {
        i: 'title',
        data: {
          content: request.topic,
          type: 'header',
          size: '5xl',
          align: 'center',
        },
      },
      {
        i: 'subtitle',
        data: {
          content: subtitle || supporting || 'Prepared Presentation',
          type: 'subheader',
          size: 'xl',
          align: 'center',
          variant: 'muted',
        },
      },
    ],
    notes: supporting || undefined,
  };
}

function createSlidesForSection(section: NormalizedSection, request: NormalizedDeckRequest): GeneratedSlide[] {
  switch (section.focus) {
    case 'metrics':
      return createMetricSlides(section);
    case 'chart':
      return createChartSlides(section);
    case 'timeline':
      return createTimelineSlides(section);
    case 'testimonials':
      return createTestimonialSlides(section);
    case 'cta':
      return createCtaSlide(section, request);
    case 'comparison':
      return createComparisonSlides(section);
    case 'product':
      return createProductSlides(section);
    case 'overview':
    case 'narrative':
    case 'custom':
    default:
      return createNarrativeSlides(section);
  }
}

function createMetricSlides(section: NormalizedSection): GeneratedSlide[] {
  if (!section.metrics.length) return [];
  const chunked = chunk(section.metrics, 4);

  return chunked.map((metricChunk, index) => {
    const withFallback = padMetrics(metricChunk, 4);
    return {
      layout: 'data-grid-dashboard',
      title: index === 0 ? section.title : `${section.title} (cont.)`,
      subtitle: section.narrative,
      description: section.bullets.join(' • ') || section.narrative,
      items: [
        {
          i: 'kpi1',
          data: createKpiData(withFallback[0]),
        },
        {
          i: 'kpi2',
          data: createKpiData(withFallback[1]),
        },
        {
          i: 'kpi3',
          data: createKpiData(withFallback[2]),
        },
        {
          i: 'kpi4',
          data: createKpiData(withFallback[3]),
        },
      ],
      notes: section.narrative || undefined,
    };
  });
}

function createChartSlides(section: NormalizedSection): GeneratedSlide[] {
  if (!section.chart) return [];

  const chart = section.chart;
  const primarySeries = chart.series[0];
  const legendLines = buildChartLegend(chart);

  return [
    {
      layout: 'chart-showcase',
      title: section.title,
      subtitle: section.narrative,
      description: legendLines.join(' • ') || section.bullets.join(' • '),
      items: [
        {
          i: 'chart',
          data: {
            type: chart.type,
            label: primarySeries?.name ?? 'Series',
            categories: chart.categories,
            series: chart.series,
            data: buildLegacyChartData(chart, primarySeries),
          },
        },
        {
          i: 'legend',
          data: {
            content: legendLines.join('\n') || section.narrative || 'Key insights from the data.',
            type: 'paragraph',
            size: 'sm',
            align: 'left',
          },
        },
      ],
      notes: section.narrative || undefined,
    },
  ];
}

function createTimelineSlides(section: NormalizedSection): GeneratedSlide[] {
  const events = section.timeline;
  if (!events.length) return [];
  return [
    {
      layout: 'timeline-roadmap',
      title: section.title,
      subtitle: section.narrative,
      description: section.bullets.join(' • ') || section.narrative,
      items: [
        {
          i: 'timeline',
          data: {
            events: events.map(event => ({
              date: event.date,
              title: event.title,
              description: event.description,
            })),
          },
        },
      ],
      notes: section.narrative || undefined,
    },
  ];
}

function createTestimonialSlides(section: NormalizedSection): GeneratedSlide[] {
  if (!section.testimonials.length) return [];
  const chunked = chunk(section.testimonials, 2);

  return chunked.map((pair, index) => {
    const filled = padTestimonials(pair, 2);
    return {
      layout: 'testimonial-gallery',
      title: index === 0 ? section.title : `${section.title} (cont.)`,
      subtitle: section.narrative,
      description: section.bullets.join(' • '),
      items: [
        {
          i: 'testimonial1',
          data: filled[0],
        },
        {
          i: 'testimonial2',
          data: filled[1],
        },
      ],
    };
  });
}

function createCtaSlide(section: NormalizedSection, request: NormalizedDeckRequest): GeneratedSlide[] {
  const cta = section.callToAction ?? {
    headline: section.title,
    subheadline: section.narrative ?? request.takeaways[0] ?? buildSubtitle(request),
    buttonLabel: 'Get Started',
  };

  return [
    {
      layout: 'call-to-action',
      title: section.title || 'Next Steps',
      subtitle: cta.subheadline,
      description: section.narrative,
      items: [
        {
          i: 'cta-text',
          data: {
            content: cta.headline || section.title || 'Ready to move forward?',
            type: 'header',
            size: '4xl',
            align: 'center',
          },
        },
        {
          i: 'cta-button',
          data: {
            text: cta.buttonLabel ?? 'Contact Us',
            variant: 'primary',
            href: cta.url,
          },
        },
      ],
    },
  ];
}

function createComparisonSlides(section: NormalizedSection): GeneratedSlide[] {
  if (!section.table) return createNarrativeSlides(section);
  return [
    {
      layout: 'comparison-table',
      title: section.title,
      subtitle: section.narrative,
      description: section.bullets.join(' • '),
      items: [
        {
          i: 'table',
          data: {
            headers: section.table.headers,
            rows: section.table.rows,
          },
        },
      ],
    },
  ];
}

function createProductSlides(section: NormalizedSection): GeneratedSlide[] {
  if (section.image?.src) {
    return [
      {
        layout: 'photo-narrative-flow',
        title: section.title,
        subtitle: section.narrative,
        description: section.bullets.join(' • '),
        items: [
          {
            i: 'image1',
            data: {
              src: section.image.src,
              alt: section.image.alt ?? section.title,
              caption: section.image.caption,
            },
          },
          {
            i: 'text1',
            data: {
              content: buildNarrativeContent(section),
              type: 'paragraph',
              size: 'lg',
              align: 'left',
            },
          },
        ],
      },
    ];
  }

  return createNarrativeSlides(section);
}

function createNarrativeSlides(section: NormalizedSection): GeneratedSlide[] {
  const content = buildNarrativeContent(section);
  return [
    {
      layout: 'content-slide',
      title: section.title,
      subtitle: section.narrative || section.bullets.join(' • '),
      description: section.narrative,
      items: [
        {
          i: 'content',
          data: {
            content: content || section.title,
            type: 'paragraph',
            size: 'base',
            align: 'left',
          },
        },
      ],
      notes: section.rawContext,
    },
  ];
}

function createTakeawaysSlide(request: NormalizedDeckRequest): GeneratedSlide {
  const content = request.takeaways.map(item => `• ${item}`).join('\n');
  return {
    layout: 'content-slide',
    title: 'Key Takeaways',
    subtitle: buildSubtitle(request),
    description: request.takeaways.join(' • '),
    items: [
      {
        i: 'content',
        data: {
          content: content || 'Summaries of the most important outcomes.',
          type: 'paragraph',
          size: 'lg',
          align: 'left',
        },
      },
    ],
  };
}

function buildSubtitle(request: NormalizedDeckRequest): string | undefined {
  if (request.subtitle) return request.subtitle;
  if (request.audience) return `Prepared for ${request.audience}`;
  if (request.goals.length) return request.goals[0];
  if (request.keyMessages.length) return request.keyMessages[0];
  return undefined;
}

function buildNarrativeContent(section: NormalizedSection): string {
  const parts: string[] = [];
  if (section.narrative) {
    parts.push(section.narrative);
  }
  if (section.bullets.length) {
    parts.push(section.bullets.map(bullet => `• ${bullet}`).join('\n'));
  }
  if (!parts.length && section.metrics.length) {
    parts.push(section.metrics.map(metric => `${metric.label}: ${formatMetricValue(metric.value)}`).join('\n'));
  }
  return parts.join('\n\n');
}

function createKpiData(metric: MetricDatum): Record<string, unknown> {
  const formattedValue = formatMetricValue(metric.value);
  const detail = metric.change !== undefined ? buildChangeLabel(metric.change, metric.changeLabel) : '';
  return {
    metric: formattedValue,
    label: detail ? `${metric.label} (${detail})` : metric.label,
    icon: 'bar-chart-3',
  };
}

function formatMetricValue(value: string | number): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? formatNumber(value) : `${value}`;
  }
  const trimmed = value.trim();
  if (!trimmed) return '—';
  return trimmed;
}

function buildChangeLabel(change: number, label?: string): string {
  const sign = change > 0 ? '+' : '';
  const suffix = label ? ` ${label}` : '';
  return `${sign}${change}${suffix}`.trim();
}

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

function padMetrics(metrics: MetricDatum[], length: number): MetricDatum[] {
  const result = [...metrics];
  while (result.length < length) {
    result.push({ label: '—', value: '—' });
  }
  return result;
}

function padTestimonials(testimonials: NormalizedSection['testimonials'], length: number) {
  const result = testimonials.map(testimonial => ({
    quote: testimonial.quote,
    author: testimonial.author ?? 'Anonymous',
    role: testimonial.role,
    company: testimonial.company,
  }));
  while (result.length < length) {
    result.push({
      quote: '“Customer feedback placeholder.”',
      author: 'Client Name',
      role: undefined,
      company: undefined,
    });
  }
  return result;
}

function buildChartLegend(chart: ChartData): string[] {
  const lines: string[] = [];
  chart.series.forEach(series => {
    const trend = describeSeriesTrend(series.values);
    lines.push(`${series.name}: ${trend}`);
  });
  if (chart.summary) {
    lines.push(chart.summary);
  }
  return lines;
}

function describeSeriesTrend(values: Array<number | null>): string {
  const numericValues = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  if (numericValues.length < 2) return 'Stable performance';
  const first = numericValues[0];
  const last = numericValues[numericValues.length - 1];
  const diff = last - first;
  const direction = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'stable';
  const percentChange = first !== 0 ? ((diff / Math.abs(first)) * 100) : 0;
  const formattedChange = Number.isFinite(percentChange) ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : `${diff.toFixed(1)}`;
  return `${direction} (${formattedChange})`;
}

function buildLegacyChartData(chart: ChartData, primarySeries?: ChartData['series'][number]) {
  if (!primarySeries) {
    return chart.categories.map(name => ({ name, value: 0 }));
  }
  return chart.categories.map((category, index) => ({
    name: category,
    value: toNumber(primarySeries.values[index]),
  }));
}

function toNumber(value: number | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return 0;
}

function chunk<T>(values: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < values.length; i += size) {
    result.push(values.slice(i, i + size));
  }
  return result;
}


