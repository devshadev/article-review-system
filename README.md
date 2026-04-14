# Article Review System

This project now runs with:
- a Next.js UI (`/app`)
- a standalone Node.js + Express + MongoDB backend (`/backend`)

## Setup

### 1) Frontend env

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 2) Backend env

Copy `backend/.env.example` to `backend/.env` and fill values:

```bash
cp backend/.env.example backend/.env
```

Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Required backend env keys:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

## Run

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run backend:dev
```

Backend seed:

```bash
npm run backend:seed
```

## API quick checks

Health:

```bash
curl http://localhost:4000/api/health
```

Signup:

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@example.com\",\"password\":\"password123\",\"name\":\"Demo\"}"
```

Create article:

```bash
curl -X POST http://localhost:4000/api/articles \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com/article-1\",\"title\":\"Article 1\"}"
```

## Notes

- The frontend reads data from `NEXT_PUBLIC_API_BASE_URL`.
- Reviews write endpoints require JWT Bearer token.
- Prisma and Next API route database path have been removed from runtime.
