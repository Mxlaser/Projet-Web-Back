# Projet Web – Gestion de Documents

Application complète de gestion de documents avec authentification, upload, et rôles utilisateur. Basée sur **NestJS (GraphQL)** en backend et **Next.js 15** en frontend.

## 🧩 Technologies

### Backend
- NestJS + GraphQL (code-first)
- Prisma ORM + PostgreSQL
- Redis + BullMQ
- JWT Auth (Passport)
- Docker / CI GitHub Actions

### Frontend
- Next.js 15 + App Router
- TypeScript + Tailwind CSS
- React Hook Form + Zod
- Axios + Lucide + Radix UI

---

## ⚙️ Prérequis

- Node.js 22 (via `nvm use 22`)
- Yarn
- Docker & Docker Compose

---

## 🚀 Lancement du projet

### 1. Cloner le repo

```bash
git clone <repo-url>
cd Projet-Web
```

### 2. Installer les dépendances

```bash
# Backend
yarn install

# Frontend
cd frontend
yarn install
cd ..
```

### 3. Configurer les fichiers `.env`

**Backend** – `.env` à la racine :

```env
DATABASE_URL="postgresql://adam:password123@localhost:5432/projetweb?schema=public"
REDIS_URL="redis://:admin@localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1d"
```

**Frontend** – `frontend/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

### 4. Lancer tous les services

```bash
docker-compose up -d
```

---

### 5. Appliquer les migrations Prisma

```bash
yarn prisma migrate deploy
```

---

### 6. Lancer les apps

**Backend** :

```bash
yarn start:dev
```

**Frontend** :

```bash
cd frontend
yarn dev
```

---

## 🔗 Accès

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000
- **GraphQL Playground** : http://localhost:3000/graphql

---

## 🧪 Tests

### Backend

```bash
yarn test           # tests unitaires
yarn test:e2e       # tests end-to-end
yarn lint           # analyse statique
```

### Frontend

```bash
yarn test
```

---

## 📁 Structure du projet

```
Projet-Web/
├── src/                    # Backend (NestJS)
│   ├── auth/
│   ├── user/
│   ├── document/
│   └── ...
├── frontend/               # Frontend (Next.js)
│   └── src/
│       ├── app/            # Pages et routes
│       ├── components/     # UI réutilisable
│       ├── contexts/       # Context API
│       └── lib/            # Services/API
├── prisma/                 # Schéma DB
├── postman/                # Collection API
├── docker-compose.yml
└── README.md
```

---

## 🧪 API GraphQL

### 🔐 Auth

- `register(createUserInput)`
- `login(loginInput): LoginResponse`
- `me()`

### 📄 Documents

- `createDocument(input, userId)`
- `getDocumentsByUser(userId)`
- `deleteDocument(id)`

> ⚠️ Toutes les mutations sauf `login` et `register` nécessitent un token JWT (`Authorization: Bearer xxx`)

---

## 📬 Tests Postman / Newman

1. Importe la collection `postman/ProjetWeb.postman_collection.json` dans Postman
2. Exécute via Newman :
```bash
npx newman run postman/ProjetWeb.postman_collection.json
```

---

## 🐳 Docker

### Build et run

```bash
docker-compose up -d --build
```

### Stopper

```bash
docker-compose down
```

---

## ✅ CI GitHub Actions

- Lint, test et build à chaque push/pull_request
- Tests Postman automatisés
- Vérification du serveur GraphQL

---

## 🙋‍♂️ Auteurs

- Dev 1 : Backend API / Auth / Base de données
- Dev 2 : Asynchrone, Redis, BullMQ, Tests, CI/CD
- Dev 3 : Frontend Next.js, Auth UI, Upload UI, Intégration API

---

## 📌 Remarques

- Le mot de passe est hashé avec `bcrypt`
- La base est persistée via volume Docker
- Le token JWT expire selon `JWT_EXPIRES_IN` (ex : `1d`)
