/* ========================================
   CHANT DES MARÉES - URL MANAGER

   This manager url is used to manage the url of the blog ?????

   
   ======================================== */

class URLManager {
    constructor() {
        this.articleSlugs = {
            1: 'les-secrets-de-la-peche-au-bar',
            2: 'guide-complet-materiel-peche',
            3: 'peche-ete-meilleurs-moments',
            4: 'ma-premiere-sortie-en-mer',
            5: 'nouvelles-reglementations-2024',
            6: 'techniques-peche-surf-casting',
            7: 'choisir-leurres-peche-mer',
            8: 'peche-nuit-conseils-securite',
            9: 'poissons-mer-plus-courants',
            10: 'mon-record-personnel-bar-8kg',
            11: 'entretien-stockage-materiel',
            12: 'peche-hiver-defis-opportunites'
        };
        
        this.categorySlugs = {
            'technique': 'techniques',
            'equipement': 'equipement',
            'conseils': 'conseils',
            'recits': 'recits',
            'actualites': 'actualites'
        };
    }

    // Générer un slug à partir d'un titre
    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
            .replace(/\s+/g, '-') // Remplacer espaces par tirets
            .replace(/-+/g, '-') // Remplacer tirets multiples par un seul
            .trim('-'); // Supprimer tirets en début/fin
    }

    // Obtenir l'URL d'un article
    getArticleURL(articleId, title = null) {
        if (this.articleSlugs[articleId]) {
            return `/article/${this.articleSlugs[articleId]}`;
        }
        
        if (title) {
            const slug = this.generateSlug(title);
            return `/article/${slug}`;
        }
        
        return `/article.html?id=${articleId}`;
    }

    // Obtenir l'URL d'une catégorie
    getCategoryURL(categoryId) {
        if (this.categorySlugs[categoryId]) {
            return `/blog/${this.categorySlugs[categoryId]}`;
        }
        return `/blog.html?category=${categoryId}`;
    }

    // Obtenir l'ID d'un article à partir de l'URL
    getArticleIdFromURL() {
        const path = window.location.pathname;
        
        // Si c'est une URL avec paramètre
        if (path.includes('article.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            return parseInt(urlParams.get('id')) || 1;
        }
        
        // Si c'est une URL propre
        if (path.startsWith('/article/')) {
            const slug = path.split('/').pop();
            return this.getArticleIdBySlug(slug);
        }
        
        return 1; // Par défaut
    }

    // Obtenir l'ID d'un article à partir de son slug
    getArticleIdBySlug(slug) {
        for (const [id, articleSlug] of Object.entries(this.articleSlugs)) {
            if (articleSlug === slug) {
                return parseInt(id);
            }
        }
        return 1; // Par défaut
    }

    // Obtenir la catégorie à partir de l'URL
    getCategoryFromURL() {
        const path = window.location.pathname;
        
        // Si c'est une URL avec paramètre
        if (path.includes('blog.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('category') || 'all';
        }
        
        // Si c'est une URL propre
        if (path.startsWith('/blog/')) {
            const slug = path.split('/').pop();
            return this.getCategoryIdBySlug(slug);
        }
        
        return 'all';
    }

    // Obtenir l'ID d'une catégorie à partir de son slug
    getCategoryIdBySlug(slug) {
        for (const [id, categorySlug] of Object.entries(this.categorySlugs)) {
            if (categorySlug === slug) {
                return id;
            }
        }
        return 'all';
    }

    // Mettre à jour l'URL sans recharger la page
    updateURL(url, title = null) {
        if (history.pushState) {
            history.pushState(null, '', url);
            if (title) {
                document.title = title;
            }
        }
    }

    // Rediriger vers une URL
    redirectTo(url) {
        window.location.href = url;
    }

    // Obtenir l'URL complète
    getFullURL(path) {
        return window.location.origin + path;
    }

    // Partager une URL
    shareURL(platform, articleId, title) {
        const url = this.getFullURL(this.getArticleURL(articleId, title));
        const encodedTitle = encodeURIComponent(title);
        const encodedURL = encodeURIComponent(url);
        
        let shareURL = '';
        
        switch (platform) {
            case 'facebook':
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
                break;
            case 'twitter':
                shareURL = `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`;
                break;
            case 'linkedin':
                shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`;
                break;
            case 'whatsapp':
                shareURL = `https://wa.me/?text=${encodedTitle} ${encodedURL}`;
                break;
        }
        
        if (shareURL) {
            window.open(shareURL, '_blank', 'width=600,height=400');
        }
    }
}

// Exporter pour utilisation globale
window.URLManager = URLManager;
