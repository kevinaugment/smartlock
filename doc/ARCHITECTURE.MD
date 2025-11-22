# Smart Lock Hub - Architecture Documentation

> **Solo Developer Guide** | **English-Only Website** | **Astro + Cloudflare D1**

---

## 1. Tech Stack

```yaml
Framework: Astro 4.x (Zero JS by default, SSG)
Styling: TailwindCSS + Typography plugin
Interactivity: React 18 (calculators only)
Database: Cloudflare D1 (SQLite)
Hosting: Cloudflare Pages
Language: Pure English (US spelling)
```

**Why This Stack**:
- Astro: SEO-perfect static generation + partial hydration
- D1: Free tier sufficient, edge database, simple SQLite
- React: Only for calculators, rest is pure Astro
- English-only: US market focus, easier SEO

---

## 2. Project Structure

```
smartlock/
├── src/
│   ├── content/
│   │   ├── config.ts                      # Zod schemas
│   │   ├── articles/                      # MDX files
│   │   │   ├── protocols/
│   │   │   ├── security/
│   │   │   ├── installation/
│   │   │   ├── use-cases/
│   │   │   └── support/                   # Support articles
│   │   └── tools/                         # Tool metadata
│   │
│   ├── components/
│   │   ├── calculators/                   # React (*.tsx)
│   │   │   ├── TCOCalculator.tsx
│   │   │   ├── RFLinkBudget.tsx
│   │   │   └── ProtocolWizard.tsx
│   │   ├── layout/                        # Astro (*.astro)
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── TableOfContents.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       └── RelatedArticles.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── ToolLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── protocols/[...slug].astro      # Dynamic routes
│   │   ├── security/[...slug].astro
│   │   ├── installation/[...slug].astro
│   │   ├── use-cases/[...slug].astro
│   │   ├── support/[...slug].astro
│   │   ├── tools/[tool].astro
│   │   ├── api/                           # API endpoints
│   │   │   ├── page-view.ts
│   │   │   ├── calculator-usage.ts
│   │   │   └── specs/door-locks.ts
│   │   ├── about.astro
│   │   └── privacy.astro
│   │
│   ├── utils/
│   │   ├── calculations/                  # Calculator logic
│   │   │   ├── tco.ts
│   │   │   ├── battery.ts
│   │   │   └── rf-link-budget.ts
│   │   ├── db.ts
│   │   └── seo.ts
│   │
│   └── styles/
│       └── global.css
│
├── db/
│   ├── schema.sql
│   └── seeds/lock-specs.sql
│
├── doc/                                   # Planning docs
│   ├── ARCHITECTURE.MD                    # This file
│   ├── ARTICLE.MD
│   ├── CALC.MD
│   └── SUPPORT.MD
│
├── public/
│   ├── images/
│   └── robots.txt
│
├── astro.config.mjs
├── tailwind.config.cjs
├── wrangler.toml                          # Cloudflare config
└── package.json
```

---

## 3. URL Structure (English)

```
Homepage:           /

Core Articles:      /protocols/smart-lock-protocols-overview
                    /security/smart-lock-security-analysis
                    /use-cases/smart-locks-airbnb-guide

Support Articles:   /support/smart-lock-keeps-going-offline
                    /support/how-to-install-smart-lock

Calculators:        /tools/lock-tco-calculator
                    /tools/protocol-selection-wizard

Category Indexes:   /protocols/
                    /security/
                    /support/
                    /tools/
```

---

## 4. Content Collections Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['protocols', 'security', 'installation', 'use-cases', 'guides', 'support']),
    
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Smart Lock Engineering Team'),
    
    wordCount: z.number(),
    readingTime: z.number(),
    
    // SEO
    keywords: z.array(z.string()),
    
    // Relationships
    relatedTools: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional(),
    
    // Metadata
    tags: z.array(z.string()),
    isPillar: z.boolean().default(false),
    isSupport: z.boolean().default(false),
    featured: z.boolean().default(false),
  })
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    componentName: z.string(), // React component to load
    complexity: z.enum(['simple', 'moderate', 'complex']),
    inputs: z.array(z.object({
      name: z.string(),
      type: z.string(),
      label: z.string(),
    })),
    relatedArticles: z.array(z.string()),
  })
});

export const collections = {
  'articles': articlesCollection,
  'tools': toolsCollection,
};
```

**Frontmatter Example**:
```yaml
---
title: "Smart Lock Communication Protocols: Complete Guide"
description: "Technical comparison of Wi-Fi, Zigbee, Z-Wave, Thread, and Matter"
category: protocols
pubDate: 2024-01-15
wordCount: 4500
readingTime: 18
keywords: ["smart lock protocols", "zigbee", "zwave"]
tags: ["protocols", "zigbee", "zwave", "matter"]
isPillar: true
relatedTools: ["protocol-selection-wizard", "battery-life-comparison"]
relatedArticles: ["zigbee-vs-zwave-locks"]
---
```

---

## 5. Database Schema

```sql
-- db/schema.sql

