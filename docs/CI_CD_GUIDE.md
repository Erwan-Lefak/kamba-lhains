# 🔄 CI/CD Pipeline Guide - Kamba Lhains

Ce guide détaille le système CI/CD complet mis en place pour le projet Kamba Lhains, incluant l'intégration continue, le déploiement automatisé et la gestion des releases.

## 📋 Vue d'ensemble

Notre pipeline CI/CD comprend 4 workflows GitHub Actions principaux :

1. **🔄 CI/CD Pipeline** (`ci-cd.yml`) - Pipeline principal de construction et déploiement
2. **📏 Quality Gates** (`quality-gates.yml`) - Contrôles qualité et standards de code
3. **📦 Dependency Management** (`dependencies.yml`) - Gestion automatisée des dépendances
4. **🚀 Release Management** (`release.yml`) - Gestion des versions et releases

## 🔄 Pipeline Principal (ci-cd.yml)

### Déclencheurs
- **Push** sur `main` et `develop`
- **Pull Requests** vers `main`
- **Déclenchement manuel** avec choix d'environnement

### Étapes du Pipeline

#### 1. 🔒 Analyse de Sécurité
```yaml
- Scan Trivy pour les vulnérabilités
- Analyse CodeQL pour la sécurité du code
- Upload des résultats vers GitHub Security
```

#### 2. 🧪 Tests et Qualité
```yaml
- Tests sur Node.js 18.x et 20.x
- Vérification TypeScript
- Linting ESLint
- Tests unitaires avec couverture
- Tests E2E avec Playwright
- Audit Lighthouse pour les performances
- Analyse de bundle
```

#### 3. 🏗️ Construction
```yaml
- Build de production
- Création d'artefacts
- Analyse de la taille du build
- Upload des artefacts
```

#### 4. 🧪 Tests de Charge
```yaml
- Tests de charge avec K6
- Tests avec Artillery
- Rapports de performance
- Validation des métriques
```

#### 5. 🚀 Déploiement Staging
```yaml
- Déploiement automatique sur Vercel
- Tests de fumée post-déploiement
- Commentaire avec URL de déploiement
```

#### 6. 🏭 Déploiement Production
```yaml
- Déploiement sur production
- Vérifications de santé
- Monitoring post-déploiement
```

#### 7. 🔄 Tâches Post-Déploiement
```yaml
- Exécution des scripts de backup
- Monitoring de performance
- Notifications Slack/Email
```

### Configuration Requise

#### Secrets GitHub
```env
# Vercel
VERCEL_TOKEN=xxxxx
VERCEL_ORG_ID=xxxxx
VERCEL_PROJECT_ID=xxxxx

# Base de données
PROD_DB_HOST=xxxxx
PROD_DB_NAME=xxxxx
PROD_DB_USER=xxxxx
PROD_DB_PASSWORD=xxxxx

# Notifications
SLACK_WEBHOOK_URL=xxxxx
EMAIL_USERNAME=xxxxx
EMAIL_PASSWORD=xxxxx
NOTIFICATION_EMAIL=xxxxx

# Outils
CODECOV_TOKEN=xxxxx
LHCI_GITHUB_APP_TOKEN=xxxxx
```

## 📏 Quality Gates (quality-gates.yml)

### Objectifs
- Maintenir la qualité du code
- Prévenir les régressions
- Assurer la sécurité
- Valider les PR

### Contrôles Qualité

#### 📊 Qualité du Code
```yaml
- ESLint avec format SARIF
- SonarCloud analysis
- Couverture de code minimum (30%)
- Vérification de la taille du bundle (<50MB)
- Audit de performance Lighthouse
```

#### 🔒 Sécurité
```yaml
- npm audit (0 vulnérabilités critiques, max 5 high)
- Scan de secrets avec TruffleHog
- Vérification des licences
```

#### 🧪 Tests
```yaml
- Couverture minimale par catégorie :
  - Statements: 25%
  - Branches: 20%
  - Functions: 25%
  - Lines: 25%
- Tests E2E fonctionnels
- Tests de performance
```

#### 📋 Qualité PR
```yaml
- Taille limitée (max 50 fichiers, 1000 lignes)
- Format de titre (Conventional Commits)
- Description minimale (50 caractères)
- Checklist de code review automatique
```

### Seuils Configurables
```javascript
// Couverture de code
const thresholds = {
  statements: 25,
  branches: 20,
  functions: 25,
  lines: 25
};

// Bundle size
const MAX_BUNDLE_SIZE_MB = 50;

// Vulnérabilités
const MAX_HIGH_VULNERABILITIES = 5;
const MAX_CRITICAL_VULNERABILITIES = 0;
```

## 📦 Gestion des Dépendances (dependencies.yml)

### Fonctionnalités

#### 🔍 Audit Automatique
- **Hebdomadaire** : Audit de sécurité complet
- **Détection** : Vulnérabilités et packages obsolètes
- **Rapport** : Analyse des licences et statistiques

#### 🔄 Mises à Jour Automatisées
```yaml
# Types de mises à jour
- patch: Corrections de bugs uniquement
- minor: Nouvelles fonctionnalités compatibles
- major: Changements majeurs (avec prudence)
```

