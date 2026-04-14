# API Design

Base URL: `http://localhost:4000`

## Health

### GET `/api/health`
- Returns API health status.

Response:
```json
{ "status": "ok" }
```

## Auth

### POST `/api/auth/signup`
Creates a user and returns JWT token.

Body:
```json
{ "email": "demo@example.com", "password": "password123", "name": "Demo" }
```

### POST `/api/auth/login`
Authenticates user and returns JWT token.

Body:
```json
{ "email": "demo@example.com", "password": "password123" }
```

## Articles

### GET `/api/articles`
- List articles ordered by newest first.
- Includes computed fields: `reviewCount`, `averageRating`.

### GET `/api/articles/:id`
- Get single article with rating aggregate fields.

### POST `/api/articles`
- Create article by URL/title/description/image.
- Public endpoint.

Body:
```json
{
  "url": "https://example.com/article-1",
  "title": "Article title",
  "description": "optional",
  "image": "optional"
}
```

### PUT `/api/articles/:id`
- Update article fields.
- Requires `Authorization: Bearer <token>`.

### DELETE `/api/articles/:id`
- Delete article and its reviews.
- Requires `Authorization: Bearer <token>`.

## Reviews

### GET `/api/articles/:id/reviews`
- List all reviews for an article.

### POST `/api/reviews`
- Create review for an article.
- Requires `Authorization: Bearer <token>`.
- Enforces one review per user per article.

Body:
```json
{
  "articleId": "mongo_object_id",
  "clarity": 4,
  "depth": 5,
  "usefulness": 4,
  "credibility": 5,
  "comment": "optional"
}
```

### PATCH `/api/reviews/:id`
- Update your own review.
- Requires `Authorization: Bearer <token>`.

### DELETE `/api/reviews/:id`
- Delete your own review.
- Requires `Authorization: Bearer <token>`.
