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
            // Même données que dans blog.js pour la cohérence
            const data = {
                "articles": [
                    {
                        "id": 1,
                        "title": "Les Secrets de la Pêche au Bar",
                        "excerpt": "Découvrez les techniques éprouvées pour capturer le bar en toute saison, du choix du matériel aux meilleurs spots de pêche.",
                        "content": `
                            <h2>Introduction</h2>
                            <p>Le bar (Dicentrarchus labrax) est l'un des poissons les plus recherchés par les pêcheurs en mer. Sa combativité et sa qualité gustative en font une prise de choix. Dans cet article, nous allons explorer les techniques les plus efficaces pour capturer ce magnifique poisson.</p>
                            
                            <h2>Connaître le Bar</h2>
                            <p>Le bar est un poisson prédateur qui vit principalement dans les eaux côtières. Il se nourrit de petits poissons, de crustacés et de mollusques. Sa taille peut varier de 30 cm à plus d'1 mètre pour les plus gros spécimens.</p>
                            
                            <h3>Habitat et Comportement</h3>
                            <p>Le bar affectionne particulièrement :</p>
                            <ul>
                                <li>Les zones rocheuses avec des courants</li>
                                <li>Les estuaires et les embouchures de rivières</li>
                                <li>Les ports et les jetées</li>
                                <li>Les fonds sableux près des herbiers</li>
                            </ul>
                            
                            <h2>Matériel Recommandé</h2>
                            <p>Pour pêcher le bar efficacement, il est important de bien choisir son matériel :</p>
                            
                            <h3>Canne à Pêche</h3>
                            <p>Une canne de 2,70m à 3,60m avec une action semi-parabolique est idéale. La puissance doit être adaptée à la technique utilisée :</p>
                            <ul>
                                <li><strong>Lancer léger :</strong> 10-30g</li>
                                <li><strong>Lancer moyen :</strong> 20-60g</li>
                                <li><strong>Surf casting :</strong> 40-120g</li>
                            </ul>
                            
                            <h3>Moulinet</h3>
                            <p>Un moulinet de taille 3000-4000 avec un frein progressif et une bonne récupération de ligne (5:1 minimum).</p>
                            
                            <h3>Ligne et Accessoires</h3>
                            <p>Utilisez une ligne de 20-30/100 avec un bas de ligne en fluorocarbone de 15-20/100. Les hameçons de taille 1/0 à 4/0 sont parfaits pour le bar.</p>
                            
                            <h2>Techniques de Pêche</h2>
                            
                            <h3>1. Pêche au Leurre</h3>
                            <p>La pêche au leurre est très efficace pour le bar. Voici les leurres les plus productifs :</p>
                            <ul>
                                <li><strong>Leurres souples :</strong> Shad, worm, créature</li>
                                <li><strong>Leurres durs :</strong> Popper, stickbait, jerkbait</li>
                                <li><strong>Jigs :</strong> Jig head avec shad ou octopus</li>
                            </ul>
                            
                            <h3>2. Pêche à la Buldo</h3>
                            <p>Technique très efficace consistant à animer un leurre souple près du fond. L'animation doit être lente et régulière avec des pauses.</p>
                            
                            <h3>3. Pêche au Vif</h3>
                            <p>Utilisez des petits poissons vivants (sardine, anchois, mulets) comme appâts. Cette technique est particulièrement efficace en été.</p>
                            
                            <h2>Meilleurs Moments</h2>
                            <p>Le bar est plus actif :</p>
                            <ul>
                                <li><strong>Marée montante :</strong> Les 2 premières heures</li>
                                <li><strong>Marée descendante :</strong> Les 2 dernières heures</li>
                                <li><strong>Heures :</strong> Aube et crépuscule</li>
                                <li><strong>Saison :</strong> Printemps et automne</li>
                            </ul>
                            
                            <h2>Conseils Pratiques</h2>
                            <blockquote>
                                "La patience et l'observation sont les clés du succès. Observez l'eau, repérez les oiseaux qui plongent, ils vous indiqueront souvent la présence de bars qui chassent."
                            </blockquote>
                            
                            <h3>Techniques d'Animation</h3>
                            <p>L'animation du leurre est cruciale :</p>
                            <ol>
                                <li>Lancez votre leurre dans la zone de pêche</li>
                                <li>Laissez-le descendre au fond</li>
                                <li>Récupérez lentement en donnant des petits coups de poignet</li>
                                <li>Faites des pauses régulières</li>
                                <li>Variez la vitesse de récupération</li>
                            </ol>
                            
                            <h2>Conclusion</h2>
                            <p>La pêche au bar demande de la patience et de la technique, mais les récompenses sont à la hauteur de l'effort. N'hésitez pas à expérimenter différentes techniques et à adapter votre approche selon les conditions. Bonne pêche !</p>
                        `,
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
                        "content": `
                            <h2>Introduction</h2>
                            <p>Choisir le bon matériel de pêche est essentiel pour réussir vos sorties. Dans ce guide complet, nous allons vous aider à sélectionner l'équipement adapté à vos besoins et à votre budget.</p>
                            
                            <h2>Les Cannes à Pêche</h2>
                            <p>La canne est l'élément central de votre équipement. Voici les critères à considérer :</p>
                            
                            <h3>Types de Cannes</h3>
                            <ul>
                                <li><strong>Canne de lancer :</strong> Pour pêcher depuis le bord</li>
                                <li><strong>Canne de surf casting :</strong> Pour les lancers longue distance</li>
                                <li><strong>Canne de bateau :</strong> Pour pêcher en mer</li>
                                <li><strong>Canne de rockfishing :</strong> Pour les zones rocheuses</li>
                            </ul>
                            
                            <h2>Les Moulinets</h2>
                            <p>Le moulinet doit être choisi en fonction de votre canne et de votre technique de pêche.</p>
                        `,
                        "author": "Sophie Martin",
                        "date": "2024-01-12",
                        "category": "equipement",
                        "tags": ["matériel", "canne", "moulinet", "débutant"],
                        "image": "fishing-gear.jpg",
                        "readTime": "12 min",
                        "featured": false
                    }
                    // Ajoutez d'autres articles avec du contenu détaillé...
                ]
            };
            
            this.articles = data.articles;
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            throw error;
        }
    }

    getCurrentArticleId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentArticleId = parseInt(urlParams.get('id')) || 1;
    }

    loadCurrentArticle() {
        this.currentArticle = this.articles.find(article => article.id === this.currentArticleId);
        
        if (!this.currentArticle) {
            this.showError('Article non trouvé');
            return;
        }

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
