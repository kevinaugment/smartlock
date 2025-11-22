# Smart Lock Hub - 设计系统文档

> 版本: 2.0
> 更新日期: 2024-11-21
> 设计师: Professional UI/UX Team

---

## 🎨 设计哲学

我们的设计系统遵循以下原则：
1. **清晰层级** - 完美的视觉层级让内容易于扫读
2. **专业可信** - 技术网站需要专业且值得信赖的视觉风格
3. **易于阅读** - 优秀的排版确保长篇技术内容的可读性
4. **一致性** - 统一的设计语言贯穿整个网站

---

## 📐 字体系统

### 字体家族

#### 主字体 - Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```
- **使用场景**: 正文、标题、UI元素
- **特点**: 现代、清晰、专为屏幕阅读优化

#### 等宽字体 - JetBrains Mono
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```
- **使用场景**: 代码块、技术参数
- **特点**: 优秀的代码可读性，支持连字

### 标题层级（H1-H6）

完美的字体尺寸比例，确保清晰的内容层级：

| 标题 | 移动端 | 平板 | 桌面端 | 字重 | 行高 | 字间距 | 使用场景 |
|------|--------|------|--------|------|------|--------|----------|
| **H1** | 2.25rem (36px) | 3rem (48px) | 3.75rem (60px) | 800 | 1.1 | -0.03em | 页面主标题 |
| **H2** | 1.875rem (30px) | 2.25rem (36px) | 3rem (48px) | 700 | 1.2 | -0.025em | 主要章节 |
| **H3** | 1.5rem (24px) | 1.875rem (30px) | 2.25rem (36px) | 700 | 1.3 | 正常 | 次级章节 |
| **H4** | 1.25rem (20px) | 1.5rem (24px) | 1.875rem (30px) | 600 | 1.4 | 正常 | 小节标题 |
| **H5** | 1.125rem (18px) | 1.25rem (20px) | 1.5rem (24px) | 600 | 1.5 | 正常 | 子标题 |
| **H6** | 1rem (16px) | 1.125rem (18px) | 1.25rem (20px) | 600 | 1.5 | 正常 | 最小标题 |

### 正文字体尺寸

| 尺寸 | 字号 | 行高 | 使用场景 |
|------|------|------|----------|
| **xs** | 0.75rem (12px) | 1rem | 辅助文本、标签 |
| **sm** | 0.875rem (14px) | 1.25rem | 次要内容、表格 |
| **base** | 1rem (16px) | 1.5rem | 正文（默认） |
| **lg** | 1.125rem (18px) | 1.75rem | 强调段落 |
| **xl** | 1.25rem (20px) | 1.75rem | 引言、摘要 |

---

## 🎨 配色系统

### 品牌色 - Professional Blue

完整的蓝色渐变，用于主要品牌识别：

| 名称 | 色值 | 使用场景 |
|------|------|----------|
| `primary-50` | #eff6ff | 淡色背景、悬停状态 |
| `primary-100` | #dbeafe | 极淡背景 |
| `primary-200` | #bfdbfe | 边框、分隔线 |
| `primary-300` | #93c5fd | 次要元素 |
| `primary-400` | #60a5fa | 图标、装饰 |
| `primary-500` | #3b82f6 | 常规使用 |
| **`primary-600`** | **#2563eb** | **主按钮、主链接** ⭐ |
| `primary-700` | #1d4ed8 | 悬停状态 |
| `primary-800` | #1e40af | 激活状态 |
| `primary-900` | #1e3a8a | 深色文本 |

### 强调色 - Tech Orange

用于强调、警告和技术亮点：

| 名称 | 色值 | 使用场景 |
|------|------|----------|
| `accent-500` | #f97316 | 强调内容 |
| `accent-600` | #ea580c | 强调按钮 |
| `accent-700` | #c2410c | 强调悬停 |

### 语义色

#### Success Green（成功/正确）
- **主色**: `success-600` #16a34a
- **背景**: `success-50` #f0fdf4
- **使用**: 成功提示、正面信息、验证通过

#### Warning Yellow（警告/注意）
- **主色**: `warning-600` #d97706
- **背景**: `warning-50` #fffbeb
- **使用**: 警告信息、注意事项

#### Danger Red（错误/危险）
- **主色**: `danger-600` #dc2626
- **背景**: `danger-50` #fef2f2
- **使用**: 错误提示、删除操作、危险警告

### 中性灰度

| 名称 | 色值 | 使用场景 |
|------|------|----------|
| `gray-50` | #f9fafb | 表格头、背景 |
| `gray-100` | #f3f4f6 | 代码背景、卡片背景 |
| `gray-200` | #e5e7eb | 边框、分隔线 |
| `gray-300` | #d1d5db | 禁用状态 |
| `gray-500` | #6b7280 | 次要文本 |
| **`gray-700`** | **#374151** | **正文文本** ⭐ |
| **`gray-900`** | **#111827** | **标题文本** ⭐ |

---

## 📦 组件样式

### 按钮（Buttons）

#### 主按钮（Primary）
```html
<button class="btn btn-primary">Primary Button</button>
```
- **颜色**: primary-600
- **悬停**: primary-700
- **激活**: primary-800
- **使用场景**: 主要操作（提交、保存、确认）

#### 次要按钮（Secondary）
```html
<button class="btn btn-secondary">Secondary Button</button>
```
- **颜色**: 白色背景 + 灰色边框
- **使用场景**: 次要操作（取消、返回）

#### 按钮尺寸
- **小**: `btn-sm` (适用于紧凑空间)
- **正常**: `btn` (默认尺寸)
- **大**: `btn-lg` (强调操作)

### 卡片（Cards）

```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <p>Card content...</p>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

