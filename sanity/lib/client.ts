import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

export async function getArticles() {
  return client.fetch(`*[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    category->{name, slug},
    tags,
    featured,
    readingTime,
    publishedAt,
    updatedAt
  }`)
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      category->{name, slug},
      tags,
      featured,
      readingTime,
      content,
      publishedAt,
      updatedAt,
      relatedArticles[]->{
        title,
        slug,
        description
      },
      relatedCalculators[]->{
        name,
        slug,
        url
      }
    }`,
    { slug }
  )
}

export async function getCategories() {
  return client.fetch(`*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    icon
  }`)
}

export async function getArticlesByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      tags,
      featured,
      readingTime,
      publishedAt
    }`,
    { categorySlug }
  )
}
