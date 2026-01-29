# 🚀 Configuration Complète - Kamba Lhains avec Google Sheets

## Vue d'ensemble du système

Ton site utilisera **2 Google Sheets** :
1. **Sheet Produits** (PUBLIC - déjà configuré ✅)
2. **Sheet Commandes** (PRIVÉ - avec Service Account)

---

## 📦 PARTIE 1 : Google Sheet Produits (✅ DÉJÀ FAIT)

- **ID** : `1aJFCzh7-gpZZbRYMfSUO6rATWampbnfOaVJQ6wkTV4s`
- **URL** : https://docs.google.com/spreadsheets/d/1aJFCzh7-gpZZbRYMfSUO6rATWampbnfOaVJQ6wkTV4s/edit
- **Statut** : ✅ Configuré et fonctionnel

---

## 📋 PARTIE 2 : Google Sheet Commandes (À FAIRE)

### Étape 1 : Créer un nouveau Google Sheet

1. Va sur https://sheets.google.com
2. Connecte-toi avec **goldandnation@gmail.com**
3. Clique sur **"+ Vierge"**
4. Nomme-le : **"Kamba Lhains Commandes"**

### Étape 2 : Importer la structure

1. Dans le Google Sheet, va dans **Fichier** → **Importer**
2. Importe le fichier `google-sheets-commandes-template.csv`
3. Choisis **"Remplacer la feuille de calcul"**
4. Clique sur **"Importer les données"**

### Étape 3 : Renommer la feuille

1. En bas, double-clique sur "Feuille 1"
2. Renomme en **"Commandes"** (sans accent)
3. Appuie sur Entrée

---

## 🔑 PARTIE 3 : Créer le Service Account Google

### Pourquoi un Service Account ?

Le Sheet des commandes doit rester **PRIVÉ** (pas comme celui des produits). Pour que ton site puisse écrire dedans, il faut un "compte robot" (Service Account).

### Étape 1 : Créer un projet Google Cloud

1. Va sur https://console.cloud.google.com/
2. Connecte-toi avec **goldandnation@gmail.com**
3. Clique sur **"Sélectionner un projet"** → **"Nouveau projet"**
4. Nom : `Kamba Lhains API`
5. Clique sur **"Créer"**
6. Attends quelques secondes que le projet se crée

### Étape 2 : Activer l'API Google Sheets

1. Dans le menu ☰ (hamburger en haut à gauche) → **APIs & Services** → **Library**
2. Recherche : `Google Sheets API`
3. Clique dessus
4. Clique sur **"ENABLE"** (Activer)

### Étape 3 : Créer le Service Account

1. Menu ☰ → **APIs & Services** → **Credentials**
2. Clique sur **"+ CREATE CREDENTIALS"**
3. Sélectionne **"Service Account"**
4. Remplis :
   - **Service account name** : `kamba-sheets-writer`
   - **Service account ID** : (auto-généré)
   - **Description** : `Écrit les commandes dans Google Sheets`
5. Clique sur **"CREATE AND CONTINUE"**
6. **Role** : Sélectionne **"Editor"** (Éditeur)
7. Clique sur **"CONTINUE"** puis **"DONE"**

### Étape 4 : Générer la clé JSON

1. Dans la liste des Service Accounts, clique sur celui que tu viens de créer
2. Va dans l'onglet **"KEYS"**
3. Clique sur **"ADD KEY"** → **"Create new key"**
4. Sélectionne **JSON**
5. Clique sur **"CREATE"**
6. ⬇️ Un fichier JSON est téléchargé (garde-le précieusement !)

---

## 🔗 PARTIE 4 : Partager le Sheet avec le Service Account

### Étape 1 : Copier l'email du Service Account

1. Ouvre le fichier JSON téléchargé avec un éditeur de texte
2. Cherche la ligne `"client_email": "..."`
3. Copie l'email (ex: `kamba-sheets-writer@projet-xxxxx.iam.gserviceaccount.com`)

### Étape 2 : Partager le Google Sheet

