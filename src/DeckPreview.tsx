"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { BoldMinimalistHero, DataGridDashboard, PhotoNarrativeFlow, ChartShowcase, TestimonialGallery, CallToAction, MetricsBreakdown, ComparisonTable } from '@/components/layouts';
import { ThemeConfig } from '@/lib/deck-types';
import { exportDeckClient } from '@/lib/export-client';
import layoutsData from '@/../resources/layouts.json';
import themesData from '@/../resources/themes.json';
import { cn } from '@/lib/utils';
import { Palette, Layout, Download, Maximize2, Minimize2 } from 'lucide-react';

interface DeckPreviewProps {
  className?: string;
}

const layoutComponents = {
  'bold-minimalist-hero': BoldMinimalistHero,
  'data-grid-dashboard': DataGridDashboard,
  'photo-narrative-flow': PhotoNarrativeFlow,
  'chart-showcase': ChartShowcase,
  'testimonial-gallery': TestimonialGallery,
  'call-to-action': CallToAction,
  'metrics-breakdown': MetricsBreakdown,
  'comparison-table': ComparisonTable,
};

export const DeckPreview: React.FC<DeckPreviewProps> = ({ className }) => {
  const [selectedLayout, setSelectedLayout] = useState<string>('data-grid-dashboard');
  const [selectedTheme, setSelectedTheme] = useState<string>('metallic-earth');
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themesData.themes['metallic-earth']);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentTheme(themesData.themes[selectedTheme as keyof typeof themesData.themes]);
  }, [selectedTheme]);

  const LayoutComponent = layoutComponents[selectedLayout as keyof typeof layoutComponents];
  const currentLayout = layoutsData.layouts[selectedLayout as keyof typeof layoutsData.layouts];

  const handleExport = async () => {
    try {
      await exportDeckClient({
        layout: selectedLayout,
        theme: selectedTheme,
        filename: 'generated-deck.pptx'
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    }
  };

  const getLayoutIcon = (layoutKey: string) => {
    const icons: Record<string, React.ReactNode> = {
      'bold-minimalist-hero': <Layout className="h-4 w-4" />,
      'data-grid-dashboard': <Layout className="h-4 w-4" />,
      'photo-narrative-flow': <Layout className="h-4 w-4" />,
      'chart-showcase': <Layout className="h-4 w-4" />,
      'testimonial-gallery': <Layout className="h-4 w-4" />,
      'call-to-action': <Layout className="h-4 w-4" />,
      'metrics-breakdown': <Layout className="h-4 w-4" />,
      'comparison-table': <Layout className="h-4 w-4" />,
    };
    return icons[layoutKey] || <Layout className="h-4 w-4" />;
  };

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen bg-gray-50 flex w-full", className)}>
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h1 className="text-lg font-bold text-gray-900">Deck Skill Preview</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Theme</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(themesData.themes).map(([key, theme]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Layouts</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.entries(layoutsData.layouts).map(([key, layout]) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        isActive={selectedLayout === key}
                        onClick={() => setSelectedLayout(key)}
                        className="w-full justify-start"
                      >
                        <div className="flex items-center gap-3">
                          {getLayoutIcon(key)}
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">
                              {layout.description.split(' ').slice(0, 3).join(' ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-3 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-full justify-start"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Fullscreen Preview
                  </>
                )}
              </Button>
              <Button
                onClick={handleExport}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PPTX
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {layoutsData.layouts[selectedLayout as keyof typeof layoutsData.layouts]?.description}
              </h2>
              <div className="text-sm text-gray-500">
                Theme: {currentTheme.name}
              </div>
            </div>
          </header>

          {/* Preview Area */}
          <div className={cn(
            "flex-1 p-8 w-full pt-4",
            isFullscreen && "fixed inset-0 z-50 bg-white p-0"
          )}>
            <div className={cn(
              "w-full relative",
              isFullscreen ? "h-full" : "aspect-[16/9]"
            )}
            style={isFullscreen ? {} : { maxWidth: '1200px', margin: '0 auto' }}
            >
              <motion.div
                key={`${selectedLayout}-${selectedTheme}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "w-full h-full rounded-lg overflow-hidden shadow-2xl border",
                  isFullscreen && "rounded-none"
                )}
                style={{
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                }}
              >
                {LayoutComponent && (
                  <LayoutComponent layout={currentLayout} theme={currentTheme} />
                )}
              </motion.div>
            </div>

            {/* Layout Info */}
            {!isFullscreen && (
              <div className="mt-6 w-full px-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Layout Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Configuration</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Layout: {selectedLayout.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                        <li>• Grid: 12 columns, responsive</li>
                        <li>• Theme: {currentTheme.name}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
