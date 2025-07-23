# Dockerfile.dev
FROM node:22.11.0

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code dans le conteneur (mais sera écrasé par le volume en dev)
COPY . .

# Exposer le port utilisé par Angular
EXPOSE 80

# Commande par défaut
CMD ["npm", "run", "start"]
