# Guide de Configuration Google OAuth

Ce guide explique comment configurer la connexion Google sur votre site Kamba Lhains.

## Prérequis

- Un compte Google Cloud Platform
- Accès au projet (ou créer un nouveau projet)

## Étapes de Configuration

### 1. Créer un Projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le sélecteur de projet en haut
3. Cliquez sur **"Nouveau projet"**
4. Donnez un nom à votre projet (ex: "Kamba Lhains Auth")
5. Cliquez sur **"Créer"**

### 2. Activer l'API Google+ (Google People API)

1. Dans le menu de gauche, allez dans **"API et services"** > **"Bibliothèque"**
2. Recherchez "Google+ API" ou "Google People API"
3. Cliquez sur l'API
4. Cliquez sur **"Activer"**

### 3. Configurer l'Écran de Consentement OAuth

1. Dans le menu de gauche, allez dans **"API et services"** > **"Écran de consentement OAuth"**
2. Sélectionnez **"Externe"** (pour permettre à tous les utilisateurs de se connecter)
3. Cliquez sur **"Créer"**
4. Remplissez les informations requises :
   - **Nom de l'application** : Kamba Lhains
   - **E-mail d'assistance utilisateur** : votre email
   - **Logo de l'application** : (optionnel)
   - **Domaines autorisés** :
     - `kamba-lhains.com` (en production)
     - `localhost` (pour le développement)
   - **Coordonnées du développeur** : votre email
5. Cliquez sur **"Enregistrer et continuer"**
6. Dans **"Champs d'application"**, ajoutez les scopes suivants :
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
7. Cliquez sur **"Enregistrer et continuer"**
8. Vérifiez et cliquez sur **"Retour au tableau de bord"**

### 4. Créer les Identifiants OAuth 2.0

1. Dans le menu de gauche, allez dans **"API et services"** > **"Identifiants"**
2. Cliquez sur **"Créer des identifiants"** > **"ID client OAuth 2.0"**
3. Sélectionnez **"Application Web"**
4. Donnez un nom (ex: "Kamba Lhains Web Client")
5. Ajoutez les **URI de redirection autorisés** :

   **Pour le développement local :**
   ```
   http://localhost:3002/api/auth/callback/google
   ```

   **Pour la production :**
   ```
   https://kamba-lhains.com/api/auth/callback/google
   ```

6. Cliquez sur **"Créer"**
7. Une popup s'affiche avec votre **Client ID** et **Client Secret**
8. **IMPORTANT** : Copiez ces deux valeurs, vous en aurez besoin pour le fichier `.env.local`

### 5. Configurer les Variables d'Environnement

1. Ouvrez votre fichier `.env.local` (créez-le si nécessaire à partir de `.env.local.example`)

2. Ajoutez les variables suivantes :

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=votre-secret-nextauth-genere
NEXTAUTH_URL=http://localhost:3002

# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-google
```

3. Pour générer le `NEXTAUTH_SECRET`, utilisez cette commande :
```bash
openssl rand -base64 32
```

### 6. Configurer Google Sheets pour les Utilisateurs

1. Créez un nouveau Google Sheet ou utilisez un existant
2. Nommez l'onglet **"Users"** (exactement comme ça)
3. Ajoutez les en-têtes suivants dans la première ligne :

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Email | Prénom | Nom | Password | Date création | Dernière connexion | Statut | Provider | Provider ID |

4. Copiez l'ID du Google Sheet (dans l'URL après `/d/`)
5. Ajoutez cette variable dans `.env.local` :
```bash
GOOGLE_SHEETS_USERS_ID=votre-google-sheet-id-ici
```

6. Partagez le Google Sheet avec votre Service Account :
   - Cliquez sur **"Partager"** en haut à droite
   - Ajoutez l'email de votre service account (format : `nom@projet.iam.gserviceaccount.com`)
   - Donnez les droits **"Éditeur"**

### 7. Configuration pour la Production

Quand vous déployez en production :

1. Retournez dans Google Cloud Console > **"Identifiants"**
2. Modifiez votre client OAuth
3. Ajoutez l'URI de redirection de production :
   ```
   https://kamba-lhains.com/api/auth/callback/google
   ```
4. Dans Vercel (ou votre plateforme de déploiement), ajoutez les variables d'environnement :
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://kamba-lhains.com`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_SHEETS_USERS_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`

## Tester la Connexion Google

1. Démarrez votre serveur de développement :
```bash
npm run dev
```

2. Allez sur http://localhost:3002/connexion

3. Cliquez sur le bouton **"Continuer avec Google"**

4. Vous devriez être redirigé vers la page de connexion Google

5. Après connexion, vous serez redirigé vers votre site

6. Vérifiez que l'utilisateur a été créé dans votre Google Sheet

## Résolution de Problèmes

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à celle utilisée
- Format attendu : `http://localhost:3002/api/auth/callback/google`

### Erreur "invalid_client"
- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont corrects
- Assurez-vous qu'il n'y a pas d'espaces avant/après les valeurs

### Utilisateur pas créé dans Google Sheet
- Vérifiez que `GOOGLE_SHEETS_USERS_ID` est correct
- Vérifiez que le Service Account a les droits d'édition sur le Sheet
- Vérifiez que l'onglet s'appelle exactement "Users"
- Regardez les logs du serveur pour voir les erreurs éventuelles

### NextAuth Error
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL (avec le bon port en dev)

## Sécurité

- Ne commitez JAMAIS le fichier `.env.local` dans Git
- Gardez vos secrets (`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`) confidentiels
- En production, utilisez toujours HTTPS
- Limitez les domaines autorisés dans Google Cloud Console

## Support

Pour plus d'informations :
- [Documentation NextAuth.js](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
