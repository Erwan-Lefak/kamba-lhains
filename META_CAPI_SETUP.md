# Meta Conversions API (CAPI) - Configuration

## 📋 Qu'est-ce que la Conversions API ?

La **Meta Conversions API** est une méthode de **tracking server-side** qui complète le Meta Pixel client-side. Ensemble, ils permettent un tracking quasi complet (95%+) même avec les bloqueurs de publicités.

### Avantages du Pixel + CAPI :
- ✅ **Client-side (Pixel)** : Capture les événements navigateur
- ✅ **Server-side (CAPI)** : Backup fiable si le pixel est bloqué
- ✅ **95%+ de tracking** vs 70% avec le pixel seul
- ✅ **Contourne les bloqueurs** et restrictions iOS 14+

## 🔧 Configuration

### 1. Créer un Access Token Meta

1. Allez sur [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Sélectionnez votre pixel (`1495398438682010`)
3. Cliquez sur **Paramètres** → **Conversions API**
4. Cliquez sur **Générer un access token**
5. Copiez le token généré

### 2. Ajouter le token aux variables d'environnement

Ajoutez à votre fichier `.env.local` et `.env.production` :

```bash
# Meta Conversions API Access Token
META_CONVERSIONS_API_ACCESS_TOKEN=votre_token_ici
```

**⚠️ IMPORTANT** : Ne committez JAMAIS ce token dans Git !

### 3. Ajouter au fichier .env.example (pour référence)

```bash
# Meta Conversions API (optionnel, pour tracking serveur avancé)
#META_CONVERSIONS_API_ACCESS_TOKEN=votre_token_ici
```

## 📊 Fonctionnement

### Double Tracking (Client + Serveur)

Chaque événement critique est envoyé **deux fois** :

```javascript
// Exemple pour un achat

// 1. Client-side (Meta Pixel) - immédiat
trackMetaPurchase(orderNum, totalValue);

// 2. Server-side (CAPI) - backup
sendCAPIPurchase({
  orderId: orderNum,
  totalValue: totalValue,
  currency: 'EUR',
});
```

### Événements trackés avec CAPI

| Événement | Client-side | Server-side (CAPI) | Page |
|-----------|-------------|-------------------|------|
| Purchase | ✅ MetaPixel.tsx | ✅ CAPI Backup | commande-confirmee.js |
| InitiateCheckout | ✅ MetaPixel.tsx | ✅ CAPI Backup | checkout.tsx |
| ViewContent | ✅ MetaPixel.tsx | ❌ | produit/[id].js |
| AddToCart | ✅ MetaPixel.tsx | ❌ | produit/[id].js |
| PageView | ✅ _document.tsx | ❌ | Toutes pages |

**Pourquoi seulement Purchase et InitiateCheckout en CAPI ?**
- Ce sont les événements les plus critiques pour les ROI
- Coût de la CAPI (Meta facture les appels API)
- Meilleur ratio coût/bénéfice

## 🧪 Tester la CAPI

### 1. Vérifier que le token est configuré

```bash
# Vérifier dans .env.local
cat .env.local | grep META_CONVERSIONS_API_ACCESS_TOKEN
```

### 2. Tester un événement

1. Faites un achat test sur le site
2. Vérifiez dans les **logs serveur** (console) :
   ```
   Meta CAPI: 1 événement(s) envoyé(s) avec succès
   ```

3. Vérifiez dans **Meta Events Manager** → **Test Events**
   - Devriez voir les événements CAPI avec une icône serveur

### 3. Vérifier le double tracking

Dans Meta Events Manager, vous devriez voir pour un achat :
- 1 événement **Purchase** (client-side)
- 1 événement **Purchase** (server-side/CAPI)

## 📁 Fichiers ajoutés/modifiés

### Nouveaux fichiers :
- `lib/meta/conversionsAPI.ts` - Service CAPI
- `lib/meta/capiHelper.ts` - Helper client
- `pages/api/meta/conversions-api.ts` - API route Next.js

### Fichiers modifiés :
- `pages/commande-confirmee.js` - Ajout CAPI Purchase
- `pages/checkout.tsx` - Ajout CAPI InitiateCheckout

## 🔍 Dépannage

### Les événements CAPI n'apparaissent pas

1. **Vérifier le token**
   ```bash
   echo $META_CONVERSIONS_API_ACCESS_TOKEN
   ```

2. **Vérifier les logs serveur** pour les erreurs

3. **Vérifier les permissions du token** dans Events Manager

### Erreur "Access Token invalide"

- Régénérer le token dans Events Manager
- Mettre à jour `.env.local`
- Redémarrer le serveur de dev

## 📚 Documentation officielle

- [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [CAPI vs Pixel Comparison](https://analyzify.com/hub/meta-capi-vs-meta-pixel)
- [Meta Pixel Best Practices 2025](https://www.limelightdigital.co.nz/insights/mastering-meta-pixel-tracking-in-2025-everything-you-need-to-know/)

## ✅ Checklist

- [ ] Token généré dans Events Manager
- [ ] Token ajouté à `.env.local`
- [ ] Token ajouté à `.env.production` (Vercel)
- [ ] Build testé sans erreur
- [ ] Déployé en production
- [ ] Testé un achat complet
- [ ] Vérifié dans Events Manager
