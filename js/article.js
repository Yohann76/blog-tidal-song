/* ========================================
   CHANT DES MARÉES - ARTICLE FUNCTIONALITY
   ======================================== */

class ArticleManager {
    constructor() {
        this.articles = [];
        this.currentArticle = null;
        this.currentArticleId = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadArticles();
            this.getCurrentArticleId();
            this.loadCurrentArticle();
            this.setupEventListeners();
            this.generateTableOfContents();
            this.loadRelatedArticles();
            this.loadNavigationArticles();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'article:', error);
            this.showError('Erreur lors du chargement de l\'article');
        }
    }

    async loadArticles() {
        try {
            // Utiliser le nouveau système de chargement d'articles
            this.articleLoader = new ArticleLoader();
            this.articles = await this.articleLoader.loadAllArticles();
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            throw error;
        }
    }

    getCurrentArticleId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentArticleId = parseInt(urlParams.get('id')) || 1;
        console.log('ID de l\'article demandé:', this.currentArticleId);
    }

    loadCurrentArticle() {
        console.log('Articles disponibles:', this.articles);
        console.log('Recherche de l\'article avec ID:', this.currentArticleId);
        
        this.currentArticle = this.articles.find(article => article.id === this.currentArticleId);
        
        if (!this.currentArticle) {
            console.error('Article non trouvé avec ID:', this.currentArticleId);
            this.showError('Article non trouvé');
            return;
        }

        console.log('Article trouvé:', this.currentArticle);
        this.renderArticle();
        this.updatePageTitle();
    }

    renderArticle() {
        // Mise à jour du titre
        document.getElementById('article-title').textContent = this.currentArticle.title;
        
        // Mise à jour de l'extrait
        document.getElementById('article-excerpt').textContent = this.currentArticle.excerpt;
        
        // Mise à jour des métadonnées
        const categoryInfo = this.getCategoryInfo(this.currentArticle.category);
        document.getElementById('article-category').textContent = categoryInfo.name;
        document.getElementById('article-date').innerHTML = `<i class="fas fa-calendar"></i> ${this.formatDate(this.currentArticle.date)}`;
        document.getElementById('article-read-time').innerHTML = `<i class="fas fa-clock"></i> ${this.currentArticle.readTime} de lecture`;
        document.getElementById('article-author').textContent = this.currentArticle.author;
        
        // Mise à jour du breadcrumb
        document.getElementById('breadcrumb-category').textContent = categoryInfo.name;
        
        // Mise à jour de l'image
        const imageElement = document.getElementById('article-image');
        if (this.currentArticle.image) {
            imageElement.innerHTML = `<img src="images/${this.currentArticle.image}" alt="${this.currentArticle.title}">`;
        } else {
            imageElement.innerHTML = `<div class="image-placeholder"><i class="${categoryInfo.icon}"></i></div>`;
        }
        
        // Mise à jour du contenu
        document.getElementById('article-body').innerHTML = this.currentArticle.content;
        
        // Mise à jour des tags
        this.renderTags();
    }

    renderTags() {
        const tagsContainer = document.getElementById('article-tags');
        if (this.currentArticle.tags && this.currentArticle.tags.length > 0) {
            const tagsHTML = this.currentArticle.tags.map(tag => 
                `<a href="blog.html?tag=${tag}" class="tag">${tag}</a>`
            ).join('');
            
            tagsContainer.innerHTML = `
                <h4>Tags</h4>
                <div class="tag-list">${tagsHTML}</div>
            `;
        } else {
            tagsContainer.innerHTML = '';
        }
    }

    generateTableOfContents() {
        const content = document.getElementById('article-body');
        const headings = content.querySelectorAll('h2, h3, h4');
        const tocContainer = document.getElementById('table-of-contents');
        
        if (headings.length === 0) {
            tocContainer.innerHTML = '<p>Aucune section disponible</p>';
            return;
        }
        
        let tocHTML = '';
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const level = parseInt(heading.tagName.charAt(1));
            const indent = level > 2 ? 'style="padding-left: 20px;"' : '';
            
            tocHTML += `
                <li ${indent}>
                    <a href="#${id}" class="toc-link">${heading.textContent}</a>
                </li>
            `;
        });
        
        tocContainer.innerHTML = `<ul>${tocHTML}</ul>`;
        
        // Ajouter les event listeners pour le scroll
        this.setupTocScroll();
    }

    setupTocScroll() {
        const tocLinks = document.querySelectorAll('.toc-link');
        const headings = document.querySelectorAll('h2, h3, h4');
        
        // Observer pour mettre à jour le TOC actif
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Retirer la classe active de tous les liens
                    tocLinks.forEach(link => link.classList.remove('active'));
                    
                    // Ajouter la classe active au lien correspondant
                    const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });
        
        headings.forEach(heading => observer.observe(heading));
    }

    loadRelatedArticles() {
        const relatedContainer = document.getElementById('related-articles');
        const currentCategory = this.currentArticle.category;
        
        // Trouver des articles de la même catégorie (exclure l'article actuel)
        const relatedArticles = this.articles
            .filter(article => article.category === currentCategory && article.id !== this.currentArticleId)
            .slice(0, 3);
        
        if (relatedArticles.length === 0) {
            relatedContainer.innerHTML = '<p>Aucun article similaire trouvé</p>';
            return;
        }
        
        const relatedHTML = relatedArticles.map(article => {
            const categoryInfo = this.getCategoryInfo(article.category);
            return `
                <a href="article.html?id=${article.id}" class="related-article">
                    <div class="related-article-image">
                        <i class="${categoryInfo.icon}"></i>
                    </div>
                    <div class="related-article-content">
                        <h4 class="related-article-title">${article.title}</h4>
                        <p class="related-article-date">${this.formatDate(article.date)}</p>
                    </div>
                </a>
            `;
        }).join('');
        
        relatedContainer.innerHTML = relatedHTML;
    }

    loadNavigationArticles() {
        const currentIndex = this.articles.findIndex(article => article.id === this.currentArticleId);
        
        // Article précédent
        const prevArticle = currentIndex > 0 ? this.articles[currentIndex - 1] : null;
        const prevLink = document.getElementById('prev-article');
        const prevTitle = document.getElementById('prev-article-title');
        
        if (prevArticle) {
            prevLink.href = `article.html?id=${prevArticle.id}`;
            prevTitle.textContent = prevArticle.title;
            prevLink.style.display = 'flex';
        } else {
            prevLink.style.display = 'none';
        }
        
        // Article suivant
        const nextArticle = currentIndex < this.articles.length - 1 ? this.articles[currentIndex + 1] : null;
        const nextLink = document.getElementById('next-article');
        const nextTitle = document.getElementById('next-article-title');
        
        if (nextArticle) {
            nextLink.href = `article.html?id=${nextArticle.id}`;
            nextTitle.textContent = nextArticle.title;
            nextLink.style.display = 'flex';
        } else {
            nextLink.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Boutons d'action
        document.getElementById('share-btn').addEventListener('click', () => this.shareArticle());
        document.getElementById('bookmark-btn').addEventListener('click', () => this.toggleBookmark());
        document.getElementById('print-btn').addEventListener('click', () => this.printArticle());
        
        // Boutons de partage
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareOnPlatform(e.currentTarget.dataset.platform);
            });
        });
        
        // Newsletter
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.subscribeNewsletter();
        });
    }

    shareArticle() {
        if (navigator.share) {
            navigator.share({
                title: this.currentArticle.title,
                text: this.currentArticle.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback : copier l'URL dans le presse-papiers
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Lien copié dans le presse-papiers');
            });
        }
    }

    shareOnPlatform(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.currentArticle.title);
        const text = encodeURIComponent(this.currentArticle.excerpt);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title} ${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    toggleBookmark() {
        const btn = document.getElementById('bookmark-btn');
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
            this.showNotification('Article sauvegardé');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
            this.showNotification('Article retiré des favoris');
        }
    }

    printArticle() {
        window.print();
    }

    subscribeNewsletter() {
        const email = document.querySelector('.newsletter-input').value;
        if (email) {
            this.showNotification('Merci pour votre inscription à la newsletter !');
            document.querySelector('.newsletter-input').value = '';
        }
    }

    updatePageTitle() {
        document.title = `${this.currentArticle.title} - Chant des Marées`;
        
        // Mise à jour de la meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.currentArticle.excerpt;
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

    showNotification(message) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        const container = document.querySelector('.article-content');
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

// Initialiser l'article quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new ArticleManager();
});

// Ajouter les styles pour l'animation de notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
