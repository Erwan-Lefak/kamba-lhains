module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/nouvelle-collection',
        'http://localhost:3000/boutique',
        'http://localhost:3000/produit/1'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Autres métriques importantes
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],
        
        // Ressources
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['error', { maxLength: 0 }],
        'next-gen-images': ['error', { maxLength: 0 }],
        'efficiently-encode-images': ['error', { maxLength: 0 }],
        'offscreen-images': ['error', { maxLength: 0 }],
        
        // Accessibilité
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],
        'button-name': ['error', { maxLength: 0 }],
        
        // SEO
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        'html-has-lang': ['error', { maxLength: 0 }],
        
        // Sécurité
        'is-on-https': ['error', { maxLength: 0 }],
        'external-anchors-use-rel-noopener': ['error', { maxLength: 0 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};