import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // Global SEO
    defineField({
      name: 'seo',
      title: 'Global SEO',
      type: 'object',
      description: '全局SEO设置',
      fields: [
        {
          name: 'siteTitle',
          title: 'Site Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
          description: '网站名称',
        },
        {
          name: 'titleTemplate',
          title: 'Title Template',
          type: 'string',
          description: '标题模板（如：%s | Smart Lock Hub）',
          initialValue: '%s | Smart Lock Hub',
        },
        {
          name: 'defaultDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
          description: '默认SEO描述',
        },
        {
          name: 'keywords',
          title: 'Global Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
          description: '全局关键词',
        },
        {
          name: 'ogImage',
          title: 'Default OG Image',
          type: 'image',
          description: '默认社交媒体分享图',
        },
        {
          name: 'favicon',
          title: 'Favicon',
          type: 'image',
          description: '网站图标',
        },
      ],
    }),
    
    // Site Identity
    defineField({
      name: 'identity',
      title: 'Site Identity',
      type: 'object',
      fields: [
        {
          name: 'siteName',
          title: 'Site Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          description: '网站标语',
        },
        {
          name: 'logo',
          title: 'Logo',
          type: 'image',
          description: '网站Logo',
        },
        {
          name: 'logoText',
          title: 'Logo Text',
          type: 'string',
          description: '无Logo时显示的文字',
        },
      ],
    }),
    
    // Contact Information
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
        },
      ],
    }),
    
    // Social Media
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'string',
          description: '完整URL或用户名',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'string',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string',
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'string',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'string',
        },
      ],
    }),
    
    // Navigation
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      fields: [
        {
          name: 'header',
          title: 'Header Navigation',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'openInNewTab',
                  title: 'Open in New Tab',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'url',
                },
              },
            },
          ],
        },
        {
          name: 'footer',
          title: 'Footer Navigation',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Section Title',
                  type: 'string',
                },
                {
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'label',
                          title: 'Label',
                          type: 'string',
                        },
                        {
                          name: 'url',
                          title: 'URL',
                          type: 'string',
                        },
                      ],
                    },
                  ],
                },
              ],
              preview: {
                select: {
                  title: 'title',
                },
              },
            },
          ],
        },
      ],
    }),
    
    // Analytics
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'GA4 Measurement ID（如：G-XXXXXXXXXX）',
        },
        {
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'GTM ID（如：GTM-XXXXXXX）',
        },
        {
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string',
        },
      ],
    }),
    
    // Scripts
    defineField({
      name: 'customScripts',
      title: 'Custom Scripts',
      type: 'object',
      fields: [
        {
          name: 'headScripts',
          title: 'Head Scripts',
          type: 'text',
          rows: 5,
          description: '在</head>前插入的脚本',
        },
        {
          name: 'bodyScripts',
          title: 'Body Scripts',
          type: 'text',
          rows: 5,
          description: '在</body>前插入的脚本',
        },
      ],
    }),
    
    // Maintenance Mode
    defineField({
      name: 'maintenance',
      title: 'Maintenance Mode',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Maintenance Mode',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'message',
          title: 'Maintenance Message',
          type: 'text',
          rows: 3,
        },
      ],
    }),
  ],
  
  preview: {
    select: {
      title: 'identity.siteName',
      subtitle: 'seo.siteTitle',
    },
  },
})
