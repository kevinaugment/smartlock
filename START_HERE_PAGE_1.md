# 🚀 立即开始：第1页执行手册

> **任务**：删除 wifi-cloud-lock-architecture.mdx  
> **预计时间**：30-45分钟  
> **难度**：⭐ 简单

---

## ✅ 执行前检查

```bash
# 1. 确认在正确目录
pwd
# 应显示：/Users/luokun/Documents/GitHub/smartlock

# 2. 检查Git状态
git status
# 应显示：working tree clean

# 3. 确认文件存在
ls -la src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
# 应显示文件信息
```

---

## 📖 Step 1: 读取并分析（10分钟）

### 1.1 打开文件阅读

```bash
# 方式1：用VS Code打开
code src/content/articles/protocols/wifi-cloud-lock-architecture.mdx

# 方式2：用默认编辑器
open src/content/articles/protocols/wifi-cloud-lock-architecture.mdx

# 方式3：命令行查看
cat src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
```

### 1.2 记录关键信息

**在笔记中记录**（可用任何笔记工具）：

```markdown
# wifi-cloud-lock分析

## 基本信息
- 字数：约 [___] 字
- 章节：[列出主要章节]

## 独特内容（需保留到新Pillar）
- [ ] WiFi持续连接架构图
- [ ] 云端依赖性分析
- [ ] 具体品牌案例（如August）
- [ ] 功耗数据（60-80mW）
- [ ] [其他独特内容]

## 重复内容（可直接删除）
- [ ] 基础WiFi介绍
- [ ] 通用协议对比
- [ ] [其他通用内容]
```

### 1.3 提取关键数据

**复制到笔记**（将来写新Pillar时使用）：

```markdown
## 待迁移到 protocols-overview.mdx 的内容

### WiFi章节素材
1. 架构图描述：[复制图表信息]
2. 功耗数据：WiFi锁60-80mW continuous
3. 云端依赖：[复制关键段落]
4. 品牌案例：August Pro实测数据
5. 优劣势对比表：[复制表格]
```

---

## 🗂️ Step 2: 备份文件（2分钟）

```bash
# 创建备份目录
mkdir -p archive/deleted/2024-11

# 复制文件到备份
cp src/content/articles/protocols/wifi-cloud-lock-architecture.mdx \
   archive/deleted/2024-11/wifi-cloud-lock-architecture.mdx

# 验证备份成功
ls -la archive/deleted/2024-11/wifi-cloud-lock-architecture.mdx
# 应显示文件和大小
```

**✅ 检查点**：archive目录中有备份文件

---

## 🗑️ Step 3: 删除源文件（1分钟）

```bash
# 使用Git删除（会自动stage）
git rm src/content/articles/protocols/wifi-cloud-lock-architecture.mdx

# 验证删除
git status
# 应显示：deleted: src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
```

**✅ 检查点**：`git status` 显示文件已删除

---

## 🔀 Step 4: 配置301重定向（10分钟）

### 4.1 找到配置文件

```bash
# 打开astro配置文件
code astro.config.mjs

# 或
open astro.config.mjs
```

### 4.2 找到redirects配置

在文件中查找 `redirects` 部分，通常在 `defineConfig` 内：

```javascript
export default defineConfig({
  // ... 其他配置
  
  redirects: {
    // 现有的重定向
  },
  
  // ... 更多配置
});
```

### 4.3 添加新重定向

在 `redirects` 对象中添加：

```javascript
redirects: {
  // 现有重定向...
  
  // 新增：wifi-cloud-lock重定向
  '/protocols/wifi-cloud-lock-architecture': {
    status: 301,
    destination: '/protocols/smart-lock-protocols-overview#wifi'
  },
},
```

**或者简化语法**（如果配置支持）：

```javascript
redirects: {
  '/protocols/wifi-cloud-lock-architecture': '/protocols/smart-lock-protocols-overview#wifi',
},
```

### 4.4 保存并验证语法

```bash
# 检查语法错误
npm run build

# 如果有错误，修正语法
# 如果成功，继续
```

**✅ 检查点**：配置文件无语法错误

---

## 📝 Step 5: 更新sitemap（5分钟）

### 5.1 查找sitemap配置

```bash
# 如果有sitemap.xml
code public/sitemap.xml

# 如果是动态生成的，检查配置
# 通常Astro会自动处理，可跳过此步
```

### 5.2 手动更新（如需要）

如果需要手动维护sitemap：

```xml
<!-- 找到并删除这一行 -->
<url>
  <loc>https://yoursite.com/protocols/wifi-cloud-lock-architecture</loc>
  ...
</url>
```

**注意**：大多数情况下sitemap是自动生成的，删除源文件后会自动更新

**✅ 检查点**：sitemap已确认（自动或手动）

---

## 💾 Step 6: Git提交（5分钟）

