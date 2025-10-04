# Étape 1 : Build de l’app
FROM node:20-slim AS builder

# Étape 4 : Dossier de travail
WORKDIR /usr/src/app

# Étape 2 : Installer les dépendances système nécessaires à Chrome
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpng16-16 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers compilés
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Étape 3 : Variables Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


# Étape 5 : Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances (sans les dev pour accélérer le cache)
RUN npm ci

# Copier le reste du projet
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Étape 8 : Définir le port (Render fournit PORT)
ENV PORT=8080
EXPOSE 8080

# Étape 9 : Lancer ton app
CMD ["node", "dist/server.js"]