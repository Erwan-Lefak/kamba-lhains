# Déploiement sur Google Cloud Run

Ce guide vous accompagne dans la migration de votre site Next.js vers Google Cloud Run.

## Prérequis

1. **Compte Google Cloud Platform** avec facturation activée
2. **gcloud CLI** installé ([Installation](https://cloud.google.com/sdk/docs/install))
3. **Docker** installé localement (optionnel, pour tests)

## 1. Configuration initiale Google Cloud

### Installer et configurer gcloud CLI

```bash
# Installer gcloud (si pas déjà fait)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Se connecter à Google Cloud
gcloud auth login

# Créer un nouveau projet (ou utiliser un existant)
gcloud projects create kamba-lhains --name="Kamba Lhains"

# Définir le projet par défaut
gcloud config set project kamba-lhains

# Activer la facturation (requis)
# Allez sur: https://console.cloud.google.com/billing

# Activer les APIs nécessaires
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Définir la région par défaut (Europe)
gcloud config set run/region europe-west1
```

## 2. Gestion des variables d'environnement

### Créer les secrets dans Secret Manager

Les variables sensibles doivent être stockées dans Google Secret Manager, **jamais** dans le code.

```bash
# Créer les secrets à partir du fichier .env.local
echo -n "votre_valeur" | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-
echo -n "votre_valeur" | gcloud secrets create DATABASE_URL --data-file=-
echo -n "votre_valeur" | gcloud secrets create STRIPE_SECRET_KEY --data-file=-
echo -n "votre_valeur" | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=-
echo -n "votre_valeur" | gcloud secrets create JWT_SECRET --data-file=-
echo -n "votre_valeur" | gcloud secrets create ADMIN_PASSWORD --data-file=-

# Variables publiques (peuvent être définies directement)
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# ADMIN_EMAIL
```

### Script automatisé pour créer tous les secrets

Créez un fichier `setup-secrets.sh`:

```bash
#!/bin/bash

# Source .env.local
export $(cat .env.local | xargs)

# Créer les secrets
echo -n "$SUPABASE_SERVICE_ROLE_KEY" | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=- 2>/dev/null || \
  echo -n "$SUPABASE_SERVICE_ROLE_KEY" | gcloud secrets versions add SUPABASE_SERVICE_ROLE_KEY --data-file=-

echo -n "$DATABASE_URL" | gcloud secrets create DATABASE_URL --data-file=- 2>/dev/null || \
  echo -n "$DATABASE_URL" | gcloud secrets versions add DATABASE_URL --data-file=-

echo -n "$STRIPE_SECRET_KEY" | gcloud secrets create STRIPE_SECRET_KEY --data-file=- 2>/dev/null || \
  echo -n "$STRIPE_SECRET_KEY" | gcloud secrets versions add STRIPE_SECRET_KEY --data-file=-

echo -n "$STRIPE_WEBHOOK_SECRET" | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- 2>/dev/null || \
  echo -n "$STRIPE_WEBHOOK_SECRET" | gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=-

echo -n "$JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- 2>/dev/null || \
  echo -n "$JWT_SECRET" | gcloud secrets versions add JWT_SECRET --data-file=-

echo -n "$ADMIN_PASSWORD" | gcloud secrets create ADMIN_PASSWORD --data-file=- 2>/dev/null || \
  echo -n "$ADMIN_PASSWORD" | gcloud secrets versions add ADMIN_PASSWORD --data-file=-

echo "Secrets créés avec succès!"
```

Rendre exécutable et lancer:
```bash
chmod +x setup-secrets.sh
./setup-secrets.sh
```

## 3. Déploiement manuel (première fois)

### Construire l'image Docker localement (optionnel, pour tester)

```bash
# Tester le build localement
docker build -t kamba-lhains .

# Tester l'image localement
docker run -p 8080:8080 --env-file .env.local kamba-lhains

# Accéder à http://localhost:8080
```

### Déployer sur Cloud Run

```bash
# Build et déploiement en une commande
gcloud run deploy kamba-lhains \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,ADMIN_EMAIL=$ADMIN_EMAIL" \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,JWT_SECRET=JWT_SECRET:latest,ADMIN_PASSWORD=ADMIN_PASSWORD:latest"
```

**Note:** Remplacez les valeurs `$VARIABLE` par les vraies valeurs ou sourcez le fichier .env.local avant.

## 4. Déploiement automatisé avec Cloud Build (CI/CD)

### Configuration du trigger GitHub

```bash
# Connecter votre repository GitHub
gcloud beta builds triggers create github \
  --repo-name=kamba-lhains \
  --repo-owner=Erwan-Lefak \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

Vous devrez autoriser Cloud Build à accéder à votre repository GitHub via la console.

### Autoriser Cloud Build à déployer sur Cloud Run

```bash
# Obtenir le numéro du projet
PROJECT_NUMBER=$(gcloud projects describe kamba-lhains --format='value(projectNumber)')

# Donner les permissions nécessaires au service account Cloud Build
gcloud projects add-iam-policy-binding kamba-lhains \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding kamba-lhains \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding kamba-lhains \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Mise à jour du cloudbuild.yaml avec les secrets

Modifiez `cloudbuild.yaml` pour inclure les secrets:

```yaml
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'kamba-lhains'
      - '--image'
      - 'gcr.io/$PROJECT_ID/kamba-lhains:$COMMIT_SHA'
      - '--region'
      - 'europe-west1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '1Gi'
      - '--cpu'
      - '1'
      - '--min-instances'
      - '0'
      - '--max-instances'
      - '10'
      - '--port'
      - '8080'
      - '--timeout'
      - '300'
      - '--set-env-vars'
      - 'NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,NEXT_PUBLIC_SUPABASE_URL=https://zswdacnecdiuomlhyutr.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51PxoVLGYHWAvqsEv...,ADMIN_EMAIL=admin@kamba-lhains.com'
      - '--set-secrets'
      - 'DATABASE_URL=DATABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,JWT_SECRET=JWT_SECRET:latest,ADMIN_PASSWORD=ADMIN_PASSWORD:latest'
    secretEnv:
      - 'DATABASE_URL'
      - 'SUPABASE_SERVICE_ROLE_KEY'
      - 'STRIPE_SECRET_KEY'
      - 'STRIPE_WEBHOOK_SECRET'
      - 'JWT_SECRET'
      - 'ADMIN_PASSWORD'

availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/DATABASE_URL/versions/latest
      env: 'DATABASE_URL'
    - versionName: projects/$PROJECT_ID/secrets/SUPABASE_SERVICE_ROLE_KEY/versions/latest
      env: 'SUPABASE_SERVICE_ROLE_KEY'
    - versionName: projects/$PROJECT_ID/secrets/STRIPE_SECRET_KEY/versions/latest
      env: 'STRIPE_SECRET_KEY'
    - versionName: projects/$PROJECT_ID/secrets/STRIPE_WEBHOOK_SECRET/versions/latest
      env: 'STRIPE_WEBHOOK_SECRET'
    - versionName: projects/$PROJECT_ID/secrets/JWT_SECRET/versions/latest
      env: 'JWT_SECRET'
    - versionName: projects/$PROJECT_ID/secrets/ADMIN_PASSWORD/versions/latest
      env: 'ADMIN_PASSWORD'
```

## 5. Configuration du domaine personnalisé

### Mapper un domaine personnalisé

```bash
# Mapper votre domaine à Cloud Run
gcloud run domain-mappings create \
  --service kamba-lhains \
  --domain www.kamba-lhains.com \
  --region europe-west1

# Suivre les instructions pour configurer vos DNS
# (Google Cloud vous donnera des enregistrements DNS à ajouter)
```

### Configuration SSL

Le certificat SSL est automatiquement provisionné et géré par Google Cloud Run. Aucune configuration supplémentaire n'est nécessaire.

## 6. Configuration Stripe Webhook

Après le déploiement, vous devez mettre à jour l'URL du webhook Stripe:

1. Allez sur le Dashboard Stripe: https://dashboard.stripe.com/webhooks
2. Créez un nouveau webhook endpoint avec votre URL Cloud Run:
   ```
   https://kamba-lhains-xxxxx-ew.a.run.app/api/webhooks/stripe
   ```
3. Copiez le **signing secret** (commence par `whsec_...`)
4. Mettez à jour le secret dans Google Cloud:

```bash
echo -n "whsec_votre_nouveau_secret" | gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=-
```

5. Redéployez le service pour prendre en compte le nouveau secret:

```bash
gcloud run services update kamba-lhains --region europe-west1
```

## 7. Monitoring et logs

### Consulter les logs

```bash
# Voir les logs en temps réel
gcloud run services logs tail kamba-lhains --region europe-west1

# Voir les logs récents
gcloud run services logs read kamba-lhains --region europe-west1 --limit 50
```

### Dashboard de monitoring

Accédez à la console Google Cloud:
- **Cloud Run**: https://console.cloud.google.com/run
- **Logs**: https://console.cloud.google.com/logs
- **Monitoring**: https://console.cloud.google.com/monitoring

## 8. Commandes utiles

```bash
# Voir les services déployés
gcloud run services list

# Obtenir l'URL du service
gcloud run services describe kamba-lhains --region europe-west1 --format 'value(status.url)'

# Mettre à jour la configuration sans redéployer
gcloud run services update kamba-lhains \
  --memory 2Gi \
  --region europe-west1

# Voir les révisions
gcloud run revisions list --service kamba-lhains --region europe-west1

# Rollback vers une révision précédente
gcloud run services update-traffic kamba-lhains \
  --to-revisions REVISION_NAME=100 \
  --region europe-west1

# Supprimer le service
gcloud run services delete kamba-lhains --region europe-west1
```

## 9. Optimisations et bonnes pratiques

### Optimiser les coûts

- **Min instances**: Laissez à 0 pour éviter les coûts au repos
- **Max instances**: Limitez selon votre trafic attendu (10 est un bon départ)
- **Memory**: 1Gi est suffisant pour Next.js, augmentez si nécessaire

### Améliorer les performances

```bash
# Augmenter les ressources
gcloud run services update kamba-lhains \
  --memory 2Gi \
  --cpu 2 \
  --region europe-west1

# Ajouter des instances minimales pour éviter les cold starts
gcloud run services update kamba-lhains \
  --min-instances 1 \
  --region europe-west1
```

### Mise en place d'un CDN (optionnel mais recommandé)

Pour servir les assets statiques via un CDN:

```bash
# Créer un bucket Cloud Storage pour les assets
gsutil mb -l europe-west1 gs://kamba-lhains-assets

# Configurer le bucket pour l'accès public
gsutil iam ch allUsers:objectViewer gs://kamba-lhains-assets

# Configurer un Load Balancer avec CDN
# (Instructions complètes: https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket)
```

## 10. Checklist de migration

- [ ] Compte Google Cloud créé et facturé
- [ ] gcloud CLI installé et configuré
- [ ] Projet Google Cloud créé
- [ ] APIs activées (Cloud Run, Cloud Build, Secret Manager)
- [ ] Secrets créés dans Secret Manager
- [ ] Build Docker testé localement (optionnel)
- [ ] Premier déploiement manuel réussi
- [ ] Cloud Build connecté à GitHub
- [ ] Permissions accordées au service account Cloud Build
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] Certificat SSL actif
- [ ] Webhook Stripe mis à jour avec la nouvelle URL
- [ ] Tests de l'application en production
- [ ] Monitoring et logs configurés

## Coûts estimés

Avec la configuration par défaut (min-instances=0, memory=1Gi):

- **Trafic faible** (< 1000 requêtes/jour): ~0-5€/mois
- **Trafic moyen** (10k requêtes/jour): ~10-20€/mois
- **Trafic élevé** (100k requêtes/jour): ~50-100€/mois

Cloud Run facture uniquement le temps d'exécution réel, pas le temps au repos.

## Support

- Documentation Cloud Run: https://cloud.google.com/run/docs
- Pricing Calculator: https://cloud.google.com/products/calculator
- Status Page: https://status.cloud.google.com/

## Dépannage

### Le build échoue

- Vérifiez que `output: 'standalone'` est bien dans `next.config.js`
- Vérifiez que Prisma génère bien le client dans le Dockerfile

### Le service ne démarre pas

- Vérifiez les logs: `gcloud run services logs tail kamba-lhains`
- Vérifiez que tous les secrets sont correctement configurés
- Vérifiez que le port 8080 est bien exposé

### Variables d'environnement manquantes

- Vérifiez que les secrets existent: `gcloud secrets list`
- Vérifiez les permissions du service account Cloud Run

---

**Prêt pour la migration!** Suivez les étapes ci-dessus dans l'ordre pour un déploiement réussi.