#### 🏗️ Tests de Compatibilité
- **Matrix testing** sur Node.js 16.x, 18.x, 20.x
- **Validation** automatique après mise à jour
- **Rollback** en cas d'échec

#### 🔒 Mises à Jour de Sécurité
```yaml
- Application automatique des correctifs
- Création de PR prioritaires
- Tests complets avant merge
```

### Configuration
```yaml
# Planification
schedule:
  - cron: '0 9 * * 1'  # Tous les lundis à 9h UTC

# Labels automatiques
labels: [dependencies, automated, security]

# Assignation automatique
reviewers: [repository_owner]
```

## 🚀 Gestion des Releases (release.yml)

### Types de Releases

#### 📋 Release Préparée (Manuel)
```yaml
- Calcul automatique de version (patch/minor/major)
- Génération de changelog
- Création et push des tags
- Support des pré-releases
```

#### 🏗️ Build de Release
```yaml
- Tests complets (unitaires + E2E)
- Build de production optimisé
- Création d'archives
- Rapport de build détaillé
```

#### 🚀 Publication GitHub
```yaml
- Release notes automatiques
- Upload d'artefacts
- Liens vers documentation
- Instructions d'installation
```

#### 🚀 Déploiement Automatique
```yaml
- Déploiement Vercel production
- Validation post-déploiement
- Checks de santé complets
```

#### 📢 Notifications
```yaml
- Slack (#releases)
- Email aux stakeholders
- Résumé dans GitHub Actions
```

### Workflow de Release

1. **Déclenchement Manuel**
   ```bash
   # Via GitHub UI ou API
   curl -X POST \
     -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/OWNER/REPO/actions/workflows/release.yml/dispatches \
     -d '{"ref":"main","inputs":{"version_type":"minor","pre_release":false}}'
   ```

2. **Release Automatique par Tag**
   ```bash
   git tag -a v1.2.3 -m "Release v1.2.3"
   git push origin v1.2.3
   ```

## 🛠️ Configuration et Maintenance

### Setup Initial

1. **Configuration des Secrets**
   ```bash
   # Via GitHub CLI
   gh secret set VERCEL_TOKEN --body="your_token"
   gh secret set SLACK_WEBHOOK_URL --body="your_webhook"
   ```

2. **Configuration Vercel**
   ```bash
   # Lier le projet
   vercel link
   
   # Récupérer les IDs
   vercel env ls
   ```

3. **Configuration SonarCloud**
   ```bash
   # Créer projet sur sonarcloud.io
   # Ajouter SONAR_TOKEN aux secrets GitHub
   ```

### Monitoring et Debugging

#### 📊 Métriques Suivies
```yaml
- Temps de build moyen
- Taux de succès des déploiements  
- Couverture de code évolution
- Nombre de vulnérabilités
- Taille du bundle tendance
```

#### 🔍 Logs et Debugging
```bash
# Vérifier les workflows
gh run list --workflow=ci-cd.yml

# Détails d'une exécution
gh run view RUN_ID --log

# Re-déclencher un workflow
gh run rerun RUN_ID
```

#### ⚠️ Résolution des Problèmes Courants

**1. Échec de Déploiement Vercel**
```bash
# Vérifier les tokens
vercel whoami
vercel projects ls

# Logs de déploiement
vercel logs PROJECT_NAME
```

**2. Tests de Charge Timeout**
```yaml
# Augmenter le timeout dans ci-cd.yml
- name: ⚡ Run load tests
  run: timeout 600 npm run load-test:k6
```

**3. Couverture de Code Insuffisante**
```javascript
// Ajuster les seuils dans quality-gates.yml
const thresholds = {
  statements: 20,  // Réduire temporairement
  branches: 15,
  functions: 20,
  lines: 20
};
```

### Optimisations et Améliorations

#### 🚀 Performance du Pipeline
```yaml
# Cache agressif
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}

# Parallélisation
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

#### 📊 Métriques Avancées
```yaml
# Intégration DataDog/New Relic
- name: Send metrics
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/series" \
    -H "Content-Type: application/json" \
    -H "DD-API-KEY: ${{ secrets.DD_API_KEY }}" \
    -d '{"series":[{"metric":"ci.build.duration","points":[['$(date +%s)', '${{ github.event.head_commit.timestamp }}']],"tags":["environment:production"]}]}'
```

## 📚 Ressources Additionnelles

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [K6 Documentation](https://k6.io/docs/)

### Outils de Monitoring
- [GitHub Actions Usage](https://github.com/settings/billing)
- [Vercel Analytics](https://vercel.com/analytics)
- [SonarCloud Quality Gate](https://sonarcloud.io/)

### Best Practices
- Toujours tester les changements de pipeline sur une branche
- Utiliser des environnements staging pour valider
- Monitorer les coûts des workflows
- Maintenir les secrets à jour
- Documenter les changements de configuration

---

**📋 Ce pipeline est conçu pour évoluer avec le projet. N'hésitez pas à l'adapter selon vos besoins spécifiques.**

*Dernière mise à jour : 2024-12-25*  
*Version : 1.0*  
*Responsable : DevOps Team*