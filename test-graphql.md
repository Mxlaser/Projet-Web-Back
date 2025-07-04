# Tests GraphQL - Backend

## Serveur fonctionnel ✅

Le serveur GraphQL fonctionne correctement sur `http://localhost:4000/graphql`

## Tests de base

### 1. Hello Query

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello { message } }"}'
```

**Résultat attendu :**

```json
{
  "data": {
    "hello": {
      "message": "Hello from GraphQL!"
    }
  }
}
```

### 2. Types disponibles

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { __schema { types { name } } }"}'
```

**Types d'authentification confirmés :**

- `LoginInput`
- `RegisterInput`
- `LoginResponse`

## Mutations d'authentification

### 3. Test de login

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($loginInput: LoginInput!) { login(loginInput: $loginInput) { access_token user { id email fullName role createdAt } } }",
    "variables": {
      "loginInput": {
        "email": "test@example.com",
        "password": "password123"
      }
    }
  }'
```

### 4. Test de register

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Register($registerInput: RegisterInput!) { register(registerInput: $registerInput) { access_token user { id email fullName role createdAt } } }",
    "variables": {
      "registerInput": {
        "email": "newuser@example.com",
        "password": "password123",
        "fullName": "Nouvel Utilisateur"
      }
    }
  }'
```

## Schéma mis à jour ✅

Le schéma `src/schema.gql` a été régénéré automatiquement et inclut :

- ✅ `LoginInput` avec `email` et `password`
- ✅ `RegisterInput` avec `email`, `password` et `fullName`
- ✅ `LoginResponse` avec `access_token` et `user`
- ✅ `User` avec `createdAt`

## Problème résolu ✅

L'erreur `Unknown argument "email" on field "Mutation.login"` a été résolue en :

1. Supprimant l'ancien fichier `schema.gql`
2. Redémarrant le serveur pour régénérer le schéma
3. Vérifiant que les nouveaux types sont disponibles

Le backend GraphQL est maintenant entièrement fonctionnel ! 🚀
