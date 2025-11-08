declare module 'quickchart-js' {
  interface DataUrlOptions {
    format?: 'png' | 'jpeg' | 'svg';
    devicePixelRatio?: number;
  }

  export default class QuickChart {
    constructor(options?: { width?: number; height?: number; backgroundColor?: string });
    setConfig(config: unknown): this;
    setWidth(width: number): this;
    setHeight(height: number): this;
    setBackgroundColor(color: string): this;
    toDataUrl(options?: DataUrlOptions): Promise<string>;
    getUrl(): string;
  }
}


