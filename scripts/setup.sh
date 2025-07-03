#!/bin/bash

# Secure Docs - Script de setup automatique
echo "🚀 Configuration de Secure Docs..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 22."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Node.js 22 ou supérieur est requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

echo "✅ Docker $(docker --version) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
yarn install

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "🔧 Création du fichier .env..."
    cat > .env << EOF
# Base de données
DATABASE_URL=postgresql://efrei_user:efrei_password@localhost:5432/efrei_docs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application
PORT=4000
NODE_ENV=development
EOF
    echo "✅ Fichier .env créé"
else
    echo "✅ Fichier .env existe déjà"
fi

# Démarrer les services Docker
echo "🐳 Démarrage des services Docker..."
docker-compose up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente que PostgreSQL soit prêt..."
sleep 10

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Exécuter les migrations
echo "🗄️ Exécution des migrations..."
npx prisma migrate dev

echo "✅ Setup terminé avec succès!"
echo ""
echo "🌐 Accès aux services:"
echo "   - API GraphQL: http://localhost:4000/graphql"
echo "   - Health Check: http://localhost:4000/health"
echo ""
echo "🚀 Pour démarrer l'application:"
echo "   yarn start:dev"
echo ""
echo "🧪 Pour exécuter les tests:"
echo "   yarn test" 