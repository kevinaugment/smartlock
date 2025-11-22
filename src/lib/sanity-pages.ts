import { client } from './sanity'

// 获取网站设置
export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0] {
    _id,
    seo {
      siteTitle,
      titleTemplate,
      defaultDescription,
      keywords,
      "ogImage": ogImage.asset->url,
      "favicon": favicon.asset->url
    },
    identity {
      siteName,
      tagline,
      "logo": logo.asset->url,
      logoText
    },
    contact {
      email,
      phone,
      address
    },
    social {
      twitter,
      facebook,
      linkedin,
      github,
      youtube
    },
    navigation {
      header[] {
        label,
        url,
        openInNewTab
      },
      footer[] {
        title,
        links[] {
          label,
          url
        }
      }
    },
    analytics {
      googleAnalyticsId,
      googleTagManagerId,
      facebookPixelId
    },
    customScripts {
      headScripts,
      bodyScripts
    },
    maintenance {
      enabled,
      message
    }
  }`)
}

// 获取页面数据
export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      "slug": slug.current,
      pageType,
      seo {
        metaTitle,
        metaDescription,
        keywords,
        "ogImage": ogImage.asset->url,
        noIndex
      },
      content,
      hero {
        enabled,
        headline,
        subheadline,
        "backgroundImage": backgroundImage.asset->url,
        ctaButton {
          text,
          link
        }
      },
      featuredArticles[]->{
        title,
        "slug": slug.current,
        description,
        category->{
          name,
          "slug": slug.current
        }
      },
      featuredCalculators[]->{
        name,
        "slug": slug.current,
        description,
        url
      },
      publishedAt,
      status
    }`,
    { slug }
  )
}

// 获取首页数据
export async function getHomePage() {
  return getPageBySlug('home')
}

// 获取所有已发布页面
export async function getAllPublishedPages() {
  return client.fetch(`*[_type == "page" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    pageType,
    publishedAt
  }`)
}

// 生成SEO元数据
export function generateSEOMetadata(page: any, siteSettings: any) {
  const title = page.seo?.metaTitle || page.title
  const description = page.seo?.metaDescription || siteSettings.seo?.defaultDescription
  const keywords = page.seo?.keywords || siteSettings.seo?.keywords || []
  const ogImage = page.seo?.ogImage || siteSettings.seo?.ogImage
  
  const formattedTitle = siteSettings.seo?.titleTemplate
    ? siteSettings.seo.titleTemplate.replace('%s', title)
    : title
  
  return {
    title: formattedTitle,
    description,
    keywords: keywords.join(', '),
    ogImage,
    noIndex: page.seo?.noIndex || false,
  }
}
