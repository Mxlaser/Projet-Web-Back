# Secure Docs - Backend

Plateforme sécurisée de gestion documentaire avec NestJS, GraphQL, Message Queuing, CI/CD et Tests.

## 🚀 Fonctionnalités

- **API GraphQL** avec NestJS (Code First)
- **Authentification JWT** avec gestion des rôles
- **Message Queuing** avec BullMQ et Redis
- **Tests automatisés** (unitaires et intégration)
- **CI/CD** avec GitHub Actions
- **Déploiement Docker** avec PostgreSQL
- **Gestion des documents** (CRUD sécurisé)

## 🛠️ Technologies

- **NestJS** - Framework Node.js
- **GraphQL** - API Query Language
- **BullMQ** - Message Queue avec Redis
- **PostgreSQL** - Base de données
- **Prisma** - ORM
- **JWT** - Authentification
- **Jest** - Tests
- **Docker** - Containerisation

## 📦 Installation

### Prérequis

- Node.js 22
- Docker et Docker Compose
- PostgreSQL
- Redis

### Installation locale

1. **Cloner le projet :**

```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances :**

```bash
yarn install
```

3. **Configurer l'environnement :**

```bash
cp .env.example .env
```

4. **Démarrer les services :**

```bash
docker-compose up -d
```

5. **Générer le client Prisma :**

```bash
npx prisma generate
```

6. **Exécuter les migrations :**

```bash
npx prisma migrate dev
```

7. **Démarrer l'application :**

```bash
yarn start:dev
```

L'API sera accessible sur `http://localhost:4000`
Le playground GraphQL sera accessible sur `http://localhost:4000/graphql`

## 🔐 Authentification

### Endpoints GraphQL

#### Inscription

```graphql
mutation Register($email: String!, $password: String!, $fullName: String!) {
  register(email: $email, password: $password, fullName: $fullName) {
    access_token
    user {
      id
      email
      fullName
      role
    }
  }
}
```

#### Connexion

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
    user {
      id
      email
      fullName
      role
    }
  }
}
```

#### Récupérer l'utilisateur courant

```graphql
query GetCurrentUser {
  me {
    id
    email
    fullName
    role
    createdAt
  }
}
```

## 📄 Gestion des Documents

### Queries

#### Récupérer mes documents

```graphql
query GetMyDocuments {
  myDocuments {
    id
    title
    description
    fileUrl
    userId
    createdAt
    updatedAt
    user {
      id
      email
      fullName
    }
  }
}
```

#### Récupérer un document par ID

```graphql
query GetDocument($id: String!) {
  document(id: $id) {
    id
    title
    description
    fileUrl
    userId
    createdAt
    updatedAt
    user {
      id
      email
      fullName
    }
  }
}
```

#### Récupérer tous les documents (Admin)

```graphql
query GetAllDocuments {
  documents {
    id
    title
    description
    fileUrl
    userId
    createdAt
    updatedAt
    user {
      id
      email
      fullName
    }
  }
}
```

### Mutations

#### Créer un document

```graphql
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(createDocumentInput: $input) {
    id
    title
    description
    fileUrl
    userId
    createdAt
    updatedAt
  }
}
```

#### Mettre à jour un document

```graphql
mutation UpdateDocument($input: UpdateDocumentInput!) {
  updateDocument(updateDocumentInput: $input) {
    id
    title
    description
    fileUrl
    userId
    createdAt
    updatedAt
  }
}
```

#### Supprimer un document

```graphql
mutation DeleteDocument($id: String!) {
  removeDocument(id: $id) {
    id
    title
  }
}
```

## 🔄 Message Queuing

Le système utilise BullMQ avec Redis pour gérer les événements asynchrones :

- **Création de document** → Job `document.created`
- **Mise à jour de document** → Job `document.updated`
- **Suppression de document** → Job `document.deleted`

### Configuration Redis

```yaml
redis:
  host: localhost
  port: 6379
  password: admin
```

## 🧪 Tests

### Tests unitaires

```bash
yarn test
```

### Tests avec couverture

```bash
yarn test:cov
```

### Tests en mode watch

```bash
yarn test:watch
```

### Tests e2e

```bash
yarn test:e2e
```

## 🚀 CI/CD

### GitHub Actions

Le pipeline CI/CD comprend :

1. **Tests** - Lint, tests unitaires, couverture
2. **Build** - Construction de l'image Docker
3. **Deploy** - Déploiement automatique sur Render

### Variables d'environnement requises

```bash
# GitHub Secrets
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
RENDER_SERVICE_ID=your-render-service-id
RENDER_API_KEY=your-render-api-key
```

## 🐳 Docker

### Construction de l'image

```bash
docker build -t secure-docs-backend .
```

### Démarrage avec Docker Compose

```bash
docker-compose up -d
```

### Services inclus

- **Backend** - Port 4000
- **PostgreSQL** - Port 5432
- **Redis** - Port 6379

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:4000/health
```

### Logs

```bash
# Logs de l'application
docker-compose logs backend

# Logs Redis
docker-compose logs redis

# Logs PostgreSQL
docker-compose logs postgres
```

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
DATABASE_URL=postgresql://efrei_user:efrei_password@localhost:5432/efrei_docs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
PORT=4000
NODE_ENV=development
```

## 📁 Structure du Projet

```
src/
├── auth/                    # Authentification
│   ├── guards/             # Guards JWT et rôles
│   ├── decorators/         # Décorateurs personnalisés
│   └── jwt.strategy.ts     # Stratégie JWT
├── document/               # Module documents
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # Entités GraphQL
│   ├── document.resolver.ts
│   ├── document.service.ts
│   └── document-events.processor.ts
├── user/                   # Module utilisateurs
│   ├── entities/          # Entités GraphQL
│   ├── enums/             # Énumérations
│   └── user.service.ts
├── health/                 # Health checks
└── main.ts                 # Point d'entrée
```

## 🚀 Déploiement

### Render

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déploiement automatique sur push

### Heroku

```bash
heroku create secure-docs-backend
heroku addons:create heroku-postgresql
heroku addons:create heroku-redis
git push heroku main
```

## 📝 API Documentation

La documentation complète de l'API GraphQL est disponible via le playground :
`http://localhost:4000/graphql`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur 1** - Backend & GraphQL
- **Développeur 2** - Tests & CI/CD
- **Développeur 3** - Frontend & UI
- **Développeur 4** - DevOps & Déploiement
