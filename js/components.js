/* ========================================
   CHANT DES MARÉES - COMPOSANTS MODULAIRES
   ======================================== */

/**
 * Composant ArticleCard - Carte d'article réutilisable
 */
class ArticleCard {
    constructor(article, options = {}) {
        this.article = article;
        this.options = {
            showCategory: true,
            showAuthor: true,
            showDate: true,
            showExcerpt: true,
            showReadTime: false,
            featured: false,
            ...options
        };
    }

    render() {
        const categoryInfo = this.getCategoryInfo(this.article.category);
        const formattedDate = this.formatDate(this.article.date);
        
        return `
            <article class="article-card ${this.article.featured || this.options.featured ? 'featured' : ''}">
                <div class="article-image">
                    <div class="image-placeholder">
                        <i class="${categoryInfo.icon}"></i>
                    </div>
                    ${this.options.showCategory ? `<div class="article-category">${categoryInfo.name}</div>` : ''}
                </div>
                <div class="article-content">
                    <h3 class="article-title">${this.article.title}</h3>
                    ${this.options.showExcerpt ? `<p class="article-excerpt">${this.article.excerpt}</p>` : ''}
                    <div class="article-meta">
                        ${this.options.showDate ? `
                            <span class="article-date">
                                <i class="fas fa-calendar"></i> ${formattedDate}
                            </span>
                        ` : ''}
                        ${this.options.showAuthor ? `
                            <span class="article-author">
                                <i class="fas fa-user"></i> ${this.article.author}
                            </span>
                        ` : ''}
                        ${this.options.showReadTime ? `
                            <span class="article-read-time">
                                <i class="fas fa-clock"></i> ${this.article.readTime}
                            </span>
                        ` : ''}
                    </div>
                    <a href="#" class="article-link" data-article-id="${this.article.id}">
                        Lire la suite <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
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
}

/**
 * Composant Pagination - Pagination réutilisable
 */
class Pagination {
    constructor(currentPage, totalPages, options = {}) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.options = {
            showPrevNext: true,
            showFirstLast: false,
            maxVisible: 5,
            prevText: '<i class="fas fa-chevron-left"></i>',
            nextText: '<i class="fas fa-chevron-right"></i>',
            firstText: 'Premier',
            lastText: 'Dernier',
            ...options
        };
    }

    render() {
        if (this.totalPages <= 1) return '';

        let paginationHTML = '<ul class="pagination">';
        
        // Bouton précédent
        if (this.options.showPrevNext) {
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link pagination-prev ${this.currentPage === 1 ? 'disabled' : ''}" 
                       data-page="${this.currentPage - 1}">
                        ${this.options.prevText}
                    </a>
                </li>
            `;
        }

        // Pages
        const startPage = Math.max(1, this.currentPage - Math.floor(this.options.maxVisible / 2));
        const endPage = Math.min(this.totalPages, startPage + this.options.maxVisible - 1);