-- Page analytics
CREATE TABLE page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_url TEXT NOT NULL,
  category TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Calculator usage
CREATE TABLE calculator_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  calculator_name TEXT NOT NULL,
  input_params TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Saved calculations (shareable)
CREATE TABLE saved_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  calculator_name TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  input_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);

-- Door lock specifications
CREATE TABLE lock_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  protocol TEXT NOT NULL,
  min_door_thickness_mm INTEGER,
  max_door_thickness_mm INTEGER,
  backsets TEXT, -- JSON: [60, 70]
  hole_type TEXT,
  has_keypad BOOLEAN,
  battery_type TEXT,
  estimated_battery_life_days INTEGER,
  typical_price_usd INTEGER,
  region TEXT
);

CREATE INDEX idx_lock_specs_protocol ON lock_specifications(protocol);
```

---

## 6. Component Patterns

### Calculator Component (React)
```typescript
// src/components/calculators/TCOCalculator.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TCOCalculator() {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState(null);

  const onSubmit = async (data) => {
    // Calculate
    const tco = calculateTCO(data);
    setResult(tco);
    
    // Track usage (optional)
    await fetch('/api/calculator-usage', {
      method: 'POST',
      body: JSON.stringify({ calculator: 'tco', inputs: data })
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form inputs */}
      {result && <ResultDisplay data={result} />}
    </form>
  );
}
```

### Layout (Astro)
```astro
---
// src/layouts/ArticleLayout.astro
import BaseLayout from './BaseLayout.astro';
const { article } = Astro.props;
const { Content } = await article.render();
---

<BaseLayout title={article.data.title}>
  <article class="prose">
    <h1>{article.data.title}</h1>
    <Content />
    <RelatedArticles articles={article.data.relatedArticles} />
  </article>
</BaseLayout>
```

### Hydration Strategy
```astro
<!-- Static content (no JS sent) -->
<div class="intro">
  <h1>TCO Calculator</h1>
  <p>Calculate total cost...</p>
</div>

<!-- Interactive component (hydrated on load) -->
<TCOCalculator client:load />

<!-- Static content continues (no JS) -->
<div class="methodology">
  <h2>How We Calculate</h2>
</div>
```

---

## 7. API Endpoints

```typescript
// src/pages/api/page-view.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const { pageUrl, category } = await request.json();
  const db = locals.runtime.env.DB;
  
  await db.prepare(`
    INSERT INTO page_views (page_url, category) VALUES (?, ?)
  `).bind(pageUrl, category).run();
  
  return new Response(JSON.stringify({ success: true }));
};
```

```typescript
// src/pages/api/specs/door-locks.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals }) => {
  const protocol = url.searchParams.get('protocol');
  const db = locals.runtime.env.DB;
  
  const { results } = await db.prepare(`
    SELECT * FROM lock_specifications WHERE protocol = ?
  `).bind(protocol).all();
  
  return new Response(JSON.stringify(results));
};
```

---

## 8. SEO Configuration

### SEO Component
```astro
---
// src/components/seo/SEOHead.astro
const { title, description } = Astro.props;
const fullTitle = `${title} | Smart Lock Engineering Hub`;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<link rel="canonical" href={Astro.url.href} />
```

### Sitemap
```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://smartlockhub.engineering', // CHANGE THIS
  integrations: [sitemap()],
});
```

---

## 9. Naming Conventions

### File Names (kebab-case)
```
✅ smart-lock-protocols-overview.mdx
✅ zigbee-vs-zwave-locks.mdx
✅ tco-calculator.tsx
✅ door-lock-compatibility-checker.mdx

❌ SmartLockProtocols.mdx
❌ zigbee_vs_zwave.mdx
❌ TCOCalc.tsx
```

### Component Names (PascalCase)
```typescript
✅ TCOCalculator.tsx
✅ RFLinkBudget.tsx
✅ ProtocolWizard.tsx

❌ tco-calculator.tsx
❌ rfLinkBudget.tsx
```

### URL Slugs (kebab-case, descriptive)
```
✅ /protocols/smart-lock-protocols-overview
✅ /support/smart-lock-keeps-going-offline
✅ /tools/lock-tco-calculator

❌ /protocols/overview
❌ /support/offline
❌ /tools/tco
```

### Variable Names (camelCase)
```typescript
✅ const lockPrice = 200;
✅ const batteryLifeDays = 365;
✅ const doorThickness = 45;

❌ const lock_price = 200;
❌ const BatteryLifeDays = 365;
```

---

## 10. Development Workflow

### Initial Setup
```bash
# Clone repo
git clone <repo-url>
cd smartlock

