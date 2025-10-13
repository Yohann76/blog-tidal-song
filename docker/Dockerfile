# Dockerfile pour Chant des Marées
FROM nginx:alpine

# Copier les fichiers du site
COPY . /usr/share/nginx/html/

# Copier la configuration Nginx
COPY docker/nginx-docker.conf /etc/nginx/conf.d/default.conf

# Créer le répertoire pour les logs
RUN mkdir -p /var/log/nginx

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
