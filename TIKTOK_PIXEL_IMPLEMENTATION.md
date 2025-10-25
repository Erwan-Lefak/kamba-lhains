# TikTok Pixel Implementation

## Problème résolu
Le TikTok Pixel manquait le paramètre "value" dans les événements de conversion, ce qui empêchait le calcul du ROAS (Return on Ad Spend) et l'optimisation des enchères.

## Solution implémentée

### 1. Composant TikTokPixel (`components/TikTokPixel.tsx`)

Le pixel TikTok a été intégré avec les fonctionnalités suivantes :

- **Pixel ID**: `D3UBE0BC77U413QPA75G`
- **Initialisation automatique** au chargement de l'application
- **Tracking des changements de page** via Next.js router

### 2. Événements trackés avec paramètre "value"

#### ViewContent (Vue de produit)
```javascript
trackViewContent(productId, productName, price, currency)
```
- **Où**: Page produit `/pages/produit/[id].js`
- **Quand**: Chargement de la page produit
- **Paramètres**:
  - `content_id`: ID du produit
  - `content_name`: Nom du produit
  - `value`: Prix du produit (✅ inclus)
  - `currency`: EUR par défaut

#### AddToCart (Ajout au panier)
```javascript
trackAddToCart(productId, productName, price, quantity, currency)
```
- **Où**: Page produit `/pages/produit/[id].js`
- **Quand**: Click sur "Ajouter au panier"
- **Paramètres**:
  - `content_id`: ID du produit
  - `content_name`: Nom du produit
  - `quantity`: Quantité ajoutée
  - `value`: Prix × quantité (✅ inclus)
  - `currency`: EUR par défaut

#### InitiateCheckout (Début du paiement)
```javascript
trackInitiateCheckout(totalValue, numItems, currency)
```
- **Où**: À implémenter sur la page de checkout
- **Paramètres**:
  - `value`: Montant total du panier (✅ inclus)
  - `currency`: EUR
  - `num_items`: Nombre d'articles

#### CompletePayment (Paiement complété)
```javascript
trackCompletePayment(orderId, totalValue, currency)
```
- **Où**: À implémenter sur la page de confirmation
- **Paramètres**:
  - `order_id`: Numéro de commande
  - `value`: Montant total payé (✅ inclus)
  - `currency`: EUR

#### Search (Recherche)
```javascript
trackSearch(searchQuery)
```
- **Où**: À implémenter sur la barre de recherche
- **Paramètres**:
  - `query`: Termes de recherche

## Fichiers modifiés

1. **`components/TikTokPixel.tsx`** (NOUVEAU)
   - Composant principal du pixel
   - Fonctions helper pour le tracking

2. **`pages/_app.tsx`**
   - Import et ajout du composant `<TikTokPixel />`

3. **`pages/produit/[id].js`**
   - Import des fonctions de tracking
   - Tracking ViewContent au chargement
   - Tracking AddToCart au click

## Prochaines étapes recommandées

### À implémenter pour un tracking complet:

1. **Page Checkout** (`pages/checkout.tsx` ou similaire)
   ```javascript
   import { trackInitiateCheckout } from '../components/TikTokPixel';

   // Au chargement de la page checkout
   useEffect(() => {
     const total = getTotalPrice();
     const numItems = getTotalItems();
     trackInitiateCheckout(total, numItems);
   }, []);
   ```

2. **Page Confirmation de commande**
   ```javascript
   import { trackCompletePayment } from '../components/TikTokPixel';

   // Après paiement réussi
   trackCompletePayment(orderId, totalAmount);
   ```

3. **Barre de recherche** (si applicable)
   ```javascript
   import { trackSearch } from '../components/TikTokPixel';

   // Lors de la soumission de recherche
   const handleSearch = (query) => {
     trackSearch(query);
     // ... reste du code
   };
   ```

## Vérification

Pour vérifier que le pixel fonctionne correctement:

1. Ouvrir les DevTools du navigateur
2. Aller dans l'onglet Network
3. Filtrer par "analytics.tiktok.com"
4. Naviguer sur le site et vérifier que les événements sont envoyés
5. Vérifier que le paramètre `value` est présent dans les payloads

## Test sur TikTok Events Manager

1. Connectez-vous à TikTok Events Manager
2. Allez dans votre pixel (ID: D3UBE0BC77U413QPA75G)
3. Utilisez le mode "Test Events" pour vérifier en temps réel
4. Vérifiez que tous les événements contiennent le paramètre `value`

## Notes importantes

- Le paramètre `value` est **obligatoire** pour:
  - Le calcul du ROAS
  - L'optimisation des campagnes pour la valeur
  - Le ciblage des clients à forte valeur

- La devise par défaut est **EUR** (peut être changée si nécessaire)

- Le pixel est chargé de manière asynchrone pour ne pas ralentir le chargement de la page
