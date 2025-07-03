
# 📁 Backend – Gestion de Documents

API GraphQL réalisée avec **NestJS**, **PostgreSQL**, **Prisma**, **Redis**, **BullMQ**, **JWT**.

## 🚀 Fonctionnalités

- Authentification (JWT)
- Inscription et connexion
- Gestion des rôles (ADMIN / USER)
- Création, suppression et affichage de documents
- File d’attente BullMQ (Redis)
- Tests unitaires & e2e
- CI/CD avec GitHub Actions

## 📦 Technologies principales

- **NestJS** (GraphQL, Modules, Services)
- **Prisma ORM**
- **PostgreSQL**
- **Redis** (BullMQ)
- **JWT**
- **Docker / Docker Compose**
- **Jest** pour les tests
- **ESLint** pour la qualité de code

## ⚙️ Prérequis

- Node.js 22
- npm
- Docker & Docker Compose
- Prisma CLI (`npm install -g prisma`)

## 🧪 Lancer le projet en local

### 1. Cloner le repo

```bash
git clone <url-du-repo>
cd Projet-Web
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d’environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://adam:password123@localhost:5432/projetweb?schema=public"
REDIS_URL="redis://:admin@localhost:6379"
JWT_SECRET="super-secret"
JWT_EXPIRES_IN="1d"
```

### 4. Lancer les services via Docker

```bash
docker-compose up -d
```

Cela lance :

- PostgreSQL (port 5432)
- Redis (port 6379)

### 5. Appliquer les migrations Prisma

```bash
npx prisma migrate deploy
```

## ▶️ Démarrage du serveur

```bash
npm run start:dev
```

Le serveur sera accessible sur :  
📍 `http://localhost:3000`

Et GraphQL Playground sur :  
📍 `http://localhost:3000/graphql`

## 🧪 Tester l'API (GraphQL)

Utilisez Postman ou GraphQL Playground pour :

- `register`
- `login`
- `createDocument`
- `getDocumentsByUser`
- `deleteDocument`

Ajoutez le token JWT dans les headers :

```http
Authorization: Bearer VOTRE_TOKEN
```

## ✅ Scripts utiles

```bash
npm run start:dev       # Lancer le serveur en dev
npm run lint            # Linter le code
npm run test            # Lancer les tests unitaires
npm run test:e2e        # Lancer les tests e2e
npm run build           # Build de production
```

## 🔁 Tests Postman avec Newman

Exporter votre collection Postman dans `postman/ProjetWeb.postman_collection.json`, puis :

```bash
npm install -g newman
newman run postman/ProjetWeb.postman_collection.json
```

## 🧪 CI/CD (GitHub Actions)

Le workflow CI :

- Lance `npm install`
- Génère le client Prisma
- Exécute `npm run lint`
- Exécute `npm run test`
- Démarre le projet
- Lance les tests Postman avec Newman

## 🗃️ Structure du projet

```
src/
├── auth/           # Authentification JWT
├── user/           # Utilisateurs
├── document/       # Documents
├── health/         # Monitoring
├── prisma/         # Prisma client et migrations
└── main.ts         # Point d’entrée de l’app
```
