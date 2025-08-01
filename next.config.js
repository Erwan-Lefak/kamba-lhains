/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization avancée
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimisation progressive des images
    loader: 'default',
  },

  // Optimisations du compilateur
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },

  // Optimisations de bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations de production
    if (!dev) {
      // Bundle splitting avancé
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };

      // Tree shaking avancé
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Compression
      config.plugins.push(
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
          minChunkSize: 30000, // 30KB minimum
        })
      );
    }

    // Alias pour imports plus rapides
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/components`,
      '@/pages': `${__dirname}/pages`,
      '@/utils': `${__dirname}/utils`,
      '@/types': `${__dirname}/types`,
      '@/contexts': `${__dirname}/contexts`,
      '@/hooks': `${__dirname}/hooks`,
      '@/lib': `${__dirname}/lib`,
    };

    return config;
  },

  // Performance et sécurité
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Headers de sécurité et performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Build ID pour cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Mode expérimental pour les dernières optimisations
  experimental: {
    // optimizeCss: true, // Temporarily disabled - requires critters package
    scrollRestoration: true,
  },
}

module.exports = nextConfig