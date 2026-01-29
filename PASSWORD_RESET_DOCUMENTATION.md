# Documentation - Système de Réinitialisation de Mot de Passe

## 📋 Vue d'ensemble

Système professionnel de réinitialisation de mot de passe avec envoi d'emails sécurisés via Resend.

## 🏗️ Architecture

### Base de données (Prisma)
**Nouveaux champs ajoutés au modèle User:**
```prisma
model User {
  passwordResetToken   String?   @unique
  passwordResetExpires DateTime?
}
```

### Fichiers créés

#### 1. **lib/passwordReset.ts**
Utilitaires de gestion des tokens:
- `generateResetToken()` - Génère un token sécurisé (crypto.randomBytes)
- `createPasswordResetToken(email)` - Crée et enregistre un token (expire en 1h)
- `verifyResetToken(token)` - Vérifie la validité d'un token
- `resetPassword(token, newPassword)` - Réinitialise le mot de passe
- `cleanupExpiredTokens()` - Nettoie les tokens expirés

#### 2. **pages/api/auth/forgot-password.ts**
API POST pour demander une réinitialisation:
- Valide l'email
- Crée le token de réinitialisation
- Envoie l'email avec le lien
- Retourne toujours succès (sécurité)

#### 3. **pages/api/auth/reset-password.ts**
API GET/POST pour réinitialiser:
- GET: Vérifie si un token est valide
- POST: Réinitialise le mot de passe avec le token

#### 4. **pages/mot-de-passe-oublie.tsx**
Page de demande de réinitialisation:
- Formulaire avec validation email
- Message de confirmation
- Design cohérent avec le site

#### 5. **pages/reinitialiser-mot-de-passe.tsx**
Page de réinitialisation avec token:
- Vérification automatique du token
- Formulaire de nouveau mot de passe
- Validation et confirmation
- Gestion des erreurs (token expiré/invalide)
- Redirection automatique après succès

#### 6. **lib/email.ts** (ajouts)
Templates d'emails professionnels:
- `sendPasswordResetEmail(email, token, firstName)` - Email de réinitialisation
- `sendPasswordChangedEmail(email, firstName)` - Email de confirmation

## 🔒 Sécurité

### Tokens
- Générés avec `crypto.randomBytes(32)` (64 caractères hex)
- Expiration: 1 heure
- Usage unique (supprimé après utilisation)
- Stockés de manière sécurisée dans la DB

### Bonnes pratiques
✅ Ne révèle pas si un email existe ou non
✅ Tokens cryptographiquement sécurisés
✅ Expiration automatique des tokens
✅ Validation stricte des mots de passe (min 6 caractères)
✅ Hashage avec bcrypt (12 rounds)
✅ Protection contre les utilisateurs OAuth
✅ Email de confirmation après changement

## 📧 Emails

### Email de réinitialisation
**Expéditeur:** `Kamba Lhains <noreply@kamba-lhains.com>`
**Sujet:** "Réinitialisation de votre mot de passe - Kamba Lhains"

**Contenu:**
- Salutation personnalisée (prénom si disponible)
- Bouton CTA "RÉINITIALISER MON MOT DE PASSE"
- Avertissement de sécurité
- Lien de secours (si le bouton ne fonctionne pas)
- Design professionnel aux couleurs de la marque

### Email de confirmation
**Expéditeur:** `Kamba Lhains <noreply@kamba-lhains.com>`
**Sujet:** "Votre mot de passe a été modifié - Kamba Lhains"

**Contenu:**
- Confirmation du changement
- Alerte de sécurité (si ce n'était pas vous)
- Bouton "SE CONNECTER"
- Design professionnel

## 🎯 Flux utilisateur

### 1. Demande de réinitialisation
```
Utilisateur → /mot-de-passe-oublie
    ↓
Entre son email
    ↓
API /api/auth/forgot-password
    ↓
Token créé + Email envoyé
    ↓
Message de confirmation affiché
```

### 2. Réinitialisation
```
Utilisateur clique sur le lien dans l'email
    ↓
/reinitialiser-mot-de-passe?token=xxx
    ↓
Vérification du token (GET /api/auth/reset-password)
    ↓
Si valide: Formulaire de nouveau mot de passe
    ↓
Soumission (POST /api/auth/reset-password)
    ↓
Mot de passe changé + Email de confirmation
    ↓
Redirection vers /connexion
```

## 🚀 Utilisation

### Variables d'environnement requises
```env
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_BASE_URL=https://kamba-lhains.com
DATABASE_URL=postgresql://...
```

### Tester le flux

1. **Demander une réinitialisation:**
```bash
curl -X POST http://localhost:3002/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

2. **Vérifier un token:**
```bash
curl http://localhost:3002/api/auth/reset-password?token=xxx
```

3. **Réinitialiser le mot de passe:**
```bash
curl -X POST http://localhost:3002/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"xxx","password":"newpassword123"}'
```

## 🎨 Design

Les pages utilisent les styles existants de `Auth.module.css` pour garantir une cohérence visuelle avec:
- Page de connexion
- Page d'inscription
- Design responsive mobile-first
- Animations et transitions fluides

## 📝 Maintenance

### Nettoyage des tokens expirés

Exécuter périodiquement (ex: cron job):
```typescript
import { cleanupExpiredTokens } from './lib/passwordReset';
await cleanupExpiredTokens();
```

### Logs

Tous les événements importants sont loggés:
- ✅ Demandes de réinitialisation
- ✅ Emails envoyés
- ✅ Tokens vérifiés
- ✅ Mots de passe changés
- ❌ Erreurs

## 🔗 Liens

- Page de demande: `/mot-de-passe-oublie`
- Page de réinitialisation: `/reinitialiser-mot-de-passe?token=xxx`
- Lien depuis connexion: Déjà présent sur `/connexion`

## ✅ Checklist de déploiement

- [ ] Vérifier RESEND_API_KEY en production
- [ ] Vérifier NEXT_PUBLIC_BASE_URL en production
- [ ] Tester l'envoi d'emails en production
- [ ] Configurer un domaine d'envoi vérifié sur Resend
- [ ] Configurer un cron job pour nettoyer les tokens expirés
- [ ] Tester le flux complet en production
- [ ] Vérifier les logs d'erreurs

## 🎓 Notes importantes

1. **Email de test:** En développement, Resend envoie les emails à l'adresse vérifiée uniquement
2. **Tokens uniques:** Un nouveau token invalide l'ancien
3. **Sécurité OAuth:** Les utilisateurs connectés via Google/Facebook/Apple ne peuvent pas réinitialiser leur mot de passe
4. **Rate limiting:** À implémenter si nécessaire (ex: max 3 demandes par heure)
