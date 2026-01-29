import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');

// Configuration des scénarios de charge
export const options = {
  scenarios: {
    // Test de montée en charge progressive
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '2m', target: 10 },   // Montée à 10 utilisateurs
        { duration: '3m', target: 50 },   // Montée à 50 utilisateurs
        { duration: '2m', target: 100 },  // Montée à 100 utilisateurs
        { duration: '5m', target: 100 },  // Maintien à 100 utilisateurs
        { duration: '2m', target: 0 },    // Descente à 0
      ],
    },
    
    // Test de pic de trafic
    spike_test: {
      executor: 'ramping-vus',
      startTime: '15m',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 200 },   // Pic soudain
        { duration: '30s', target: 200 },
        { duration: '1m', target: 10 },    // Retour normal
      ],
    },
    
    // Test de stress continu
    stress_test: {
      executor: 'constant-vus',
      vus: 50,
      duration: '10m',
      startTime: '20m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<2000'],        // 95% des requêtes < 2s
    http_req_failed: ['rate<0.05'],           // < 5% d'erreurs
    errors: ['rate<0.05'],                    // < 5% d'erreurs métier
  },
  
  ext: {
    loadimpact: {
      distribution: {
        'amazon:fr:paris': { loadZone: 'amazon:fr:paris', percent: 70 },
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 20 },
        'amazon:de:frankfurt': { loadZone: 'amazon:de:frankfurt', percent: 10 },
      },
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Données de test
const testProducts = [1, 2, 3, 4, 5];
const testUsers = [
  { email: 'user1@test.com', password: 'test123' },
  { email: 'user2@test.com', password: 'test123' },
];

export default function () {
  const scenario = __ENV.SCENARIO || 'mixed';
  
  switch (scenario) {
    case 'api':
      testApiEndpoints();
      break;
    case 'ecommerce':
      testEcommerceFlow();
      break;
    case 'static':
      testStaticPages();
      break;
    default:
      testMixedWorkload();
  }
  
  sleep(Math.random() * 3 + 1); // Pause entre 1-4s
}

/**
 * Test des endpoints API critiques
 */
function testApiEndpoints() {
  const group = 'API Tests';
  
  // Test GET /api/products
  let res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    'products API responds': (r) => r.status === 200,
    'products data valid': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data.data) && data.data.length > 0;
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);
  
  // Test GET /api/products/:id
  const randomProduct = testProducts[Math.floor(Math.random() * testProducts.length)];
  res = http.get(`${BASE_URL}/api/products/${randomProduct}`);
  check(res, {
    'product detail API responds': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  // Test authentification
  res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'invalid'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'auth API responds': (r) => r.status === 401 || r.status === 200,
  }) || errorRate.add(1);
}

/**
 * Test du parcours e-commerce complet
 */
function testEcommerceFlow() {
  const group = 'E-commerce Flow';
  
  // 1. Page d'accueil
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage loads': (r) => r.status === 200,
    'homepage has content': (r) => r.body.includes('KAMBA LHAINS'),
  }) || errorRate.add(1);
  
  // 2. Navigation vers boutique
  res = http.get(`${BASE_URL}/boutique`);
  check(res, {
    'shop page loads': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  // 3. Consultation produit
  const randomProduct = testProducts[Math.floor(Math.random() * testProducts.length)];
  res = http.get(`${BASE_URL}/produit/${randomProduct}`);
  check(res, {
    'product page loads': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  // 4. Ajout au panier (simulation)
  res = http.get(`${BASE_URL}/panier`);
  check(res, {
    'cart page accessible': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  // 5. Page de checkout
  res = http.get(`${BASE_URL}/checkout`);
  check(res, {
    'checkout page loads': (r) => r.status === 200,
  }) || errorRate.add(1);
}

/**
 * Test des pages statiques
 */
function testStaticPages() {
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/nouvelle-collection',
    '/aube',
    '/zenith',
    '/crepuscule',
  ];
  
  const randomPage = staticPages[Math.floor(Math.random() * staticPages.length)];
  const res = http.get(`${BASE_URL}${randomPage}`);
  
  check(res, {
    'static page loads': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
}

/**
 * Test de charge mixte (scénario réaliste)
 */
function testMixedWorkload() {
  const rand = Math.random();
  
  if (rand < 0.4) {
    // 40% - Navigation simple
    testStaticPages();
  } else if (rand < 0.7) {
    // 30% - Consultation API
    testApiEndpoints();
  } else {
    // 30% - Parcours e-commerce
    testEcommerceFlow();
  }
}

/**
 * Setup initial (exécuté une seule fois)
 */
export function setup() {
  console.log('🚀 Démarrage des tests de charge Kamba Lhains');
  console.log(`📍 URL cible: ${BASE_URL}`);
  
  // Vérification que l'application répond
  const res = http.get(`${BASE_URL}/`);
  if (res.status !== 200) {
    throw new Error(`Application non accessible: ${res.status}`);
  }
  
  return { timestamp: new Date().toISOString() };
}

/**
 * Teardown final (exécuté une seule fois)
 */
export function teardown(data) {
  console.log('✅ Tests de charge terminés');
  console.log(`⏱️  Durée: ${new Date().toISOString()} - ${data.timestamp}`);
}