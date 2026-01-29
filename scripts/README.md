# Scripts d'optimisation

## Optimiser les images

Ce script compresse automatiquement toutes les images dans `/public/images` :

### Installation
```bash
cd scripts
npm install
```

### Utilisation
```bash
cd scripts
npm run optimize-images
```

### Ce que fait le script :
- ✅ Compresse les images JPG/PNG (qualité 80%)
- ✅ Redimensionne les images trop grandes (max 1920px)
- ✅ Crée des versions WebP pour chaque image
- ✅ Sauvegarde les originaux avec l'extension `.backup`
- ✅ Ignore les images déjà optimisées (< 200KB)

### Résultats attendus :
- Réduction de 50-70% de la taille des images
- Amélioration significative des temps de chargement
- Meilleur score Lighthouse

### Après optimisation :
Les images WebP seront automatiquement servies par Next.js aux navigateurs compatibles.
