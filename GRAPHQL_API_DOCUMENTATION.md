# API GraphQL - Documentation Complète

## Base URL

```
http://localhost:4000/graphql
```

## Authentification

### 1. Connexion (Login)

**Mutation :** `login`

```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    access_token
    user {
      id
      email
      fullName
      role
      createdAt
    }
  }
}
```

**Variables :**

```json
{
  "loginInput": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($loginInput: LoginInput!) { login(loginInput: $loginInput) { access_token user { id email fullName role createdAt } } }",
    "variables": {
      "loginInput": {
        "email": "user@example.com",
        "password": "password123"
      }
    }
  }'
```

### 2. Inscription (Register)

**Mutation :** `register`

```graphql
mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    access_token
    user {
      id
      email
      fullName
      role
      createdAt
    }
  }
}
```

**Variables :**

```json
{
  "registerInput": {
    "email": "nouveau@example.com",
    "password": "password123",
    "fullName": "Nouvel Utilisateur"
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Register($registerInput: RegisterInput!) { register(registerInput: $registerInput) { access_token user { id email fullName role createdAt } } }",
    "variables": {
      "registerInput": {
        "email": "nouveau@example.com",
        "password": "password123",
        "fullName": "Nouvel Utilisateur"
      }
    }
  }'
```

### 3. Utilisateur actuel (Me)

**Query :** `me` (nécessite authentification)

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

**Headers requis :**

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { me { id email fullName role createdAt } }"
  }'
```

## Utilisateurs

### 4. Liste des utilisateurs

**Query :** `users`

```graphql
query GetAllUsers {
  users {
    id
    email
    fullName
    role
    createdAt
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id email fullName role createdAt } }"
  }'
```

### 5. Utilisateur par ID

**Query :** `user`

```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    email
    fullName
    role
    createdAt
  }
}
```

**Variables :**

```json
{
  "id": "user-id-here"
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: String!) { user(id: $id) { id email fullName role createdAt } }",
    "variables": {
      "id": "user-id-here"
    }
  }'
```

## Documents

### 6. Mes documents

**Query :** `myDocuments` (nécessite authentification)

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
      role
    }
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { myDocuments { id title description fileUrl userId createdAt updatedAt user { id email fullName role } } }"
  }'
```

### 7. Tous les documents (Admin seulement)

**Query :** `documents`

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
      role
    }
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { documents { id title description fileUrl userId createdAt updatedAt user { id email fullName role } } }"
  }'
```

### 8. Document par ID

**Query :** `document`

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
      role
    }
  }
}
```

**Variables :**

```json
{
  "id": "document-id-here"
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query GetDocument($id: String!) { document(id: $id) { id title description fileUrl userId createdAt updatedAt user { id email fullName role } } }",
    "variables": {
      "id": "document-id-here"
    }
  }'
```

### 9. Créer un document

**Mutation :** `createDocument`

```graphql
mutation CreateDocument($createDocumentInput: CreateDocumentInput!) {
  createDocument(createDocumentInput: $createDocumentInput) {
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

**Variables :**

```json
{
  "createDocumentInput": {
    "title": "Mon Document",
    "description": "Description du document",
    "fileUrl": "https://example.com/file.pdf"
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "mutation CreateDocument($createDocumentInput: CreateDocumentInput!) { createDocument(createDocumentInput: $createDocumentInput) { id title description fileUrl userId createdAt updatedAt } }",
    "variables": {
      "createDocumentInput": {
        "title": "Mon Document",
        "description": "Description du document",
        "fileUrl": "https://example.com/file.pdf"
      }
    }
  }'
```

### 10. Modifier un document

**Mutation :** `updateDocument`

```graphql
mutation UpdateDocument($updateDocumentInput: UpdateDocumentInput!) {
  updateDocument(updateDocumentInput: $updateDocumentInput) {
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

**Variables :**

```json
{
  "updateDocumentInput": {
    "id": "document-id-here",
    "title": "Titre modifié",
    "description": "Description modifiée",
    "fileUrl": "https://example.com/new-file.pdf"
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "mutation UpdateDocument($updateDocumentInput: UpdateDocumentInput!) { updateDocument(updateDocumentInput: $updateDocumentInput) { id title description fileUrl userId createdAt updatedAt } }",
    "variables": {
      "updateDocumentInput": {
        "id": "document-id-here",
        "title": "Titre modifié",
        "description": "Description modifiée",
        "fileUrl": "https://example.com/new-file.pdf"
      }
    }
  }'
```

### 11. Supprimer un document

**Mutation :** `removeDocument`

```graphql
mutation RemoveDocument($id: String!) {
  removeDocument(id: $id) {
    id
    title
  }
}
```

**Variables :**

```json
{
  "id": "document-id-here"
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "mutation RemoveDocument($id: String!) { removeDocument(id: $id) { id title } }",
    "variables": {
      "id": "document-id-here"
    }
  }'
```

## Test de base

### 12. Hello Query

**Query :** `hello`

```graphql
query Hello {
  hello {
    message
  }
}
```

**Exemple avec curl :**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { hello { message } }"
  }'
```

## Ordre d'utilisation recommandé

1. **Inscription** → `register` (si nouveau compte)
2. **Connexion** → `login` (obtenir le token)
3. **Vérifier l'utilisateur** → `me` (avec token)
4. **Créer un document** → `createDocument` (avec token)
5. **Lister mes documents** → `myDocuments` (avec token)
6. **Modifier un document** → `updateDocument` (avec token)
7. **Supprimer un document** → `removeDocument` (avec token)

## Gestion des erreurs

### Erreurs d'authentification

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHORIZED"
      }
    }
  ]
}
```

### Erreurs de validation

```json
{
  "errors": [
    {
      "message": "Invalid credentials",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

## Types GraphQL

### Input Types

```graphql
input LoginInput {
  email: String!
  password: String!
}

input RegisterInput {
  email: String!
  password: String!
  fullName: String!
}

input CreateDocumentInput {
  title: String!
  description: String!
  fileUrl: String!
}

input UpdateDocumentInput {
  title: String
  description: String
  fileUrl: String
  id: String!
}
```

### Object Types

```graphql
type User {
  id: ID!
  email: String!
  fullName: String!
  role: Role!
  createdAt: String!
}

type Document {
  id: ID!
  title: String!
  description: String!
  fileUrl: String!
  userId: String!
  user: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type LoginResponse {
  access_token: String!
  user: User!
}

enum Role {
  USER
  ADMIN
}
```

## Playground GraphQL

Accédez au playground GraphQL pour tester les requêtes interactivement :

```
http://localhost:4000/graphql
```
