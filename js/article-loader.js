/**
 * Article Loader - Charge les articles depuis des fichiers individuels
 */
class ArticleLoader {
    constructor() {
        this.articles = [];
        this.categories = [];
        this.articleCache = new Map();
    }

    /**
     * Charge tous les articles depuis le dossier data/articles
     */
    async loadAllArticles() {
        try {
            // Liste des articles Markdown disponibles
            const articleFiles = [
                '001-secrets-peche-bar.md',
                '002-guide-materiel-peche.md',
                '003-peche-ete-moments.md'
            ];

            const loadPromises = articleFiles.map(filename => this.loadArticle(filename));
            const loadedArticles = await Promise.all(loadPromises);
            
            // Filtrer les articles valides et les trier par ID
            this.articles = loadedArticles
                .filter(article => article !== null)
                .sort((a, b) => a.id - b.id);

            console.log(`✅ ${this.articles.length} articles Markdown chargés avec succès`);
            return this.articles;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des articles:', error);
            throw error;
        }
    }

    /**
     * Charge un article individuel depuis un fichier
     */
    async loadArticle(filename) {
        try {
            // Vérifier le cache
            if (this.articleCache.has(filename)) {
                return this.articleCache.get(filename);
            }

            const response = await fetch(`data/articles/${filename}`);
            if (!response.ok) {
                console.warn(`⚠️ Impossible de charger l'article ${filename}`);
                return null;
            }

            const content = await response.text();
            const article = this.parseArticle(content, filename);
            
            if (article) {
                this.articleCache.set(filename, article);
            }
            
            return article;
        } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${filename}:`, error);
            return null;
        }
    }

    /**
     * Parse le contenu d'un article Markdown
     */
    parseArticle(content, filename) {
        try {
            // Extraire l'ID depuis le nom de fichier
            const idMatch = filename.match(/^(\d+)-/);
            const id = idMatch ? parseInt(idMatch[1]) : 0;

            // Vérifier que c'est un fichier Markdown
            if (!filename.endsWith('.md')) {
                console.warn(`⚠️ Seuls les fichiers Markdown (.md) sont supportés: ${filename}`);
                return null;
            }

            // Extraire les métadonnées du front matter
            const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
            if (!frontMatterMatch) {
                console.warn(`⚠️ Front matter manquant dans ${filename}`);
                return null;
            }

            const frontMatter = frontMatterMatch[1];
            const articleContent = frontMatterMatch[2];

            // Parser les métadonnées
            const metadata = this.parseFrontMatter(frontMatter);
            
            // Convertir le Markdown en HTML
            const processedContent = this.processMarkdown(articleContent);

            // Créer l'objet article
            const article = {
                id: id,
                title: metadata.title || 'Titre manquant',
                excerpt: metadata.excerpt || '',
                content: processedContent,
                author: metadata.author || 'Auteur inconnu',
                date: metadata.date || new Date().toISOString().split('T')[0],
                category: metadata.category || 'general',
                tags: metadata.tags || [],
                image: metadata.image || null,
                readTime: metadata.readTime || '5 min',
                featured: metadata.featured === true || metadata.featured === 'true',
                filename: filename
            };

            return article;
        } catch (error) {
            console.error(`❌ Erreur lors du parsing de ${filename}:`, error);
            return null;
        }
    }

    /**
     * Parse le front matter YAML
     */
    parseFrontMatter(frontMatter) {
        const metadata = {};
        const lines = frontMatter.split(/\r?\n/);
        
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const key = match[1];
                let value = match[2].trim();
                
                // Enlever les guillemets si présents
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Traiter les listes (tags)
                if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(tag => tag.trim().replace(/['"]/g, ''));
                }
                
                // Traiter les booléens
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                
                metadata[key] = value;
            }
        }
        
        return metadata;
    }

    /**
     * Convertit le Markdown en HTML basique
     */
    processMarkdown(content) {
        let html = content;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold et Italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Listes
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        // Listes numérotées
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Paragraphes (lignes vides)
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Nettoyer les paragraphes vides
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>\s*<\/p>/g, '');
        
        return html;
    }

    /**
     * Obtient un article par son ID
     */
    getArticleById(id) {
        return this.articles.find(article => article.id === id);
    }

    /**
     * Obtient les articles par catégorie
     */
    getArticlesByCategory(category) {
        return this.articles.filter(article => article.category === category);
    }

    /**
     * Recherche dans les articles
     */
    searchArticles(query) {
        const searchTerm = query.toLowerCase();
        return this.articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Obtient les catégories disponibles
     */
    getCategories() {
        const categories = [
            { id: 'technique', name: 'Techniques', icon: 'fas fa-fishing-rod' },
            { id: 'equipement', name: 'Équipement', icon: 'fas fa-tools' },
            { id: 'conseils', name: 'Conseils', icon: 'fas fa-lightbulb' },
            { id: 'recits', name: 'Récits', icon: 'fas fa-book-open' },
            { id: 'actualites', name: 'Actualités', icon: 'fas fa-newspaper' },
            { id: 'general', name: 'Général', icon: 'fas fa-tag' }
        ];
        return categories;
    }

    /**
     * Obtient les articles mis en avant
     */
    getFeaturedArticles() {
        return this.articles.filter(article => article.featured);
    }

    /**
     * Obtient les articles récents
     */
    getRecentArticles(limit = 5) {
        return this.articles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}

// Export pour utilisation dans d'autres modules
window.ArticleLoader = ArticleLoader;
