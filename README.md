# Projet Web - Gestion de Documents

Application complète de gestion de documents avec backend NestJS et frontend Next.js.

## Architecture

- **Backend** : NestJS avec GraphQL, PostgreSQL, Redis, JWT
- **Frontend** : Next.js 15 avec TypeScript, Tailwind CSS
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **Containerisation** : Docker & Docker Compose

## Démarrage rapide du projet

### Prérequis

- Node.js 22 (utilisez `nvm use 22`)
- Docker & Docker Compose
- Yarn

### Étapes pour lancer le projet

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-repo>
   cd Projet-Web
   ```

2. **Sélectionner la bonne version de Node.js**

   ```bash
   nvm use 22
   ```

3. **Installer les dépendances (Backend)**

   ```bash
   yarn install
   ```

4. **Installer les dépendances (Frontend)**

   ```bash
   cd frontend
   yarn install
   cd ..
   ```

5. **Créer le fichier `.env`** à la racine du projet avec :

   ```env
   DATABASE_URL="postgresql://adam:password123@localhost:5432/projetweb?schema=public"
   REDIS_URL="redis://:admin@localhost:6379"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="1d"
   ```

6. **Démarrer tous les services avec Docker**

   ```bash
   docker-compose up -d
   ```

7. **Appliquer les migrations Prisma**

   ```bash
   yarn prisma migrate deploy
   ```

8. **Lancer l'application en mode développement**

   **Backend** (optionnel si Docker est utilisé) :

   ```bash
   yarn start:dev
   ```

   **Frontend** :

   ```bash
   cd frontend
   yarn dev
   ```

## Accès aux applications

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000
- **GraphQL Playground** : http://localhost:3000/graphql

## Fonctionnalités

### Backend (NestJS)

- ✅ Authentification JWT
- ✅ Gestion des utilisateurs avec rôles
- ✅ Upload et gestion de documents
- ✅ API GraphQL
- ✅ Base de données PostgreSQL
- ✅ Cache Redis

### Frontend (Next.js)

- ✅ Interface d'authentification
- ✅ Dashboard de gestion des documents
- ✅ Upload de fichiers
- ✅ Interface responsive
- ✅ Gestion des rôles

## Structure du projet

```
Projet-Web/
├── src/                    # Backend NestJS
│   ├── auth/              # Authentification
│   ├── user/              # Gestion des utilisateurs
│   ├── document/          # Gestion des documents
│   └── ...
├── frontend/              # Frontend Next.js
│   ├── src/
│   │   ├── app/           # Pages Next.js
│   │   ├── components/    # Composants React
│   │   ├── contexts/      # Contextes React
│   │   └── lib/           # Services et utilitaires
│   └── ...
├── prisma/                # Schéma et migrations DB
├── docker-compose.yml     # Configuration Docker
└── README.md
```

## Développement

### Backend

```bash
# Lancer en mode développement
yarn start:dev

# Tests
yarn test
yarn test:e2e

# Linter
yarn lint
```

### Frontend

```bash
cd frontend

# Lancer en mode développement
yarn dev

# Build de production
yarn build

# Tests
yarn test
```

## Déploiement

### Avec Docker Compose

```bash
# Build et lancement de tous les services
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Variables d'environnement

**Backend** (`.env`) :

```env
DATABASE_URL="postgresql://adam:password123@localhost:5432/projetweb?schema=public"
REDIS_URL="redis://:admin@localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1d"
```

**Frontend** (`frontend/.env.local`) :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Technologies utilisées

### Backend

- NestJS
- GraphQL (Apollo Server)
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Bull (File uploads)

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- Lucide React
- Radix UI
