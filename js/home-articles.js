/**
 * Home Articles - Charge les articles sur la page d'accueil
 */
class HomeArticles {
    constructor() {
        this.articleLoader = new ArticleLoader();
        this.init();
    }

    async init() {
        try {
            await this.loadArticles();
            this.renderFeaturedArticles();
        } catch (error) {
            console.error('Erreur lors du chargement des articles sur la page d\'accueil:', error);
        }
    }

    async loadArticles() {
        this.articles = await this.articleLoader.loadAllArticles();
        console.log('Articles chargés pour la page d\'accueil:', this.articles);
    }

    renderFeaturedArticles() {
        const articlesGrid = document.querySelector('.articles-grid');
        if (!articlesGrid) {
            console.warn('Conteneur des articles non trouvé');
            return;
        }

        // Prendre les 3 premiers articles (ou les articles mis en avant)
        const featuredArticles = this.articles
            .filter(article => article.featured)
            .slice(0, 3);

        // Si pas assez d'articles mis en avant, prendre les plus récents
        if (featuredArticles.length < 3) {
            const recentArticles = this.articles
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3 - featuredArticles.length);
            featuredArticles.push(...recentArticles);
        }

        console.log('Articles à afficher:', featuredArticles);

        // Remplacer le contenu statique par les articles dynamiques
        articlesGrid.innerHTML = featuredArticles.map(article => this.getArticleCardHTML(article)).join('');
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
                    <a href="article.html?id=${article.id}" class="article-link">
                        Lire la suite <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    getCategoryInfo(categoryId) {
        const categories = this.articleLoader.getCategories();
        return categories.find(cat => cat.id === categoryId) || { name: 'Autre', icon: 'fas fa-tag' };
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

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new HomeArticles();
});
