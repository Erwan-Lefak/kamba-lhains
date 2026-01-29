# 🌐 DNS à configurer pour kamba-lhains.com

## 📋 Enregistrements DNS Resend à ajouter

Copie-colle ces 4 enregistrements dans la zone DNS de ton domaine `kamba-lhains.com`.

---

## 1️⃣ DKIM (Authentification)

```
Type     : TXT
Nom      : resend._domainkey
Contenu  : p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJ5W3VN4fl4UyYtGkSkiuAms0TcJzgXHZuBRgr00xfcEbL+333GFIJ+JkjwUp3T9UuvBfy13J8qN5AwcmzMKRiLTD17hkRJUc1ok2v907F+yqgVOsOuWC1UckRvutll5YjFFJ7B8UcPJse/pYJ6cReWpU8xdAjznO+AwvpNDiU4QIDAQAB
TTL      : Auto (ou 3600)
```

---

## 2️⃣ MX (Routage des emails)

```
Type     : MX
Nom      : send
Contenu  : feedback-smtp.eu-west-1.amazonses.com
TTL      : Auto (ou 3600)
Priorité : 10
```

---

## 3️⃣ SPF (Autorisation d'envoi)

```
Type     : TXT
Nom      : send
Contenu  : v=spf1 include:amazonses.com ~all
TTL      : Auto (ou 3600)
```

---

## 4️⃣ DMARC (Politique de sécurité) - OPTIONNEL

```
Type     : TXT
Nom      : _dmarc
Contenu  : v=DMARC1; p=none;
TTL      : Auto (ou 3600)
```

---

## 🔧 Comment ajouter selon ton hébergeur

### **Si c'est Vercel** :

1. Va dans le dashboard Vercel
2. Sélectionne ton projet
3. Settings → Domains
4. Clique sur `kamba-lhains.com`
5. Scroll jusqu'à "DNS Records"
6. Add Record pour chaque enregistrement

### **Si c'est OVH** :

1. [ovh.com](https://www.ovh.com) → Connexion
2. Web Cloud → Noms de domaine → `kamba-lhains.com`
3. Zone DNS → Ajouter une entrée
4. Pour chaque enregistrement :
   - DKIM : TXT
   - MX : MX
   - SPF : TXT
   - DMARC : TXT

### **Si c'est Cloudflare** :

1. Dashboard Cloudflare
2. Sélectionne `kamba-lhains.com`
3. DNS → Add record
4. Pour chaque enregistrement ci-dessus

### **Si c'est un autre hébergeur** :

1. Connecte-toi à ton hébergeur
2. Trouve la section "DNS" ou "Zone DNS"
3. Ajoute les 4 enregistrements un par un

---

## ⏱️ Temps d'attente

Après avoir ajouté les DNS :
- **Cloudflare** : 5-15 minutes
- **Vercel** : 5-30 minutes
- **OVH** : 1-4 heures
- **Autres** : Jusqu'à 24 heures

---

## ✅ Vérifier que c'est bon

### Méthode 1 : Sur Resend

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Clique sur `kamba-lhains.com`
3. Attends que tous les enregistrements affichent ✅ vert

### Méthode 2 : Par commande

```bash
# Vérifier DKIM
dig TXT resend._domainkey.kamba-lhains.com

# Vérifier MX
dig MX send.kamba-lhains.com

# Vérifier SPF
dig TXT send.kamba-lhains.com

# Vérifier DMARC
dig TXT _dmarc.kamba-lhains.com
```

---

## 🧪 Tester l'envoi d'email

Une fois que Resend affiche ✅ pour tout :

```bash
# Test avec TON email
curl -X POST http://localhost:3002/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "TON_EMAIL@gmail.com",
    "firstName": "Test Final",
    "source": "test-dns-ok"
  }'
```

**Résultat attendu** :
- ✅ Inscription réussie dans Google Sheets
- ✅ Email de bienvenue reçu depuis `newsletter@kamba-lhains.com`
- ✅ Aucune erreur dans les logs

---

## 🎯 Résumé

| Enregistrement | Type | Nom | Statut |
|----------------|------|-----|--------|
| DKIM | TXT | resend._domainkey | ⏳ À ajouter |
| MX | MX | send | ⏳ À ajouter |
| SPF | TXT | send | ⏳ À ajouter |
| DMARC | TXT | _dmarc | ⏳ Optionnel |

---

**Une fois les DNS ajoutés, attends 5min-24h selon ton hébergeur, puis teste l'envoi d'email !** 🚀

**Où est hébergé ton domaine ?** Je t'aide à ajouter les DNS si besoin.