### 6.1 查看更改

```bash
# 查看将要提交的内容
git status

# 应该看到：
# deleted: src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
# modified: astro.config.mjs
# (可能) new file: archive/deleted/2024-11/...
```

### 6.2 添加所有更改

```bash
# 添加astro.config.mjs
git add astro.config.mjs

# 如果archive在Git中，添加它
git add archive/deleted/2024-11/wifi-cloud-lock-architecture.mdx

# 或者一次性添加所有
git add .
```

### 6.3 提交更改

```bash
# 使用清晰的commit message
git commit -m "Delete: wifi-cloud-lock-architecture.mdx

- Merged content will go to protocols-overview Pillar
- Set 301 redirect to protocols-overview#wifi
- Backup saved to archive/deleted/2024-11/
- Unique content extracted to notes for future use"
```

### 6.4 推送到远程（可选）

```bash
# 如果想立即推送
git push origin main

# 或者等完成更多页面后统一推送
```

**✅ 检查点**：`git log` 显示新的commit

---

## 📊 Step 7: 更新进度日志（5分钟）

### 7.1 创建/打开今日日志

```bash
# 创建目录
mkdir -p logs

# 创建今日日志
code logs/2024-11-22.md
```

### 7.2 记录完成情况

```markdown
# 2024-11-22 执行日志

## Batch 1: 删除重复Pillar

### ✅ Page 1.1: wifi-cloud-lock-architecture
- **时间**: 09:00-09:40 (40分钟)
- **状态**: ✅ 完成
- **Git commit**: [复制commit hash]
- **备份位置**: archive/deleted/2024-11/
- **独特内容**: 已提取到notes/wifi-architecture.md
- **重定向**: 已配置到protocols-overview#wifi
- **问题**: 无

### ⏳ Page 1.2: matter-for-smart-locks
- **状态**: 待开始

---

## 总结
- 完成页面: 1/8
- 累计用时: 40分钟
- 进度: 12.5%
```

### 7.3 更新主任务清单

打开 `PAGE_BY_PAGE_TASKS.md`，标记完成：

```markdown
### Page 1.1: wifi-cloud-lock-architecture.mdx ✅

✅ 已完成 (2024-11-22 09:40)
Git: abc123456
```

**✅ 检查点**：进度日志已更新

---

## 🎉 第1页完成验收

### 最终检查清单

```bash
□ 源文件已删除
  验证: ls src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
  应显示: No such file or directory

□ 备份文件存在
  验证: ls archive/deleted/2024-11/wifi-cloud-lock-architecture.mdx
  应显示: 文件存在

□ 独特内容已提取
  验证: 查看笔记，确认关键内容已记录

□ 301重定向已配置
  验证: 查看astro.config.mjs，确认有重定向规则

□ Git已提交
  验证: git log -1
  应显示: Delete: wifi-cloud-lock-architecture

□ 进度日志已更新
  验证: cat logs/2024-11-22.md
  应显示: Page 1.1完成记录
```

### 测试重定向（可选）

```bash
# 启动开发服务器
npm run dev

# 在浏览器访问旧URL：
# http://localhost:4321/protocols/wifi-cloud-lock-architecture

# 应该自动重定向到：
# http://localhost:4321/protocols/smart-lock-protocols-overview#wifi
```

---

## 🚀 继续下一页

**恭喜完成第1页！**

现在继续 **Page 1.2: matter-for-smart-locks.mdx**

执行相同的7步流程：
1. 读取分析（10min）
2. 备份（2min）
3. 删除（1min）
4. 配置重定向（10min）
5. 更新sitemap（5min）
6. Git提交（5min）
7. 更新日志（5min）

**目标重定向**：`/protocols/smart-lock-protocols-overview#matter`

---

## 📞 遇到问题？

### 常见问题速查

**Q: 文件不存在？**
```bash
# 搜索文件
find src -name "*wifi-cloud*"
# 可能路径不同，根据实际调整
```

**Q: astro.config.mjs找不到redirects？**
```bash
# 查看完整文件结构
cat astro.config.mjs
# 可能需要手动添加redirects配置块
```

**Q: Git提交失败？**
```bash
# 查看详细错误
git status
git diff
# 根据错误信息调整
```

**Q: npm run build失败？**
```bash
# 查看详细错误
npm run build
# 通常是语法错误，检查astro.config.mjs
```

---

## 📝 经验总结（完成后填写）

```markdown
## Page 1.1 经验

### 做得好的地方
- [记录顺利的步骤]

### 可以改进
- [记录遇到的问题和解决方案]

### 下次优化
- [记录可以加快的地方]

### 实际用时
- 预计: 30-45分钟
- 实际: ___ 分钟
- 差异原因: [如果有明显差异]
```

---

**开始计时，执行 Page 1.1！** ⏱️
