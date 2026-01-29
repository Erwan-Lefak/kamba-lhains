# Configuration du Webhook Stripe

## 🎯 Objectif
Le webhook Stripe permet de sauvegarder automatiquement les commandes dans Google Sheets après chaque paiement réussi.

## 📋 Étapes de configuration

### 1. Accéder aux webhooks Stripe

1. Va sur **https://dashboard.stripe.com/webhooks**
2. Clique sur **"Ajouter un endpoint"** / **"Add endpoint"**

### 2. Configurer l'endpoint

**URL de l'endpoint (PRODUCTION):**
```
https://www.kamba-lhains.com/api/webhooks/stripe
```

⚠️ **IMPORTANT:** Utilise cette URL pour la production.

**Pour les tests en local (via Cloudflare tunnel):**
```
https://alter-head-spread-singer.trycloudflare.com/api/webhooks/stripe
```

### 3. Sélectionner les événements

Sélectionne ces **2 événements** uniquement:

✅ `checkout.session.completed`
✅ `payment_intent.succeeded`

### 4. Récupérer la clé de signature

Après avoir créé le webhook:

1. Clique sur le webhook que tu viens de créer
2. Va dans la section **"Signing secret"**
3. Clique sur **"Reveal"** / **"Révéler"**
4. Copie la clé (commence par `whsec_...`)

### 5. Ajouter la clé dans .env.local

Ouvre le fichier `.env.local` et remplace:

```bash
STRIPE_WEBHOOK_SECRET=whsec_to_be_created_when_webhook_setup
```

Par:

```bash
STRIPE_WEBHOOK_SECRET=whsec_ta_vraie_cle_ici
```

### 6. Redémarrer le serveur

```bash
pkill -9 -f "PORT=3002"
PORT=3002 npm run dev
```

## 🧪 Tester le webhook

### Option 1: Utiliser Stripe CLI (recommandé)

```bash
stripe listen --forward-to localhost:3002/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Option 2: Faire un vrai paiement test

1. Va sur ton site
2. Ajoute un produit au panier
3. Va au checkout
4. Utilise une carte de test Stripe:
   - Numéro: `4242 4242 4242 4242`
   - Date: n'importe quelle date future
   - CVC: n'importe quel 3 chiffres
5. Complete le paiement

### Vérifier que ça fonctionne

Après un paiement réussi:

1. ✅ Une nouvelle ligne apparaît dans le Google Sheet Commandes
2. ✅ La page de confirmation affiche un numéro de commande
3. ✅ Le panier est vidé

## 🔍 Logs à surveiller

Dans les logs du serveur, tu devrais voir:

```
✅ Commande KL-2025-XXXXXX créée depuis Stripe webhook
✅ Commande KL-2025-XXXXXX ajoutée au Google Sheet
```

En cas d'erreur:

```
❌ Erreur lors du traitement du webhook: [détails]
```

## 🚨 Dépannage

### Erreur: "Webhook signature verification failed"

➡️ La clé `STRIPE_WEBHOOK_SECRET` n'est pas correcte
- Vérifie que tu as bien copié toute la clé depuis Stripe Dashboard
- Redémarre le serveur après l'avoir modifiée

### Erreur: "Permission denied" Google Sheets

➡️ Le Google Sheet n'est pas partagé avec le Service Account
- Partage le sheet avec: `kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com`
- Donne les permissions "Éditeur"

### Les commandes n'apparaissent pas dans Google Sheets

1. Vérifie les logs du serveur pour voir les erreurs
2. Vérifie que le webhook est bien configuré dans Stripe Dashboard
3. Vérifie que l'URL du webhook est correcte
4. Teste avec `./test-orders.sh create` pour voir si l'API fonctionne

## 📊 Vérifier les webhooks Stripe

Dans Stripe Dashboard > Webhooks > [ton webhook]:
- Tu peux voir tous les événements reçus
- Les tentatives de livraison (delivered / failed)
- Les détails de chaque requête

## 🎉 C'est prêt!

Une fois configuré, chaque paiement Stripe:
1. ✅ Crée automatiquement une commande dans Google Sheets
2. ✅ Affiche le numéro de commande au client
3. ✅ (Optionnel) Envoie un email de confirmation si Resend configuré

---

**URL de production:**
https://www.kamba-lhains.com

**Endpoint webhook PRODUCTION:**
https://www.kamba-lhains.com/api/webhooks/stripe

**Pour les tests en local:**
- Tunnel Cloudflare: https://alter-head-spread-singer.trycloudflare.com
- Endpoint local: https://alter-head-spread-singer.trycloudflare.com/api/webhooks/stripe

⚠️ **Note:** Utilise toujours l'URL de production pour les vrais paiements!
