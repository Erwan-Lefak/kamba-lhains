# Structure du Projet Kamba Lhains

## Organisation des fichiers

### 📁 Dossiers principaux

```
kamba-lhains/
├── components/          # Composants React réutilisables
├── pages/              # Pages Next.js
├── styles/             # Fichiers CSS/modules
├── public/             # Assets statiques
├── lib/                # Utilitaires et configurations
├── hooks/              # Hooks React personnalisés
├── contexts/           # Contexts React
├── services/           # Services API
├── types/              # Types TypeScript
├── data/               # Données statiques
├── utils/              # Fonctions utilitaires
├── __tests__/          # Tests
└── docs/               # Documentation et captures
```

### 🖼️ Organisation des images

```
public/
├── images/
│   ├── collection/     # Images des collections (IMG_*.jpg)
│   ├── products/       # Images des produits (*.png)
│   └── ui/            # Éléments d'interface (logo, icônes)
├── 0629.mp4           # Vidéos
└── ACCUEIL.mp4
```

### 📋 Documentation

```
docs/
├── PROJECT_STRUCTURE.md  # Ce fichier
├── boutique.png          # Captures d'écran
├── pageproduit.png
└── ...                   # Autres captures
```

## Bonnes pratiques

1. **Images de collection** : Utiliser `/images/collection/` 
2. **Images de produits** : Utiliser `/images/products/`
3. **Éléments UI** : Utiliser `/images/ui/`
4. **Documentation** : Ajouter dans `/docs/`

## Chemins d'import

```jsx
// Images de collection
<Image src="/images/collection/IMG_2758.jpg" />

// Images de produits  
<Image src="/images/products/blazer-amara.png" />

// Éléments UI
<Image src="/images/ui/logo.png" />
```