# Configuration Google Sheets pour les Utilisateurs

## Étape 1 : Créer un nouveau Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau tableur
3. Nommez-le **"KAMBA LHAINS - Utilisateurs"**

## Étape 2 : Configurer le premier onglet

1. Renommez le premier onglet en **"Users"** (important !)
2. Ajoutez les en-têtes suivants dans la première ligne :

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Email | Prénom | Nom | Password (Hashé) | Date Création | Dernière Connexion | Statut |

## Étape 3 : Partager avec le Service Account

1. Cliquez sur "Partager" en haut à droite
2. Ajoutez l'email du service account :
   ```
   kamba-lhains@kamba-lhains-443007.iam.gserviceaccount.com
   ```
3. Donnez-lui les droits **"Éditeur"**
4. Décochez "Notifier les utilisateurs"
5. Cliquez sur "Partager"

## Étape 4 : Récupérer l'ID du Sheet

L'ID se trouve dans l'URL du Google Sheet :
```
https://docs.google.com/spreadsheets/d/[VOTRE_ID_ICI]/edit
```

## Étape 5 : Ajouter à .env.local

Ajoutez cette ligne dans votre fichier `.env.local` :
```bash
GOOGLE_SHEETS_USERS_ID=VOTRE_ID_ICI
```

## Structure de données

### Colonnes détaillées :

- **A - Email** : Adresse email de l'utilisateur (unique)
- **B - Prénom** : Prénom de l'utilisateur
- **C - Nom** : Nom de l'utilisateur
- **D - Password (Hashé)** : Mot de passe hashé avec bcrypt (jamais en clair !)
- **E - Date Création** : Date et heure de création du compte (ISO 8601)
- **F - Dernière Connexion** : Date et heure de la dernière connexion (ISO 8601)
- **G - Statut** : État du compte (`active`, `inactive`, `suspended`)

### Exemple de données :

| Email | Prénom | Nom | Password (Hashé) | Date Création | Dernière Connexion | Statut |
|-------|---------|-----|------------------|---------------|-------------------|---------|
| jean@example.com | Jean | Dupont | $2a$10$... | 2025-01-15T10:30:00.000Z | 2025-01-20T14:22:00.000Z | active |
| marie@example.com | Marie | Martin | $2a$10$... | 2025-01-16T09:15:00.000Z | 2025-01-18T11:45:00.000Z | active |

## Sécurité

⚠️ **IMPORTANT** :
- Les mots de passe sont **toujours** hashés avec bcrypt (jamais en clair)
- Ne JAMAIS partager ce Google Sheet publiquement
- Seul le Service Account doit y avoir accès
- Les mots de passe hashés ne peuvent PAS être déchiffrés

## Test

Une fois configuré, testez avec :
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User","password":"password123"}'
```

Vous devriez voir une nouvelle ligne apparaître dans votre Google Sheet !
