# ===============================
# ÉTAPE 1 : Builder (compile le code TypeScript)
# ===============================
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (avec les dev)
RUN npm ci

# Copier le reste du projet
COPY . .

# Compiler le code TypeScript
RUN npm run build


# ===============================
# ÉTAPE 2 : Runner (exécute le serveur Node avec Puppeteer)
# ===============================
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Installer les dépendances système pour Chrome
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

# Copier les fichiers buildés et nécessaires depuis le builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Installer uniquement les dépendances de prod
RUN npm ci --omit=dev

# Puppeteer config
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Port (Render utilisera cette variable)
ENV PORT=8080
EXPOSE 8080

# Démarrage
CMD ["node", "dist/server.js"]