        if (this.options.showFirstLast && startPage > 1) {
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

        if (this.options.showFirstLast && endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                paginationHTML += '<li class="pagination-item"><span class="pagination-dots">...</span></li>';
            }
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link" data-page="${this.totalPages}">${this.totalPages}</a>
                </li>
            `;
        }

        // Bouton suivant
        if (this.options.showPrevNext) {
            paginationHTML += `
                <li class="pagination-item">
                    <a href="#" class="pagination-link pagination-next ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
                       data-page="${this.currentPage + 1}">
                        ${this.options.nextText}
                    </a>
                </li>
            `;
        }

        paginationHTML += '</ul>';
        return paginationHTML;
    }
}

/**
 * Composant SearchForm - Formulaire de recherche réutilisable
 */
class SearchForm {
    constructor(options = {}) {
        this.options = {
            placeholder: 'Rechercher...',
            buttonText: '<i class="fas fa-search"></i>',
            onSearch: () => {},
            ...options
        };
    }

    render() {
        return `
            <div class="search-form">
                <input type="text" 
                       class="search-input" 
                       placeholder="${this.options.placeholder}"
                       id="search-input">
                <button type="button" 
                        class="search-btn" 
                        id="search-btn">
                    ${this.options.buttonText}
                </button>
            </div>
        `;
    }

    attachEvents() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.options.onSearch(e.target.value);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const value = searchInput ? searchInput.value : '';
                this.options.onSearch(value);
            });
        }
    }
}

/**
 * Composant CategoryFilter - Filtre par catégorie réutilisable
 */
class CategoryFilter {
    constructor(categories, options = {}) {
        this.categories = categories;
        this.options = {
            showAll: true,
            allText: 'Toutes les catégories',
            onCategoryChange: () => {},
            ...options
        };
    }

    render() {
        let html = '<ul class="category-list">';
        
        if (this.options.showAll) {
            html += `
                <li>
                    <a href="#" class="category-link active" data-category="all">
                        ${this.options.allText}
                    </a>
                </li>
            `;
        }

        this.categories.forEach(category => {
            html += `
                <li>
                    <a href="#" class="category-link" data-category="${category.id}">
                        <i class="${category.icon}"></i> ${category.name}
                    </a>
                </li>
            `;
        });

        html += '</ul>';
        return html;
    }

    attachEvents() {
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveCategory(link);
                this.options.onCategoryChange(link.dataset.category);
            });
        });
    }

    setActiveCategory(activeLink) {
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
}

/**
 * Composant TagCloud - Nuage de tags réutilisable
 */
class TagCloud {
    constructor(tags, options = {}) {
        this.tags = tags;
        this.options = {
            maxTags: 15,
            onTagClick: () => {},
            ...options
        };
    }

    render() {
        const limitedTags = this.tags.slice(0, this.options.maxTags);
        
        return `
            <div class="tag-cloud">
                ${limitedTags.map(tag => 
                    `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`
                ).join('')}
            </div>
        `;
    }

    attachEvents() {
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.options.onTagClick(tag.dataset.tag);
            });
        });
    }
}

/**
 * Composant LoadingSpinner - Indicateur de chargement
 */
class LoadingSpinner {
    constructor(options = {}) {
        this.options = {
            size: 'medium',
            text: 'Chargement...',
            ...options
        };
    }

    render() {
        const sizeClass = this.options.size === 'small' ? 'loading-sm' : 
                         this.options.size === 'large' ? 'loading-lg' : 'loading-md';
        
        return `
            <div class="loading ${sizeClass}">
                <div class="loading-spinner"></div>
                <span>${this.options.text}</span>
            </div>
        `;
    }
}

/**
 * Composant EmptyState - État vide
 */
class EmptyState {
    constructor(options = {}) {
        this.options = {
            icon: 'fas fa-search',
            title: 'Aucun résultat trouvé',
            message: 'Essayez de modifier vos critères de recherche.',
            showButton: false,
            buttonText: 'Réinitialiser',
            onButtonClick: () => {},
            ...options
        };
    }

    render() {
        return `
            <div class="empty-state">
                <i class="${this.options.icon}"></i>
                <h3>${this.options.title}</h3>
                <p>${this.options.message}</p>
                ${this.options.showButton ? `
                    <button class="btn btn-primary" onclick="${this.options.onButtonClick}">
                        ${this.options.buttonText}
                    </button>
                ` : ''}
            </div>
        `;
    }
}

/**
 * Utilitaires pour les composants
 */
const ComponentUtils = {
    // Débounce une fonction
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle une fonction
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formater une date
    formatDate(dateString, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
    },

    // Générer un slug à partir d'un texte
    generateSlug(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    },

    // Scroll fluide vers le haut
    scrollToTop(duration = 500) {
        const start = window.pageYOffset;
        const distance = -start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

// Exporter les composants pour utilisation globale
window.BlogComponents = {
    ArticleCard,
    Pagination,
    SearchForm,
    CategoryFilter,
    TagCloud,
    LoadingSpinner,
    EmptyState,
    ComponentUtils
};
