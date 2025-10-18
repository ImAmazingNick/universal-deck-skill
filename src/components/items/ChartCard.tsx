"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ChartData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  data: ChartData;
  theme: ThemeConfig;
  className?: string;
}

const COLORS = [
  '#00FFFF', '#FF6B35', '#8B5CF6', '#00D4AA', '#FF6B35',
  '#7C3AED', '#A78BFA', '#00F5D4', '#E55A2B', '#00A3FF'
];

export const ChartCard: React.FC<ChartCardProps> = ({ data, theme, className }) => {
  const chartConfig = {
    value: {
      label: "Value",
      color: theme.colors.primary,
    },
    ...data.config,
  };

  const renderChart = () => {
    switch (data.type) {
      case 'bar':
        return (
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis
              dataKey="name"
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <YAxis
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: theme.colors.muted }}
            />
            <Bar
              dataKey="value"
              fill={theme.colors.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis
              dataKey="name"
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <YAxis
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: theme.colors.primary }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.colors.primary}
              strokeWidth={3}
              dot={{ fill: theme.colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: theme.colors.primary, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis
              dataKey="name"
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <YAxis
              stroke={theme.colors.foreground}
              fontSize={12}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: theme.colors.primary }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={theme.colors.primary}
              fill={theme.colors.primary}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Unsupported chart type: {data.type}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full border-2 transition-all duration-300 hover:shadow-lg",
          "bg-gradient-to-br from-card to-card/50"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-lg font-medium"
            style={{ color: theme.colors.foreground }}
          >
            Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            {renderChart()}
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};
