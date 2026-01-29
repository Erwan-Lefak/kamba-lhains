# 🛠️ Guide d'utilisation - Mode Maintenance / Coming Soon

Ce guide explique comment activer et désactiver l'écran d'annonce "PRINTEMPS" sur votre site.

## 📋 Vue d'ensemble

L'écran d'annonce affiche :
- ✅ La vidéo Halloween (`/public/ACCUEIL.mp4`) en arrière-plan
- ✅ Le texte "NOW AVAILABLE AT 7EME CIEL"
- ✅ Le titre "PRINTEMPS" en vert
- ✅ Le sous-titre "AUB Collection / Season SS-2025"
- ✅ Un overlay plein écran qui cache complètement le site

## 🎯 Activation / Désactivation

### Option 1 : En local (développement)

#### Activer l'écran

```bash
# Éditez le fichier .env.local
nano .env.local

# Changez la valeur à true
NEXT_PUBLIC_MAINTENANCE_MODE=true

# Redémarrez le serveur
npm run dev
```

#### Désactiver l'écran

```bash
# Éditez le fichier .env.local
nano .env.local

# Changez la valeur à false
NEXT_PUBLIC_MAINTENANCE_MODE=false

# Redémarrez le serveur
npm run dev
```

### Option 2 : Sur Vercel (production)

#### Activer l'écran

1. Allez sur **Vercel Dashboard** : https://vercel.com/dashboard
2. Sélectionnez votre projet **kamba-lhains**
3. **Settings** → **Environment Variables**
4. Cherchez `NEXT_PUBLIC_MAINTENANCE_MODE`
5. Si elle n'existe pas :
   - Cliquez sur **Add Variable**
   - Name: `NEXT_PUBLIC_MAINTENANCE_MODE`
   - Value: `true`
   - Environnements : Cochez **Production**, **Preview**, **Development**
   - Cliquez sur **Save**
6. Si elle existe déjà :
   - Cliquez sur **Edit**
   - Changez la valeur à `true`
   - Cliquez sur **Save**
7. **Redéployez** le site (Vercel le fera automatiquement ou cliquez sur "Redeploy")

#### Désactiver l'écran

1-6. Suivez les mêmes étapes mais mettez la valeur à `false`
7. Redéployez

**⏱️ Temps de propagation** : 30 secondes à 2 minutes après le redéploiement

## 🎨 Personnalisation

### Changer le texte

Éditez le fichier : `components/MaintenanceOverlay.tsx`

```tsx
<div className={styles.topText}>
  <p className={styles.nowAvailable}>NOW AVAILABLE</p>
  <p className={styles.at}>AT 7EME CIEL</p>
</div>

<h1 className={styles.mainTitle}>PRINTEMPS</h1>

<p className={styles.subtitle}>AUB Collection / Season SS-2025</p>
```

### Changer la vidéo

Remplacez la vidéo dans : `components/MaintenanceOverlay.tsx`

```tsx
<source src="/ACCUEIL.mp4" type="video/mp4" />
```

Changez `ACCUEIL.mp4` par le nom de votre nouvelle vidéo (qui doit être dans `/public/`)

### Changer les couleurs

Éditez le fichier : `styles/MaintenanceOverlay.module.css`

```css
/* Couleur du titre PRINTEMPS */
.mainTitle {
  color: #00ff88;  /* Vert actuel */
}

/* Couleur des autres textes */
.nowAvailable,
.at,
.subtitle {
  color: #ffffff;  /* Blanc actuel */
}

/* Opacité de l'overlay sombre */
.darkOverlay {
  background: rgba(0, 0, 0, 0.3);  /* 30% de noir */
}
```

### Ajuster la police

La police utilisée est **Manrope** (déjà chargée dans votre site).

Pour changer la taille :

```css
.mainTitle {
  font-size: clamp(60px, 10vw, 120px);  /* Min 60px, Max 120px */
}
```

## 🔍 Vérification

### Tester en local

```bash
# Activez le mode maintenance
echo "NEXT_PUBLIC_MAINTENANCE_MODE=true" >> .env.local

# Démarrez le serveur
npm run dev

# Ouvrez http://localhost:3000
# Vous devriez voir l'écran d'annonce
```

