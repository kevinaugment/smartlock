# 每日执行指南

> **使用方法**：每天开始前查看本指南，按顺序执行

---

## 📅 Week 1 执行计划

### Day 1（今天，8小时）

**目标**：完成Batch 1全部8页（删除重复）

**上午（4h）**：
```
09:00-09:45  Page 1.1: wifi-cloud-lock ✓
10:00-10:45  Page 1.2: matter-for-locks ✓
11:00-11:45  Page 1.3: threat-modeling ✓
11:45-12:00  休息 + Git push
```

**下午（4h）**：
```
14:00-14:45  Page 1.4: zwave-s2-security ✓
15:00-15:45  Page 1.5: hotel-hospitality ✓
16:00-16:45  Page 1.6: education-campus ✓
17:00-18:00  Page 1.7-1.8: government + healthcare ✓
18:00-18:15  Git push + 更新进度日志
```

**验收**：
- ✅ 8个文件已删除
- ✅ 8个301重定向配置
- ✅ astro.config.mjs已更新
- ✅ Git提交清晰

---

### Day 2-3（电池Pillar准备+大纲，5h）

**Day 2上午（2h）**：Phase A准备
```
□ 创建workspace/battery-pillar/
□ 收集6篇源文章
□ 逐篇阅读并标记内容
```

**Day 2下午（3h）**：Phase B大纲
```
□ 创建battery-life-guide.mdx文件
□ 撰写完整8章节大纲
□ 标记计算器嵌入位置
```

---

### Day 4-5（电池Pillar撰写，12h）

**Day 4（6h）**：
```
上午: Section 1-2（3h）
下午: Section 3（3h）
```

**Day 5（6h）**：
```
上午: Section 4-6（4h）
下午: Section 7-8 + 优化（2h）
```

---

### Day 6（电池Pillar链接+验证，3h）

```
09:00-11:00  添加所有链接（计算器+文章）
11:00-12:00  验证、优化、Git提交
```

---

### Day 7（简化2篇Support，8h）

```
上午（4h）: how-to-change-battery简化
下午（4h）: emergency-battery-died简化
```

---

## 📋 标准单页执行清单

**每个页面都执行这个检查清单**：

### 删除类页面（30-45min/页）

```bash
□ Step 1: 读取文件（10min）
  - 打开文件
  - 记录字数、章节
  - 标记独特内容
  
□ Step 2: 备份（2min）
  cp [源文件] archive/deleted/2024-11/
  
□ Step 3: 提取内容（10min）
  - 将独特内容复制到笔记
  - 标记需迁移到新Pillar的部分
  
□ Step 4: 删除（1min）
  git rm [源文件]
  
□ Step 5: 配置重定向（10min）
  - 编辑astro.config.mjs
  - 添加301重定向规则
  
□ Step 6: 提交（2min）
  git add astro.config.mjs
  git commit -m "Delete: [文件名] (reason)"
  
□ Step 7: 更新日志（2min）
  - 在DAILY_PROGRESS.md记录完成
```

### 新建Pillar页面（20-28h/页）

```bash
□ Phase A: 准备（10%时间）
  - 收集源文章
  - 分析内容
  - 创建矩阵
  
□ Phase B: 大纲（15%时间）
  - 创建文件
  - 撰写章节结构
  - 标记链接位置
  
□ Phase C: 撰写（60%时间）
  - 逐章节撰写
  - 整合源内容
  - 重写段落
  
□ Phase D: 链接（10%时间）
  - 添加计算器
  - 添加文章链接
  - 添加图表
  
□ Phase E: 验证（5%时间）
  - 字数检查
  - 链接测试
  - SEO优化
  - Git提交
```

### 简化Support页面（3-4h/页）

```bash
□ Step 1: 分析（30min）
  - 标记保留/删除内容
  
□ Step 2: 删除理论（1h）
  - 删除理论段落
  - 替换为链接
  
□ Step 3: 增强操作（1.5h）
  - 扩展步骤细节
  - 添加案例
  
□ Step 4: 添加链接（30min）
  - 向上链接Pillar
  - 横向链接Support
  - 计算器链接
  
□ Step 5: 优化（30min）
  - 添加Quick Answer
  - 格式美化
  - Git提交
```

---

