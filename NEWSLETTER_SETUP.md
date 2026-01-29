# Configuration Newsletter - Kamba Lhains

## 📋 Vue d'ensemble

Système de newsletter complet avec :
- ✅ **Resend** pour l'envoi d'emails
- ✅ **Google Sheets** pour stocker les abonnés
- ✅ Double opt-in automatique
- ✅ Vérification des doublons
- ✅ Gestion du désabonnement

---

## 🔧 Étape 1 : Créer le Google Sheet Newsletter

### 1.1 Créer le Google Sheet

1. Va sur [Google Sheets](https://docs.google.com/spreadsheets/)
2. Crée un nouveau sheet appelé **"Kamba Lhains - Newsletter"**
3. Dans l'onglet par défaut, renomme-le en **"Newsletter"** (important !)

### 1.2 Configurer les colonnes

Copie exactement ces en-têtes dans la première ligne (A1 à G1) :

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Email | Prénom | Date d'inscription | Statut | Centres d'intérêt | Fréquence | Source |

**Important** : Respecte exactement ces noms de colonnes !

### 1.3 Exemples de données (ligne 2)

Tu peux ajouter cette ligne d'exemple :

```
test@kamba.com | Jean | 2025-12-07T10:30:00.000Z | active | Nouvelles collections, Offres exclusives | weekly | footer
```

---

## 🔑 Étape 2 : Partager avec le Service Account

### 2.1 Récupérer l'email du Service Account

Dans `.env.local`, trouve la valeur de `GOOGLE_SERVICE_ACCOUNT_EMAIL`

Exemple :
```
kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com
```

### 2.2 Partager le Google Sheet

1. Clique sur le bouton **"Partager"** en haut à droite
2. Colle l'email du service account
3. Change les permissions à **"Éditeur"** (Editor)
4. **IMPORTANT** : Décoche "Avertir les utilisateurs"
5. Clique sur "Partager"

---

## 🌍 Étape 3 : Configurer les variables d'environnement

### 3.1 Récupérer l'ID du Google Sheet

L'ID se trouve dans l'URL du Google Sheet :

```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                      ^^^^^^^^^
                                      C'est l'ID !
```

### 3.2 Ajouter dans `.env.local`

```bash
# Newsletter Google Sheet
GOOGLE_SHEETS_NEWSLETTER_ID=ton-sheet-id-ici

# Resend API (si pas déjà configuré)
RESEND_API_KEY=re_xxx...

# Service Account Google (si pas déjà configuré)
GOOGLE_SERVICE_ACCOUNT_EMAIL=kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 📧 Étape 4 : Configurer Resend

### 4.1 Créer un compte Resend

1. Va sur [resend.com](https://resend.com)
2. Crée un compte (gratuit jusqu'à 3000 emails/mois)
3. Vérifie ton email

### 4.2 Obtenir la clé API

1. Dans le dashboard Resend, va dans **API Keys**
2. Crée une nouvelle clé
3. Copie-la dans `.env.local` :

```bash
RESEND_API_KEY=re_...
```

### 4.3 Configurer le domaine (optionnel mais recommandé)

Pour l'instant, Resend utilise un domaine par défaut. Pour utiliser `newsletter@kamba-lhains.com` :

1. Dans Resend, va dans **Domains**
2. Ajoute `kamba-lhains.com`
3. Configure les DNS (SPF, DKIM, DMARC)

**Note** : En développement, tu peux utiliser le domaine par défaut de Resend.

---

## 📁 Structure du système Newsletter

```
lib/
├── googleSheetsNewsletter.ts    # Gestion Google Sheets
└── newsletterEmails.ts          # Templates d'emails Resend

pages/api/newsletter/
├── subscribe.ts                 # Inscription
└── unsubscribe.ts              # Désabonnement

components/
└── Footer.tsx                   # Formulaire dans le footer

pages/
└── newsletter.tsx               # Page dédiée newsletter
```

---

## ✅ Étape 5 : Tester le système

### 5.1 Redémarrer le serveur

```bash
# Arrête le serveur (Ctrl+C)
# Redémarre
PORT=3002 npm run dev
```

### 5.2 Test depuis le Footer

1. Va sur `http://localhost:3002`
2. Scroll jusqu'au footer
3. Entre ton email
4. Clique sur "S'abonner"
5. ✅ Tu devrais voir un message de succès
6. ✅ Vérifie le Google Sheet (nouvelle ligne ajoutée)
7. ✅ Vérifie ta boîte mail (email de bienvenue)

### 5.3 Test depuis la page Newsletter

1. Va sur `http://localhost:3002/newsletter`
2. Remplis le formulaire complet
3. Teste l'abonnement ET le désabonnement

### 5.4 Test via API directe (optionnel)

```bash
curl -X POST http://localhost:3002/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "interests": ["Nouvelles collections", "Offres exclusives"],
    "frequency": "weekly",
    "source": "api-test"
  }'
```

---

## 📊 Vérifications

Après un test réussi, tu dois avoir :

### Dans Google Sheets :
- ✅ Nouvelle ligne avec l'email
- ✅ Statut = "active"
- ✅ Date d'inscription remplie
- ✅ Source correcte (footer / newsletter-page)

### Dans ta boîte mail :
- ✅ Email de bienvenue reçu
- ✅ Design propre avec logo Kamba Lhains
- ✅ Lien de désabonnement présent

### Dans les logs du serveur :
```
✅ Abonné test@example.com ajouté à la newsletter
✅ Email de bienvenue envoyé à test@example.com
```

---

## 🚨 Résolution de problèmes

### Erreur "GOOGLE_SHEETS_NEWSLETTER_ID non défini"
→ Vérifie que la variable est bien dans `.env.local` et que le serveur est redémarré

### Erreur "Permission denied" sur Google Sheets
→ Vérifie que le service account a bien les droits "Éditeur"

### Email non reçu
→ Vérifie spam/promotions
→ Vérifie que `RESEND_API_KEY` est correct
→ Regarde les logs du serveur pour les erreurs

### Doublon détecté alors que l'email n'existe pas
→ Vérifie que le nom de l'onglet est bien "Newsletter"
→ Vérifie que la colonne A contient bien les emails

---

## 📈 Statistiques Newsletter

Pour voir les stats (à implémenter dans un dashboard admin) :

```typescript
import { getNewsletterStats } from './lib/googleSheetsNewsletter';

const stats = await getNewsletterStats();
// {
//   totalSubscribers: 150,
//   activeSubscribers: 142,
//   unsubscribed: 8,
//   subscribersThisMonth: 23
// }
```

---

## 🎯 Prochaines étapes (optionnel)

1. **Dashboard Admin Newsletter**
   - Voir tous les abonnés
   - Export CSV
   - Statistiques avancées

2. **Campagnes Email**
   - Créer un système d'envoi de newsletters
   - Segmentation par centres d'intérêt
   - A/B testing

3. **Automatisation**
   - Welcome sequence (série d'emails)
   - Rappels pour les paniers abandonnés
   - Recommandations de produits

4. **Double Opt-in**
   - Email de confirmation avec lien
   - Validation avant activation

---

## 📝 Notes importantes

- **Gratuit** : Resend 3000 emails/mois + Google Sheets gratuit = parfait pour démarrer
- **RGPD compliant** : Lien de désabonnement + mentions légales
- **Scalable** : Peut gérer des milliers d'abonnés
- **Facile à maintenir** : Tout est dans Google Sheets, modifiable à la main

---

Besoin d'aide ? Vérifie les logs du serveur ou regarde le code dans :
- `lib/googleSheetsNewsletter.ts`
- `lib/newsletterEmails.ts`
- `pages/api/newsletter/subscribe.ts`
