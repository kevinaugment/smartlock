import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'calculator',
  title: 'Calculator',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: '简短描述，显示在工具列表页',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon name',
    }),
    
    // 教育内容部分 - 显示在计算器下方
    defineField({
      name: 'educationalContent',
      title: 'Educational Content',
      type: 'object',
      description: '计算器下方的教育内容（Deep Dive / Learn More）',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: '如：Deep Dive、Learn More、Complete Guide等',
        },
        {
          name: 'articles',
          title: 'Related Articles',
          type: 'array',
          description: '关联的深度文章',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'article',
                  title: 'Article',
                  type: 'reference',
                  to: [{ type: 'article' }],
                },
                {
                  name: 'customTitle',
                  title: 'Custom Title',
                  type: 'string',
                  description: '可选：覆盖文章标题',
                },
                {
                  name: 'customDescription',
                  title: 'Custom Description',
                  type: 'text',
                  rows: 2,
                  description: '可选：自定义描述',
                },
              ],
              preview: {
                select: {
                  title: 'customTitle',
                  articleTitle: 'article.title',
                },
                prepare({ title, articleTitle }) {
                  return {
                    title: title || articleTitle || 'Untitled',
                  }
                },
              },
            },
          ],
        },
      ],
    }),
    
    // 相关工具部分
    defineField({
      name: 'relatedTools',
      title: 'Related Tools',
      type: 'object',
      description: '相关的其他计算器工具',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Related Tools',
        },
        {
          name: 'tools',
          title: 'Tools',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'tool',
                  title: 'Tool',
                  type: 'reference',
                  to: [{ type: 'calculator' }],
                },
                {
                  name: 'customName',
                  title: 'Custom Name',
                  type: 'string',
                },
                {
                  name: 'customDescription',
                  title: 'Custom Description',
                  type: 'text',
                  rows: 2,
                },
              ],
              preview: {
                select: {
                  title: 'customName',
                  toolName: 'tool.name',
                },
                prepare({ title, toolName }) {
                  return {
                    title: title || toolName || 'Untitled',
                  }
                },
              },
            },
          ],
        },
      ],
    }),
    
    // SEO和元数据
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'SEO描述，如不填则使用description',
    }),
    
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: '是否在首页显示',
    }),
    
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: '所属分类（用于归类）',
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      featured: 'featured',
    },
    prepare({ title, subtitle, featured }) {
      return {
        title: title,
        subtitle: `${subtitle || ''}${featured ? ' • Featured' : ''}`,
      }
    },
  },
})
