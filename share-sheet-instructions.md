# Partager le Google Sheet Commandes avec le Service Account

## Email du Service Account à ajouter:
```
kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com
```

## Étapes pour partager le Google Sheet:

1. Ouvre le Google Sheet Commandes:
   https://docs.google.com/spreadsheets/d/1FPDQ0PiIdHe-y5WZhLmatJ3QLpEfzth6K7zo8GYf1dY/edit

2. Clique sur le bouton **"Partager"** (en haut à droite)

3. Dans le champ "Ajouter des personnes ou des groupes", colle cet email:
   ```
   kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com
   ```

4. Change les permissions à **"Éditeur"** (Editor)

5. **IMPORTANT**: Décoche la case "Avertir les utilisateurs"

6. Clique sur **"Partager"** ou **"Envoyer"**

## Vérification:

Une fois partagé, le système pourra:
- ✅ Écrire les nouvelles commandes automatiquement
- ✅ Lire les commandes pour le dashboard
- ✅ Mettre à jour les statuts des commandes

## Test après partage:

Tu peux créer une commande test avec:
```bash
curl -X POST http://localhost:3002/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Jean Test",
    "phone": "+33612345678",
    "totalAmount": 380,
    "shippingCost": 0,
    "taxAmount": 0,
    "items": [{
      "productName": "BOMBERS ITOUA",
      "quantity": 1,
      "price": 380,
      "size": "M",
      "color": "Noir"
    }],
    "shippingAddress": {
      "firstName": "Jean",
      "lastName": "Test",
      "address1": "123 Rue Test",
      "city": "Paris",
      "postalCode": "75001",
      "country": "France"
    }
  }'
```

Et vérifier dans le Google Sheet que la ligne apparaît!
