# 🚀 Sanity CMS 快速入门指南

## 📋 准备工作清单

### 1. 安装依赖（网络恢复后）

```bash
npm install
```

这将安装所有必需的Sanity包，包括：
- `sanity` - 核心CMS
- `@sanity/vision` - GraphQL查询工具
- `sanity-plugin-markdown` - Markdown编辑器
- `@sanity/client` - API客户端
- `gray-matter` - MDX解析（用于迁移）

### 2. 创建Sanity项目

访问 https://www.sanity.io/manage

1. 点击"Create new project"
2. 项目名称：`Smart Lock Content Hub`
3. Dataset: `production`
4. 记录下 **Project ID**（类似：`abc123xyz`）

### 3. 获取API Token

在Sanity管理后台：

1. 进入你的项目
2. 点击 API → Tokens
3. 创建新Token：
   - Name: `Migration Token`
   - Permissions: **Editor** (需要写权限)
4. 复制Token（只显示一次！）

### 4. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的值
PUBLIC_SANITY_PROJECT_ID=你的项目ID
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=你的API令牌
```

## 🔄 迁移现有内容

### 运行迁移脚本

```bash
npm run migrate
```

这将：
- ✅ 创建7个分类（Protocols, Security, Battery, 等）
- ✅ 创建15个计算器引用
- ✅ 迁移48篇MDX文章到Sanity
- ✅ 保留所有frontmatter数据
- ✅ 维护URL结构

预计时间：2-3分钟

## 🎨 启动Sanity Studio

```bash
npm run sanity
```

这将在 http://localhost:3333 启动管理后台

### 首次登录

1. 浏览器会自动打开
2. 使用Sanity账号登录
3. 你会看到：
   - 📝 Articles（48篇）
   - 📁 Categories（7个）
   - 🧮 Calculators（15个）

## ✏️ 编辑内容

### 编辑文章

1. 点击 "Articles"
2. 选择任意文章
3. 你可以：
   - 编辑标题、描述
   - 修改Markdown内容
   - 添加/删除标签
   - 关联其他文章
   - 关联计算器
   - 设置为特色文章

### 实时预览

编辑时，右侧会显示实时预览（如果配置了）

### 发布更改

1. 点击"Publish"按钮
2. 更改立即生效
3. Astro站点会自动读取最新内容

## 🌐 在Astro中使用

### 查询文章

```typescript
import { getAllArticles, getArticleBySlug } from '@/lib/sanity'

// 获取所有文章
const articles = await getAllArticles()

// 获取单篇文章
const article = await getArticleBySlug('security', 'smart-lock-security-complete-analysis')
```

### 渲染Markdown

```astro
---
import { getArticleBySlug } from '@/lib/sanity'
const article = await getArticleBySlug(category, slug)
---

<article>
  <h1>{article.title}</h1>
  <div set:html={article.content} />
</article>
```

## 📊 管理面板功能

### 文章管理
- ✅ 富文本Markdown编辑器
- ✅ 语法高亮
- ✅ 图片上传（自动CDN）
- ✅ 拖拽排序
- ✅ 批量操作
- ✅ 搜索和过滤

### 版本控制
- ✅ 自动保存草稿
- ✅ 版本历史
- ✅ 一键回滚
- ✅ 发布/取消发布

### 协作功能
- ✅ 多人同时编辑
- ✅ 实时光标显示
- ✅ 评论功能
- ✅ 权限控制

## 🔐 权限管理

### 邀请团队成员

1. Sanity管理后台 → Settings → Members
2. 点击"Invite members"
3. 输入邮箱地址
4. 选择角色：
   - **Administrator**: 完全控制
   - **Editor**: 编辑内容
   - **Viewer**: 只读

### 免费版限制

- ✅ 3个用户
- ✅ 无限文档
- ✅ 10GB带宽/月
- ✅ 图片CDN

## 🚀 部署

### 部署Studio到Sanity托管

```bash
npm run sanity:deploy
```

这将部署Studio到：
`https://your-project.sanity.studio`

### 配置Webhook（可选）

在Sanity管理后台：

1. Settings → API → Webhooks
2. 创建新Webhook
3. URL: `https://api.netlify.com/build_hooks/YOUR_HOOK_ID`
4. 触发条件：文档创建/更新
5. 效果：内容更新 → 自动重新构建站点

## 🎯 常见任务

### 添加新文章

```
1. Studio → Articles → Create
2. 填写标题、slug、描述
3. 选择分类
4. 编写Markdown内容
5. 添加标签
6. 关联相关文章和计算器
7. 点击Publish
```

### 修改现有文章

```
1. Studio → Articles → 搜索文章
2. 点击打开
3. 编辑任意字段
4. 点击Publish保存
```

### 管理分类

```
1. Studio → Categories
2. 编辑名称、描述、图标
3. Publish
```

### 添加计算器引用

```
1. Studio → Calculators → Create
2. 填写名称、slug、URL
3. Publish
4. 在文章中关联此计算器
```

## 📸 图片处理

### 上传图片

1. 在Markdown编辑器中
2. 点击图片按钮
3. 拖拽或选择文件
4. 图片自动上传到Sanity CDN
5. 自动生成响应式URL

### 图片优化

Sanity自动提供：
- WebP格式
- 多种尺寸
- 懒加载
- CDN加速

## 🐛 故障排除

### 迁移失败

```bash
# 检查环境变量
echo $PUBLIC_SANITY_PROJECT_ID
echo $SANITY_API_TOKEN

# 验证API连接
npx sanity check
```

### Studio无法启动

```bash
# 清除缓存
rm -rf node_modules/.cache
npm run sanity
```

### 内容不显示

```bash
# 检查API配置
# 确保 .env 文件中的 PROJECT_ID 正确
# 检查 dataset 名称
```

## 📚 学习资源

- [Sanity官方文档](https://www.sanity.io/docs)
- [Schema类型参考](https://www.sanity.io/docs/schema-types)
- [GROQ查询语言](https://www.sanity.io/docs/groq)
- [Astro集成指南](https://docs.astro.build/en/guides/cms/sanity/)

## ✅ 迁移后检查清单

- [ ] 所有48篇文章已导入
- [ ] 分类正确关联
- [ ] 计算器引用存在
- [ ] 图片正常显示
- [ ] 内部链接有效
- [ ] Markdown渲染正确
- [ ] URL结构保持不变
- [ ] 搜索功能正常
- [ ] 相关文章显示
- [ ] 团队成员已邀请

## 🎉 完成！

现在你可以：
- ✅ 在浏览器中编辑内容
- ✅ 实时预览更改
- ✅ 团队协作编辑
- ✅ 版本控制和回滚
- ✅ 无需重新部署即可更新内容

**Studio地址**: http://localhost:3333
**网站地址**: http://localhost:4321

---

有问题？查看 `SANITY_SETUP.md` 获取更多技术细节。