### Tester en production

1. Activez la variable sur Vercel
2. Attendez le redéploiement
3. Visitez votre site : https://kamba-lhains.com
4. L'écran d'annonce devrait être visible

## 📱 Responsive

L'écran s'adapte automatiquement à tous les écrans :

- **Mobile** (< 768px) : Texte plus petit, padding réduit
- **Tablette** (769-1024px) : Taille intermédiaire
- **Desktop** (> 1024px) : Pleine taille

## 🚨 Dépannage

### L'écran ne s'affiche pas

1. Vérifiez que la variable est bien à `true`
```bash
# En local
cat .env.local | grep MAINTENANCE_MODE

# Sur Vercel
# Allez dans Settings → Environment Variables
```

2. Vérifiez que le serveur a été redémarré (local) ou redéployé (Vercel)

3. Vérifiez la console du navigateur (F12) pour les erreurs

### La vidéo ne se charge pas

1. Vérifiez que le fichier `ACCUEIL.mp4` existe dans `/public/`
```bash
ls -lh public/ACCUEIL.mp4
```

2. Vérifiez la taille de la vidéo (< 50MB recommandé)

3. Essayez en navigation privée (pour éviter le cache)

### Le texte n'est pas visible

1. Vérifiez l'opacité de l'overlay sombre dans le CSS
2. Augmentez le contraste en modifiant `darkOverlay`

## 📊 Impact sur les performances

- **Taille ajoutée** : ~5KB (composant + CSS)
- **Impact vidéo** : Identique à votre page d'accueil (même vidéo)
- **Z-index** : 9999 (au-dessus de tout)
- **Build time** : Aucun impact

## 🔐 Sécurité

Le site reste accessible en arrière-plan (dans le DOM), mais invisible à l'utilisateur.

Si vous souhaitez bloquer complètement l'accès, utilisez plutôt un middleware Next.js (solution plus complexe).

## 📝 Notes techniques

### Fichiers modifiés

- ✅ `pages/_app.tsx` - Ajout de la condition d'affichage
- ✅ `.env.local` - Ajout de la variable MAINTENANCE_MODE

### Fichiers créés

- ✅ `components/MaintenanceOverlay.tsx` - Composant overlay
- ✅ `styles/MaintenanceOverlay.module.css` - Styles
- ✅ `.env.local.example` - Exemple de configuration

### Comment ça marche ?

1. Le fichier `_app.tsx` lit la variable d'environnement
2. Si `NEXT_PUBLIC_MAINTENANCE_MODE=true`, il affiche `<MaintenanceOverlay />`
3. L'overlay a un z-index de 9999 et couvre tout l'écran
4. Le site reste en dessous, mais invisible

## 🎓 Commandes utiles

```bash
# Activer rapidement
echo "NEXT_PUBLIC_MAINTENANCE_MODE=true" >> .env.local && npm run dev

# Désactiver rapidement
sed -i 's/NEXT_PUBLIC_MAINTENANCE_MODE=true/NEXT_PUBLIC_MAINTENANCE_MODE=false/g' .env.local && npm run dev

# Vérifier la valeur actuelle
grep MAINTENANCE_MODE .env.local
```

## 💡 Cas d'usage

### Lancement de nouvelle collection

```bash
# 1. Préparez votre nouvelle collection
# 2. Activez le mode maintenance
NEXT_PUBLIC_MAINTENANCE_MODE=true

# 3. Personnalisez le texte dans MaintenanceOverlay.tsx
# 4. Déployez sur Vercel
# 5. À l'heure du lancement, désactivez le mode
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### Maintenance du site

```bash
# Activez immédiatement sur Vercel
# Settings → Environment Variables → MAINTENANCE_MODE = true
# Faites vos modifications
# Désactivez quand terminé
```

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez ce guide
2. Consultez les logs Vercel : https://vercel.com/dashboard
3. Vérifiez la console navigateur (F12)

---

**Créé le** : 13 novembre 2025
**Version** : 1.0.0
