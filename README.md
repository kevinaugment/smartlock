# Smart Lock Engineering Hub

Technical smart lock engineering hub for protocols, security, deployment guides, and calculators.

## Tech Stack

- **Framework**: Astro 4.x (Static Site Generation)
- **Styling**: TailwindCSS + Typography plugin
- **Interactivity**: React 18 (calculators only)
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Pages
- **Language**: Pure English (US market)

## Project Structure

```
smartlock/
├── src/
│   ├── content/         # Content Collections (MDX articles)
│   ├── components/      # React calculators + Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes + API endpoints
│   ├── styles/          # Global CSS
│   └── utils/           # Utility functions
├── db/                  # D1 database schema and seeds
├── doc/                 # Planning documents
└── public/              # Static assets
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:4321

### 3. Build for Production

```bash
npm run build
npm run preview
```

## Content Development

### Creating Articles

Create MDX files in `src/content/articles/[category]/`:

```bash
touch src/content/articles/protocols/new-article.mdx
```

Add frontmatter:

```yaml
---
title: "Your Article Title"
description: "Brief description"
category: protocols
pubDate: 2024-01-15
wordCount: 3000
readingTime: 12
keywords: ["smart lock", "protocol"]
tags: ["zigbee", "zwave"]
isPillar: false
---
```

### Creating Calculators

1. Create React component in `src/components/calculators/`
2. Create tool metadata in `src/content/tools/`
3. Create page in `src/pages/tools/`

## Database (D1)

### Local Development

```bash
# Create local database
npx wrangler d1 execute DB --local --file=./db/schema.sql

# Query database
npx wrangler d1 execute DB --local --command "SELECT * FROM page_views"
```

### Production

```bash
# Create production database
npx wrangler d1 create smartlock_production

# Run migrations
npx wrangler d1 execute smartlock_production --file=./db/schema.sql
```

## Deployment

Deploy to Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist
```

## Documentation

- **ARCHITECTURE.MD**: Complete technical architecture
- **ARTICLE.MD**: Content planning (37 core + 62 support articles)
- **CALC.MD**: Calculator specifications (15 tools)
- **SUPPORT.MD**: Support article details
- **PRD.MD**: Product requirements

## License

All rights reserved.
