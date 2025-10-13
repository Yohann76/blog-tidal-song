# Page d'Article - Guide d'utilisation

## Vue d'ensemble

La page d'article (`article.html`) est conçue pour afficher le contenu complet d'un article de blog. Elle est entièrement modulaire et s'adapte automatiquement au contenu.

## Structure des fichiers

```
chant-des-marées/
├── article.html              # Page d'article individuel
├── css/
│   └── article.css          # Styles spécifiques à la page article
├── js/
│   └── article.js           # Logique de la page article
└── ARTICLE_USAGE.md         # Cette documentation
```

## Utilisation

### Accès à un article
Pour afficher un article spécifique, utilisez l'URL suivante :
```
article.html?id=1
```
Où `1` est l'ID de l'article souhaité.

### Navigation depuis le blog
Les liens dans le blog pointent automatiquement vers la page d'article :
- Clic sur "Lire la suite" → `article.html?id=X`
- Clic sur un article récent → `article.html?id=X`
- Clic sur un tag → `blog.html?tag=X` (filtre le blog)

## Fonctionnalités

### 1. Affichage de l'article
- **Titre** : Affiché dans le hero et dans l'onglet du navigateur
- **Extrait** : Description courte sous le titre
- **Métadonnées** : Catégorie, date, temps de lecture, auteur
- **Image** : Image principale de l'article
- **Contenu** : Texte complet avec formatage HTML

### 2. Navigation
- **Breadcrumb** : Accueil > Blog > Catégorie
- **Navigation entre articles** : Précédent/Suivant
- **Retour au blog** : Lien vers la liste des articles

### 3. Sidebar
- **Table des matières** : Générée automatiquement à partir des titres H2, H3, H4
- **Articles similaires** : Articles de la même catégorie
- **Newsletter** : Formulaire d'inscription

### 4. Actions
- **Partage** : Boutons pour partager sur les réseaux sociaux
- **Sauvegarde** : Bouton pour marquer comme favori
- **Impression** : Bouton pour imprimer l'article

### 5. Partage social
- Facebook
- Twitter
- LinkedIn
- WhatsApp

## Structure du contenu

### Format HTML
Le contenu de l'article doit être au format HTML avec les balises suivantes :

```html
<h2>Titre de section</h2>
<p>Paragraphe de texte</p>

<h3>Sous-section</h3>
<ul>
    <li>Liste à puces</li>
    <li>Élément de liste</li>
</ul>

<blockquote>
    Citation ou encadré important
</blockquote>

<code>Code inline</code>

<pre>
<code>
Bloc de code
</code>
</pre>
```

### Table des matières
La table des matières est générée automatiquement à partir des titres :
- H2 : Niveau principal
- H3 : Niveau secondaire (avec indentation)
- H4 : Niveau tertiaire (avec indentation)

## Personnalisation

### Ajouter un nouvel article
1. Modifier le tableau `articles` dans `js/article.js`
2. Ajouter un objet article avec :
   ```javascript
   {
       "id": 13,
       "title": "Titre de l'article",
       "excerpt": "Résumé court",
       "content": "<h2>Introduction</h2><p>Contenu HTML...</p>",
       "author": "Nom de l'auteur",
       "date": "2024-01-20",
       "category": "technique",
       "tags": ["tag1", "tag2"],
       "image": "image.jpg",
       "readTime": "10 min",
       "featured": false
   }
   ```

### Modifier les styles
Les styles sont dans `css/article.css` :
- Variables CSS pour les couleurs
- Classes utilitaires
- Responsive design

### Personnaliser les catégories
Modifier la fonction `getCategoryInfo()` dans `js/article.js` :
```javascript
const categories = {
    'nouvelle-categorie': { 
        name: 'Nouvelle Catégorie', 
        icon: 'fas fa-icon' 
    }
};
```

## Responsive Design

### Breakpoints
- **Mobile** : < 480px
- **Tablet** : 480px - 768px
- **Desktop** : 768px - 1024px
- **Large** : > 1024px

### Adaptations
- Sidebar qui devient collapsible sur mobile
- Navigation entre articles en colonne sur mobile
- Table des matières simplifiée sur petit écran
- Boutons de partage en colonne sur mobile

## Performance

### Optimisations
- Chargement asynchrone des articles
- Intersection Observer pour la table des matières
- Lazy loading des images
- CSS optimisé

### Bonnes pratiques
- Contenu HTML valide
- Images optimisées
- Texte lisible (contraste suffisant)
- Navigation intuitive

## SEO

### Métadonnées
- Titre de page dynamique
- Meta description mise à jour
- Structure HTML sémantique
- Breadcrumbs pour la navigation

### Accessibilité
- Navigation au clavier
- Contraste de couleurs
- Textes alternatifs
- Structure logique

## Dépannage

### Problèmes courants
1. **Article non trouvé** : Vérifier l'ID dans l'URL
2. **Contenu non affiché** : Vérifier le format HTML du contenu
3. **Table des matières vide** : Vérifier la présence de titres H2, H3, H4
4. **Navigation cassée** : Vérifier les IDs des articles

### Debug
- Ouvrir la console du navigateur
- Vérifier les erreurs JavaScript
- Tester avec différents IDs d'articles

## Extensions possibles

1. **Système de commentaires**
2. **Recommandations personnalisées**
3. **Mode lecture (sans sidebar)**
4. **Export PDF**
5. **Lecture audio**
6. **Mode sombre**
7. **Système de notation**
8. **Historique de lecture**
