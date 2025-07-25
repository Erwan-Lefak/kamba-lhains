# Documentation API - Kamba Lhains

## Vue d'ensemble

Cette documentation décrit les endpoints de l'API REST du site e-commerce Kamba Lhains. Toutes les réponses sont au format JSON et suivent les conventions RESTful.

**Base URL**: `https://kamba-lhains.vercel.app/api`

## Authentification

L'API utilise NextAuth.js pour la gestion des sessions et JWT pour l'authentification.

### Headers requis
```http
Content-Type: application/json
Authorization: Bearer <token>  # Pour les endpoints protégés
```

---

## 🔐 Authentification

### Inscription utilisateur
```http
POST /api/auth/register
```

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "clm1234567890",
    "email": "jean.dupont@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "USER"
  }
}
```

### Connexion
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clm1234567890",
    "email": "jean.dupont@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "USER"
  }
}
```

---

## 🛍️ Produits

### Obtenir tous les produits
```http
GET /api/products
```

**Paramètres optionnels:**
- `category`: string - Filtre par catégorie (`femme`, `homme`, `accessoires`)
- `featured`: boolean - Produits en vedette uniquement
- `inStock`: boolean - Produits en stock uniquement
- `limit`: number - Nombre maximum de résultats
- `offset`: number - Décalage pour la pagination

**Exemple:**
```http
GET /api/products?category=femme&featured=true&limit=10
```

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "VESTE JANÉ",
      "price": 890.00,
      "image": "/images/collection/IMG_2864.jpeg",
      "images": [
        "/images/collection/IMG_2864.jpeg",
        "/images/collection/IMG_2865.jpeg"
      ],
      "description": [
        "Veste en coton recyclé à coupe classique",
        "Col chemise sans pied, fermeture à 6 boutons clous"
      ],
      "category": "femme",
      "subCategory": "aube",
      "colors": ["#000000", "#8B7355"],
      "sizes": ["S", "M", "L", "XL"],
      "inStock": true,
      "featured": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Obtenir un produit par ID
```http
GET /api/products/:id
```

**Réponse (200):** Structure identique à un élément du tableau ci-dessus

**Erreur (404):**
```json
{
  "success": false,
  "error": "Produit non trouvé",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

## 🛒 Panier

### Obtenir le panier utilisateur
```http
GET /api/cart
```
*Authentification requise*

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_1",
        "productId": "1",
        "product": {
          "id": "1",
          "name": "VESTE JANÉ",
          "price": 890.00,
          "image": "/images/collection/IMG_2864.jpeg"
        },
        "quantity": 2,
        "size": "M",
        "color": "#000000",
        "subtotal": 1780.00
      }
    ],
    "summary": {
      "itemCount": 2,
      "subtotal": 1780.00,
      "shipping": 0.00,
      "tax": 356.00,
      "total": 2136.00
    }
  }
}
```

### Ajouter un produit au panier
```http
POST /api/cart
```
*Authentification requise*

**Body:**
```json
{
  "productId": "1",
  "quantity": 2,
  "size": "M",
  "color": "#000000"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Produit ajouté au panier",
  "item": {
    "id": "cart_item_1",
    "productId": "1",
    "quantity": 2,
    "size": "M",
    "color": "#000000"
  }
}
```

### Mettre à jour la quantité
```http
PUT /api/cart/:itemId
```

**Body:**
```json
{
  "quantity": 3
}
```

### Supprimer un élément du panier
```http
DELETE /api/cart/:itemId
```

---

## 📦 Commandes

### Créer une commande
```http
POST /api/orders
```
*Authentification requise*

**Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "size": "M",
      "color": "#000000"
    }
  ],
  "shippingAddress": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "billingAddress": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "paymentMethod": "stripe"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "order": {
    "id": "order_clm789",
    "status": "PENDING",
    "totalAmount": 2136.00,
    "items": [
      {
        "productId": "1",
        "quantity": 2,
        "price": 890.00,
        "size": "M",
        "color": "#000000"
      }
    ],
    "shippingAddress": { },
    "createdAt": "2024-01-15T14:30:00Z"
  },
  "paymentIntent": {
    "clientSecret": "pi_1234567890_secret_xyz",
    "publishableKey": "pk_test_..."
  }
}
```

### Obtenir les commandes utilisateur
```http
GET /api/orders
```
*Authentification requise*

**Paramètres optionnels:**
- `status`: string - Filtre par statut (`PENDING`, `CONFIRMED`, `SHIPPED`, etc.)
- `limit`: number - Nombre de résultats
- `offset`: number - Pagination

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_clm789",
      "status": "SHIPPED",
      "totalAmount": 2136.00,
      "paymentStatus": "PAID",
      "createdAt": "2024-01-15T14:30:00Z",
      "updatedAt": "2024-01-16T09:15:00Z",
      "trackingNumber": "FR123456789"
    }
  ]
}
```

### Obtenir une commande par ID
```http
GET /api/orders/:id
```

---

## 💳 Paiements

### Confirmer un paiement
```http
POST /api/payments/confirm
```

**Body:**
```json
{
  "paymentIntentId": "pi_1234567890",
  "orderId": "order_clm789"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_clm789",
    "status": "CONFIRMED",
    "paymentStatus": "PAID"
  }
}
```

---

## 📧 Contact et Newsletter

### Inscription newsletter
```http
POST /api/newsletter/subscribe
```

**Body:**
```json
{
  "email": "user@example.com",
  "language": "fr"
}
```

### Formulaire de contact
```http
POST /api/contact
```

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "subject": "Question produit",
  "message": "Bonjour, j'aimerais...",
  "category": "product-inquiry"
}
```

---

## ⚠️ Gestion d'erreurs

### Codes d'erreur courants

| Code HTTP | Type d'erreur | Description |
|-----------|---------------|-------------|
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource introuvable |
| 422 | Validation Error | Erreur de validation |
| 429 | Rate Limited | Trop de requêtes |
| 500 | Server Error | Erreur serveur |

### Format des erreurs
```json
{
  "success": false,
  "error": "Message d'erreur lisible",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "message": "Email invalide"
  }
}
```

### Erreurs de validation
```json
{
  "success": false,
  "error": "Données invalides",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email requis"
    },
    {
      "field": "password", 
      "message": "Mot de passe trop court"
    }
  ]
}
```

---

## 🔒 Rate Limiting

- **Authentification**: 5 tentatives par 15 minutes par IP
- **API générale**: 100 requêtes par minute par utilisateur
- **Upload**: 10 fichiers par heure par utilisateur

---

## 📝 Types TypeScript

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string[];
  category: 'femme' | 'homme' | 'accessoires';
  subCategory?: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 🧪 Exemples d'utilisation

### JavaScript/Fetch
```javascript
// Obtenir les produits
const response = await fetch('/api/products?category=femme&limit=5');
const { data } = await response.json();

// Ajouter au panier (avec auth)
const token = localStorage.getItem('authToken');
const cartResponse = await fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '1',
    quantity: 2,
    size: 'M'
  })
});
```

### cURL
```bash
# Obtenir les produits
curl -X GET "https://kamba-lhains.vercel.app/api/products?category=femme"

# Créer un compte
curl -X POST "https://kamba-lhains.vercel.app/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jean","lastName":"Dupont","email":"jean@example.com","password":"motdepasse123"}'
```

---

## 📞 Support

Pour toute question sur l'API :
- **Email**: dev@kamba-lhains.com
- **Documentation**: https://docs.kamba-lhains.com
- **Status**: https://status.kamba-lhains.com