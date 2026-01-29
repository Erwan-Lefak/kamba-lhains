import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E complets
 * Tests de performance, d'accessibilité et de comportement utilisateur
 */
export default defineConfig({
  testDir: './specs',
  
  /* Timeout global pour les tests */
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  
  /* Configuration des tests */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter de résultats */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'test-results/allure-results' }]
  ],
  
  /* Configuration globale */
  use: {
    /* URL de base */
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    
    /* Capture de traces uniquement en cas d'échec */
    trace: 'on-first-retry',
    
    /* Screenshots */
    screenshot: 'only-on-failure',
    
    /* Vidéos */
    video: 'retain-on-failure',
    
    /* Attendre les requêtes réseau */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Configuration des projets de test */
  projects: [
    // Tests de setup pour les données de test
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Tests Chrome Desktop
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['geolocation', 'notifications'],
        }
      },
      dependencies: ['setup'],
    },

    // Tests Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    // Tests Safari
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Tests Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    // Tests Mobile Safari
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },

    // Tests avec Edge
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      dependencies: ['setup'],
    },

    // Tests d'accessibilité
    {
      name: 'accessibility',
      testMatch: /.*\.a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // Tests de performance
    {
      name: 'performance',
      testMatch: /.*\.perf\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Désactiver les images pour des tests plus rapides
        contextOptions: {
          extraHTTPHeaders: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        }
      },
      dependencies: ['setup'],
    },

    // Tests visuels
    {
      name: 'visual',
      testMatch: /.*\.visual\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Configuration pour des screenshots consistants
        contextOptions: {
          deviceScaleFactor: 1,
          hasTouch: false,
          isMobile: false,
          viewport: { width: 1280, height: 720 }
        }
      },
      dependencies: ['setup'],
    }
  ],

  /* Configuration du serveur de développement */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Dossiers de sortie */
  outputDir: 'test-results/',
  
  /* Configuration globale des tests */
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
});