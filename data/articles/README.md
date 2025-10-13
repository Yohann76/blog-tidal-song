# Système d'Articles - Chant des Marées

Ce dossier contient tous les articles du blog sous forme de fichiers Markdown individuels.

## Structure des Fichiers

Chaque article est un fichier Markdown avec :
- **Nom de fichier** : `XXX-titre-article.md`
  - `XXX` : ID numérique sur 3 chiffres (001, 002, etc.)
  - `titre-article` : Titre en minuscules avec tirets
  - Extension : `.md` pour Markdown uniquement

## Format des Articles

### Front Matter (Métadonnées)

Chaque article commence par un bloc de métadonnées entre `---` :

```yaml
---
title: "Titre de l'article"
excerpt: "Description courte de l'article"
author: "Nom de l'auteur"
date: "2024-01-15"
category: "technique"
tags: ["bar", "technique", "lancer"]
image: "nom-image.jpg"
readTime: "8 min"
featured: true
---
```

### Champs Obligatoires

- `title` : Titre de l'article
- `excerpt` : Description courte (affichée dans les listes)
- `author` : Nom de l'auteur
- `date` : Date au format YYYY-MM-DD
- `category` : Catégorie (voir liste ci-dessous)
- `tags` : Liste de mots-clés

### Champs Optionnels

- `image` : Nom du fichier image
- `readTime` : Temps de lecture estimé
- `featured` : Article mis en avant (true/false)

## Catégories Disponibles

- `technique` : Techniques de pêche
- `equipement` : Matériel et équipement
- `conseils` : Conseils et astuces
- `recits` : Récits et expériences
- `actualites` : Actualités
- `general` : Général

## Format Supporté

### Markdown (.md)
- Syntaxe Markdown standard
- Conversion automatique en HTML
- Simple et efficace pour le contenu textuel
- Support des listes, tableaux, citations, etc.

## Création d'un Nouvel Article

### Méthode 1 : Template Automatique

1. Ouvrez la console du navigateur sur le site
2. Exécutez :
```javascript
const generator = new ArticleGenerator();
console.log(generator.createNewArticle()); // Génère un template Markdown
```

### Méthode 2 : Copier un Article Existant

1. Copiez un fichier existant
2. Renommez-le avec le prochain ID
3. Modifiez le contenu et les métadonnées

### Méthode 3 : Création Manuelle

1. Créez un nouveau fichier avec le format `XXX-titre.md`
2. Ajoutez le front matter avec les métadonnées
3. Écrivez votre contenu en Markdown

## Exemple d'Article

```markdown
---
title: "Mon Premier Article"
excerpt: "Description de mon article"
author: "Mon Nom"
date: "2024-01-15"
category: "conseils"
tags: ["débutant", "conseils"]
readTime: "5 min"
featured: false
---

# Mon Premier Article

## Introduction

Voici mon premier article...

## Contenu

Le contenu de mon article...

### Sous-section

Détails de la sous-section...

## Conclusion

Merci de m'avoir lu !
```

## Conseils

1. **ID unique** : Utilisez des IDs séquentiels (001, 002, 003...)
2. **Titres courts** : Gardez les titres de fichiers courts et clairs
3. **Métadonnées** : Remplissez toujours les champs obligatoires
4. **Tags** : Utilisez des tags pertinents et cohérents
5. **Images** : Placez les images dans le dossier `images/`
6. **Test** : Vérifiez que l'article s'affiche correctement sur le site

## Maintenance

- Les articles sont automatiquement chargés au démarrage du site
- Pas besoin de redémarrer le serveur pour ajouter des articles
- Les modifications sont prises en compte immédiatement
