#!/usr/bin/env node

/**
 * 提取计算器页面的教育内容
 * 读取 .astro 文件中的 Deep Dive / Learn More 等部分
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const toolsDir = path.join(__dirname, '../src/pages/tools')

// 解析单个.astro文件
function parseAstroFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath, '.astro')
  
  const result = {
    slug: fileName,
    name: '',
    description: '',
    educationalContent: {
      sectionTitle: '',
      articles: [],
    },
    relatedTools: {
      sectionTitle: 'Related Tools',
      tools: [],
    },
  }
  
  // 提取Deep Dive / Learn More部分
  const deepDiveMatch = content.match(/<h2[^>]*>(.*?Deep Dive.*?|.*?Learn More.*?|.*?Complete.*?Guide.*?)<\/h2>/i)
  if (deepDiveMatch) {
    result.educationalContent.sectionTitle = deepDiveMatch[1].trim()
  }
  
  // 提取文章链接
  const articleRegex = /<a\s+href="([^"]+)"\s+class="[^"]*block[^"]*"[^>]*>\s*<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gs
  let articleMatch
  while ((articleMatch = articleRegex.exec(content)) !== null) {
    const [, url, title, description] = articleMatch
    if (url.startsWith('/') && !url.startsWith('/tools/')) {
      result.educationalContent.articles.push({
        url: url,
        title: title.replace(/<[^>]+>/g, '').trim(),
        description: description.replace(/<[^>]+>/g, '').trim(),
      })
    }
  }
  
  // 提取Related Tools部分
  const relatedToolsMatch = content.match(/<h2[^>]*>(.*?Related.*?Tools.*?|.*?Related.*?Calculators.*?)<\/h2>/i)
  if (relatedToolsMatch) {
    result.relatedTools.sectionTitle = relatedToolsMatch[1].trim()
  }
  
  // 提取工具链接
  const toolRegex = /<a\s+href="(\/tools\/[^"]+)"\s+class="[^"]*block[^"]*"[^>]*>\s*<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gs
  let toolMatch
  while ((toolMatch = toolRegex.exec(content)) !== null) {
    const [, url, title, description] = toolMatch
    const toolSlug = url.replace('/tools/', '')
    result.relatedTools.tools.push({
      slug: toolSlug,
      title: title.replace(/<[^>]+>/g, '').trim(),
      description: description.replace(/<[^>]+>/g, '').trim(),
    })
  }
  
  return result
}

// 主函数
function main() {
  console.log('📊 提取计算器教育内容...\n')
  
  const files = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.astro') && f !== 'index.astro')
  
  console.log(`找到 ${files.length} 个计算器页面\n`)
  
  const results = {}
  
  for (const file of files) {
    const filePath = path.join(toolsDir, file)
    try {
      const data = parseAstroFile(filePath)
      results[data.slug] = data
      
      console.log(`✅ ${data.slug}`)
      console.log(`   教育内容: ${data.educationalContent.articles.length} 篇文章`)
      console.log(`   相关工具: ${data.relatedTools.tools.length} 个\n`)
    } catch (error) {
      console.error(`❌ 解析失败 ${file}:`, error.message)
    }
  }
  
  // 输出JSON文件
  const outputPath = path.join(__dirname, '../calculator-content.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  
  console.log(`\n💾 结果已保存到: calculator-content.json`)
  console.log(`\n使用此数据更新迁移脚本中的计算器内容`)
}

main()
