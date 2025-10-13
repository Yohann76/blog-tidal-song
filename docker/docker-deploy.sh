#!/bin/bash

# Script de déploiement Docker pour Chant des Marées
# Usage: ./docker-deploy.sh [dev|prod]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis OK"
}

# Configuration selon l'environnement
configure_environment() {
    if [ "$ENVIRONMENT" = "prod" ]; then
        log_info "Configuration pour la production..."
        COMPOSE_FILE=$PROD_COMPOSE_FILE
        
        # Vérifier que le domaine est configuré
        if grep -q "votre-domaine.com" nginx-docker.conf; then
            log_warning "N'oubliez pas de configurer votre domaine dans nginx-docker.conf"
        fi
    else
        log_info "Configuration pour le développement..."
    fi
}

# Construire l'image
build_image() {
    log_info "Construction de l'image Docker..."
    docker-compose -f $COMPOSE_FILE build --no-cache
    log_success "Image construite"
}

# Démarrer les services
start_services() {
    log_info "Démarrage des services..."
    docker-compose -f $COMPOSE_FILE up -d
    log_success "Services démarrés"
}

# Vérifier la santé des services
health_check() {
    log_info "Vérification de la santé des services..."
    
    # Attendre que le service soit prêt
    sleep 5
    
    # Vérifier que le conteneur web est en cours d'exécution
    if docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
        log_success "Services en cours d'exécution"
    else
        log_error "Problème avec les services"
        docker-compose -f $COMPOSE_FILE logs
        exit 1
    fi
    
    # Tester l'accès au site
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log_success "Site accessible sur http://localhost"
    else
        log_warning "Site non accessible, vérifiez les logs"
    fi
}

# Afficher les informations utiles
show_info() {
    echo ""
    log_info "=== Informations utiles ==="
    echo "• Voir les logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "• Arrêter: docker-compose -f $COMPOSE_FILE down"
    echo "• Redémarrer: docker-compose -f $COMPOSE_FILE restart"
    echo "• Shell dans le conteneur: docker exec -it chant-des-marees-web sh"
    echo ""
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "• Obtenir SSL: docker-compose -f $PROD_COMPOSE_FILE run --rm certbot"
        echo "• Renouveler SSL: docker-compose -f $PROD_COMPOSE_FILE run --rm certbot renew"
        echo ""
    fi
}

# Nettoyage en cas d'erreur
cleanup() {
    log_error "Erreur détectée, nettoyage..."
    docker-compose -f $COMPOSE_FILE down
    exit 1
}

# Configuration des signaux
trap cleanup EXIT

# Fonction principale
main() {
    echo "🐳 Déploiement Docker - Chant des Marées"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    configure_environment
    build_image
    start_services
    health_check
    show_info
    
    # Désactiver le trap de nettoyage si tout s'est bien passé
    trap - EXIT
    
    log_success "Déploiement terminé avec succès !"
}

# Exécution
main "$@"
