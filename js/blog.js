/* ========================================
   CHANT DES MARÉES - BLOG FUNCTIONALITY
   ======================================== */

class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.currentCategory = 'all';
        this.currentSort = 'date-desc';
        this.searchTerm = '';
        
        this.init();
    }

    async init() {
        try {
            await this.loadArticles();
            this.setupEventListeners();
            this.renderArticles();
            this.renderSidebar();
            this.updateResultsCount();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du blog:', error);
            this.showError('Erreur lors du chargement des articles');
        }
    }

    async loadArticles() {
        try {
            // Données intégrées directement pour éviter les problèmes CORS
            const data = {
                "articles": [
                    {
                        "id": 1,
                        "title": "Les Secrets de la Pêche au Bar",
                        "excerpt": "Découvrez les techniques éprouvées pour capturer le bar en toute saison, du choix du matériel aux meilleurs spots de pêche.",
                        "content": "Le bar est l'un des poissons les plus recherchés par les pêcheurs en mer...",
                        "author": "Marc Dubois",
                        "date": "2024-01-15",
                        "category": "technique",
                        "tags": ["bar", "technique", "lancer", "carnassier"],
                        "image": "bar-fishing.jpg",
                        "readTime": "8 min",
                        "featured": true
                    },
                    {
                        "id": 2,
                        "title": "Guide Complet du Matériel de Pêche",
                        "excerpt": "Tout ce qu'il faut savoir pour choisir son équipement de pêche en mer selon votre budget et vos objectifs.",
                        "content": "Choisir le bon matériel de pêche est essentiel pour réussir vos sorties...",
                        "author": "Sophie Martin",
                        "date": "2024-01-12",
                        "category": "equipement",
                        "tags": ["matériel", "canne", "moulinet", "débutant"],
                        "image": "fishing-gear.jpg",
                        "readTime": "12 min",
                        "featured": false
                    },
                    {
                        "id": 3,
                        "title": "Pêche d'Été : Les Meilleurs Moments",
                        "excerpt": "Optimisez vos sorties de pêche estivales en connaissant les meilleures heures et conditions météo.",
                        "content": "L'été est une saison privilégiée pour la pêche en mer...",
                        "author": "Pierre Leroy",
                        "date": "2024-01-10",
                        "category": "conseils",
                        "tags": ["été", "météo", "timing", "conseils"],
                        "image": "summer-fishing.jpg",
                        "readTime": "6 min",
                        "featured": false
                    },
                    {
                        "id": 4,
                        "title": "Ma Première Sortie en Mer",
                        "excerpt": "Récit d'une journée mémorable de pêche en mer pour un débutant, avec ses joies et ses apprentissages.",
                        "content": "Il était 5h du matin quand j'ai quitté la maison...",
                        "author": "Thomas Moreau",
                        "date": "2024-01-08",
                        "category": "recits",
                        "tags": ["débutant", "première fois", "récit", "apprentissage"],
                        "image": "first-fishing.jpg",
                        "readTime": "10 min",
                        "featured": true
                    },
                    {
                        "id": 5,
                        "title": "Nouvelles Réglementations 2024",
                        "excerpt": "Découvrez les nouvelles règles de pêche en mer qui entrent en vigueur cette année.",
                        "content": "Le ministère de la Mer a annoncé de nouvelles mesures...",
                        "author": "Service Rédaction",
                        "date": "2024-01-05",
                        "category": "actualites",
                        "tags": ["réglementation", "2024", "lois", "respect"],
                        "image": "regulations.jpg",
                        "readTime": "5 min",
                        "featured": false
                    },
                    {
                        "id": 6,
                        "title": "Techniques de Pêche au Surf Casting",
                        "excerpt": "Maîtrisez l'art du surf casting pour pêcher depuis la plage et atteindre les fonds profonds.",
                        "content": "Le surf casting est une technique de pêche spectaculaire...",
                        "author": "Jean-Baptiste Lecomte",
                        "date": "2024-01-03",
                        "category": "technique",
                        "tags": ["surf casting", "plage", "lancer", "technique"],
                        "image": "surf-casting.jpg",
                        "readTime": "15 min",
                        "featured": false
                    },
                    {
                        "id": 7,
                        "title": "Choisir ses Leurres pour la Pêche en Mer",
                        "excerpt": "Guide complet pour sélectionner les meilleurs leurres selon les conditions et les espèces ciblées.",
                        "content": "Le choix du leurre est crucial pour la réussite de votre pêche...",
                        "author": "Marie Dubois",
                        "date": "2024-01-01",
                        "category": "equipement",
                        "tags": ["leurres", "sélection", "espèces", "conditions"],
                        "image": "lures.jpg",
                        "readTime": "9 min",
                        "featured": false
                    },
                    {
                        "id": 8,
                        "title": "Pêche de Nuit : Conseils et Sécurité",
                        "excerpt": "Tout ce qu'il faut savoir pour pêcher la nuit en toute sécurité et efficacité.",
                        "content": "La pêche de nuit offre des opportunités uniques...",
                        "author": "Alexandre Petit",
                        "date": "2023-12-28",
                        "category": "conseils",
                        "tags": ["nuit", "sécurité", "éclairage", "technique"],
                        "image": "night-fishing.jpg",
                        "readTime": "7 min",
                        "featured": false
                    },
                    {
                        "id": 9,
                        "title": "Les Poissons de Mer les Plus Courants",
                        "excerpt": "Découvrez les principales espèces de poissons que vous pouvez rencontrer lors de vos sorties de pêche.",
                        "content": "Connaître les poissons de mer est essentiel...",
                        "author": "Dr. Marine Biologist",
                        "date": "2023-12-25",
                        "category": "conseils",
                        "tags": ["espèces", "identification", "biologie", "connaissance"],
                        "image": "fish-species.jpg",
                        "readTime": "11 min",
                        "featured": false
                    },
                    {
                        "id": 10,
                        "title": "Mon Record Personnel : Un Bar de 8kg",
                        "excerpt": "Récit détaillé de la capture de mon plus beau bar, avec les techniques utilisées et les émotions ressenties.",
                        "content": "Ce matin-là, je ne me doutais pas que j'allais vivre...",
                        "author": "François Leroux",
                        "date": "2023-12-22",
                        "category": "recits",
                        "tags": ["record", "bar", "émotion", "technique"],
                        "image": "big-bass.jpg",
                        "readTime": "13 min",
                        "featured": true
                    },
                    {
                        "id": 11,
                        "title": "Entretien et Stockage du Matériel",
                        "excerpt": "Comment bien entretenir et stocker votre matériel de pêche pour qu'il dure dans le temps.",
                        "content": "Un matériel bien entretenu est un matériel qui dure...",
                        "author": "Technique Expert",
                        "date": "2023-12-20",
                        "category": "equipement",
                        "tags": ["entretien", "stockage", "durabilité", "maintenance"],
                        "image": "gear-maintenance.jpg",
                        "readTime": "6 min",
                        "featured": false
                    },
                    {
                        "id": 12,
                        "title": "Pêche en Hiver : Défis et Opportunités",
                        "excerpt": "Les spécificités de la pêche hivernale et les techniques adaptées aux conditions froides.",
                        "content": "L'hiver n'est pas une saison morte pour la pêche...",
                        "author": "Hiver Pêcheur",
                        "date": "2023-12-18",
                        "category": "technique",
                        "tags": ["hiver", "froid", "technique", "saison"],
                        "image": "winter-fishing.jpg",
                        "readTime": "8 min",
                        "featured": false
                    }
                ],
                "categories": [
                    {
                        "id": "technique",
                        "name": "Techniques",
                        "description": "Apprenez les différentes techniques de pêche en mer",
                        "icon": "fas fa-fishing-rod"
                    },
                    {
                        "id": "equipement",
                        "name": "Équipement",
                        "description": "Conseils pour choisir et entretenir votre matériel",
                        "icon": "fas fa-tools"
                    },
                    {
                        "id": "conseils",
                        "name": "Conseils",
                        "description": "Astuces et recommandations pour améliorer votre pêche",
                        "icon": "fas fa-lightbulb"
                    },
                    {
                        "id": "recits",
                        "name": "Récits",
                        "description": "Partagez vos expériences et histoires de pêche",
                        "icon": "fas fa-book-open"
                    },
                    {
                        "id": "actualites",
                        "name": "Actualités",
                        "description": "Dernières nouvelles du monde de la pêche",
                        "icon": "fas fa-newspaper"
                    }
                ]
            };
            
            this.articles = data.articles;
            this.filteredArticles = [...this.articles];
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterArticles();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterArticles();
            });
        }

        // Filtres par catégorie
        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveCategory(link);
                this.currentCategory = link.dataset.category;
                this.currentPage = 1;
                this.filterArticles();
            });
        });

        // Tri
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortArticles();
                this.renderArticles();
            });
        }
    }

    setActiveCategory(activeLink) {
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    filterArticles() {
        this.filteredArticles = this.articles.filter(article => {
            const matchesCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
            const matchesSearch = this.searchTerm === '' || 
                article.title.toLowerCase().includes(this.searchTerm) ||
                article.excerpt.toLowerCase().includes(this.searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });

        this.sortArticles();
        this.currentPage = 1;
        this.renderArticles();
        this.updateResultsCount();
    }

    sortArticles() {
        this.filteredArticles.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }

    renderArticles() {
        const container = document.getElementById('articles-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        if (articlesToShow.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = articlesToShow.map(article => this.getArticleCardHTML(article)).join('');
        this.renderPagination();
    }

    getArticleCardHTML(article) {
        const categoryInfo = this.getCategoryInfo(article.category);
        const formattedDate = this.formatDate(article.date);
        
        return `
            <article class="article-card ${article.featured ? 'featured' : ''}">
                <div class="article-image">
                    <div class="image-placeholder">
                        <i class="${categoryInfo.icon}"></i>
                    </div>
                    <div class="article-category">${categoryInfo.name}</div>
                </div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="fas fa-calendar"></i> ${formattedDate}
                        </span>
                        <span class="article-author">
                            <i class="fas fa-user"></i> ${article.author}
                        </span>
                    </div>
                    <a href="#" class="article-link" data-article-id="${article.id}">
                        Lire la suite <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Aucun article trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de filtrer par catégorie.</p>
            </div>
        `;
    }

    renderSidebar() {
        this.renderRecentArticles();
        this.renderTagCloud();
    }

    renderRecentArticles() {
        const container = document.getElementById('recent-articles');
        if (!container) return;

        const recentArticles = this.articles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        container.innerHTML = recentArticles.map(article => {
            const categoryInfo = this.getCategoryInfo(article.category);
            const formattedDate = this.formatDate(article.date);
            
            return `
                <a href="#" class="recent-article" data-article-id="${article.id}">
                    <div class="recent-article-image">
                        <i class="${categoryInfo.icon}"></i>
                    </div>
                    <div class="recent-article-content">
                        <h4 class="recent-article-title">${article.title}</h4>
                        <p class="recent-article-date">${formattedDate}</p>
                    </div>
                </a>
            `;
        }).join('');
    }

    renderTagCloud() {
        const container = document.getElementById('tag-cloud');
        if (!container) return;

        const allTags = this.articles.flatMap(article => article.tags);
        const tagCounts = {};
        
        allTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });

        const sortedTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15)
            .map(([tag]) => tag);

        container.innerHTML = sortedTags.map(tag => 
            `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`
        ).join('');

        // Ajouter les event listeners pour les tags
        container.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.searchByTag(tag.dataset.tag);
            });
        });
    }

    searchByTag(tag) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = tag;
            this.searchTerm = tag.toLowerCase();
            this.filterArticles();
        }
    }

    renderPagination() {
        const container = document.getElementById('pagination-container');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<ul class="pagination">';
        
        // Bouton précédent
        paginationHTML += `
            <li class="pagination-item">
                <a href="#" class="pagination-link pagination-prev ${this.currentPage === 1 ? 'disabled' : ''}" 
                   data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Pages
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                paginationHTML += '<li class="pagination-item"><span class="pagination-dots">...</span></li>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link ${i === this.currentPage ? 'active' : ''}" 
                       data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<li class="pagination-item"><span class="pagination-dots">...</span></li>';
            }
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }

        // Bouton suivant
        paginationHTML += `
            <li class="pagination-item">
                <a href="#" class="pagination-link pagination-next ${this.currentPage === totalPages ? 'disabled' : ''}" 
                   data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationHTML += '</ul>';
        container.innerHTML = paginationHTML;

        // Ajouter les event listeners pour la pagination
        container.querySelectorAll('.pagination-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                if (page && page !== this.currentPage && !link.classList.contains('disabled')) {
                    this.currentPage = page;
                    this.renderArticles();
                    this.scrollToTop();
                }
            });
        });
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const count = this.filteredArticles.length;
            const text = count === 1 ? 'article trouvé' : 'articles trouvés';
            countElement.textContent = `${count} ${text}`;
        }
    }

    getCategoryInfo(categoryId) {
        const categories = {
            'technique': { name: 'Techniques', icon: 'fas fa-fishing-rod' },
            'equipement': { name: 'Équipement', icon: 'fas fa-tools' },
            'conseils': { name: 'Conseils', icon: 'fas fa-lightbulb' },
            'recits': { name: 'Récits', icon: 'fas fa-book-open' },
            'actualites': { name: 'Actualités', icon: 'fas fa-newspaper' }
        };
        return categories[categoryId] || { name: 'Autre', icon: 'fas fa-tag' };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    showError(message) {
        const container = document.getElementById('articles-container');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erreur</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialiser le blog quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Gestion des clics sur les articles
document.addEventListener('click', (e) => {
    const articleLink = e.target.closest('.article-link, .recent-article');
    if (articleLink) {
        e.preventDefault();
        const articleId = articleLink.dataset.articleId;
        if (articleId) {
            // Ici vous pouvez ajouter la logique pour afficher l'article complet
            console.log('Article cliqué:', articleId);
            // Par exemple : window.location.href = `article.html?id=${articleId}`;
        }
    }
});
