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

Windows PowerShell:# Article Review System

A full-stack web application that allows users to submit article URLs, auto-fetch metadata, and leave structured star ratings and reviews.

**Live Frontend:** https://article-review-system.vercel.app/
**Live Backend:** https://article-review-system.onrender.com/

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Pages & UI Routes](#pages--ui-routes)
5. [Backend API Routes](#backend-api-routes)
6. [Authentication Flow](#authentication-flow)
7. [Data Models](#data-models)
8. [How to Run Locally](#how-to-run-locally)
9. [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Inline CSS with CSS variables (Brutalist design system) |
| Backend | Node.js / Express (hosted on Render) |
| Auth | JWT (JSON Web Tokens) stored in localStorage |
| Fonts | Unbounded (display) + Space Mono (body/code) via Google Fonts |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                       │
│                                                         │
│   Next.js Frontend (Vercel)                             │
│   https://article-review-system.vercel.app              │
│                                                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐  │
│   │  /       │  │ /login   │  │ /signup  │  │/add-  │  │
│   │  Feed    │  │          │  │          │  │article│  │
│   └──────────┘  └──────────┘  └──────────┘  └───────┘  │
│          │             │             │            │      │
└──────────┼─────────────┼─────────────┼────────────┼──────┘
           │   REST API calls (fetch)  │            │
           ▼             ▼             ▼            ▼
┌─────────────────────────────────────────────────────────┐
│              Express Backend (Render)                   │
│         https://article-review-system.onrender.com      │
│                                                         │
│   /api/auth/signup    /api/auth/login                   │
│   /api/articles       /api/articles/:id/reviews         │
│                                                         │
│                    ┌──────────┐                         │
│                    │ Database │                         │
│                    └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

The frontend is a **Next.js** app deployed on **Vercel**. It communicates with an **Express** REST API deployed on **Render**. There is no server-side session — authentication is handled entirely via **JWT tokens** that the frontend stores in `localStorage` and sends as `Authorization: Bearer <token>` headers on protected requests.

---

## Project Structure

### Frontend (`/`)

```
app/
├── layout.tsx                  # Root layout — loads fonts, mounts NavBar
├── globals.css                 # CSS variables, brutalist design tokens, scrollbar
├── page.tsx                    # Home page — article feed (server component)
│
├── login/
│   └── page.tsx                # Login page
├── signup/
│   └── page.tsx                # Signup page
├── add-article/
│   └── page.tsx                # Submit a new article URL
├── articles/
│   └── [id]/
│       └── page.tsx            # Article detail + review submission + reviews list
│
└── components/
    ├── nav-bar.tsx             # Sticky top nav with auth state
    ├── page-shell.tsx          # Reusable page header + content wrapper
    ├── brutal-ui.tsx           # Design system: BrutalInput, BrutalTextarea, BrutalButton
    └── add-article-form.tsx    # (legacy) original combined auth+submit form
```

---

## Pages & UI Routes

### `GET /` — Article Feed
The home page. Fetches all articles from the backend on the server side (`cache: no-store`) and renders them in a responsive grid. Each card shows the article title, description snippet, source domain, average rating, and review count. A highlighted **READ →** button links to the original article URL.

### `GET /login` — Login
A form that takes an email and password, calls `POST /api/auth/login`, and on success stores the JWT token and user email in `localStorage`. Redirects to the feed on success.

### `GET /signup` — Sign Up
A form that takes name (optional), email, and password. Calls `POST /api/auth/signup`. On success stores the JWT and redirects to the feed.

### `GET /add-article` — Add Article
A protected page for submitting a new article URL. Shows the user's login status at the top. Requires a valid JWT — if the user is not logged in, the submit button is disabled and a login prompt is shown. Optional title and description fields act as fallbacks if the backend cannot auto-fetch metadata from the URL.

### `GET /articles/[id]` — Article Detail & Reviews
A dynamic route for a specific article. Two-column layout:
- **Left column** — star rating widget (1–5) + comment textarea + submit button
- **Right column** — chronological list of all submitted reviews with ratings, comments, and timestamps

Submitting a review requires a valid JWT.

---

## Backend API Routes

Base URL: `https://article-review-system.onrender.com`

### Auth

| Method | Route | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register a new user. Body: `{ email, password, name? }`. Returns `{ token, user }` |
| POST | `/api/auth/login` | No | Log in. Body: `{ email, password }`. Returns `{ token, user }` |

### Articles

| Method | Route | Auth Required | Description |
|---|---|---|---|
| GET | `/api/articles` | No | List all articles with review stats |
| POST | `/api/articles` | Yes (JWT) | Submit a new article URL. Body: `{ url, title?, description? }`. Backend attempts to auto-fetch title/description from the URL |
| GET | `/api/articles/:id` | No | Get a single article by ID |

### Reviews

| Method | Route | Auth Required | Description |
|---|---|---|---|
| GET | `/api/articles/:id/reviews` | No | List all reviews for an article |
| POST | `/api/articles/:id/reviews` | Yes (JWT) | Submit a review. Body: `{ rating, comment? }`. Rating must be 1–5 |

### Request / Response Examples

**POST `/api/auth/signup`**
```json
// Request body
{ "email": "user@example.com", "password": "secret123", "name": "Jane" }

// Response 200
{ "token": "eyJhbGci...", "user": { "email": "user@example.com" } }
```

**POST `/api/articles`**
```json
// Request body
{ "url": "https://example.com/article", "title": "Optional fallback title" }

// Authorization header
"Authorization": "Bearer eyJhbGci..."

// Response 200
{ "id": "abc123", "title": "Auto-fetched Title", "url": "...", ... }
```

**POST `/api/articles/:id/reviews`**
```json
// Request body
{ "rating": 4, "comment": "Really insightful article." }

// Response 200
{ "id": "rev456", "rating": 4, "comment": "Really insightful article.", "createdAt": "..." }
```

---

## Authentication Flow

```
1. User fills in email + password on /signup or /login
           │
           ▼
2. Frontend POSTs to /api/auth/signup or /api/auth/login
           │
           ▼
3. Backend validates credentials, returns JWT token
           │
           ▼
4. Frontend saves token to localStorage
   - localStorage["authToken"]   = "eyJhbGci..."
   - localStorage["authUserEmail"] = "user@example.com"
           │
           ▼
5. NavBar reads localStorage on mount → shows user email + Logout button
           │
           ▼
6. Protected requests (add article, submit review) include:
   Header: "Authorization: Bearer eyJhbGci..."
           │
           ▼
7. Logout clears localStorage and resets UI state
```

> **Note:** Because JWT is stored in `localStorage` (not httpOnly cookies), it is accessible to JavaScript. This is a common pattern for SPAs but be aware of XSS considerations in production.

---

## Data Models

### User
```
id          string   Unique identifier
email       string   Unique, used for login
password    string   Hashed before storage
name        string?  Optional display name
createdAt   datetime
```

### Article
```
id            string   Unique identifier
url           string   The submitted article URL
title         string   Auto-fetched or manually provided
description   string?  Auto-fetched or manually provided
source        string?  Domain extracted from URL (e.g. "bbc.co.uk")
reviewCount   int      Computed — total number of reviews
averageRating float?   Computed — average of all review ratings
createdAt     datetime
```

### Review
```
id          string   Unique identifier
articleId   string   Foreign key → Article
userId      string   Foreign key → User
rating      int      1 to 5 (inclusive)
comment     string?  Optional written review
createdAt   datetime
```

---

## How to Run Locally

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### 1. Clone the repositories

```bash
# Frontend
git clone <frontend-repo-url>
cd frontend

# Backend (in a separate terminal)
git clone <backend-repo-url>
cd backend
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=4000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key_here
```

Start the backend:

```bash
npm run dev
# Server runs on http://127.0.0.1:4000
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4000
```

> If left unset, the frontend defaults to `http://127.0.0.1:4000` automatically.

Start the frontend:

```bash
npm run dev
# App runs on http://localhost:3000
```

### 4. Open the app

Visit `http://localhost:3000` in your browser.

1. Go to `/signup` and create an account
2. You will be redirected to the feed
3. Go to `/add-article` and submit an article URL
4. Click the article card on the feed to open the review page
5. Submit a star rating and optional comment

---

## Deployment

### Frontend — Vercel

The frontend is deployed automatically via Vercel's GitHub integration.

- **Build command:** `next build`
- **Output directory:** `.next`
- **Environment variable set in Vercel dashboard:**
  ```
  NEXT_PUBLIC_API_BASE_URL=https://article-review-system.onrender.com
  ```

### Backend — Render

The backend is deployed as a **Web Service** on Render.

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables set in Render dashboard:**
  ```
  PORT=4000
  DATABASE_URL=...
  JWT_SECRET=...
  ```

> Render free-tier services spin down after 15 minutes of inactivity. The first request after a cold start may take 30–60 seconds to respond. This is expected behaviour on the free plan.

---

## Design System

The UI follows a **Brutalist** design language with the following tokens:

| Token | Value | Usage |
|---|---|---|
| `--black` | `#0A0A0A` | Borders, text, shadows |
| `--white` | `#F5F0E8` | Page background, card backgrounds |
| `--yellow` | `#F5E642` | Primary actions, navbar brand, highlights |
| `--blue` | `#1A3CFF` | Secondary actions, links, login accent |
| `--red` | `#E63329` | Errors, logout, danger states |
| `--green` | `#00C853` | Success states, signup accent |
| `--font-display` | Unbounded | Headings, buttons, labels |
| `--font-mono` | Space Mono | Body text, inputs, metadata |
| `--border` | `3px solid #0A0A0A` | All component borders |
| `--shadow` | `6px 6px 0px #0A0A0A` | Hard-offset box shadows |

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
