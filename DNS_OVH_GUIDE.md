# 🌐 Configuration DNS OVH pour Resend - Guide pas-à-pas

## 🎯 Objectif

Configurer les DNS sur OVH pour que les emails partent depuis `newsletter@kamba-lhains.com`

---

## 📝 Étapes détaillées

### 1. Se connecter à OVH

1. Va sur [ovh.com](https://www.ovh.com)
2. Clique sur "Connexion" en haut à droite
3. Entre tes identifiants OVH

---

### 2. Accéder à la Zone DNS

1. Dans le menu de gauche : **Web Cloud**
2. Clique sur **Noms de domaine**
3. Sélectionne **kamba-lhains.com** dans la liste
4. Clique sur l'onglet **Zone DNS** (en haut)

---

### 3. Ajouter les 4 enregistrements DNS

#### 📌 Enregistrement 1 : DKIM (TXT)

1. Clique sur **Ajouter une entrée** (bouton à droite)
2. Sélectionne **TXT**
3. Remplis :
   - **Sous-domaine** : `resend._domainkey`
   - **TTL** : Laisse par défaut (ou 3600)
   - **Valeur** :
     ```
     p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJ5W3VN4fl4UyYtGkSkiuAms0TcJzgXHZuBRgr00xfcEbL+333GFIJ+JkjwUp3T9UuvBfy13J8qN5AwcmzMKRiLTD17hkRJUc1ok2v907F+yqgVOsOuWC1UckRvutll5YjFFJ7B8UcPJse/pYJ6cReWpU8xdAjznO+AwvpNDiU4QIDAQAB
     ```
4. Clique **Suivant** puis **Valider**

---

#### 📌 Enregistrement 2 : MX (Mail Exchange)

1. Clique sur **Ajouter une entrée**
2. Sélectionne **MX**
3. Remplis :
   - **Sous-domaine** : `send`
   - **TTL** : Laisse par défaut
   - **Priorité** : `10`
   - **Cible** : `feedback-smtp.eu-west-1.amazonses.com.` (**avec le point final**)
4. Clique **Suivant** puis **Valider**

---

#### 📌 Enregistrement 3 : SPF (TXT)

1. Clique sur **Ajouter une entrée**
2. Sélectionne **TXT**
3. Remplis :
   - **Sous-domaine** : `send`
   - **TTL** : Laisse par défaut
   - **Valeur** : `v=spf1 include:amazonses.com ~all`
4. Clique **Suivant** puis **Valider**

---

#### 📌 Enregistrement 4 : DMARC (TXT) - OPTIONNEL

1. Clique sur **Ajouter une entrée**
2. Sélectionne **TXT**
3. Remplis :
   - **Sous-domaine** : `_dmarc`
   - **TTL** : Laisse par défaut
   - **Valeur** : `v=DMARC1; p=none;`
4. Clique **Suivant** puis **Valider**

---

## ⏱️ Attendre la propagation

**Chez OVH, la propagation prend environ 1 à 4 heures.**

Tu verras un message comme :
> "La modification de votre zone DNS peut prendre jusqu'à 24 heures pour être prise en compte."

En réalité, c'est souvent bien plus rapide (1-2h).

---

## ✅ Vérifier que c'est configuré

### Méthode 1 : Sur Resend (LA MEILLEURE)

1. Attends 30 minutes à 2 heures
2. Va sur [resend.com/domains](https://resend.com/domains)
3. Clique sur `kamba-lhains.com`
4. Les enregistrements doivent afficher ✅ vert

### Méthode 2 : Par commande

Attends 1-2h puis tape :

```bash
# Vérifier DKIM
dig TXT resend._domainkey.kamba-lhains.com +short

# Vérifier MX
dig MX send.kamba-lhains.com +short

# Vérifier SPF
dig TXT send.kamba-lhains.com +short

# Vérifier DMARC
dig TXT _dmarc.kamba-lhains.com +short
```

**Résultat attendu** : Tu dois voir les valeurs que tu as ajoutées.

---

## 🧪 Test final

Une fois que Resend affiche ✅ pour tous les enregistrements :

### Test 1 : API

```bash
curl -X POST http://localhost:3002/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "TON_VRAI_EMAIL@gmail.com",
    "firstName": "Test Final",
    "source": "test-ovh-dns"
  }'
```

### Test 2 : Via le site

1. Va sur `http://localhost:3002`
2. Scroll au footer
3. Entre ton email
4. Clique "S'abonner"

**Résultat attendu** :
- ✅ Email reçu depuis `newsletter@kamba-lhains.com`
- ✅ Pas dans les spams
- ✅ Aucune erreur dans les logs serveur

---

## 📊 Récapitulatif des DNS ajoutés

| # | Type | Nom | Valeur | Priorité |
|---|------|-----|--------|----------|
| 1 | TXT | resend._domainkey | p=MIGfMA0GCS... | - |
| 2 | MX | send | feedback-smtp.eu-west-1.amazonses.com. | 10 |
| 3 | TXT | send | v=spf1 include:amazonses.com ~all | - |
| 4 | TXT | _dmarc | v=DMARC1; p=none; | - |

---

## 🚨 Problèmes courants

### "L'enregistrement existe déjà"
→ Supprime l'ancien enregistrement conflictuel puis rajoute le nouveau

### "Valeur trop longue" (pour DKIM)
→ OVH devrait accepter, sinon essaie de coller sans guillemets

### "Toujours pas vérifié après 24h"
→ Vérifie que tu n'as pas fait de typo dans les noms
→ Vérifie qu'il n'y a pas de conflit avec d'autres enregistrements

---

## 🎉 C'est tout !

Une fois les 4 DNS ajoutés dans OVH :
1. ⏳ Attends 1-4 heures
2. ✅ Vérifie sur Resend que tout est vert
3. 🧪 Teste l'envoi d'email
4. 🚀 Ton système newsletter est 100% pro !

---

**Besoin d'aide ?** Envoie-moi une capture d'écran de ta zone DNS OVH si tu bloques.
