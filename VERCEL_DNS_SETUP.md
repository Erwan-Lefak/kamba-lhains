# Configuration DNS OVH pour Vercel

Ce guide vous aide à configurer automatiquement votre domaine OVH `kamba-lhains.com` pour qu'il pointe vers votre application Vercel.

## Prérequis

### 1. Créer une application OVH API

1. Allez sur: https://eu.api.ovh.com/createApp/
2. Remplissez le formulaire:
   - **Application name**: `vercel-dns-setup`
   - **Application description**: `Configuration DNS pour Vercel`
3. Notez votre **Application Key** et **Application Secret**

### 2. Installer les dépendances

```bash
npm install ovh readline-sync
```

## Utilisation

### Option 1: Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x setup-vercel-dns.js

# Lancer le script
node setup-vercel-dns.js
```

Le script vous guidera à travers les étapes:
1. Authentification API OVH (première fois)
2. Validation de la Consumer Key
3. Menu interactif pour configurer les DNS

### Option 2: Variables d'environnement (pour automatisation)

```bash
# Définir les credentials OVH
export OVH_APP_KEY="votre_app_key"
export OVH_APP_SECRET="votre_app_secret"
export OVH_CONSUMER_KEY="votre_consumer_key"

# Lancer le script
node setup-vercel-dns.js
```

## Configuration DNS appliquée

Le script configure automatiquement ces enregistrements DNS:

| Type | Sous-domaine | Cible | Description |
|------|-------------|-------|-------------|
| **A** | @ (apex) | `76.76.21.21` | Pointe le domaine principal vers Vercel |
| **CNAME** | www | `cname.vercel-dns.com` | Pointe www vers Vercel |
| **CAA** | @ | `0 issue "letsencrypt.org"` | Autorise Let's Encrypt pour SSL |

**⚠️ Important**: Vérifiez l'IP A record dans les paramètres de votre projet Vercel car elle peut varier selon votre plan.

## Étapes détaillées

### 1. Première exécution - Authentification

```bash
node setup-vercel-dns.js
```

Le script vous demandera:
- **Application Key**: Copiez depuis la console OVH
- **Application Secret**: Copiez depuis la console OVH

Une URL de validation sera affichée. Visitez cette URL et validez les permissions.

### 2. Configuration DNS

Dans le menu:
1. Tapez `1` pour voir les DNS actuels
2. Tapez `2` pour configurer les DNS Vercel
3. Confirmez avec `y`

### 3. Configuration Vercel

Après que le script ait configuré les DNS:

1. **Allez sur Vercel Dashboard**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** `kamba-lhains`
3. **Settings** → **Domains**
4. **Ajoutez les domaines**:
   - `kamba-lhains.com`
   - `www.kamba-lhains.com`

Vercel va automatiquement:
- Vérifier les enregistrements DNS
- Générer un certificat SSL (via Let's Encrypt)
- Activer HTTPS

### 4. Vérification

Attendez 5-10 minutes et testez:

```bash
# Vérifier la résolution DNS
dig kamba-lhains.com
dig www.kamba-lhains.com

