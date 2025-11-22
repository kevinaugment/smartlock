# 🧮 计算器CMS集成指南

## 📋 概述

计算器页面分为两部分：
1. **计算器主体**（首屏）- React组件，保持不变
2. **教育内容**（下方）- 由Sanity CMS管理

## 🎯 架构设计

### 页面结构

```
┌─────────────────────────────┐
│  计算器标题和描述              │
├─────────────────────────────┤
│                             │
│  📊 计算器主体（React）       │
│  - 输入表单                  │
│  - 实时计算                  │
│  - 结果显示                  │
│                             │
├─────────────────────────────┤
│  📚 教育内容（Sanity CMS）    │
│  - Deep Dive文章             │
│  - Learn More指南            │
│  - 相关工具链接              │
└─────────────────────────────┘
```

## 🗂️ Schema结构

### Calculator Schema扩展

已添加的字段：

```typescript
{
  educationalContent: {
    sectionTitle: string,        // "Deep Dive" / "Learn More"
    articles: [
      {
        article: Reference<Article>,  // 关联文章
        customTitle: string?,         // 可选：覆盖标题
        customDescription: string?    // 可选：自定义描述
      }
    ]
  },
  
  relatedTools: {
    sectionTitle: string,        // "Related Tools"
    tools: [
      {
        tool: Reference<Calculator>,
        customName: string?,
        customDescription: string?
      }
    ]
  }
}
```

## 🔧 使用方法

### 1. 在Astro页面中使用

```astro
---
// src/pages/tools/battery-life-comparison.astro

import BatteryLifeCalculator from '@/components/calculators/BatteryLifeCalculator'
import CalculatorEducationalContent from '@/components/CalculatorEducationalContent.astro'
---

<Layout title="Battery Life Comparison">
  <!-- 计算器主体 -->
  <section class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-4">Battery Life Comparison</h1>
    <p class="text-lg text-gray-600 mb-8">
      Compare battery life across different smart lock protocols
    </p>
    
    <!-- React计算器组件 -->
    <BatteryLifeCalculator client:load />
  </section>

  <!-- CMS管理的教育内容 -->
  <section class="container mx-auto px-4 pb-12">
    <CalculatorEducationalContent calculatorSlug="battery-life-comparison" />
  </section>
</Layout>
```

### 2. 在Sanity Studio中编辑

#### 添加教育内容

1. 打开 http://localhost:3333
2. 选择 **Calculators** → 选择工具（如 Battery Life Comparison）
3. 展开 **Educational Content**
4. 设置 Section Title（如 "Complete Battery Guides"）
5. 点击 **Add article**
6. 选择相关文章（如 "Battery Life Guide"）
7. 可选：自定义标题和描述
8. 点击 **Publish**

#### 添加相关工具

1. 展开 **Related Tools**
2. 点击 **Add tool**
3. 选择相关计算器
4. 可选：自定义名称和描述
5. 点击 **Publish**

## 📊 当前15个计算器

| 计算器 | Slug | 状态 |
|-------|------|-----|
| Battery Life Comparison | `battery-life-comparison` | ✅ |
| Credential Capacity Planner | `credential-capacity-planner` | ✅ |
| Door Lock Compatibility Checker | `door-lock-compatibility-checker` | ✅ |
| Emergency Backup Evaluator | `emergency-backup-evaluator` | ✅ |
| Installation Time Estimator | `installation-time-estimator` | ✅ |
| Lock TCO Calculator | `lock-tco-calculator` | ✅ |
| Mesh Node Planner | `mesh-node-planner` | ✅ |
| Multi-Property Fleet Planner | `multi-property-fleet-planner` | ✅ |
| Offline Resilience Scorecard | `offline-resilience-scorecard` | ✅ |
| Protocol Selection Wizard | `protocol-selection-wizard` | ✅ |
| RF Coverage Estimator | `rf-coverage-estimator` | ✅ |
| Short-Term Rental ROI Calculator | `short-term-rental-roi-calculator` | ✅ |
| Smart Home Integration Checker | `smart-home-integration-checker` | ✅ |
| STR Automation Time Savings | `str-automation-time-savings` | ✅ |
| Subscription vs Purchase Comparison | `subscription-vs-purchase-comparison` | ✅ |

## 🔄 迁移现有内容

### 提取现有教育内容

```bash
# 运行提取脚本
node scripts/extract-calculator-content.js

# 输出: calculator-content.json
```

### 更新迁移脚本

