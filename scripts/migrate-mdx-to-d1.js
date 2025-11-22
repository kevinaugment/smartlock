#!/usr/bin/env node

/**
 * MDX到D1数据库迁移脚本
 * 
 * 将src/content/articles/下的48篇MDX文章迁移到D1数据库
 * 
 * 使用方法:
 * 1. 确保wrangler已登录: wrangler login
 * 2. 确保D1数据库已创建和初始化
 * 3. 运行: node scripts/migrate-mdx-to-d1.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ARTICLES_DIR = path.join(__dirname, '../src/content/articles')
const DB_NAME = 'smartlock'

// 分类映射
const CATEGORY_MAP = {
  'protocols': { name: 'Protocols', slug: 'protocols', icon: '📡', order: 1 },
  'security': { name: 'Security', slug: 'security', icon: '🔒', order: 2 },
  'installation': { name: 'Battery & Installation', slug: 'installation', icon: '🔋', order: 3 },
  'guides': { name: 'Troubleshooting', slug: 'guides', icon: '🔧', order: 4 },
  'use-cases': { name: 'Use Cases', slug: 'use-cases', icon: '🏢', order: 5 },
  'support': { name: 'Support', slug: 'support', icon: '💡', order: 6 },
  'integration': { name: 'Integration', slug: 'integration', icon: '🔗', order: 7 },
}

// 计算阅读时间
function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// 提取描述
function extractDescription(content, maxLength = 150) {
  const text = content.replace(/[#*`>\[\]]/g, '').trim()
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 执行D1命令
function executeD1Command(sql, bindings = []) {
  try {
    const bindingsArg = bindings.length > 0 
      ? `--json='${JSON.stringify(bindings).replace(/'/g, "\\'")}'` 
      : ''
    
    const command = `wrangler d1 execute ${DB_NAME} --command="${sql.replace(/"/g, '\\"')}" ${bindingsArg}`
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
    return { success: true, result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 获取所有MDX文件
function getAllMDXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllMDXFiles(filePath, fileList)
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// 提取分类
function extractCategory(filePath) {
  const relativePath = path.relative(ARTICLES_DIR, filePath)
  return relativePath.split(path.sep)[0]
}

// 步骤1: 创建默认管理员用户
async function createDefaultUser() {
  console.log('\n📝 步骤1: 创建默认用户...')
  
  // 密码: admin123 的bcrypt hash (需要在实际使用时替换)
  const passwordHash = '$2a$10$rVfZQ3p0JYmPZqwHDqC5Puj6K1cXQJ7Zq1YGXm3OfN6qYvzLqP6AO'
  
  const sql = `INSERT OR IGNORE INTO users (id, email, password_hash, name, role) 
               VALUES (1, 'admin@smartlock.com', '${passwordHash}', 'Admin', 'admin')`
  
  const result = executeD1Command(sql)
  
  if (result.success) {
    console.log('  ✅ 默认用户创建成功')
  } else {
    console.log('  ⚠️  用户可能已存在或创建失败')
  }
}

// 步骤2: 创建分类
async function createCategories() {
  console.log('\n📁 步骤2: 创建分类...')
  
  let created = 0
  
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    const sql = `INSERT OR IGNORE INTO categories (name, slug, icon, description, display_order) 
                 VALUES ('${cat.name}', '${cat.slug}', '${cat.icon}', '${cat.name} articles', ${cat.order})`
    
    const result = executeD1Command(sql)
    
    if (result.success) {
      console.log(`  ✅ ${cat.name}`)
      created++
    }
  }
  
  console.log(`\n  创建了 ${created} 个分类`)
  return true
}

// 步骤3: 迁移文章
async function migrateArticles() {
  console.log('\n📝 步骤3: 迁移文章...')
  
  const files = getAllMDXFiles(ARTICLES_DIR)
  console.log(`  找到 ${files.length} 个MDX文件\n`)
  
  let successCount = 0
  let failCount = 0
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter, content: markdown } = matter(content)
      
      const category = extractCategory(filePath)
      const categoryData = CATEGORY_MAP[category]
      
      if (!categoryData) {
        console.log(`  ⚠️  跳过（未知分类 ${category}）: ${path.basename(filePath)}`)
        failCount++
        continue
      }
      
      const fileName = path.basename(filePath, '.mdx')
      const title = frontmatter.title || fileName.replace(/-/g, ' ')
      const slug = `${category}/${fileName}`
      const description = frontmatter.description || extractDescription(markdown)
      const readingTime = calculateReadingTime(markdown)
      
      // 转义单引号和双引号
      const escapedTitle = title.replace(/'/g, "''")
      const escapedSlug = slug.replace(/'/g, "''")
      const escapedDescription = description.replace(/'/g, "''")
      const escapedContent = markdown.replace(/'/g, "''")
      
      // 先获取分类ID
      const getCategoryIdSql = `SELECT id FROM categories WHERE slug = '${categoryData.slug}'`
      const categoryResult = executeD1Command(getCategoryIdSql)
      
      // 插入文章
      const sql = `INSERT INTO articles (
        title, slug, description, content, category_id, author_id,
        reading_time, status, featured, created_at, updated_at
      ) VALUES (
        '${escapedTitle}',
        '${escapedSlug}',
        '${escapedDescription}',
        '${escapedContent}',
        (SELECT id FROM categories WHERE slug = '${categoryData.slug}'),
        1,
        ${readingTime},
        'published',
        ${frontmatter.featured ? 1 : 0},
        datetime('now'),
        datetime('now')
      )`
      
      const result = executeD1Command(sql)
      
      if (result.success) {
        console.log(`  ✅ ${title}`)
        successCount++
        
        // 处理标签
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
          for (const tagName of frontmatter.tags) {
            const escapedTag = tagName.replace(/'/g, "''")
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            
            // 创建标签
            const createTagSql = `INSERT OR IGNORE INTO tags (name, slug) VALUES ('${escapedTag}', '${tagSlug}')`
            executeD1Command(createTagSql)
            
            // 关联标签到文章
            const linkTagSql = `INSERT OR IGNORE INTO article_tags (article_id, tag_id) 
                                VALUES (
                                  (SELECT id FROM articles WHERE slug = '${escapedSlug}'),
                                  (SELECT id FROM tags WHERE name = '${escapedTag}')
                                )`
            executeD1Command(linkTagSql)
          }
        }
      } else {
        console.log(`  ❌ 失败: ${title} - ${result.error}`)
        failCount++
      }
    } catch (error) {
      console.log(`  ❌ 处理失败 ${path.basename(filePath)}: ${error.message}`)
      failCount++
    }
  }
  
  console.log(`\n  成功: ${successCount}, 失败: ${failCount}`)
  return { successCount, failCount }
}

// 步骤4: 验证迁移结果
async function verifyMigration() {
  console.log('\n🔍 步骤4: 验证迁移结果...')
  
  // 统计文章数
  const countSql = `SELECT COUNT(*) as total FROM articles`
  const countResult = executeD1Command(countSql)
  
  // 统计分类
  const catCountSql = `SELECT COUNT(*) as total FROM categories`
  const catResult = executeD1Command(catCountSql)
  
  // 统计标签
  const tagCountSql = `SELECT COUNT(*) as total FROM tags`
  const tagResult = executeD1Command(tagCountSql)
  
  console.log(`  📊 文章总数: ${countResult.result ? 'Success' : 'Failed'}`)
  console.log(`  📁 分类总数: ${catResult.result ? 'Success' : 'Failed'}`)
  console.log(`  🏷️  标签总数: ${tagResult.result ? 'Success' : 'Failed'}`)
  
  return true
}

// 主函数
async function main() {
  console.log('🚀 开始MDX到D1数据库迁移')
  console.log('=' .repeat(60))
  
  try {
    // 检查wrangler
    try {
      execSync('wrangler --version', { stdio: 'pipe' })
    } catch (error) {
      console.error('❌ 错误: wrangler未安装或未登录')
      console.log('   请运行: npm install -g wrangler && wrangler login')
      process.exit(1)
    }
    
    // 检查D1数据库
    try {
      executeD1Command('SELECT 1')
    } catch (error) {
      console.error('❌ 错误: 无法连接到D1数据库')
      console.log('   请确保数据库已创建: wrangler d1 create smartlock')
      console.log('   并且已初始化: wrangler d1 execute smartlock --file=database/schema.sql')
      process.exit(1)
    }
    
    // 执行迁移步骤
    await createDefaultUser()
    await createCategories()
    const { successCount, failCount } = await migrateArticles()
    await verifyMigration()
    
    // 完成报告
    console.log('\n' + '='.repeat(60))
    console.log('🎉 迁移完成！')
    console.log('='.repeat(60))
    console.log(`✅ 成功迁移: ${successCount} 篇文章`)
    if (failCount > 0) {
      console.log(`⚠️  失败: ${failCount} 篇文章`)
    }
    console.log('\n📝 下一步:')
    console.log('   1. 启动API: cd api && npm run dev')
    console.log('   2. 启动管理后台: cd admin && npm run dev')
    console.log('   3. 访问: http://localhost:5173')
    console.log('   4. 登录: admin@smartlock.com / admin123')
    
  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// 运行
main()
