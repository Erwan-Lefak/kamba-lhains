# Système de Tracking des Visiteurs

## Vue d'ensemble

Le site Kamba Lhains dispose maintenant d'un système complet de tracking des visiteurs qui compte **tous les visiteurs** (anonymes et connectés).

## Comment ça fonctionne

### 1. Génération de Session

Chaque visiteur reçoit un **sessionId unique** stocké dans le `sessionStorage` :
- Durée : **30 minutes d'inactivité**
- Format : `session_1234567890_abc123def`
- Stockage : `sessionStorage` du navigateur

### 2. Tracking Automatique

À chaque changement de page, le système enregistre automatiquement :
- ✓ Le **sessionId** unique du visiteur
- ✓ La **page visitée** (pathname)
- ✓ L'**userId** (si connecté, sinon null)
- ✓ Le **userAgent** du navigateur
- ✓ L'**horodatage** de la visite

### 3. Stockage des Données

Les données sont stockées dans la table `user_analytics` :
```sql
{
  id: "uuid",
  sessionId: "session_xxx",
  event: "page_view",
  page: "/",
  userId: "user-id" ou null,
  userAgent: "Mozilla/5.0...",
  createdAt: "2025-01-01T12:00:00Z"
}
```

## Fichiers impliqués

### Backend
- `/pages/api/track-page-view.js` - API pour enregistrer les vues
- `/prisma/schema.prisma` - Modèle `UserAnalytics` (userId optionnel)
- `/pages/api/admin/dashboard.js` - Calcul des statistiques

### Frontend
- `/utils/sessionManager.js` - Gestion des sessions visiteurs
- `/pages/_app.tsx` - Composant `PageViewTracker`

### Scripts
- `/scripts/reset-product-views.js` - Reset des vues de produits

## Métriques Calculées

### Visiteurs Uniques
Compte le nombre de **sessionId distincts** sur la période sélectionnée.

### Taux de Conversion
```
Taux = (Nombre de commandes ÷ Nombre de visiteurs) × 100
```

## Avantages

✅ Compte les visiteurs **anonymes** ET **connectés**
✅ Ne nécessite pas de cookies tiers
✅ Respecte la navigation privée (sessionStorage)
✅ Calcul en temps réel
✅ Filtrage des données de test

## Limitations

- Les visiteurs avec `sessionStorage` désactivé ne sont pas comptés
- Une nouvelle session est créée après 30 min d'inactivité
- Les sessions sont par navigateur/onglet

## Dashboard Admin

Dans le dashboard (`/admin/dashboard`), vous pouvez voir :
- **Nombre de visiteurs** sur la période
- **Taux de conversion** calculé automatiquement
- **Pages les plus visitées** (à venir)
- **Flux de navigation** (à venir)

## Notes Techniques

- Le tracking est **asynchrone** pour ne pas ralentir la navigation
- Les erreurs de tracking sont loggées mais n'affectent pas l'UX
- Compatible avec tous les navigateurs modernes
- Fonctionne avec Next.js App Router
