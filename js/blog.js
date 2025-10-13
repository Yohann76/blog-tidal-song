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
            // Utiliser le nouveau système de chargement d'articles
            this.articleLoader = new ArticleLoader();
            this.articles = await this.articleLoader.loadAllArticles();
            this.filteredArticles = [...this.articles];
            
            console.log('Articles chargés:', this.articles);
            console.log('Nombre d\'articles:', this.articles.length);
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
                    <a href="article.html?id=${article.id}" class="article-link" data-article-id="${article.id}">
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
                <a href="article.html?id=${article.id}" class="recent-article" data-article-id="${article.id}">
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
        if (this.articleLoader) {
            const categories = this.articleLoader.getCategories();
            return categories.find(cat => cat.id === categoryId) || { name: 'Autre', icon: 'fas fa-tag' };
        }
        
        // Fallback si l'ArticleLoader n'est pas disponible
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

// Les liens d'articles sont maintenant des liens directs vers article.html
// Plus besoin de gestion d'événements pour les clics