# Install dependencies
npm install

# Setup D1 database locally
npx wrangler d1 create smartlock_dev
npx wrangler d1 execute DB --local --file=./db/schema.sql
npx wrangler d1 execute DB --local --file=./db/seeds/lock-specs.sql

# Start dev server
npm run dev
```

### Daily Development
```bash
# Start dev server (port 4321)
npm run dev

# Type check
npm run type-check

# Lint & format
npm run lint
npm run format

# Build for production
npm run build
npm run preview
```

### Creating New Article
```bash
# 1. Create MDX file
touch src/content/articles/protocols/new-article.mdx

# 2. Add frontmatter (copy from existing)
# 3. Write content in English
# 4. Test locally: npm run dev
# 5. Commit: git add . && git commit -m "Add: new article"
```

### Creating New Calculator
```bash
# 1. Create React component
touch src/components/calculators/NewCalculator.tsx

# 2. Create tool metadata
touch src/content/tools/new-calculator.md

# 3. Create page
touch src/pages/tools/new-calculator.astro

# 4. Add calculation logic
touch src/utils/calculations/new-calc.ts

# 5. Test: npm run dev
```

---

## 11. Deployment

### Cloudflare Pages Setup
```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Create D1 database (production)
npx wrangler d1 create smartlock_production

# 3. Run migrations
npx wrangler d1 execute smartlock_production --file=./db/schema.sql

# 4. Deploy
npm run build
npx wrangler pages deploy dist
```

### Environment Variables
```toml
# wrangler.toml
name = "smartlock-hub"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "smartlock_production"
database_id = "YOUR_DATABASE_ID"

[site]
bucket = "./dist"
```

### GitHub Actions (Auto Deploy)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 12. Content Standards

### Article Writing (English Only)
```markdown
✅ Use US English spelling:
   - "color" not "colour"
   - "analyze" not "analyse"
   - "center" not "centre"

✅ Clear technical writing:
   - Short paragraphs (3-4 sentences)
   - Active voice
   - Bullet points for lists
   - Code examples where relevant

✅ Consistent terminology:
   - "smart lock" not "smart-lock" or "smartlock"
   - "Zigbee" not "ZigBee" (follow official)
   - "Wi-Fi" not "WiFi" or "wifi"
```

### Code Standards
```typescript
// ✅ Good
const calculateBatteryLife = (protocol: string, usage: number): number => {
  const baseLife = protocolBatteryLife[protocol];
  return baseLife * adjustmentFactor(usage);
};

// ❌ Bad
function calc(p, u) {
  return data[p] * adj(u);
}
```

---

## 13. Performance Targets

```yaml
Core Web Vitals:
  LCP: < 2.5s
  FID: < 100ms
  CLS: < 0.1

Page Size:
  HTML: < 100KB
  CSS: < 50KB
  JS (calculator pages): < 100KB
  Images: WebP, optimized

Lighthouse Score:
  Performance: 90+
  Accessibility: 100
  Best Practices: 100
  SEO: 100
```

---

## 14. Security Considerations

```yaml
Content Security:
  - No user-generated content (static site)
  - All external links nofollow/noopener
  - HTTPS only (Cloudflare enforced)

Database:
  - D1 read-only for public APIs
  - Write operations rate-limited
  - No sensitive user data stored

Privacy:
  - No cookies (except analytics)
  - Anonymous analytics only
  - GDPR compliant (no personal data)
```

---

## 15. Maintenance Checklist

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Check Lighthouse scores
- [ ] Review analytics (top pages, calculators)
- [ ] Check broken links
- [ ] Update lock specifications database

### Quarterly
- [ ] Review and update Core Articles
- [ ] Add new calculators based on feedback
- [ ] Refresh screenshots/diagrams
- [ ] Audit external links
- [ ] Check Cloudflare limits

### Annually
- [ ] Major Astro version upgrade
- [ ] Content refresh (outdated info)
- [ ] SEO audit
- [ ] Performance optimization
- [ ] Backup D1 database

---

## Quick Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Deploy
npx wrangler pages deploy dist

# D1 database query (local)
npx wrangler d1 execute DB --local --command "SELECT * FROM page_views LIMIT 10"

# D1 database query (production)
npx wrangler d1 execute DB --command "SELECT * FROM calculator_usage GROUP BY calculator_name"
```

---

**Key Principle**: Keep it simple. As a solo developer, prioritize:
1. ✅ Static generation (fast, cheap)
2. ✅ Minimal JS (only calculators)
3. ✅ Clear structure (easy to maintain)
4. ✅ English-only (focused market)
5. ✅ Type safety (catch errors early)

**Remember**: Content quality > fancy features. Focus on Core Articles first.
