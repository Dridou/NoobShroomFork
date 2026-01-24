# Système de Talents - Context Fonctionnel

## Vue d'Ensemble Jeu

Legend of Mushrooms possède un **système de talents arborescents** où les joueurs répartissent des points entre plusieurs branches de talents pour renforcer leur personnage. Chaque branche représente une classe de talents (Fury, Archery, Sorcery, Tame Beasts).

## Implémentation NoobShroom

### Objectif
NoobShroom permet aux joueurs de **créer, consulter et partager des builds de talents** optimisés avant de les implémenter dans le jeu.

### Branches de Talents (4 branches)
- **Fury** : Compétences de combat direct
- **Archery** : Attaques à distance
- **Sorcery** : Magie et effets
- **Tame Beasts** : Domptage de créatures

Chaque branche contient **30 nœuds** (10 nœuds × 3 parties d'une branche), avec un **nœud final spécialisé** par branche. Seuls 4 noeuds finaux spéciaux peuvent etre activés au maximum dans un build, toute branche confondue.



---

## Architecture Composants

### 1. **TalentBranch** (`src/components/talent/TalentBranch/`)
- Composant principal qui rend une branche entière
- Contient 3 sous-branches visibles (branch1, branch2, branch3)
- Affiche les connexions SVG entre les nœuds
- Props :
  - `branchName`: Nom de la branche ("Fury" | "Archery" | "Sorcery" | "Beast")
  - `nodes`: Array des définitions de nœuds (données)
  - `points`: Array des points assignés par le joueur
  - `readOnly`: Boolean (true en vue, false en création)
  - `onUpdatePoints`, `onResetBranch`, etc. (handlers en mode édition)

### 2. **TalentNode** (`src/components/talent/TalentNode/`)
- Cercle représentant un nœud de talent individuel
- Affiche le compteur `X/Y` (points actuels/max) **sous le cercle**
- Bouton `+` visible pour ajouter des points lorsque les plumes restantes suffisent.
- Est cliquable en mode création pour ajouter des points
- Est inactif (readOnly) en mode consultation

### 3. **TalentTree** (`src/components/talent/TalentTree/`)
- Ancienne version (moins utilisée)
- Historique, peut être déprécié

---

## Pages & Routes

### 1. **Création de Build** 
**Route :** `/builder/talents/create`
**Fichier :** `src/app/builder/talents/create/page.jsx`
**Composant :** `TalentBuilder`

**Fonctionnalités :**
- Mode édition complet
- Zoom/Pan avec `react-zoom-pan-pinch`
- Switch entre les 4 branches
- Ajout/retrait de points (drag ou boutons)
- Reset branche / Reset tout
- Partage (URL + copie)
- Enregistrement en base de données
- Affichage des stats (points utilisés, feathers dépensés)

**Layout :**
```
┌─────────────────────────────┐
│ Header (titre, save, share) │
├─────────────────────────────┤
│ Controls (feathers, reset)  │
├─────────────────────────────┤
│  Sidebar          │ Canvas  │
│ (tabs branches)   │ (talents│
│                   │ avec    │
│                   │ zoom)   │
└─────────────────────────────┘
```

### 2. **Navigation des Builds**
**Route :** `/builder/talents/browse`
**Fichier :** `src/app/builder/talents/browse/page.jsx`
**Composant :** `BrowseBuilds`

**Fonctionnalités :**
- Liste paginée des builds créés
- Filtrage par tags
- Tri (votes, date, points)
- Recherche par nom
- Affichage des likes/dislikes et rating
- Accès rapide à la vue détaillée

### 3. **Consultation Détaillée**
**Route :** `/builder/talents/view/[id]`
**Fichier :** `src/app/builder/talents/view/[id]/page.jsx`
**Composant :** `ViewBuild`

**Fonctionnalités :**
- Affichage du build en mode consultation (readOnly)
- Zoom/Pan interactif (même expérience que création)
- **Contrôles mobiles dans le conteneur :**
  - Boutons d'incrément : `+1`, `+5`, `+10` (top-left) - sélection exclusive
  - Onglets de branches : Fury, Archery, Sorcery, Tame Beasts (top-center)
- Infos du build : créateur, date, tags
- Stats : points totaux par branche, nœuds actifs, moyenne points/nœud
- Vote communautaire (likes/dislikes)
- Rating bar visuelle

**Layout Mobile-First :**
```
┌─────────────────────────────┐
│ +1 +5 +10 │ Fury Archery... │
├─────────────────────────────┤
│                             │
│  Conteneur Talents          │
│  (zoom/pan - 1350×1000)     │
│                             │
│  Texte Points X/Y           │
│  sous les cercles           │
└─────────────────────────────┘
```

---

## Data & Points

### Structure de Points
```
branchPoints = {
  Fury: [0, 5, 0, 20, ...],      // Array 30 éléments
  Archery: [0, 0, 10, 15, ...],
  Sorcery: [5, 5, 5, ...],
  Beast: [0, 0, 0, ...]
}
```

### Configuration Persistée (DB)
Stockée en format compacte `config` :
```javascript
{
  fury: {
    branch1: { nodes: { "0": 5, "2": 20 }, finalTalentActive: false },
    branch2: { nodes: { "1": 10 }, finalTalentActive: false },
    branch3: { nodes: { "2": 15 }, finalTalentActive: true }
  },
  archery: { ... },
  sorcery: { ... },
  tameBeasts: { ... }
}
```

---

## Interactions Utilisateur

### Mode Création (`/builder/talents/create`)
1. Sélectionner une branche (Fury, Archery, etc.)
2. Cliquer sur un nœud ou son bouton `+` pour ajouter des points
3. Zoomer/Panner pour naviguer l'arbre
4. Reset branche ou tout réinitialiser
5. Sauvegarder le build

### Mode Consultation (`/builder/talents/view/[id]`)
1. Voir le build d'un autre joueur en readOnly
2. Zoomer/Panner pour explorer l'arbre
3. Changer de branche via onglets (top-center)
4. Voter (like/dislike) pour noter le build
5. Copier la config URL pour partage

---

## Styling & Design

### Couleurs des Nœuds
- **Variables CSS :** `--talentYellow`, `--talentRed` (legacy)
- **Nœuds actifs :** Couleur saturée (filter: grayscale(0%))
- **Nœuds inactifs :** Gris désaturé (filter: grayscale(80%))

### Texte des Points
- **Format :** `X/Y` (ex: `20/40`)
- **Position :** Centré horizontalement, **en dessous du cercle** (~60% de hauteur)
- **Style :** Blanc, bold (weight: 700), font-size 14px, text-shadow pour contraste

### Contrôles Mobiles
- **+1, +5, +10 :** Position fixe top-left du conteneur (z-index: 100)
- **Onglets branches :** Position fixe top-center du conteneur (z-index: 100)
- **Bouttons actifs :** Background bleu accent (`--color-accent-primary`)
- **Zoom/Pan :** react-zoom-pan-pinch avec margin-top pour éviter les contrôles

---

## État Global & Hooks

### ViewBuild
```javascript
const [build, setBuild] = useState(null);           // Données build
const [selectedTab, setSelectedTab] = useState("Fury");  // Branche active
const [incrementValue, setIncrementValue] = useState(1); // +1, +5 ou +10
const [branchPoints, setBranchPoints] = useState({...}); // Points assignés
const treeWrapperRef = useRef(null);                // Ref zoom/pan
```

### TalentBuilder
État similaire + handlers pour édition (updatePoints, resetBranch, etc.)

---

## APIs

### GET `/api/builder/talents/[id]`
Récupère un build par ID
```json
{
  "id": "9jzkwTbt",
  "name": "Fury DPS Build",
  "creatorName": "Player123",
  "config": { ... },
  "likes": 15,
  "dislikes": 2,
  "tags": ["dps", "fury"],
  "createdAt": "2026-01-24T..."
}
```

### GET `/api/builder/talents/browse`
Liste tous les builds avec filters
- Query params: `search`, `tags`, `sort`, `limit`, `page`

### POST `/api/builder/talents`
Crée un nouveau build

### POST `/api/builder/talents/[id]/vote`
Enregistre un like/dislike

---

## TODO & Améliorations Futures
- [ ] Intégration avec calculateur de stats (dégâts, défense, etc.)
- [ ] Export en format JSON
- [ ] Historique des builds
- [ ] Partage direct sur réseaux sociaux
- [ ] Mode "comparer deux builds"
