/* ========================================
   ROUTEUR JAVASCRIPT POUR GITHUB PAGES
   ======================================== */

class SPARouter {
    constructor() {
        // Détecter le chemin de base pour GitHub Pages
        this.basePath = this.detectBasePath();
        
        this.routes = {
            '/': 'index.html',
            '/blog': 'pages/blog.html',
            '/article': 'pages/article.html',
            '/mentions-legales': 'pages/mentions-legales.html',
            '/politique-confidentialite': 'pages/politique-confidentialite.html'
        };
        
        this.init();
    }

    detectBasePath() {
        // Détecter si on est sur GitHub Pages
        const pathname = window.location.pathname;
        const isGitHubPages = pathname.includes('/blog-tidal-song/');
        
        if (isGitHubPages) {
            return '/blog-tidal-song';
        }
        
        return '';
    }

    init() {
        console.log('🚀 SPARouter initialisé avec basePath:', this.basePath);
        
        // Intercepter les clics sur les liens
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                console.log('🔗 Navigation vers:', link.getAttribute('href'));
                this.navigate(link.getAttribute('href'));
            }
        });

        // Gérer le bouton retour du navigateur
        window.addEventListener('popstate', (e) => {
            console.log('⬅️ Popstate:', window.location.pathname);
            this.loadPage(window.location.pathname);
        });

        // Charger la page initiale
        console.log('📄 Chargement initial:', window.location.pathname);
        this.loadPage(window.location.pathname);
    }

    isInternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            const isSameOrigin = url.origin === window.location.origin;
            const isRelative = href.startsWith('/') || href.startsWith('./') || href.startsWith('../');
            return isSameOrigin || isRelative;
        } catch {
            return false;
        }
    }

    navigate(path) {
        // Nettoyer le chemin
        const cleanPath = this.cleanPath(path);
        
        // Construire l'URL complète avec le chemin de base
        const fullPath = this.basePath + cleanPath;
        
        // Mettre à jour l'URL sans recharger la page
        if (fullPath !== window.location.pathname) {
            window.history.pushState({}, '', fullPath);
        }
        
        // Charger la page
        this.loadPage(cleanPath);
    }

    cleanPath(path) {
        // Supprimer le chemin de base du chemin si présent
        if (this.basePath && path.startsWith(this.basePath)) {
            path = path.substring(this.basePath.length);
        }
        
        // Normaliser le chemin
        if (!path || path === '/') {
            return '/';
        }
        
        // Supprimer les extensions .html
        if (path.endsWith('.html')) {
            path = path.substring(0, path.length - 5);
        }
        
        return path;
    }

    async loadPage(path) {
        const cleanPath = this.cleanPath(path);
        const filePath = this.routes[cleanPath];
        
        if (!filePath) {
            this.load404();
            return;
        }

        try {
            // Afficher un indicateur de chargement
            this.showLoading();
            
            // Charger le contenu
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const html = await response.text();
            
            // Extraire le contenu principal
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Remplacer le contenu de la page
            this.updatePageContent(doc);
            
            // Masquer l'indicateur de chargement
            this.hideLoading();
            
            // Déclencher les événements personnalisés
            this.triggerPageEvents(cleanPath);
            
        } catch (error) {
            console.error('Erreur lors du chargement de la page:', error);
            this.load404();
        }
    }

    updatePageContent(doc) {
        // Remplacer le titre
        document.title = doc.title;
        
        // Remplacer le contenu principal
        const mainContent = doc.querySelector('main, .main, #main, .content, body > *:not(script)');
        if (mainContent) {
            const currentMain = document.querySelector('main, .main, #main, .content, body > *:not(script)');
            if (currentMain) {
                currentMain.replaceWith(mainContent);
            } else {
                document.body.innerHTML = doc.body.innerHTML;
            }
        } else {
            document.body.innerHTML = doc.body.innerHTML;
        }
        
        // Recharger les scripts
        this.reloadScripts();
    }

    reloadScripts() {
        // Supprimer les anciens scripts
        const oldScripts = document.querySelectorAll('script[src]');
        oldScripts.forEach(script => script.remove());
        
        // Recharger les scripts nécessaires
        const scripts = [
            'js/main.js',
            'js/components.js',
            'js/template-loader.js',
            'js/article-loader.js',
            'js/blog.js',
            'js/url-manager.js'
        ];
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    }

    triggerPageEvents(path) {
        // Déclencher un événement personnalisé pour chaque page
        const event = new CustomEvent('pageLoaded', {
            detail: { path: path }
        });
        document.dispatchEvent(event);
        
        // Déclencher des événements spécifiques selon la page
        if (path === '/blog') {
            document.dispatchEvent(new CustomEvent('blogPageLoaded'));
        } else if (path.startsWith('/article')) {
            document.dispatchEvent(new CustomEvent('articlePageLoaded'));
        }
    }

    showLoading() {
        // Créer un indicateur de chargement
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.remove();
        }
    }

    load404() {
        // Charger la page 404
        this.loadPage('/404');
    }
}

// Initialiser le routeur quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.spaRouter = new SPARouter();
});

// Exposer le routeur globalement
window.SPARouter = SPARouter;