**特性**:
- 圆角: `rounded-xl` (12px)
- 边框: 1px solid gray-200
- 阴影: `shadow-sm` 悬停时升级为 `shadow-md`
- 过渡: 平滑的阴影过渡

### 徽章（Badges）

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Error</span>
```

### 提示框（Alerts）

```html
<div class="alert alert-info">Information message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Error message</div>
```

---

## 📝 内容排版

### 段落（Paragraphs）

```css
p {
  color: theme('colors.gray.700');
  line-height: 1.75; /* 28px for 16px font */
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}
```

**最佳实践**:
- 最大宽度: 65-75字符（理想阅读宽度）
- 行高: 1.75 (28px)
- 段间距: 1.25rem (20px)

### 链接（Links）

```css
a {
  color: primary-600;
  font-weight: 500;
  border-bottom: 1px solid primary-300;
  transition: all 0.2s ease;
}

a:hover {
  color: primary-700;
  border-bottom-color: primary-600;
}
```

**特性**:
- 下划线使用border-bottom（更灵活）
- 悬停时颜色加深
- 平滑过渡效果

### 加粗文本（Strong/Bold）

```css
strong, b {
  color: gray-900;
  font-weight: 700;
}
```

**使用规则**:
- 强调重要内容
- 关键术语首次出现
- 操作步骤中的关键词

### 内联代码（Inline Code）

```css
code {
  color: pink-600;
  background-color: gray-100;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', monospace;
}
```

**示例**: `const lockStatus = 'locked';`

### 代码块（Code Blocks）

```css
pre {
  background-color: gray-900;
  color: gray-100;
  padding: 1.25rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
}
```

**特性**:
- 深色背景（gray-900）
- 圆角边框
- 水平滚动（保持代码完整性）
- 等宽字体

### 表格（Tables）

完美的表格样式，适合技术文档：

```css
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid gray-200;
}

thead {
  background-color: gray-50;
  border-bottom: 2px solid gray-300;
}

thead th {
  font-weight: 700;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

tbody tr {
  border-bottom: 1px solid gray-200;
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: gray-50;
}

tbody td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}
```

**特性**:
- 表头带背景色区分
- 悬停高亮行
- 圆角边框
- 清晰的单元格边框

### 引用（Blockquotes）

```css
blockquote {
  border-left: 4px solid primary-400;
  background-color: blue-50;
  padding: 1rem;
  border-radius: 0.375rem;
  font-style: italic;
  color: gray-700;
}
```

**示例**:
> This is an important quote or callout that needs special attention.

### 列表（Lists）

#### 无序列表（Unordered Lists）
```css
ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  space-y: 0.5rem;
}