# Tester l'accès
curl -I https://kamba-lhains.com
curl -I https://www.kamba-lhains.com
```

## Personnalisation

### Modifier l'IP Vercel

Éditez `setup-vercel-dns.js`:

```javascript
apex: {
  type: 'A',
  target: 'NOUVELLE_IP_VERCEL' // Trouvez-la dans Vercel Dashboard
}
```

### Ajouter des sous-domaines

Ajoutez dans `dnsRecords`:

```javascript
api: {
  type: 'CNAME',
  target: 'cname.vercel-dns.com.'
}
```

Puis modifiez la fonction `configureVercelDNS()`:

```javascript
await addDNSRecord('api', CONFIG.dnsRecords.api.type, CONFIG.dnsRecords.api.target);
```

## Gestion manuelle (alternative)

Si vous préférez configurer manuellement via l'interface OVH:

### 1. Connexion à l'espace client OVH

1. Allez sur: https://www.ovh.com/manager/
2. **Web Cloud** → **Noms de domaine** → `kamba-lhains.com`
3. Onglet **Zone DNS**

### 2. Supprimer les anciens enregistrements

Supprimez les enregistrements existants pour:
- `@` (type A)
- `www` (type CNAME ou A)

### 3. Ajouter les nouveaux enregistrements

**Enregistrement A (domaine principal)**
- Sous-domaine: (vide ou `@`)
- Type: `A`
- Cible: `76.76.21.21`
- TTL: `3600`

**Enregistrement CNAME (www)**
- Sous-domaine: `www`
- Type: `CNAME`
- Cible: `cname.vercel-dns.com.`
- TTL: `3600`

**Enregistrement CAA (SSL)**
- Sous-domaine: (vide ou `@`)
- Type: `CAA`
- Valeur: `0 issue "letsencrypt.org"`
- TTL: `3600`

### 4. Appliquer les modifications

Cliquez sur **Appliquer la configuration** dans l'interface OVH.

## Vérification de l'IP Vercel

Pour obtenir l'IP exacte de Vercel:

1. Allez sur **Vercel Dashboard** → Votre projet
2. **Settings** → **Domains**
3. Cliquez sur **Add Domain**
4. Entrez votre domaine
5. Vercel affichera l'IP exacte à utiliser

## Temps de propagation

- **Minimum**: 5-15 minutes
- **Maximum**: 24-48 heures
- **Moyenne**: 1-2 heures

Vérifiez la propagation: https://dnschecker.org/

## Résolution de problèmes

### Erreur: "Invalid credentials"

```bash
# Vérifiez vos credentials
echo $OVH_APP_KEY
echo $OVH_APP_SECRET
echo $OVH_CONSUMER_KEY
```

Régénérez la Consumer Key si nécessaire.

### Erreur: "Zone does not exist"

Vérifiez que le domaine `kamba-lhains.com` est bien dans votre compte OVH.

### DNS ne se propage pas

```bash
# Forcer le refresh de la zone
# Via le script
node setup-vercel-dns.js
# Choisir option 2

# Ou manuellement via l'API
curl -X POST https://eu.api.ovh.com/1.0/domain/zone/kamba-lhains.com/refresh
```

### Certificat SSL non généré

1. Vérifiez que les DNS pointent bien vers Vercel
2. Attendez 10-15 minutes
3. Vérifiez que l'enregistrement CAA est présent
4. Contactez le support Vercel si le problème persiste

## Commandes utiles

```bash
# Lister tous les enregistrements DNS (via API)
curl -X GET https://eu.api.ovh.com/1.0/domain/zone/kamba-lhains.com/record \
  -H "X-Ovh-Application: $OVH_APP_KEY" \
  -H "X-Ovh-Consumer: $OVH_CONSUMER_KEY"

# Tester la résolution DNS
dig +short kamba-lhains.com
dig +short www.kamba-lhains.com

# Tester le certificat SSL
openssl s_client -connect kamba-lhains.com:443 -servername kamba-lhains.com
```

## Support

- **Documentation OVH API**: https://api.ovh.com/console/
- **Documentation Vercel**: https://vercel.com/docs/domains
- **OVH Support**: https://help.ovhcloud.com/
- **Vercel Support**: https://vercel.com/support

## Sécurité

⚠️ **Ne jamais committer vos credentials OVH**

Ajoutez à `.gitignore`:

```
.env
.env.local
ovh-credentials.json
```

Utilisez des variables d'environnement:

```bash
# .env.local (ne pas committer)
OVH_APP_KEY=your_key
OVH_APP_SECRET=your_secret
OVH_CONSUMER_KEY=your_consumer_key
```

## Automatisation CI/CD

Pour automatiser les mises à jour DNS dans un pipeline:

```yaml
# .github/workflows/update-dns.yml
name: Update DNS

on:
  workflow_dispatch:

jobs:
  update-dns:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install ovh readline-sync
      - run: node setup-vercel-dns.js
        env:
          OVH_APP_KEY: ${{ secrets.OVH_APP_KEY }}
          OVH_APP_SECRET: ${{ secrets.OVH_APP_SECRET }}
          OVH_CONSUMER_KEY: ${{ secrets.OVH_CONSUMER_KEY }}
```

Ajoutez vos secrets dans GitHub: **Settings** → **Secrets and variables** → **Actions**
