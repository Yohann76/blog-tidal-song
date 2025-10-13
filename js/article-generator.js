/**
 * Article Generator - Outil pour créer et gérer les articles
 */
class ArticleGenerator {
    constructor() {
        this.articleLoader = new ArticleLoader();
        this.categories = [
            { id: 'technique', name: 'Techniques', icon: 'fas fa-fishing-rod' },
            { id: 'equipement', name: 'Équipement', icon: 'fas fa-tools' },
            { id: 'conseils', name: 'Conseils', icon: 'fas fa-lightbulb' },
            { id: 'recits', name: 'Récits', icon: 'fas fa-book-open' },
            { id: 'actualites', name: 'Actualités', icon: 'fas fa-newspaper' },
            { id: 'general', name: 'Général', icon: 'fas fa-tag' }
        ];
    }

    /**
     * Génère un template d'article Markdown
     */
    generateTemplate(articleData) {
        const {
            id = this.getNextId(),
            title = 'Nouvel Article',
            excerpt = 'Description de l\'article...',
            author = 'Votre Nom',
            date = new Date().toISOString().split('T')[0],
            category = 'general',
            tags = ['exemple'],
            image = null,
            readTime = '5 min',
            featured = false
        } = articleData;

        const frontMatter = `---
title: "${title}"
excerpt: "${excerpt}"
author: "${author}"
date: "${date}"
category: "${category}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
${image ? `image: "${image}"` : ''}
readTime: "${readTime}"
featured: ${featured}
---

# ${title}

## Introduction

Votre introduction ici...

## Contenu Principal

Votre contenu principal ici...

### Sous-section

Détails de la sous-section...

## Conclusion

Votre conclusion ici...
`;

        return frontMatter;
    }

    /**
     * Obtient le prochain ID disponible
     */
    getNextId() {
        // Cette fonction devrait être appelée après avoir chargé les articles
        // Pour l'instant, on retourne un ID basé sur la date
        return Math.floor(Date.now() / 1000) % 10000;
    }

    /**
     * Valide les métadonnées d'un article
     */
    validateArticle(articleData) {
        const errors = [];
        
        if (!articleData.title || articleData.title.trim() === '') {
            errors.push('Le titre est requis');
        }
        
        if (!articleData.excerpt || articleData.excerpt.trim() === '') {
            errors.push('L\'extrait est requis');
        }
        
        if (!articleData.author || articleData.author.trim() === '') {
            errors.push('L\'auteur est requis');
        }
        
        if (!articleData.date || !this.isValidDate(articleData.date)) {
            errors.push('La date doit être au format YYYY-MM-DD');
        }
        
        if (!articleData.category || !this.categories.find(cat => cat.id === articleData.category)) {
            errors.push('La catégorie doit être valide');
        }
        
        if (!articleData.tags || !Array.isArray(articleData.tags) || articleData.tags.length === 0) {
            errors.push('Au moins un tag est requis');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Valide une date au format YYYY-MM-DD
     */
    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Calcule le temps de lecture estimé
     */
    calculateReadTime(content) {
        // Estimation : 200 mots par minute
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    }

    /**
     * Génère un nom de fichier à partir du titre
     */
    generateFilename(title) {
        const id = this.getNextId();
        const slug = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
            .replace(/\s+/g, '-') // Remplacer espaces par tirets
            .replace(/-+/g, '-') // Supprimer tirets multiples
            .trim();
        
        return `${id.toString().padStart(3, '0')}-${slug}.md`;
    }

    /**
     * Obtient les catégories disponibles
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Obtient les tags les plus utilisés
     */
    getPopularTags() {
        // Cette fonction devrait analyser les articles existants
        // Pour l'instant, on retourne des tags populaires
        return [
            'technique', 'débutant', 'matériel', 'conseils', 'bar', 'daurade',
            'surf-casting', 'lancer', 'leurres', 'appâts', 'marée', 'sécurité'
        ];
    }

    /**
     * Crée un nouvel article avec les métadonnées par défaut
     */
    createNewArticle() {
        const defaultData = {
            title: 'Nouvel Article',
            excerpt: 'Description de l\'article...',
            author: 'Votre Nom',
            date: new Date().toISOString().split('T')[0],
            category: 'general',
            tags: ['exemple'],
            readTime: '5 min',
            featured: false
        };

        return this.generateTemplate(defaultData);
    }
}

// Export pour utilisation dans d'autres modules
window.ArticleGenerator = ArticleGenerator;
