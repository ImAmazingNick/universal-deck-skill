"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TableData, ThemeConfig } from '@/lib/deck-types';
import { cn } from '@/lib/utils';

interface TableCardProps {
  data: TableData;
  theme: ThemeConfig;
  className?: string;
}

export const TableCard: React.FC<TableCardProps> = ({ data, theme, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card
        className={cn(
          "h-full border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
          "bg-gradient-to-br from-card via-card/95 to-card/80",
          "rounded-xl shadow-md overflow-hidden"
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.gradients.background,
        }}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr>
                  {data.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left font-bold font-features-text leading-heading border-b-2"
                      style={{
                        fontSize: '18px',
                        color: theme.colors.primary,
                        borderBottomColor: theme.colors.primary,
                        fontFamily: theme.typography?.fontFamily?.heading,
                        backgroundColor: theme.colors.muted,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {data.rows.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                    className="group"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={cn(
                          "px-6 py-4 font-features-text leading-relaxed border-b",
                          // Alternate row colors for better readability
                          rowIndex % 2 === 0 && "bg-background/30",
                          rowIndex % 2 === 1 && "bg-background/10",
                          // Hover effect
                          "group-hover:bg-primary/5 transition-colors duration-200"
                        )}
                        style={{
                          fontSize: '16px',
                          color: theme.colors.foreground,
                          fontFamily: theme.typography?.fontFamily?.body,
                          borderBottomColor: theme.colors.border,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


