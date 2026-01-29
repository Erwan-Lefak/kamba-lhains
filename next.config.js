/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables explicites pour Next.js
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },

  // Port configuration
  devIndicators: {
    port: 3002
  },
  // Image optimization avancée
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['res.cloudinary.com', 'www.jacquemus.com'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    unoptimized: false, // Force optimization
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://m.stripe.network; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.stripe.com https://*.google.com https://*.supabase.co; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'https://kamba-lhains.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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

  // Output standalone pour Docker (requis pour Cloud Run)
  output: 'standalone',
}

module.exports = nextConfig