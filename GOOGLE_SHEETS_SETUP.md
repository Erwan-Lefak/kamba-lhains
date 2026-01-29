# Configuration Google Sheets pour Kamba Lhains

## 📋 Étapes pour configurer Google Sheets API

### 1. Créer un projet Google Cloud

1. Va sur https://console.cloud.google.com/
2. Connecte-toi avec **goldandnation@gmail.com**
3. Clique sur "Sélectionner un projet" → "Nouveau projet"
4. Nom du projet : `Kamba Lhains`
5. Clique sur "Créer"

### 2. Activer l'API Google Sheets

1. Dans le menu de gauche → **APIs & Services** → **Library**
2. Recherche "Google Sheets API"
3. Clique sur "Google Sheets API"
4. Clique sur **"ENABLE"** (Activer)

### 3. Créer un compte de service

1. Menu de gauche → **APIs & Services** → **Credentials**
2. Clique sur **"+ CREATE CREDENTIALS"**
3. Sélectionne **"Service Account"**
4. Remplis les informations :
   - Service account name : `kamba-lhains-sheets`
   - Service account ID : (généré automatiquement)
   - Description : `Service account pour lire les produits depuis Google Sheets`
5. Clique sur **"CREATE AND CONTINUE"**
6. Role : Sélectionne **"Viewer"** (Lecteur)
7. Clique sur **"CONTINUE"** puis **"DONE"**

### 4. Générer la clé privée

1. Dans la liste des comptes de service, clique sur le compte que tu viens de créer
2. Va dans l'onglet **"KEYS"**
3. Clique sur **"ADD KEY"** → **"Create new key"**
4. Sélectionne **JSON**
5. Clique sur **"CREATE"**
6. Un fichier JSON sera téléchargé (garde-le précieusement !)

### 5. Créer le Google Sheet

1. Va sur https://sheets.google.com
2. Connecte-toi avec **goldandnation@gmail.com**
3. Crée une nouvelle feuille de calcul
4. Nomme-la : **"Kamba Lhains - Produits"**
5. Renomme la première feuille en **"Produits"**

### 6. Structure du Google Sheet

Crée les colonnes suivantes (ligne 1 - en-têtes) :

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | name | price | description | category | subCategory | colors | sizes | images | inStock | featured |

**Exemple de ligne 2 :**
```
gilet-1957 | GILET 1957 | 480 | Veste en denim... | homme | denim | #191970 | S,M,L,XL | /images/gilet-1957-face.jpg,/images/gilet-1957-droit.jpg | TRUE | FALSE
```

### 7. Partager le Google Sheet avec le compte de service

1. Dans le fichier JSON téléchargé à l'étape 4, trouve le champ `"client_email"`
2. Il ressemble à : `kamba-lhains-sheets@projet-xxxxx.iam.gserviceaccount.com`
3. Dans ton Google Sheet, clique sur **"Partager"** (en haut à droite)
4. Colle l'email du compte de service
5. Donne l'accès **"Lecteur"**
6. Décoche "Avertir les utilisateurs"
7. Clique sur **"Partager"**

### 8. Configurer les variables d'environnement

Ouvre le fichier JSON téléchargé et extrais :

1. **`client_email`** → Copie la valeur
2. **`private_key`** → Copie toute la clé (avec `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`)

Ajoute dans ton fichier `.env.local` :

```bash
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=ton-email-du-compte-service@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTa clé privée ici...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_PRODUCTS_ID=ID_DE_TON_GOOGLE_SHEET
```

**Pour obtenir l'ID du Google Sheet :**
- Dans l'URL de ton Google Sheet : `https://docs.google.com/spreadsheets/d/CECI_EST_L_ID/edit`
- Copie la partie entre `/d/` et `/edit`

### 9. Tester l'intégration

Une fois configuré, teste avec :

```bash
curl http://localhost:3002/api/products/google-sheets
```

Tu devrais voir tes produits s'afficher !

## 🔄 Import rapide des produits existants

Je vais créer un script pour importer automatiquement les 13 produits existants dans ton Google Sheet !

## ✅ Checklist

- [ ] Projet Google Cloud créé
- [ ] API Google Sheets activée
- [ ] Compte de service créé
- [ ] Clé JSON téléchargée
- [ ] Google Sheet créé avec la structure
- [ ] Sheet partagé avec le compte de service
- [ ] Variables d'environnement configurées dans `.env.local`
- [ ] Test API réussi

---

**Besoin d'aide ?** N'hésite pas à me demander si tu bloques sur une étape !