li::marker {
  color: primary-500;
}
```

#### 有序列表（Ordered Lists）
```css
ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  space-y: 0.5rem;
}
```

**特性**:
- 标记颜色使用品牌色
- 适当的项间距
- 嵌套列表支持

### 分隔线（Horizontal Rules）

```css
hr {
  border-color: gray-200;
  border-top-width: 1px;
  margin-top: 3rem;
  margin-bottom: 3rem;
}
```

---

## 🎯 间距系统

基于8px网格系统：

| 名称 | 像素值 | Rem值 | 使用场景 |
|------|--------|-------|----------|
| `spacing-1` | 4px | 0.25rem | 极小间距 |
| `spacing-2` | 8px | 0.5rem | 紧凑间距 |
| `spacing-3` | 12px | 0.75rem | 小间距 |
| `spacing-4` | 16px | 1rem | 默认间距 |
| `spacing-5` | 20px | 1.25rem | 段落间距 |
| `spacing-6` | 24px | 1.5rem | 标题下间距 |
| `spacing-8` | 32px | 2rem | 小节间距 |
| `spacing-10` | 40px | 2.5rem | H3上间距 |
| `spacing-12` | 48px | 3rem | H2上间距/分隔线 |
| `spacing-16` | 64px | 4rem | 大章节间距 |

---

## 📱 响应式断点

| 断点 | 最小宽度 | 使用场景 |
|------|----------|----------|
| **sm** | 640px | 手机横屏 |
| **md** | 768px | 平板竖屏 |
| **lg** | 1024px | 平板横屏/小笔记本 |
| **xl** | 1280px | 桌面显示器 |
| **2xl** | 1536px | 大屏显示器 |

---

## 🎭 阴影系统

| 名称 | 效果 | 使用场景 |
|------|------|----------|
| `shadow-sm` | 轻微阴影 | 卡片、按钮默认 |
| `shadow` | 标准阴影 | 弹出框 |
| `shadow-md` | 中等阴影 | 悬停状态 |
| `shadow-lg` | 大阴影 | Modal |
| `shadow-xl` | 超大阴影 | 浮动面板 |
| `shadow-soft` | 柔和阴影 | 自定义 |

---

## 🔄 过渡动画

```css
transition: all 0.2s ease;  /* 快速交互 */
transition: all 0.3s ease-in-out;  /* 平滑过渡 */
```

**使用原则**:
- 悬停状态: 200ms
- 页面切换: 300ms
- 复杂动画: 300-500ms
- 缓动函数: `ease` 或 `ease-in-out`

---

## 💡 使用示例

### 文章内容页面

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Article Title" description="Description">
  <article class="prose prose-lg mx-auto px-4 py-12">
    <h1>Main Article Title</h1>
    <p class="lead">
      Introduction paragraph with larger text...
    </p>
    
    <h2>Section Title</h2>
    <p>Regular paragraph content...</p>
    
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </tbody>
    </table>
    
    <pre><code>const example = 'code block';</code></pre>
  </article>
</BaseLayout>
```

### 计算器页面

```astro
<div class="calculator-wrapper">
  <h3 class="mb-4">TCO Calculator</h3>
  <form class="space-y-4">
    <div>
      <label class="label">Lock Price</label>
      <input type="number" class="input" />
    </div>
    <button type="submit" class="btn btn-primary">
      Calculate
    </button>
  </form>
  
  <div class="result-card mt-6">
    <h4>Results</h4>
    <p>Total Cost: <strong>$1,234</strong></p>
  </div>
</div>
```

---

## ✅ 设计检查清单

在发布前确认：

### 字体
- [ ] 所有标题使用正确的层级（H1-H6）
- [ ] 正文字体大小为16px（1rem）
- [ ] 行高设置为1.75
- [ ] 代码块使用等宽字体

### 颜色
- [ ] 主按钮使用primary-600
- [ ] 链接颜色为primary-600
- [ ] 正文文本为gray-700
- [ ] 标题文本为gray-900

### 间距
- [ ] 标题和段落之间有适当间距
- [ ] H2之间间距为3rem
- [ ] 段落之间间距为1.25rem

### 组件
- [ ] 所有按钮有悬停效果
- [ ] 卡片有阴影和圆角
- [ ] 表格可悬停高亮
- [ ] 表单输入有焦点状态

### 响应式
- [ ] 移动端字体缩小适当
- [ ] 平板端布局正确
- [ ] 桌面端最大宽度限制

---

## 📚 参考资源

- **Typography**: [Practical Typography](https://practicaltypography.com/)
- **Color Theory**: [Refactoring UI](https://www.refactoringui.com/)
- **Components**: [Tailwind UI](https://tailwindui.com/)
- **Accessibility**: [WebAIM](https://webaim.org/)

---

**设计系统版本**: 2.0
**最后更新**: 2024-11-21
**维护团队**: Smart Lock Engineering Hub
