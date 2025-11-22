import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: '页面标题',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL路径（如：about, contact）',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'About Page', value: 'about' },
          { title: 'Contact Page', value: 'contact' },
          { title: 'Category Index', value: 'category-index' },
          { title: 'Tools Index', value: 'tools-index' },
          { title: 'Custom Page', value: 'custom' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    // SEO Section
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: 'TDK设置',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
          description: 'SEO标题（建议50-60字符，留空则使用页面标题）',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
          description: 'SEO描述（建议150-160字符）',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
          description: 'SEO关键词',
        },
        {
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          description: '社交媒体分享图片（推荐1200x630px）',
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          initialValue: false,
          description: '禁止搜索引擎索引此页面',
        },
      ],
    }),
    
    // Content Section
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          type: 'code',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
            ],
          },
        },
      ],
      description: '页面主要内容（富文本编辑器）',
    }),
    
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description: '首屏大图区域',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Hero',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
        },
        {
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 2,
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
        },
        {
          name: 'ctaButton',
          title: 'CTA Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
            },
          ],
        },
      ],
    }),
    
    // Featured Content
    defineField({
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: '特色文章（首页展示）',
    }),
    
    defineField({
      name: 'featuredCalculators',
      title: 'Featured Calculators',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'calculator' }] }],
      description: '特色工具（首页展示）',
    }),
    
    // Publishing
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      type: 'pageType',
      status: 'status',
    },
    prepare({ title, slug, type, status }) {
      return {
        title: title,
        subtitle: `/${slug} • ${type} • ${status}`,
      }
    },
  },
})
