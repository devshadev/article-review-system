# Article Review System - Requirements

## Core Concept
A platform where users can add articles and review them based on structured criteria.

## Features

### 1. Article Creation
- Add via URL (auto metadata extraction)
- Manual creation fallback
- Prevent duplicate URLs

### 2. Article Storage
Each article contains:
- title
- description
- url
- image
- source (domain)
- createdAt

### 3. Review System
Each review includes:
- clarity (1-5)
- depth (1-5)
- usefulness (1-5)
- credibility (1-5)
- optional comment

Rules:
- One review per user per article
- Editable

### 4. Article Page
- Article metadata
- Aggregated ratings
- Review list

### 5. Global Feed
- List of all articles
- Filters:
  - rating
  - tags
  - date
- Sorting:
  - newest
  - highest rated
  - most reviewed
