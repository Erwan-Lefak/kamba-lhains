import React from 'react';

// SVG filters for color blindness simulation
export const ColorBlindnessFilters: React.FC = () => (
  <svg className="sr-only" aria-hidden="true">
    <defs>
      {/* Protanopia filter (red-blind) */}
      <filter id="protanopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.567, 0.433, 0,     0, 0
                  0.558, 0.442, 0,     0, 0
                  0,     0.242, 0.758, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* Deuteranopia filter (green-blind) */}
      <filter id="deuteranopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.625, 0.375, 0,   0, 0
                  0.7,   0.3,   0,   0, 0
                  0,     0.3,   0.7, 0, 0
                  0,     0,     0,   1, 0"
        />
      </filter>

      {/* Tritanopia filter (blue-blind) */}
      <filter id="tritanopia-filter">
        <feColorMatrix
          type="matrix"
          values="0.95, 0.05,  0,     0, 0
                  0,    0.433, 0.567, 0, 0
                  0,    0.475, 0.525, 0, 0
                  0,    0,     0,     1, 0"
        />
      </filter>

      {/* Protanomaly filter (red-weak) */}
      <filter id="protanomaly-filter">
        <feColorMatrix
          type="matrix"
          values="0.817, 0.183, 0,     0, 0
                  0.333, 0.667, 0,     0, 0
                  0,     0.125, 0.875, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* Deuteranomaly filter (green-weak) */}
      <filter id="deuteranomaly-filter">
        <feColorMatrix
          type="matrix"
          values="0.8,   0.2,   0,     0, 0
                  0.258, 0.742, 0,     0, 0
                  0,     0.142, 0.858, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* Tritanomaly filter (blue-weak) */}
      <filter id="tritanomaly-filter">
        <feColorMatrix
          type="matrix"
          values="0.967, 0.033, 0,     0, 0
                  0,     0.733, 0.267, 0, 0
                  0,     0.183, 0.817, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* Achromatopsia filter (total color blindness) */}
      <filter id="achromatopsia-filter">
        <feColorMatrix
          type="matrix"
          values="0.299, 0.587, 0.114, 0, 0
                  0.299, 0.587, 0.114, 0, 0
                  0.299, 0.587, 0.114, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* Achromatomaly filter (partial color blindness) */}
      <filter id="achromatomaly-filter">
        <feColorMatrix
          type="matrix"
          values="0.618, 0.320, 0.062, 0, 0
                  0.163, 0.775, 0.062, 0, 0
                  0.163, 0.320, 0.516, 0, 0
                  0,     0,     0,     1, 0"
        />
      </filter>

      {/* High contrast filter */}
      <filter id="high-contrast-filter">
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 .5 1"/>
        </feComponentTransfer>
      </filter>

      {/* Low contrast filter for testing */}
      <filter id="low-contrast-filter">
        <feComponentTransfer>
          <feFuncR type="linear" slope="0.3" intercept="0.35"/>
          <feFuncG type="linear" slope="0.3" intercept="0.35"/>
          <feFuncB type="linear" slope="0.3" intercept="0.35"/>
        </feComponentTransfer>
      </filter>

      {/* Blur filter for vision impairment simulation */}
      <filter id="blur-filter">
        <feGaussianBlur stdDeviation="2"/>
      </filter>

      {/* Cataracts simulation */}
      <filter id="cataracts-filter">
        <feGaussianBlur stdDeviation="1.5"/>
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 .8 1"/>
        </feComponentTransfer>
      </filter>

      {/* Glaucoma simulation (tunnel vision) */}
      <filter id="glaucoma-filter">
        <feGaussianBlur stdDeviation="3"/>
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 .3 1"/>
        </feComponentTransfer>
      </filter>

      {/* Macular degeneration simulation */}
      <filter id="macular-degeneration-filter">
        <feGaussianBlur stdDeviation="4"/>
        <feOffset dx="0" dy="0"/>
        <feFlood floodColor="#000000" floodOpacity="0.7"/>
        <feComposite in="SourceGraphic" operator="out"/>
      </filter>

      {/* Diabetic retinopathy simulation */}
      <filter id="diabetic-retinopathy-filter">
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix
          type="matrix"
          values="0.8, 0.2, 0,   0, 0
                  0.2, 0.6, 0.2, 0, 0
                  0,   0.2, 0.8, 0, 0
                  0,   0,   0,   1, 0"
        />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 .6 1"/>
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

// Hook to apply color blindness filters
export const useColorBlindnessFilter = (type: string) => {
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing filter classes
    root.classList.remove(
      'colorblind-protanopia',
      'colorblind-deuteranopia', 
      'colorblind-tritanopia',
      'colorblind-protanomaly',
      'colorblind-deuteranomaly',
      'colorblind-tritanomaly',
      'colorblind-achromatopsia',
      'colorblind-achromatomaly'
    );

    // Add new filter class if not 'none'
    if (type !== 'none') {
      root.classList.add(`colorblind-${type}`);
    }
  }, [type]);
};

// Color contrast utilities
export const colorContrastUtils = {
  // Calculate relative luminance
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const lum1 = colorContrastUtils.getLuminance(...color1);
    const lum2 = colorContrastUtils.getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast ratio meets WCAG standards
  meetsWCAG: (ratio: number, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean => {
    const requirements = {
      AA: { normal: 4.5, large: 3 },
      AAA: { normal: 7, large: 4.5 }
    };
    return ratio >= requirements[level][size];
  },

  // Convert hex to RGB
  hexToRgb: (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  },

  // Check contrast between two hex colors
  checkContrast: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal') => {
    const rgb1 = colorContrastUtils.hexToRgb(color1);
    const rgb2 = colorContrastUtils.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return { ratio: 0, passes: false };
    
    const ratio = colorContrastUtils.getContrastRatio(rgb1, rgb2);
    const passes = colorContrastUtils.meetsWCAG(ratio, level, size);
    
    return { ratio: Math.round(ratio * 100) / 100, passes };
  }
};

// Color palette accessibility checker component
interface ColorPaletteCheckerProps {
  colors: { name: string; hex: string; usage: string }[];
  backgroundColor?: string;
}

export const ColorPaletteChecker: React.FC<ColorPaletteCheckerProps> = ({
  colors,
  backgroundColor = '#ffffff'
}) => {
  const results = colors.map(color => ({
    ...color,
    contrast: colorContrastUtils.checkContrast(color.hex, backgroundColor)
  }));

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Vérification d'accessibilité des couleurs</h3>
      <div className="space-y-3">
        {results.map((color, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 border rounded">
            <div
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            <div className="flex-1">
              <div className="font-medium">{color.name}</div>
              <div className="text-sm text-gray-600">{color.usage}</div>
              <div className="text-sm">
                Contraste: {color.contrast.ratio}:1 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  color.contrast.passes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {color.contrast.passes ? 'WCAG AA ✓' : 'WCAG AA ✗'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorBlindnessFilters;