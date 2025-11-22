#!/usr/bin/env node

/**
 * 迁移脚本：将48个MDX文件迁移到Sanity CMS
 * 
 * 使用方法：
 * 1. 确保已设置环境变量 PUBLIC_SANITY_PROJECT_ID 和 SANITY_API_TOKEN
 * 2. 运行: node scripts/migrate-to-sanity.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 初始化Sanity客户端
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

// 分类映射
const categoryMap = {
  protocols: { name: 'Protocols', slug: 'protocols', icon: '📡' },
  security: { name: 'Security', slug: 'security', icon: '🔒' },
  installation: { name: 'Battery & Installation', slug: 'installation', icon: '🔋' },
  guides: { name: 'Troubleshooting', slug: 'guides', icon: '🔧' },
  'use-cases': { name: 'Use Cases', slug: 'use-cases', icon: '🏢' },
  support: { name: 'Support', slug: 'support', icon: '💡' },
  integration: { name: 'Integration', slug: 'integration', icon: '🔗' },
}

// 创建分类
async function createCategories() {
  console.log('📁 创建分类...')
  
  const categories = {}
  
  for (const [key, category] of Object.entries(categoryMap)) {
    const doc = {
      _type: 'category',
      _id: `category-${key}`,
      name: category.name,
      slug: { _type: 'slug', current: category.slug },
      icon: category.icon,
      description: `${category.name} articles and guides`,
    }
    
    try {
      const result = await client.createOrReplace(doc)
      categories[key] = result._id
      console.log(`  ✅ 创建分类: ${category.name}`)
    } catch (error) {
      console.error(`  ❌ 创建分类失败 ${category.name}:`, error.message)
    }
  }
  
  return categories
}

// 创建计算器
async function createCalculators() {
  console.log('\n🧮 创建计算器...')
  
  const calculators = [
    { name: 'Battery Life Comparison', slug: 'battery-life-comparison', url: '/tools/battery-life-comparison' },
    { name: 'Credential Capacity Planner', slug: 'credential-capacity-planner', url: '/tools/credential-capacity-planner' },
    { name: 'Door Lock Compatibility Checker', slug: 'door-lock-compatibility-checker', url: '/tools/door-lock-compatibility-checker' },
    { name: 'Emergency Backup Evaluator', slug: 'emergency-backup-evaluator', url: '/tools/emergency-backup-evaluator' },
    { name: 'Installation Time Estimator', slug: 'installation-time-estimator', url: '/tools/installation-time-estimator' },
    { name: 'Lock TCO Calculator', slug: 'lock-tco-calculator', url: '/tools/lock-tco-calculator' },
    { name: 'Mesh Node Planner', slug: 'mesh-node-planner', url: '/tools/mesh-node-planner' },
    { name: 'Multi-Property Fleet Planner', slug: 'multi-property-fleet-planner', url: '/tools/multi-property-fleet-planner' },
    { name: 'Offline Resilience Scorecard', slug: 'offline-resilience-scorecard', url: '/tools/offline-resilience-scorecard' },
    { name: 'Protocol Selection Wizard', slug: 'protocol-selection-wizard', url: '/tools/protocol-selection-wizard' },
    { name: 'RF Coverage Estimator', slug: 'rf-coverage-estimator', url: '/tools/rf-coverage-estimator' },
    { name: 'Short-Term Rental ROI Calculator', slug: 'short-term-rental-roi-calculator', url: '/tools/short-term-rental-roi-calculator' },
    { name: 'Smart Home Integration Checker', slug: 'smart-home-integration-checker', url: '/tools/smart-home-integration-checker' },
    { name: 'STR Automation Time Savings', slug: 'str-automation-time-savings', url: '/tools/str-automation-time-savings' },
    { name: 'Subscription vs Purchase Comparison', slug: 'subscription-vs-purchase-comparison', url: '/tools/subscription-vs-purchase-comparison' },
  ]
  
  const calcMap = {}
  
  for (const calc of calculators) {
    const doc = {
      _type: 'calculator',
      _id: `calculator-${calc.slug}`,
      name: calc.name,
      slug: { _type: 'slug', current: calc.slug },
      url: calc.url,
      description: `Calculate and plan your smart lock ${calc.name.toLowerCase()}`,
    }
    
    try {
      const result = await client.createOrReplace(doc)
      calcMap[calc.slug] = result._id
      console.log(`  ✅ 创建计算器: ${calc.name}`)
    } catch (error) {
      console.error(`  ❌ 创建计算器失败 ${calc.name}:`, error.message)
    }
  }
  
  return calcMap
}

// 读取所有MDX文件
function getAllMDXFiles() {
  const articlesDir = path.join(__dirname, '../src/content/articles')
  const files = []
  
  function scanDir(dir) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
  }
  
  scanDir(articlesDir)
  return files
}

// 提取分类
function extractCategory(filePath) {
  const relativePath = path.relative(path.join(__dirname, '../src/content/articles'), filePath)
  const category = relativePath.split(path.sep)[0]
  return category
}

// 计算阅读时间
function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// 迁移单个文章
async function migrateArticle(filePath, categories) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content: markdown } = matter(content)
    
    const category = extractCategory(filePath)
    const categoryId = categories[category]
    
    if (!categoryId) {
      console.log(`  ⚠️  跳过（未知分类 ${category}）: ${path.basename(filePath)}`)
      return null
    }
    
    const fileName = path.basename(filePath, '.mdx')
    const readingTime = calculateReadingTime(markdown)
    
    const doc = {
      _type: 'article',
      _id: `article-${category}-${fileName}`,
      title: frontmatter.title || fileName.replace(/-/g, ' '),
      slug: { _type: 'slug', current: `${category}/${fileName}` },
      description: frontmatter.description || '',
      category: { _type: 'reference', _ref: categoryId },
      tags: frontmatter.tags || [],
      featured: frontmatter.featured || false,
      readingTime: readingTime,
      content: markdown,
      publishedAt: frontmatter.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const result = await client.createOrReplace(doc)
    console.log(`  ✅ 迁移文章: ${doc.title}`)
    return result
  } catch (error) {
    console.error(`  ❌ 迁移失败 ${path.basename(filePath)}:`, error.message)
    return null
  }
}

// 主函数
async function main() {
  console.log('🚀 开始迁移到Sanity CMS\n')
  
  // 检查环境变量
  if (!process.env.PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ 错误: 请设置 PUBLIC_SANITY_PROJECT_ID 和 SANITY_API_TOKEN 环境变量')
    process.exit(1)
  }
  
  console.log(`📦 项目ID: ${process.env.PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.PUBLIC_SANITY_DATASET || 'production'}\n`)
  
  // 步骤1: 创建分类
  const categories = await createCategories()
  
  // 步骤2: 创建计算器
  const calculators = await createCalculators()
  
  // 步骤3: 迁移文章
  console.log('\n📝 迁移文章...')
  const files = getAllMDXFiles()
  console.log(`  找到 ${files.length} 个MDX文件\n`)
  
  let successCount = 0
  let failCount = 0
  
  for (const file of files) {
    const result = await migrateArticle(file, categories)
    if (result) {
      successCount++
    } else {
      failCount++
    }
  }
  
  // 完成报告
  console.log('\n' + '='.repeat(60))
  console.log('🎉 迁移完成!')
  console.log('='.repeat(60))
  console.log(`✅ 成功: ${successCount} 篇文章`)
  console.log(`❌ 失败: ${failCount} 篇文章`)
  console.log(`📁 分类: ${Object.keys(categories).length} 个`)
  console.log(`🧮 计算器: ${Object.keys(calculators).length} 个`)
  console.log('\n🌐 访问 Sanity Studio: npx sanity start')
  console.log('📱 管理后台将在 http://localhost:3333 启动\n')
}

main().catch(console.error)
