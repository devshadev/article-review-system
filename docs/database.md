# Database Design

## User
- id
- email
- name
- createdAt

## Article
- id
- title
- description
- url (unique)
- image
- source
- createdAt

## Review
- id
- userId
- articleId
- clarity
- depth
- usefulness
- credibility
- comment
- createdAt

## Constraints
- Unique(userId, articleId)
