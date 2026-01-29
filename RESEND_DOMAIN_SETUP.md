# 🌐 Configuration du domaine Resend - kamba-lhains.com

## ✅ Ce qui a été fait

Le domaine `kamba-lhains.com` a été ajouté dans Resend et configuré dans le code :

- **Newsletter** : `newsletter@kamba-lhains.com`
- **Commandes** : `commandes@kamba-lhains.com`  
- **Expéditions** : `expeditions@kamba-lhains.com`

---

## 📋 Configuration DNS requise

Pour que les emails soient envoyés depuis `@kamba-lhains.com`, tu dois configurer les DNS.

### 1. Récupérer les enregistrements DNS

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Clique sur `kamba-lhains.com`
3. Tu verras 3 types d'enregistrements :

#### **SPF (TXT)**
```
Nom : @
Type : TXT
Valeur : v=spf1 include:_spf.resend.com ~all
```

#### **DKIM (TXT)**
```
Nom : resend._domainkey
Type : TXT
Valeur : [Une longue clé fournie par Resend]
```

#### **DMARC (TXT)**
```
Nom : _dmarc
Type : TXT
Valeur : v=DMARC1; p=none; pct=100; rua=mailto:dmarc@kamba-lhains.com
```

---

## 🔧 Ajouter les DNS chez ton hébergeur

### Si ton domaine est chez **OVH** :

1. Va sur [ovh.com](https://www.ovh.com)
2. Connexion → Domaines → `kamba-lhains.com`
3. Onglet "Zone DNS"
4. Clique "Ajouter une entrée"
5. Pour chaque enregistrement :
   - SPF : Sélectionne "TXT"
   - DKIM : Sélectionne "TXT"  
   - DMARC : Sélectionne "TXT"
6. Copie les valeurs depuis Resend

### Si ton domaine est chez **Cloudflare** :

1. Dashboard Cloudflare
2. Sélectionne `kamba-lhains.com`
3. DNS → Records
4. "Add record"
5. Type : TXT
6. Copie nom + valeur depuis Resend

### Si ton domaine est chez **Namecheap** :

1. Dashboard → Domain List
2. Manage → Advanced DNS
3. Add New Record
4. Type : TXT Record
5. Copie depuis Resend

---

## ⏱️ Temps de propagation

- **DNS standard** : 1-24 heures
- **Cloudflare** : 5-15 minutes

---

## ✅ Vérifier la configuration

### Dans Resend

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Clique sur `kamba-lhains.com`
3. Attends que les 3 enregistrements affichent ✅ (vert)

### Par commande

```bash
# Vérifier SPF
dig txt kamba-lhains.com | grep spf

# Vérifier DKIM
dig txt resend._domainkey.kamba-lhains.com

# Vérifier DMARC
dig txt _dmarc.kamba-lhains.com
```

---

## 🧪 Test après configuration

Une fois que Resend affiche ✅ pour tous les enregistrements :

```bash
# Test d'inscription newsletter
curl -X POST http://localhost:3002/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "TON_EMAIL@gmail.com",
    "firstName": "Test",
    "source": "test-final"
  }'
```

**Vérifie ta boîte mail** → L'email doit venir de `newsletter@kamba-lhains.com` !

---

## 📧 Emails configurés

| Type | Adresse | Utilisation |
|------|---------|-------------|
| Newsletter | `newsletter@kamba-lhains.com` | Inscriptions, bienvenue |
| Commandes | `commandes@kamba-lhains.com` | Confirmations de commande |
| Expéditions | `expeditions@kamba-lhains.com` | Suivi de livraison |

---

## 🚨 Problèmes courants

### "Domain not verified"
→ Les DNS ne sont pas encore propagés, attends 1-24h

### "SPF validation failed"
→ Vérifie que tu as bien ajouté `v=spf1 include:_spf.resend.com ~all`

### "DKIM signature invalid"
→ Copie-colle exactement la clé DKIM depuis Resend (attention aux espaces)

---

## 📖 Documentation Resend

- [Guide officiel DNS](https://resend.com/docs/dashboard/domains/introduction)
- [Troubleshooting](https://resend.com/docs/dashboard/domains/troubleshooting)

---

**Une fois les DNS configurés, ton système newsletter sera 100% professionnel !** ✨
