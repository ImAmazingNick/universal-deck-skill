// Client-side export functionality for browser preview

export interface ExportOptions {
  layout?: string;
  layouts?: string[];
  theme: string;
  filename?: string;
}

export async function exportDeckClient(options: ExportOptions): Promise<void> {
  const { layout, layouts, theme, filename = 'deck.pptx' } = options;

  if (!layout && (!layouts || layouts.length === 0)) {
    throw new Error('Either layout or layouts array is required');
  }

  try {
    // Show loading state
    console.log(`🎨 Exporting deck with theme: ${theme}...`);

    // Call the API route
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        layout,
        layouts,
        theme,
        filename,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export PPTX');
    }

    // Get the blob and create a download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log(`✅ Deck exported successfully: ${filename}`);
  } catch (error: any) {
    console.error('Export failed:', error);
    throw error;
  }
}

export function downloadSamplePptx(): void {
  // This is a placeholder - in a real implementation,
  // you'd generate or fetch the actual PPTX file
  console.log('📥 Downloading sample PPTX...');

  // For demo purposes, just show an alert
  alert('Sample PPTX download would happen here. Use the CLI command: npm run export generate');
}
