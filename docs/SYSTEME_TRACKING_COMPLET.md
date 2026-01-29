# Système de Tracking Complet - Kamba Lhains

## 📊 Vue d'ensemble

Le site dispose maintenant de **deux systèmes de tracking** complémentaires :

### 1. Tracking des Visiteurs (Pages)
### 2. Tracking des Vues Produits

---

## 🌐 1. Tracking des Visiteurs

### Fonctionnement
Chaque fois qu'un visiteur navigue sur une page du site :
- ✅ Un **sessionId unique** est généré (durée : 30 minutes)
- ✅ La **page visitée** est enregistrée dans `UserAnalytics`
- ✅ Fonctionne pour **tous les visiteurs** (anonymes et connectés)

### API Utilisée
`POST /api/track-page-view`

### Données Enregistrées
```json
{
  "sessionId": "session_1234567890_abc123",
  "event": "page_view",
  "page": "/",
  "userId": "user-id" ou null,
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-01-01T12:00:00Z"
}
```

### Intégration
- **Fichier** : `/pages/_app.tsx`
- **Composant** : `PageViewTracker`
- **Automatique** : Oui, à chaque changement de route

---

## 🛍️ 2. Tracking des Vues Produits

### Fonctionnement
Quand un visiteur consulte une page produit (`/produit/[id]`) :
- ✅ La vue est **enregistrée dans ProductAnalytics**
- ✅ Compteur **incrémenté par jour** (upsert)
- ✅ Visible dans le **dashboard admin** (onglet Produits)

### API Utilisée
`POST /api/track-product-view`

### Données Enregistrées
```json
{
  "productId": "123",
  "event": "view",
  "date": "2025-01-01T00:00:00Z",
  "count": 1 (s'incrémente à chaque vue)
}
```

### Intégration
- **Fichier** : `/pages/produit/[id].js` (ligne 111-120)
- **Déclenchement** : Dès qu'un produit est chargé
- **Groupement** : Par jour (minuit à minuit)

---

## 📈 Dashboard Admin

### Métriques Calculées

#### Visiteurs
```javascript
Visiteurs = Nombre de sessionId distincts
```

#### Taux de Conversion
```javascript
Taux = (Commandes ÷ Visiteurs) × 100
```

#### Vues Produits (dans l'onglet Produits)
```javascript
Vues = Σ count pour chaque jour de la période
```

### Onglets Concernés

1. **Vue d'ensemble**
   - Visiteurs totaux
   - Taux de conversion en temps réel

2. **Produits**
   - Nombre de vues par produit
   - Ventes vs Vues
   - Taux de conversion par produit (à venir)

3. **Analytiques**
   - Statistiques visiteurs
   - Métriques de conversion

---

## 🔍 Tables de la Base de Données

### UserAnalytics
```prisma
model UserAnalytics {
  id        String   @id @default(uuid())
  userId    String?  // ← OPTIONNEL pour visiteurs anonymes
  event     String   // "page_view"
  page      String?
  sessionId String
  userAgent String?
  createdAt DateTime @default(now())
  user User? @relation(...)
}
```

### ProductAnalytics
```prisma
model ProductAnalytics {
  id        String   @id @default(uuid())
  productId String
  event     String   // "view"
  count     Int      @default(1)
  date      DateTime @default(now())
  product Product @relation(...)

  @@unique([productId, event, date])
}
```

---

## 🚀 Déploiement

### Vérifications
- ✅ Base de données synchronisée (`prisma db push`)
- ✅ Serveur redémarré
- ✅ APIs créées
- ✅ Tracking intégré dans `_app.tsx` et `produit/[id].js`

### URLs des APIs
- `/api/track-page-view` - Pour les pages
- `/api/track-product-view` - Pour les produits

### Fichiers Créés/Modifiés
```
✓ prisma/schema.prisma (userId optionnel)
✓ pages/api/track-page-view.js (nouveau)
✓ pages/api/track-product-view.js (nouveau)
✓ utils/sessionManager.js (nouveau)
✓ pages/_app.tsx (modifié - PageViewTracker)
✓ pages/produit/[id].js (modifié - tracking ligne 111-120)
```

---

## 📝 Notes Importantes

### Filtrage des Tests
Les données de test (emails contenant "test", "demo", etc.) sont **automatiquement filtrées** dans le dashboard.

### Performance
- Tracking **asynchrone** (n'affecte pas l'UX)
- Erreurs **loggées** mais non bloquantes
- Compatible avec tous les navigateurs modernes

### RGPD
- Pas de cookies tiers
- SessionStorage local au navigateur
- Données anonymisées pour visiteurs non connectés

---

## 🎯 Prochaines Étapes (Optionnelles)

- [ ] Ajouter des graphiques dans l'onglet Analytiques
- [ ] Tracker les ajouts au panier
- [ ] Tracker les favoris
- [ ] Analyser le parcours utilisateur (funnel)
- [ ] Heatmaps des pages produits
- [ ] A/B Testing

---

**Le système est maintenant actif et opérationnel ! 🎉**
