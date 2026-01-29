# 🚀 Newsletter - Guide de démarrage rapide

## ⏱️ Configuration en 5 minutes

### 1️⃣ Créer le Google Sheet (2 min)

1. Va sur [Google Sheets](https://docs.google.com/spreadsheets/)
2. Nouveau → "Kamba Lhains - Newsletter"
3. Renomme l'onglet en **"Newsletter"**
4. Première ligne (A1→G1) :

```
Email | Prénom | Date d'inscription | Statut | Centres d'intérêt | Fréquence | Source
```

5. **Partager** → `kamba-sheets-writer@kamba-lhains-api.iam.gserviceaccount.com`
6. Droits : **Éditeur** ✓
7. Décoche "Avertir" ✓

### 2️⃣ Ajouter l'ID dans .env.local (1 min)

Récupère l'ID depuis l'URL du sheet :
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                      ^^^^^^^^^^^
```

Dans `.env.local` :
```bash
GOOGLE_SHEETS_NEWSLETTER_ID=1ABC...XYZ
```

### 3️⃣ Vérifier Resend (1 min)

Dans `.env.local`, vérifie que tu as :
```bash
RESEND_API_KEY=re_...
```

Si non, crée une clé sur [resend.com](https://resend.com) (gratuit).

### 4️⃣ Redémarrer & Tester (1 min)

```bash
# Redémarre le serveur
# Ctrl+C puis :
PORT=3002 npm run dev
```

Teste sur http://localhost:3002 :
1. Scroll au footer
2. Entre ton email
3. Clique "S'abonner"

✅ **Ça marche si :**
- Message de succès affiché
- Nouvelle ligne dans Google Sheet
- Email de bienvenue reçu

---

## 🧪 Script de test automatique

```bash
./test-newsletter.sh
```

---

## 📚 Documentation complète

- **NEWSLETTER_README.md** → Vue d'ensemble complète
- **NEWSLETTER_SETUP.md** → Guide détaillé pas-à-pas

---

## ❓ Problème ?

**Email non reçu ?**
→ Vérifie spam/promotions
→ Vérifie `RESEND_API_KEY` dans `.env.local`

**Erreur "GOOGLE_SHEETS_NEWSLETTER_ID non défini" ?**
→ Ajoute la variable dans `.env.local`
→ Redémarre le serveur

**"Permission denied" Google Sheets ?**
→ Vérifie que le service account a les droits "Éditeur"

---

## ✨ C'est tout !

Tu as maintenant une newsletter **professionnelle et gratuite** ! 🎉

**Points clés :**
- ✅ Inscription footer + page dédiée
- ✅ Email de bienvenue automatique
- ✅ Stockage Google Sheets (facile à exporter)
- ✅ Vérification des doublons
- ✅ 100% gratuit jusqu'à 3000 emails/mois

**Prochaine étape :** Envoyer ta première campagne newsletter ! 📬