1. Ouvre ton **Google Sheet "Kamba Lhains Commandes"**
2. Clique sur **"Partager"** (en haut à droite)
3. Colle l'email du Service Account
4. Choisis **"Éditeur"** (pour qu'il puisse écrire)
5. **Décoche** "Avertir les utilisateurs"
6. Clique sur **"Partager"**

✅ Ton Service Account peut maintenant écrire dans ce Sheet !

---

## ⚙️ PARTIE 5 : Configurer les variables d'environnement

### Étape 1 : Récupérer les informations du fichier JSON

Ouvre le fichier JSON et trouve :
1. **`client_email`** → C'est l'email du Service Account
2. **`private_key`** → C'est la clé privée (longue chaîne avec `-----BEGIN PRIVATE KEY-----`)

### Étape 2 : Récupérer l'ID du Sheet Commandes

1. Ouvre ton Google Sheet "Kamba Lhains Commandes"
2. Regarde l'URL : `https://docs.google.com/spreadsheets/d/`**`1ABC...XYZ`**`/edit`
3. Copie la partie entre `/d/` et `/edit`

### Étape 3 : Ajouter dans `.env.local`

Ouvre ton fichier `.env.local` et ajoute :

```bash
# Google Sheets - Service Account (pour écrire les commandes)
GOOGLE_SERVICE_ACCOUNT_EMAIL=ton-email-du-service-account@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTa clé privée complète ici...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ORDERS_ID=ton-id-du-sheet-commandes

# Resend - Service d'emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important** : Pour `GOOGLE_PRIVATE_KEY`, copie toute la clé **avec les guillemets** et garde les `\n` tels quels.

---

## 📧 PARTIE 6 : Configurer Resend (Emails)

### Étape 1 : Créer un compte Resend

1. Va sur https://resend.com
2. Clique sur **"Start Building"**
3. Crée un compte avec **goldandnation@gmail.com**

### Étape 2 : Obtenir la clé API

1. Dans le dashboard Resend → **API Keys**
2. Clique sur **"Create API Key"**
3. Nom : `Kamba Lhains`
4. Permissions : **"Sending access"**
5. Clique sur **"Add"**
6. ⚠️ **Copie la clé** (elle ne sera affichée qu'une fois !)
7. Colle-la dans `.env.local` → `RESEND_API_KEY=...`

### Étape 3 : Vérifier ton domaine (optionnel mais recommandé)

#### Option A - Utiliser un sous-domaine de Resend (gratuit, immédiat)
- Resend te donne un domaine gratuit : `onboarding.resend.dev`
- Les emails viendront de : `commandes@onboarding.resend.dev`
- Ça marche tout de suite, aucune configuration !

#### Option B - Utiliser ton propre domaine (recommandé pour production)
1. Dans Resend → **Domains**
2. Clique sur **"Add Domain"**
3. Entre `kamba-lhains.com`
4. Suis les instructions pour ajouter les DNS (SPF, DKIM, DMARC)
5. Une fois vérifié, tes emails viendront de `commandes@kamba-lhains.com`

---

## ✅ PARTIE 7 : Vérifier que tout fonctionne

### Test 1 : Produits depuis Google Sheets ✅

```bash
curl http://localhost:3002/api/products/google-sheets
```

✅ Tu devrais voir tes 13 produits

### Test 2 : Créer une commande de test

```bash
curl -X POST http://localhost:3002/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Jean Test",
    "phone": "+33612345678",
    "totalAmount": 380,
    "shippingCost": 0,
    "taxAmount": 0,
    "items": [
      {
        "productName": "BOMBERS ITOUA",
        "quantity": 1,
        "price": 380,
        "size": "M",
        "color": "Noir"
      }
    ],
    "shippingAddress": {
      "firstName": "Jean",
      "lastName": "Test",
      "address1": "123 Rue Test",
      "city": "Paris",
      "postalCode": "75001",
      "country": "France"
    }
  }'
```

✅ Tu devrais voir :
1. La commande ajoutée dans ton Google Sheet "Commandes"
2. Un email envoyé à `test@example.com`
3. Une réponse JSON avec le numéro de commande

### Test 3 : Dashboard admin

```bash
curl http://localhost:3002/api/admin/dashboard-sheets
```

✅ Tu devrais voir les statistiques du dashboard

---

## 📊 Résumé de l'architecture

```
┌─────────────────────────────────────────────────────┐
│                   TON SITE WEB                      │
│              (localhost:3002)                       │
└─────────────────────────────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           │                         │
           ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Google Sheet        │  │  Google Sheet        │
│  PRODUITS            │  │  COMMANDES           │
│  (PUBLIC)            │  │  (PRIVÉ)             │
│                      │  │                      │
│  ✅ Lecture facile   │  │  🔐 Service Account  │
│  ✅ 13 produits      │  │  ✅ Écriture sécurisée│
└──────────────────────┘  └──────────────────────┘
           │                         │
           └────────────┬────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   RESEND API     │
              │  (Emails)        │
              │                  │
              │  📧 Confirmation │
              │  📦 Expédition   │
              └──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   DASHBOARD      │
              │   ADMIN          │
              │                  │
              │  📊 Statistiques │
              │  📦 Commandes    │
              └──────────────────┘
```

---

## 🎯 Checklist finale

- [ ] Google Sheet Produits créé et public ✅ (déjà fait)
- [ ] Google Sheet Commandes créé
- [ ] Projet Google Cloud créé
- [ ] API Google Sheets activée
- [ ] Service Account créé
- [ ] Clé JSON téléchargée
- [ ] Sheet Commandes partagé avec le Service Account
- [ ] Variables `GOOGLE_SERVICE_ACCOUNT_EMAIL` configurée
- [ ] Variable `GOOGLE_PRIVATE_KEY` configurée
- [ ] Variable `GOOGLE_SHEETS_ORDERS_ID` configurée
- [ ] Compte Resend créé
- [ ] Variable `RESEND_API_KEY` configurée
- [ ] Test commande réussi
- [ ] Email reçu
- [ ] Dashboard affiche les données

---

## 💡 Utilisation quotidienne

### Modifier un produit :
1. Ouvre le Sheet Produits
2. Change le prix, stock, etc.
3. Sauvegarde → C'est mis à jour en 5 min max

### Voir les commandes :
1. Ouvre le Sheet Commandes
2. Toutes les commandes sont là en temps réel
3. Tu peux les filtrer, exporter en Excel, etc.

### Mettre à jour un statut de commande :
1. Dans le Sheet, change le statut (PENDING → PAID → SHIPPED → DELIVERED)
2. Si tu ajoutes un numéro de suivi, l'email part automatiquement

---

## 🆓 100% Gratuit

- ✅ Google Sheets : Gratuit
- ✅ Google Cloud (API) : Gratuit (quota large)
- ✅ Resend : 100 emails/jour gratuits
- ✅ Total : **0€/mois**

---

**Questions ?** Suis ce guide étape par étape et tout fonctionnera ! 🚀
