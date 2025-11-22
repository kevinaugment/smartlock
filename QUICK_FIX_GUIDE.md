# MDX解析问题快速修复指南

## 问题概述

当前有多个MDX文件在构建时出现解析错误。这些错误阻止了网站的正常构建。

## 快速临时解决方案（推荐）

如果时间紧迫需要快速上线，可以暂时移除有问题的文章：

```bash
cd /Users/luokun/Documents/GitHub/smartlock

# 创建备份目录
mkdir -p src/content/articles/_problem_files

# 移动问题文件（暂时移除）
mv src/content/articles/guides/credential-management-best-practices.mdx src/content/articles/_problem_files/
mv src/content/articles/guides/disaster-recovery-business-continuity.mdx src/content/articles/_problem_files/

# 测试构建
npm run build
```

## 根本解决方案

### 方案1：使用text代码块（最简单）

将所有包含特殊字符的代码块从 ` ```javascript` 改为 ` ```text`:

```markdown
<!-- 之前 -->
\`\`\`javascript
const regex = /^(\d)\1+$/;
\`\`\`

<!-- 之后 -->
\`\`\`text
const regex = /^(\d)\1+$/;
\`\`\`
```

### 方案2：移除特殊字符

```markdown
<!-- 之前 -->
\`\`\`
$10K-$50K = Medium
\`\`\`

<!-- 之后 -->
\`\`\`
10K to 50K = Medium
\`\`\`
```

### 方案3：使用HTML (如果Markdown不工作)

```html
<pre><code class="language-javascript">
function validate() {
  // code here
}
</code></pre>
```

## 需要修复的具体文件

### 1. credential-management-best-practices.mdx

**位置：** 第157-220行的JavaScript代码块

**问题：** 正则表达式反向引用 `\1`

**修复：** 将 ` ```javascript` 改为 ` ```text`

### 2. disaster-recovery-business-continuity.mdx  

**位置：** 第148-161行的代码块

**问题：** 美元符号和数字组合

**修复：** 已将`$`替换为"dollars"，如果仍有问题，改为 ` ```text`

### 3. maintenance-troubleshooting-guide.mdx

**位置：** 第66行附近

**修复：** 需要检查该行内容并应用上述修复方法

## 自动化修复脚本（谨慎使用）

```bash
#!/bin/bash
# 警告：此脚本会修改文件，使用前请备份

cd /Users/luokun/Documents/GitHub/smartlock/src/content/articles

# 备份
cp -r guides guides_backup

# 将所有javascript代码块改为text（保守方法）
find . -name "*.mdx" -exec sed -i '' 's/```javascript/```text/g' {} \;
find . -name "*.mdx" -exec sed -i '' 's/```js/```text/g' {} \;

echo "修复完成，请运行 npm run build 测试"
```

## 测试步骤

每次修复后：

```bash
# 1. 清理缓存
rm -rf .astro dist

# 2. 重新构建
npm run build

# 3. 如果成功，测试预览
npm run preview

# 4. 访问 http://localhost:4321
```

## 如果仍然失败

1. 查看具体错误信息中的文件和行号
2. 打开该文件，导航到问题行
3. 检查前后20行的代码块
4. 应用上述修复方案之一
5. 重复测试

## 推荐优先级

1. **现在立即做：** 运行快速临时解决方案，移除问题文件，确保网站可以构建
2. **上线后修复：** 逐个修复MDX文件，测试后重新添加回网站
3. **长期方案：** 建立MDX内容规范，避免使用会导致解析问题的格式

---

*创建时间：2024-11-21 21:00*
