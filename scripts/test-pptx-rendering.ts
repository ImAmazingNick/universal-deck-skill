import { exportToPptx } from './exportPptx';
import path from 'path';

/**
 * Test script to verify PPTX rendering with styles and layouts
 */
async function testPptxRendering() {
  console.log('🧪 Testing PPTX Rendering...\n');

  const testCases = [
    {
      name: 'Single Layout Test',
      options: {
        theme: 'metallic-earth',
        layout: 'bold-minimalist-hero',
        outputPath: 'output/test-single-layout.pptx'
      }
    },
    {
      name: 'Multiple Slides Test',
      options: {
        theme: 'metallic-earth',
        slides: [
          {
            layout: 'bold-minimalist-hero',
            title: 'Hero Slide'
          },
          {
            layout: 'data-grid-dashboard',
            title: 'Dashboard View'
          },
          {
            layout: 'chart-showcase',
            title: 'Chart Analysis'
          },
          {
            layout: 'comparison-table',
            title: 'Feature Comparison'
          }
        ],
        outputPath: 'output/test-multiple-slides.pptx'
      }
    },
    {
      name: 'Style Application Test',
      options: {
        theme: 'metallic-earth',
        slides: [
          {
            layout: 'content-slide',
            title: 'Typography Test',
            items: [
              {
                i: 'text1',
                data: {
                  text: 'Large Bold Text',
                  size: '3xl',
                  weight: 'bold',
                  color: '#00FFFF'
                }
              },
              {
                i: 'text2',
                data: {
                  text: 'Medium Regular Text',
                  size: 'lg',
                  weight: 'normal'
                }
              }
            ]
          }
        ],
        outputPath: 'output/test-styles.pptx'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📝 Running: ${testCase.name}`);
      await exportToPptx(testCase.options as any);
      console.log(`   ✅ Success: ${testCase.options.outputPath}\n`);
    } catch (error) {
      console.error(`   ❌ Failed: ${testCase.name}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  console.log('✨ Testing complete!');
}

// Run tests if executed directly
if (require.main === module) {
  testPptxRendering().catch(console.error);
}

export { testPptxRendering };

