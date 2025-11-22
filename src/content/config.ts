import { defineCollection, z } from 'astro:content';

// Articles collection (Core + Support articles)
const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'protocols',
      'security',
      'installation',
      'use-cases',
      'guides',
      'support',
      'technical',
      'integration',
    ]),

    // Dates
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Smart Lock Engineering Team'),

    // Content metrics
    wordCount: z.number(),
    readingTime: z.number(), // minutes

    // SEO
    keywords: z.array(z.string()),

    // Taxonomy
    tags: z.array(z.string()),
    isPillar: z.boolean().default(false),
    isSupport: z.boolean().default(false),

    // Relationships
    relatedTools: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional(),

    // Display
    featured: z.boolean().default(false),
    featuredImage: z.string().optional(),
  }),
});

// Tools collection (Calculator metadata)
const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),

    // Tool specifics
    componentName: z.string(), // React component name
    complexity: z.enum(['simple', 'moderate', 'complex']),

    // Tool metadata
    inputs: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          label: z.string(),
          description: z.string(),
          required: z.boolean().default(true),
        })
      )
      .optional(),
    outputs: z.array(z.string()).optional(),

    // Content
    wordCount: z.number(),
    relatedArticles: z.array(z.string()),

    // SEO
    keywords: z.array(z.string()),
  }),
});

export const collections = {
  articles: articlesCollection,
  tools: toolsCollection,
};
