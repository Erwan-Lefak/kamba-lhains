# 🚀 Configuration Google Sheets ULTRA-SIMPLE (100% Gratuit)

## ⏱️ Temps estimé : 3 minutes

Aucune API, aucun credential, aucune configuration compliquée !

---

## Étape 1 : Créer le Google Sheet (1 min)

1. Va sur https://sheets.google.com
2. Connecte-toi avec **goldandnation@gmail.com**
3. Clique sur **"+ Vierge"** pour créer une nouvelle feuille
4. Nomme le fichier : **"Kamba Lhains Produits"**

---

## Étape 2 : Importer les produits (30 secondes)

1. Dans ton Google Sheet, va dans **Fichier** → **Importer**
2. Va dans l'onglet **"Importer un fichier"**
3. Clique sur **"Parcourir"**
4. Sélectionne le fichier `google-sheets-import.csv` (dans ton projet)
5. Choisis :
   - Emplacement d'importation : **"Remplacer la feuille de calcul"**
   - Type de séparateur : **"Détecter automatiquement"**
6. Clique sur **"Importer les données"**

✅ **Tes 13 produits sont maintenant dans le Google Sheet !**

---

## Étape 3 : Rendre le Google Sheet public (30 secondes)

1. En haut à droite, clique sur **"Partager"**
2. En bas, clique sur **"Modifier"** à côté de "Accès limité"
3. Sélectionne **"Tous les utilisateurs disposant du lien"**
4. Assure-toi que c'est en **"Lecteur"** (pas éditeur)
5. Clique sur **"Terminé"**

🔓 **Ton Google Sheet est maintenant accessible en lecture publique**

---

## Étape 4 : Récupérer l'ID du Google Sheet (30 secondes)

1. Regarde l'URL de ton Google Sheet dans la barre d'adresse
2. Elle ressemble à : `https://docs.google.com/spreadsheets/d/`**`1ABC...XYZ`**`/edit`
3. Copie la partie entre `/d/` et `/edit` (c'est l'ID du Sheet)

Exemple :
```
URL : https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
ID  : 1AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## Étape 5 : Configurer la variable d'environnement (30 secondes)

1. Ouvre le fichier `.env.local` de ton projet
2. Ajoute cette ligne (remplace par ton vrai ID) :

```bash
# Google Sheets Public (aucune authentification nécessaire)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=ton-id-google-sheet-ici
```

3. Sauvegarde le fichier

---

## ✅ C'est terminé !

Maintenant ton site lit automatiquement les produits depuis Google Sheets !

### 🎯 Pour modifier un produit :

1. Ouvre ton Google Sheet
2. Change le prix, le nom, les couleurs, etc.
3. Sauvegarde (Ctrl+S)
4. Attends **5 minutes** (cache) ou force le refresh en visitant :
   - `http://localhost:3002/api/products/google-sheets?refresh=true`

### 📊 Structure du Google Sheet

| Colonne | Description | Exemple |
|---------|-------------|---------|
| **id** | Identifiant unique (pour l'URL) | `bombers-itoua` |
| **name** | Nom du produit | `BOMBERS ITOUA` |
| **price** | Prix en EUR (nombre) | `380` |
| **description** | Description courte | `Veste bombers élégante` |
| **category** | Catégorie | `homme` ou `femme` |
| **subCategory** | Sous-catégorie | `outerwear`, `tops`, `bottoms` |
| **colors** | Codes couleur séparés par virgules | `#000000,#808080` |
| **sizes** | Tailles séparées par virgules | `S,M,L,XL` |
| **images** | Chemins d'images séparés par virgules | `/images/prod-1.jpg,/images/prod-2.jpg` |
| **inStock** | En stock ? | `TRUE` ou `FALSE` |
| **featured** | À la une ? | `TRUE` ou `FALSE` |

### 💡 Conseils

- ✅ Toujours utiliser `TRUE` ou `FALSE` en majuscules pour inStock et featured
- ✅ Séparer les couleurs/tailles/images avec des virgules sans espaces : `#000,#FFF`
- ✅ Les codes couleur doivent commencer par `#`
- ✅ Le prix doit être un nombre (pas de symbole €)
- ✅ L'id ne doit contenir que des lettres minuscules et tirets

### 🎨 Codes couleur courants

```
Noir     : #000000
Blanc    : #FFFFFF
Gris     : #808080
Bordeaux : #800020
Kaki     : #556B2F
Beige    : #8B7355
Rouge    : #DC2626
Vert     : #22C55E
Bleu nuit: #191970
```

---

## 🔄 Fallback automatique

Si Google Sheets ne répond pas, le site utilisera automatiquement les produits du fichier `data/products.ts`. Aucune interruption de service !

---

## 🆓 100% Gratuit

Cette solution utilise uniquement :
- ✅ Google Sheets (gratuit)
- ✅ Lecture publique (pas d'API Google Cloud)
- ✅ Aucun service payant

---

**Questions ?** Tout fonctionne automatiquement une fois l'ID configuré !
