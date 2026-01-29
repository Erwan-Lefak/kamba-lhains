# Étapes finales pour activer le système de commandes

## ✅ CE QUI EST DÉJÀ CONFIGURÉ

1. **Google Sheets Produits** - Fonctionne parfaitement
   - 13 produits récupérés avec succès
   - API: http://localhost:3002/api/products/google-sheets

2. **Google Sheets Commandes** - Structure prête
   - Sheet ID configuré dans .env.local
   - Headers corrects dans le Google Sheet
   - Code mis à jour pour utiliser "Feuille 1"

3. **Service Account Google** - Configuré
   - Email: `kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com`
   - Clé privée ajoutée dans .env.local
   - Authentification prête

4. **API de commandes** - Prête
   - `/api/orders/create` - Créer une commande
   - `/api/admin/dashboard-sheets` - Dashboard stats

---

## 🔧 CE QU'IL RESTE À FAIRE (5 minutes)

### 1. Partager le Google Sheet avec le Service Account

**Le sheet:** https://docs.google.com/spreadsheets/d/1FPDQ0PiIdHe-y5WZhLmatJ3QLpEfzth6K7zo8GYf1dY/edit

**Email à ajouter:**
```
kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com
```

**Instructions:**
1. Ouvre le Google Sheet des commandes (lien ci-dessus)
2. Clique sur **"Partager"** (bouton en haut à droite)
3. Colle l'email du Service Account dans le champ
4. Change les permissions à **"Éditeur"**
5. **DÉCOCHE** "Avertir les utilisateurs"
6. Clique sur **"Partager"**

### 2. Configurer Resend (service email)

**Option A: Resend (recommandé - 100 emails/jour gratuits)**

1. Va sur https://resend.com/signup
2. Inscris-toi avec goldandnation@gmail.com
3. Vérifie ton email
4. Va dans "API Keys"
5. Crée une nouvelle clé
6. Copie la clé et ajoute-la dans `.env.local`:
   ```bash
   RESEND_API_KEY=re_votre_cle_ici
   ```

**Option B: Alternative gratuite (si tu préfères)**
- Je peux désactiver l'envoi d'emails
- Les commandes seront quand même sauvegardées dans Google Sheets
- Tu pourras voir toutes les commandes dans le Google Sheet

### 3. Redémarrer le serveur

Une fois le Google Sheet partagé:
```bash
# Arrête le serveur actuel
pkill -f "PORT=3002"

# Redémarre le serveur
PORT=3002 npm run dev
```

---

## 🧪 TESTER LE SYSTÈME

Une fois les étapes 1 et 3 terminées (partage + redémarrage):

```bash
curl -X POST http://localhost:3002/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test Client",
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
      "firstName": "Test",
      "lastName": "Client",
      "address1": "123 Rue Test",
      "city": "Paris",
      "postalCode": "75001",
      "country": "France"
    }
  }'
```

**Résultat attendu:**
- Tu reçois un numéro de commande (ex: KL-2025-586018)
- Une nouvelle ligne apparaît dans le Google Sheet
- Un email de confirmation est envoyé (si Resend configuré)

---

## 📊 DASHBOARD ADMIN

Le dashboard est accessible à:
```
http://localhost:3002/admin
```

Il affichera:
- Chiffre d'affaires total
- Nombre de commandes
- Commandes du jour
- Top produits
- Commandes récentes

Toutes ces données viennent directement du Google Sheet!

---

## 🔍 VÉRIFICATION RAPIDE

**Sans toucher au code, vérifie que:**
- [ ] Le Google Sheet est partagé avec `kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com`
- [ ] Les permissions sont "Éditeur"
- [ ] Le serveur redémarre sans erreur
- [ ] Une commande test s'ajoute dans le Google Sheet

**Avec Resend (optionnel):**
- [ ] Clé API Resend dans .env.local
- [ ] Email de confirmation reçu lors d'une commande test

---

## ❓ EN CAS DE PROBLÈME

**Erreur "Permission denied":**
→ Le Google Sheet n'est pas partagé avec le Service Account

**Erreur "Unable to parse range":**
→ L'onglet doit s'appeler "Feuille 1" (déjà configuré)

**Pas d'email reçu:**
→ Normal si Resend n'est pas configuré (les commandes fonctionnent quand même)

**Commandes n'apparaissent pas dans le Sheet:**
→ Vérifie que le partage est bien fait ET que le serveur a redémarré

---

## 🎉 PROCHAINES ÉTAPES (après activation)

Une fois que tout fonctionne:
1. Tu pourras gérer tes commandes directement dans Google Sheets
2. Modifier les statuts (PENDING → PROCESSING → SHIPPED → DELIVERED)
3. Ajouter des numéros de suivi
4. Exporter les données (CSV, Excel, etc.)
5. Le dashboard se mettra à jour automatiquement

---

**Besoin d'aide? Dis-moi où tu bloques!**
