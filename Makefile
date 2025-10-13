# Makefile simplifié pour Chant des Marées
.PHONY: help run logs update clean

# Variables
COMPOSE_FILE = docker/docker-compose.yml
PROD_COMPOSE_FILE = docker/docker-compose.prod.yml
CONTAINER_NAME = chant-des-marees-web

help: ## Afficher l'aide
	@echo "Chant des Marées - Commandes disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

run: ## Démarrer le site (développement)
	@echo "🚀 Démarrage du site..."
	cd docker && docker-compose up -d --build
	@echo "✅ Site accessible sur http://localhost"

run-prod: ## Démarrer le site (production)
	@echo "🚀 Démarrage en production..."
	cd docker && docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Site accessible sur http://localhost"

logs: ## Voir les logs
	@echo "📋 Affichage des logs..."
	cd docker && docker-compose logs -f

update: ## Mettre à jour le site
	@echo "🔄 Mise à jour du site..."
	cd docker && docker-compose down
	cd docker && docker-compose build --no-cache
	cd docker && docker-compose up -d
	@echo "✅ Mise à jour terminée"

stop: ## Arrêter le site
	@echo "⏹️ Arrêt du site..."
	cd docker && docker-compose down
	@echo "✅ Site arrêté"

clean: ## Nettoyer (arrêter + supprimer les conteneurs)
	@echo "🧹 Nettoyage..."
	cd docker && docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f
	@echo "✅ Nettoyage terminé"

status: ## Voir le statut des services
	@echo "📊 Statut des services..."
	cd docker && docker-compose ps

shell: ## Ouvrir un shell dans le conteneur
	@echo "🐚 Ouverture du shell..."
	docker exec -it $(CONTAINER_NAME) sh

# Commandes de développement
dev: run logs ## Démarrer en mode développement avec logs

restart: stop run ## Redémarrer le site