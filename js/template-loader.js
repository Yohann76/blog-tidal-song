/**
 * Template Loader - Charge les templates modulaires
 */
class TemplateLoader {
    constructor() {
        this.templates = new Map();
        this.loadedTemplates = new Set();
    }

    /**
     * Charge un template depuis un fichier
     */
    async loadTemplate(templateName, templatePath) {
        if (this.loadedTemplates.has(templateName)) {
            return this.templates.get(templateName);
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement du template ${templateName}: ${response.status}`);
            }
            
            const templateContent = await response.text();
            this.templates.set(templateName, templateContent);
            this.loadedTemplates.add(templateName);
            
            console.log(`✅ Template ${templateName} chargé avec succès`);
            return templateContent;
        } catch (error) {
            console.error(`❌ Erreur lors du chargement du template ${templateName}:`, error);
            return null;
        }
    }

    /**
     * Insère un template dans un élément
     */
    async insertTemplate(templateName, templatePath, targetElement) {
        const templateContent = await this.loadTemplate(templateName, templatePath);
        if (templateContent && targetElement) {
            targetElement.innerHTML = templateContent;
            return true;
        }
        return false;
    }

    /**
     * Détermine le chemin des templates selon la localisation de la page
     */
    getTemplatePath() {
        const currentPath = window.location.pathname;
        // Si on est dans le dossier pages, utiliser ../templates
        if (currentPath.includes('/pages/')) {
            return '../templates/';
        }
        // Sinon, utiliser templates/ directement
        return 'templates/';
    }

    /**
     * Charge tous les templates nécessaires
     */
    async loadAllTemplates() {
        const templatePath = this.getTemplatePath();
        const templates = [
            { name: 'nav', path: `${templatePath}_nav.html` },
            { name: 'footer', path: `${templatePath}_footer.html` }
        ];

        const loadPromises = templates.map(template => 
            this.loadTemplate(template.name, template.path)
        );

        try {
            await Promise.all(loadPromises);
            console.log('✅ Tous les templates chargés avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des templates:', error);
            return false;
        }
    }

    /**
     * Initialise les templates sur la page
     */
    async init() {
        // Charger tous les templates
        await this.loadAllTemplates();

        // Insérer la navigation
        const navElement = document.querySelector('.navbar');
        if (navElement) {
            const templatePath = this.getTemplatePath();
            const currentPath = window.location.pathname;
            
            // Utiliser le bon template selon la page
            let navTemplate = '_nav.html';
            if (currentPath === '/' || currentPath === '/blog-tidal-song/' || currentPath.endsWith('/blog-tidal-song')) {
                navTemplate = '_nav-home.html';
            }
            
            await this.insertTemplate('nav', `${templatePath}${navTemplate}`, navElement);
        }

        // Insérer le footer
        const footerElement = document.querySelector('.footer');
        if (footerElement) {
            const templatePath = this.getTemplatePath();
            await this.insertTemplate('footer', `${templatePath}_footer.html`, footerElement);
        }

        // Initialiser les événements après chargement
        this.initNavigationEvents();
    }

    /**
     * Initialise les événements de navigation
     */
    initNavigationEvents() {
        // Gestion du menu hamburger
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Fermer le menu au clic sur un lien
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Gestion du scroll pour la navbar
        this.initScrollEffects();
    }

    /**
     * Initialise les effets de scroll
     */
    initScrollEffects() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const logo = document.querySelector('.nav-logo h1');

        if (!navbar) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Ajouter/supprimer la classe scrolled
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Gestion de la visibilité des éléments
            if (currentScrollY > 100) {
                // En scroll down - logo visible, menu visible
                if (logo) {
                    logo.style.color = '#ffffff';
                    logo.style.opacity = '1';
                }
                
                navLinks.forEach(link => {
                    link.style.color = '#ffffff';
                    link.style.opacity = '1';
                });
            } else {
                // En haut de page - logo blanc, menu blanc
                if (logo) {
                    logo.style.color = '#ffffff';
                    logo.style.opacity = '1';
                }
                
                navLinks.forEach(link => {
                    link.style.color = '#ffffff';
                    link.style.opacity = '1';
                });
            }

            lastScrollY = currentScrollY;
        });
    }
}

// Initialiser le template loader quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const templateLoader = new TemplateLoader();
    templateLoader.init();
});