## 🔧 常用命令速查

### Git操作

```bash
# 查看当前状态
git status

# 删除文件
git rm src/content/articles/[path]/[filename].mdx

# 添加修改
git add [文件路径]

# 提交（清晰message）
git commit -m "Action: filename (reason)"

# 推送
git push origin main

# 查看历史
git log --oneline -10
```

### 文件操作

```bash
# 创建目录
mkdir -p [路径]

# 复制文件
cp [源] [目标]

# 移动文件
mv [源] [目标]

# 查看文件
cat [文件路径]
open [文件路径]  # Mac
code [文件路径]  # VS Code

# 统计字数
wc -w [文件路径]

# 搜索内容
grep -r "关键词" src/
```

### 项目特定

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 检查链接
# （需要安装broken-link-checker）
npm run check-links
```

---

## 📊 进度跟踪方法

### 创建每日日志

每天创建 `logs/2024-11-22.md`：

```markdown
# 2024-11-22 执行日志

## 计划
- [ ] Batch 1: Page 1.1-1.4

## 实际执行

### 09:00-09:45 Page 1.1: wifi-cloud-lock
- ✅ 完成删除
- Git: abc123456
- 独特内容已保存到notes/wifi-architecture.md

### 10:00-10:45 Page 1.2: matter-for-locks
- ✅ 完成删除
- Git: def789012
- Matter架构图保存到assets/

### 遇到的问题
1. astro.config.mjs重定向语法不确定
   - 解决：查看文档，使用正确语法

## 今日总结
- 完成页面：4/4 ✅
- 用时：3.5小时（比预计快）
- 质量：良好

## 明日计划
- Batch 1剩余4页
- 开始Batch 2准备
```

---

## ✅ 质量检查清单

### 每个页面完成后

```bash
□ 内容质量
  - 字数符合目标
  - 章节结构清晰
  - 无语法错误
  
□ 链接质量
  - 所有链接有效（或使用placeholder）
  - 计算器链接数量达标
  - 内部链接合理
  
□ SEO优化
  - Title包含关键词
  - Meta description精准
  - H1-H6层级正确
  - 图片有alt text
  
□ Git规范
  - Commit message清晰
  - 每个页面单独commit
  - 定期push
  
□ 文档更新
  - DAILY_PROGRESS.md已更新
  - PAGE_BY_PAGE_TASKS.md状态已标记
```

### 每个Batch完成后

```bash
□ 批次目标达成
  - 所有页面已处理
  - 质量标准符合
  
□ 架构一致性
  - 链接网络完整
  - 内容无重复
  
□ 技术实施
  - 重定向配置正确
  - sitemap已更新
  
□ Git历史清晰
  - 每个页面可追溯
  - Commit分组合理
```

---

## 🚨 常见问题解决

### Q1: 源文章找不到某些内容？
**A**: 可能文章不存在或路径错误
- 使用 `find src -name "*battery*"` 搜索
- 检查ARTICLE_ACTION_LIST.md确认文件名

### Q2: 301重定向不生效？
**A**: 检查语法和路径
- 重定向路径必须以 `/` 开头
- 目标路径可以包含 `#anchor`
- 重启dev server测试

### Q3: Git冲突？
**A**: 先pull再push
```bash
git pull origin main
# 解决冲突
git add .
git commit
git push
```

### Q4: 字数不达标？
**A**: 扩展内容而非填充
- 添加更多案例
- 深化技术解释
- 扩展FAQ
- **不要**为了字数而重复

### Q5: 计算器链接还没实现？
**A**: 使用placeholder
```markdown
⚙️ [Battery Life Calculator](/tools/battery-calculator) 
<!-- TODO: 实现计算器后更新链接 -->
```

---

## 🎯 每日开始前检查

```bash
□ Git状态干净（无未提交更改）
□ 开发服务器正常运行
□ 今日目标明确
□ 上一个页面已完成验收
□ 工作环境就绪（编辑器、笔记、浏览器）
```

---

## 🎉 每日结束前检查

```bash
□ 所有修改已Git提交
□ 进度日志已更新
□ 明日计划已写好
□ 代码已push到远程
□ 开发服务器已关闭
```

---

**现在可以开始执行 Day 1, Page 1.1！** 🚀
