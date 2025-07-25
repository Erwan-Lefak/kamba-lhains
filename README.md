# 🌟 Kamba Lhains - E-commerce de Mode Haut de Gamme

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.0-2D3748)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20Playwright-green)](https://jestjs.io/)

**Kamba Lhains** est une boutique de mode en ligne sophistiquée offrant des vêtements haut de gamme pour homme et femme. Conçue avec les technologies web les plus modernes, elle offre une expérience d'achat premium avec un focus sur l'artisanat français et européen.

## ✨ Fonctionnalités

### 🛍️ E-commerce Complet
- **Catalogue produits** avec filtrage avancé par catégorie, couleur, taille
- **Panier d'achat** persistant avec gestion des quantités
- **Processus de commande** sécurisé avec intégration Stripe
- **Gestion des utilisateurs** (inscription, connexion, profils)
- **Système de favoris** pour sauvegarder des produits

### 🎨 Collections Exclusives
- **Aube** - Vêtements matinaux élégants
- **Zénith** - Pièces de milieu de journée
- **Crépuscule** - Tenues de fin de journée  
- **Nouvelle Collection** - Dernières créations

### 🔧 Technologies Avancées
- **Next.js 15** avec React 19 pour performance optimale
- **TypeScript** complet avec typage strict
- **Prisma ORM** avec base PostgreSQL
- **NextAuth.js** pour authentification sécurisée
- **Stripe** pour les paiements
- **Framer Motion** pour animations fluides

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- PostgreSQL 13+
- Compte Stripe (pour les paiements)

### Configuration rapide

```bash
# Cloner le projet
git clone https://github.com/Erwan-Lefak/kamba-lhains.git
cd kamba-lhains

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos paramètres

# Configurer la base de données
npx prisma generate
npx prisma db push

# Lancer en développement
npm run dev
```

### Variables d'environnement requises

```env
# Base de données
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Authentification
NEXTAUTH_SECRET="votre-clé-secrete"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (optionnel)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_FROM="noreply@kamba-lhains.com"
```

## 📁 Structure du Projet

```
kamba-lhains/
├── 📁 components/          # Composants React réutilisables
│   ├── 📁 AI/             # Recommandations IA
│   ├── 📁 Analytics/      # Dashboard analytics
│   ├── 📁 Cart/           # Composants panier
│   ├── 📁 Header/         # Navigation et header
│   └── ...
├── 📁 pages/              # Routes Next.js
├── 📁 lib/                # Utilitaires et configurations
│   ├── 📁 middleware/     # Sécurité, validation, rate limiting
│   └── 📁 monitoring/     # Error tracking, métriques
├── 📁 services/           # Services API et logique métier
├── 📁 hooks/              # Hooks React personnalisés
├── 📁 contexts/           # Gestion d'état globale
├── 📁 types/              # Définitions TypeScript
├── 📁 __tests__/          # Tests unitaires et d'intégration
├── 📁 tests/e2e/          # Tests end-to-end Playwright
├── 📁 docs/               # Documentation complète
└── 📁 public/             # Assets statiques et images
```

## 🛠️ Scripts de Développement

```bash
# Développement
npm run dev                # Serveur de développement
npm run build             # Build de production
npm run start             # Serveur de production

# Tests
npm run test              # Tests unitaires Jest
npm run test:watch        # Tests en mode watch
npm run test:coverage     # Coverage des tests
npm run test:e2e          # Tests end-to-end Playwright

# Qualité de code
npm run lint              # ESLint
npm run lint:fix          # Fix automatique ESLint
npm run type-check        # Vérification TypeScript

# Performance et analyse
npm run analyze           # Analyse du bundle
npm run lighthouse        # Audit Lighthouse
npm run perf              # Tests de performance complets

# Validation complète
npm run validate          # Type-check + lint + tests
npm run precommit         # Hook de pre-commit
```

## 🔐 Sécurité

Le projet implémente des mesures de sécurité robustes :

### Middleware de Sécurité
- **Rate Limiting** par IP et endpoint
- **Headers de sécurité** (CSP, HSTS, XSS Protection)
- **Détection d'activités suspectes** avec blocage automatique
- **Validation stricte** des entrées avec Zod

### Authentification
- **NextAuth.js** avec sessions sécurisées
- **Tokens JWT** avec expiration
- **Protection CSRF** intégrée
- **Validation côté serveur** pour toutes les routes

### Monitoring
- **Error tracking** avec logs détaillés
- **Métriques de performance** en temps réel
- **Alertes automatiques** pour activités suspectes
- **Dashboard de monitoring** intégré

## 📊 Tests et Qualité

### Couverture de Tests
- **Tests unitaires** : Composants et utilities
- **Tests d'intégration** : Services API et hooks
- **Tests E2E** : Parcours utilisateur complets
- **Tests de performance** : Core Web Vitals
- **Tests d'accessibilité** : WCAG 2.1 AA

### Outils de Qualité
- **ESLint** avec règles Next.js
- **TypeScript** strict mode
- **Prettier** pour formatage
- **Lighthouse CI** pour audits automatiques

## 🌐 Déploiement

### Vercel (Recommandé)
```bash
# Déploiement automatique via GitHub
vercel --prod

# Ou configuration manuelle
vercel deploy --prod
```

### Configuration Production
- **PostgreSQL** hébergé (Supabase, Neon, etc.)
- **CDN** pour assets statiques
- **Redis** pour cache et sessions (optionnel)
- **Monitoring** externe (Sentry, DataDog)

## 📈 Performance

### Optimisations Implémentées
- **Images optimisées** automatiquement (WebP/AVIF)
- **Lazy loading** pour tous les composants
- **Bundle splitting** et code splitting
- **Compression Gzip/Brotli**
- **Mise en cache** intelligente

### Métriques Cibles
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s  
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

## 🌍 Internationalisation

Le projet supporte 3 langues :
- **Français** 🇫🇷 (par défaut)
- **Anglais** 🇬🇧
- **Coréen** 🇰🇷

Les traductions sont centralisées dans `utils/translations.ts` avec un système de clés hiérarchiques.

## 🤝 Contribution

### Guide de Contribution
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commiter** les changements (`git commit -m 'Add amazing feature'`)
4. **Pousser** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **TypeScript strict** obligatoire
- **Tests** pour toute nouvelle fonctionnalité
- **Documentation** mise à jour
- **Messages de commit** conventionnels

## 📚 Documentation

- **[Documentation API](./docs/API_DOCUMENTATION.md)** - Endpoints et exemples
- **[Structure du projet](./docs/PROJECT_STRUCTURE.md)** - Organisation des fichiers
- **[Guide des améliorations](./IMPROVEMENTS.md)** - Historique des améliorations

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur Principal** : [Erwan Lefak](https://github.com/Erwan-Lefak)
- **Design** : Équipe Kamba Lhains
- **Contribution** : Communauté open-source

## 📞 Support

- **Email** : dev@kamba-lhains.com
- **Issues** : [GitHub Issues](https://github.com/Erwan-Lefak/kamba-lhains/issues)
- **Documentation** : [Wiki du projet](https://github.com/Erwan-Lefak/kamba-lhains/wiki)

---

**Fait avec ❤️ en France** • **Kamba Lhains** © 2024
