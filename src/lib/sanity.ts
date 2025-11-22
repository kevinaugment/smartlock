import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

export const client: SanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: import.meta.env.PROD,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
})

// 查询所有文章
export async function getAllArticles() {
  return client.fetch(`*[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current
    },
    tags,
    featured,
    readingTime,
    publishedAt,
    updatedAt
  }`)
}

// 根据slug查询文章
export async function getArticleBySlug(categorySlug: string, articleSlug: string) {
  const fullSlug = `${categorySlug}/${articleSlug}`
  
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      category->{
        name,
        "slug": slug.current
      },
      tags,
      featured,
      readingTime,
      content,
      publishedAt,
      updatedAt,
      relatedArticles[]->{
        title,
        "slug": slug.current,
        description
      },
      relatedCalculators[]->{
        name,
        "slug": slug.current,
        url
      }
    }`,
    { slug: fullSlug }
  )
}

// 查询所有分类
export async function getAllCategories() {
  return client.fetch(`*[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon
  }`)
}

// 根据分类查询文章
export async function getArticlesByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      tags,
      featured,
      readingTime,
      publishedAt
    }`,
    { categorySlug }
  )
}

// 查询特色文章
export async function getFeaturedArticles(limit = 6) {
  return client.fetch(
    `*[_type == "article" && featured == true] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      "slug": slug.current,
      description,
      category->{
        name,
        "slug": slug.current
      },
      readingTime,
      publishedAt
    }`
  )
}

// 搜索文章
export async function searchArticles(query: string) {
  const searchQuery = `*[_type == "article" && (
    title match $searchTerm ||
    description match $searchTerm ||
    content match $searchTerm
  )] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current
    },
    readingTime,
    publishedAt
  }`
  
  return client.fetch(searchQuery, { searchTerm: `${query}*` })
}
