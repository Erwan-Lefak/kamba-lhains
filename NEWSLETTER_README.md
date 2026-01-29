# 📬 Système Newsletter Kamba Lhains

## ✅ Ce qui a été créé

Un système de newsletter **complet et professionnel** avec :

### 🎯 Fonctionnalités
- ✅ **Inscription via le footer** (rapide, juste l'email)
- ✅ **Inscription via la page dédiée** (avec préférences détaillées)
- ✅ **Email de bienvenue automatique** via Resend
- ✅ **Stockage dans Google Sheets** (facile à consulter et exporter)
- ✅ **Vérification des doublons** (impossible de s'inscrire 2 fois)
- ✅ **Désabonnement facile** (page + API)
- ✅ **Gestion des centres d'intérêt** et fréquence d'envoi
- ✅ **Statistiques newsletter** (total abonnés, actifs, désabonnés)

### 🗂️ Fichiers créés

```
lib/
├── googleSheetsNewsletter.ts     # ⭐ Logique Google Sheets pour newsletter
└── newsletterEmails.ts           # ⭐ Templates d'emails Resend

pages/api/newsletter/
├── subscribe.ts                  # ⭐ API inscription
└── unsubscribe.ts               # ⭐ API désabonnement

Documentation/
├── NEWSLETTER_SETUP.md          # 📖 Guide complet de configuration
└── google-sheet-newsletter-template.csv  # 📊 Template des colonnes

Mis à jour :
├── components/Footer.tsx        # ✏️ Formulaire newsletter fonctionnel
├── pages/newsletter.tsx         # ✏️ Page newsletter avec vraie API
└── .env.local.example          # ✏️ Variables d'environnement ajoutées
```

---

## 🚀 Configuration rapide (5 minutes)

### Étape 1 : Google Sheet Newsletter

1. **Crée un nouveau Google Sheet** nommé "Kamba Lhains - Newsletter"
2. **Renomme l'onglet en "Newsletter"** (important !)
3. **Copie ces colonnes** en ligne 1 :

   | Email | Prénom | Date d'inscription | Statut | Centres d'intérêt | Fréquence | Source |
   |-------|--------|-------------------|---------|-------------------|-----------|--------|

4. **Partage avec le Service Account** :
   - Clique "Partager"
   - Ajoute : `kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com`
   - Droits : **Éditeur**
   - Décoche "Avertir les utilisateurs"

### Étape 2 : Variables d'environnement

Dans `.env.local`, ajoute :

```bash
# Newsletter Google Sheet ID (récupéré depuis l'URL du sheet)
GOOGLE_SHEETS_NEWSLETTER_ID=1ABC...XYZ

# Resend API (si pas déjà fait)
RESEND_API_KEY=re_...

# Service Account (déjà configuré pour les commandes)
GOOGLE_SERVICE_ACCOUNT_EMAIL=kamba-sheets-writer@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Étape 3 : Tester

```bash
# Redémarre le serveur
PORT=3002 npm run dev
```

1. Va sur `http://localhost:3002`
2. Scroll au footer
3. Entre ton email
4. ✅ Message de succès
5. ✅ Nouvelle ligne dans Google Sheets
6. ✅ Email de bienvenue reçu

---

## 📊 Structure des données (Google Sheet)

Chaque abonné est une ligne avec :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| **Email** | Email de l'abonné | `jean@example.com` |
| **Prénom** | Prénom (optionnel) | `Jean` |
| **Date d'inscription** | ISO 8601 | `2025-12-07T10:30:00.000Z` |
| **Statut** | `active` ou `unsubscribed` | `active` |
| **Centres d'intérêt** | Liste séparée par virgules | `Nouvelles collections, Offres exclusives` |
| **Fréquence** | weekly/biweekly/monthly/events-only | `weekly` |
| **Source** | Provenance | `footer` ou `newsletter-page` |

---

## 🎨 Email de bienvenue

Exemple de ce que reçoit l'abonné :

```
┌─────────────────────────────────────────┐
│         KAMBA LHAINS                    │
│   MODE INTEMPORELLE & ÉCORESPONSABLE    │
└─────────────────────────────────────────┘

      Bienvenue Jean ! 🎉

Merci de rejoindre la communauté Kamba Lhains.

En vous inscrivant, vous bénéficiez de :

✨ Avant-premières exclusives
🎁 Offres spéciales réservées
🎨 Coulisses de la création
💡 Conseils mode durables
🎫 Invitations privilégiées

      [ DÉCOUVRIR LA COLLECTION ]

📬 Vous recevrez nos actualités chaque semaine.
```

---

## 🔧 API Endpoints

### `POST /api/newsletter/subscribe`

Inscription à la newsletter.

**Body :**
```json
{
  "email": "jean@example.com",
  "firstName": "Jean",
  "interests": ["Nouvelles collections", "Offres exclusives"],
  "frequency": "weekly",
  "source": "footer"
}
```

**Response (succès) :**
```json
{
  "success": true,
  "message": "Inscription réussie ! Vérifiez votre boîte mail."
}
```

**Response (doublon) :**
```json
{
  "success": false,
  "message": "Cet email est déjà inscrit à la newsletter"
}
```

### `POST /api/newsletter/unsubscribe`

Désabonnement de la newsletter.

**Body :**
```json
{
  "email": "jean@example.com"
}
```

---

## 📈 Statistiques

Utilise `getNewsletterStats()` pour récupérer les stats :

```typescript
import { getNewsletterStats } from './lib/googleSheetsNewsletter';

const stats = await getNewsletterStats();
// {
//   totalSubscribers: 150,      // Total d'abonnés
//   activeSubscribers: 142,     // Abonnés actifs
//   unsubscribed: 8,            // Désabonnés
//   subscribersThisMonth: 23    // Nouveaux ce mois
// }
```

---

## 🎯 Prochaines améliorations possibles

### Court terme
- [ ] **Dashboard admin newsletter** (voir tous les abonnés)
- [ ] **Export CSV** des abonnés
- [ ] **Double opt-in** (confirmation par email)

### Moyen terme
- [ ] **Campagnes d'emailing** (envoyer une newsletter)
- [ ] **Segmentation** (par centres d'intérêt)
- [ ] **Templates d'email** personnalisables

### Long terme
- [ ] **Automatisation** (welcome sequence, anniversaires)
- [ ] **A/B testing** des emails
- [ ] **Analytics avancées** (taux d'ouverture, clics)

---

## 💡 Pourquoi cette solution ?

### ✅ Avantages

1. **100% Gratuit au démarrage**
   - Resend : 3000 emails/mois gratuits
   - Google Sheets : illimité et gratuit
   - Total : **0€** jusqu'à 3000 emails/mois

2. **Facile à maintenir**
   - Tout est dans un Google Sheet
   - Modifiable à la main
   - Export CSV en 1 clic

3. **Scalable**
   - Peut gérer des milliers d'abonnés
   - Google Sheets supporte 10M de cellules
   - Resend scale automatiquement

4. **RGPD Compliant**
   - Lien de désabonnement dans chaque email
   - Données stockées en Europe (Google)
   - Consentement explicite

### ⚠️ Limites (à considérer plus tard)

- **Pas de segmentation avancée** (pour l'instant)
- **Pas d'envoi groupé** de newsletter (à développer)
- **Google Sheets devient lent** après ~50k lignes (mais on y est pas encore !)

**Solution quand tu grandis** :
- Migrer vers Mailchimp, Brevo ou ConvertKit
- Garder Resend pour les emails transactionnels
- Ou développer un système d'envoi custom

---

## 🆘 Besoin d'aide ?

### Documentation complète
Lis `NEWSLETTER_SETUP.md` pour le guide pas-à-pas complet

### Vérifier les logs
```bash
# Dans le terminal où tourne npm run dev
✅ Abonné test@example.com ajouté à la newsletter
✅ Email de bienvenue envoyé à test@example.com
```

### Problèmes fréquents

**"GOOGLE_SHEETS_NEWSLETTER_ID non défini"**
→ Ajoute la variable dans `.env.local` et redémarre le serveur

**"Permission denied" Google Sheets**
→ Vérifie que le service account a les droits "Éditeur"

**Email non reçu**
→ Vérifie spam/promotions
→ Vérifie `RESEND_API_KEY` dans `.env.local`

**Doublon non détecté**
→ Vérifie que l'onglet s'appelle exactement "Newsletter"

---

## 🎉 Résumé

Tu as maintenant un système de newsletter **professionnel, gratuit et scalable** !

- ✅ Inscription footer + page dédiée
- ✅ Email de bienvenue automatique
- ✅ Stockage Google Sheets
- ✅ Gestion des doublons
- ✅ Désabonnement facile
- ✅ 100% gratuit jusqu'à 3000 emails/mois

**Prêt pour la production !** 🚀

---

*Créé avec ❤️ pour Kamba Lhains*