迁移脚本已更新，会：
1. 创建15个Calculator文档
2. 提取现有.astro文件中的教育内容
3. 建立文章引用关系
4. 建立工具间的关联

## 📝 示例配置

### Battery Life Comparison 示例

```json
{
  "name": "Battery Life Comparison",
  "slug": "battery-life-comparison",
  "description": "Compare battery life across protocols",
  "educationalContent": {
    "sectionTitle": "Complete Battery Guides",
    "articles": [
      {
        "article": "article-installation-smart-lock-battery-life-guide",
        "customTitle": null,
        "customDescription": "Deep dive into battery optimization"
      }
    ]
  },
  "relatedTools": {
    "sectionTitle": "Related Calculators",
    "tools": [
      {
        "tool": "calculator-protocol-selection-wizard",
        "customName": null
      },
      {
        "tool": "calculator-lock-tco-calculator"
      }
    ]
  }
}
```

### STR ROI Calculator 示例

```json
{
  "name": "Short-Term Rental ROI Calculator",
  "slug": "short-term-rental-roi-calculator",
  "educationalContent": {
    "sectionTitle": "Deep Dive: STR Strategy",
    "articles": [
      {
        "article": "article-use-cases-smart-locks-airbnb-complete-guide",
        "customTitle": "Airbnb Complete Guide"
      },
      {
        "article": "article-installation-smart-lock-battery-life-guide",
        "customTitle": "Battery Planning for STR"
      }
    ]
  },
  "relatedTools": {
    "sectionTitle": "Related STR Tools",
    "tools": [
      {
        "tool": "calculator-str-automation-time-savings"
      },
      {
        "tool": "calculator-multi-property-fleet-planner"
      }
    ]
  }
}
```

## 🎨 样式定制

### 教育内容区域

```astro
<div class="mt-16">
  <h2 class="text-3xl font-bold text-gray-900 mb-8">
    <!-- Section Title -->
  </h2>
  <div class="grid gap-6 md:grid-cols-2">
    <!-- 文章卡片 -->
  </div>
</div>
```

### 相关工具区域

```astro
<div class="mt-12">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    <!-- Section Title -->
  </h2>
  <div class="grid gap-4 md:grid-cols-3">
    <!-- 工具卡片 -->
  </div>
</div>
```

## 🚀 部署和更新

### 本地开发

```bash
# 启动Sanity Studio
npm run sanity

# 启动Astro开发服务器
npm run dev
```

### 更新内容流程

1. 编辑 http://localhost:3333
2. 修改教育内容或相关工具
3. 点击 Publish
4. Astro自动读取最新数据
5. 刷新页面查看更改

### 生产部署

配置Webhook自动重建：
1. Sanity Studio → Settings → Webhooks
2. 添加部署平台的Build Hook
3. 内容更新 → 自动触发重建

## ✅ 验收清单

### 功能测试

- [ ] 计算器主体正常显示和运行
- [ ] 教育内容区域正常加载
- [ ] 文章链接正确跳转
- [ ] 相关工具链接有效
- [ ] 自定义标题和描述生效
- [ ] 响应式布局正常

### Studio测试

- [ ] 可以添加/删除文章引用
- [ ] 可以添加/删除工具引用
- [ ] 自定义字段正常保存
- [ ] 预览显示正确
- [ ] 发布后立即生效

## 💡 最佳实践

### 教育内容建议

1. **每个计算器2-4篇文章**
   - 1篇深度指南
   - 1-2篇相关主题
   - 1篇实战案例

2. **关联工具3-5个**
   - 同类别的其他计算器
   - 互补功能的工具
   - 工作流程中的下一步

3. **标题优化**
   - 使用自定义标题突出重点
   - 保持简洁（5-8个词）
   - 体现价值主张

### SEO优化

1. 设置 `metaDescription`
2. 使用有意义的 Section Title
3. 确保文章描述清晰
4. 工具间互相链接形成网络

## 📚 相关文档

- `CMS_QUICK_START.md` - CMS快速入门
- `SANITY_SETUP.md` - 技术设置
- `CMS_MIGRATION_COMPLETE.md` - 迁移报告

## 🎉 完成！

计算器CMS集成已配置完成。现在你可以：

✅ 在Studio中可视化管理教育内容
✅ 灵活关联文章和工具
✅ 自定义标题和描述
✅ 实时预览更改
✅ 无需代码即可更新内容

**开始使用**: 访问 http://localhost:3333 → Calculators → 选择任意工具开始编辑！
