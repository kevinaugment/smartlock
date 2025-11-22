# 📦 数据迁移指南

## 🎯 目标

将48篇MDX文章从文件系统迁移到D1数据库，包括：
- ✅ 文章内容和元数据
- ✅ 7个分类
- ✅ 标签系统
- ✅ 阅读时间计算
- ✅ 作者关联

## 📋 迁移前准备

### 1. 安装wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录Cloudflare

```bash
wrangler login
```

### 3. 创建D1数据库

```bash
wrangler d1 create smartlock
```

**记录返回的database_id**，更新到`wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "smartlock"
database_id = "your-database-id-here"  # 更新这里
```

### 4. 初始化数据库Schema

```bash
wrangler d1 execute smartlock --file=database/schema.sql
```

### 5. 安装迁移脚本依赖

```bash
cd scripts
npm install
cd ..
```

## 🚀 执行迁移

### 运行迁移脚本

```bash
node scripts/migrate-mdx-to-d1.js
```

### 迁移过程

脚本会自动执行以下步骤：

#### 步骤1: 创建默认用户 ✅
```
默认管理员账号:
- Email: admin@smartlock.com
- Password: admin123
- Role: admin
```

#### 步骤2: 创建分类 ✅
```
创建7个Hub分类:
- 📡 Protocols
- 🔒 Security
- 🔋 Battery & Installation
- 🔧 Troubleshooting
- 🏢 Use Cases
- 💡 Support
- 🔗 Integration
```

#### 步骤3: 迁移文章 ✅
```
处理48个MDX文件:
- 提取frontmatter
- 计算阅读时间
- 生成描述
- 创建文章记录
- 处理标签关联
```

#### 步骤4: 验证结果 ✅
```
统计:
- 文章总数
- 分类数量
- 标签数量
```

## 📊 迁移内容

### 文章信息映射

| MDX字段 | D1字段 | 说明 |
|---------|--------|------|
| title | title | 文章标题 |
| - | slug | 自动生成：category/filename |
| description | description | 描述（或自动提取） |
| content | content | Markdown内容 |
| - | category_id | 从目录结构识别 |
| - | author_id | 默认为1（admin） |
| - | reading_time | 自动计算 |
| featured | featured | 特色标记 |
| tags | tags | 标签数组 |
| - | status | 默认published |

### 文件结构示例

```
src/content/articles/
├── protocols/
│   ├── smart-lock-protocols-overview.mdx
│   └── zigbee-vs-zwave-comparison.mdx
├── security/
│   └── smart-lock-security-complete-analysis.mdx
├── support/
│   ├── install-smart-lock-step-by-step.mdx
│   └── (34篇support文章...)
└── ...
```

## ✅ 验证迁移

### 1. 检查文章数量

```bash
wrangler d1 execute smartlock --command="SELECT COUNT(*) as total FROM articles"
```

预期结果: `total: 48`

### 2. 检查分类

```bash
wrangler d1 execute smartlock --command="SELECT name, COUNT(*) as article_count FROM categories c LEFT JOIN articles a ON c.id = a.category_id GROUP BY c.id"
```

### 3. 检查特定文章

```bash
wrangler d1 execute smartlock --command="SELECT title, slug, status, reading_time FROM articles LIMIT 5"
```

### 4. 检查标签

```bash
wrangler d1 execute smartlock --command="SELECT COUNT(*) as total FROM tags"
```

## 🔧 故障排除

### 问题1: wrangler未找到

**解决方案:**
```bash
npm install -g wrangler
wrangler login
```

### 问题2: 数据库连接失败

**解决方案:**
```bash
# 检查数据库是否存在
wrangler d1 list

# 重新创建
wrangler d1 create smartlock

# 重新初始化schema
wrangler d1 execute smartlock --file=database/schema.sql
```

### 问题3: 部分文章失败

**解决方案:**
1. 查看控制台输出的错误信息
2. 检查MDX文件格式
3. 确保frontmatter正确
4. 重新运行脚本（已存在的会跳过）

### 问题4: SQL语法错误

**常见原因:**
- 单引号未转义
- 特殊字符问题

**解决方案:**
脚本已自动处理转义，如遇问题检查特定文章内容

## 📝 迁移后清单

### ✅ 必须完成

- [ ] 验证48篇文章都已导入
- [ ] 验证7个分类都存在
- [ ] 测试管理员登录
- [ ] 检查文章在管理后台显示

### ✅ 可选操作

- [ ] 更新密码哈希（生产环境）
- [ ] 添加更多管理员用户
- [ ] 配置文章发布时间
- [ ] 设置特色文章

## 🎯 下一步

### 启动完整系统

```bash
# 终端1: 启动API
cd api
npm install
npm run dev

# 终端2: 启动管理后台
cd admin
npm install
npm run dev

# 终端3: 启动主站（可选）
npm run dev
```

### 访问地址

- **管理后台**: http://localhost:5173
- **API**: http://localhost:8787
- **主站**: http://localhost:4321

### 登录管理后台

```
Email: admin@smartlock.com
Password: admin123
```

## 📈 性能统计

### 预期时间

| 步骤 | 时间 |
|------|------|
| 创建用户 | <1秒 |
| 创建分类 | <1秒 |
| 迁移48篇文章 | 30-60秒 |
| 验证 | <5秒 |
| **总计** | **约1分钟** |

### 资源使用

- D1读取: 约100次
- D1写入: 约200次
- 存储: 约5MB

## 🔒 安全提示

### ⚠️ 重要

1. **生产环境密码**: 脚本中的密码哈希仅用于开发
   ```bash
   # 生成新密码哈希
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
   ```

2. **环境变量**: 敏感信息应使用环境变量
   ```bash
   export DB_NAME=smartlock
   export ADMIN_EMAIL=your@email.com
   ```

3. **备份**: 迁移前备份MDX文件
   ```bash
   tar -czf articles-backup.tar.gz src/content/articles/
   ```

## 🎉 迁移完成后

### 可以做什么

✅ 在管理后台查看和编辑文章
✅ 使用Monaco编辑器编写Markdown
✅ 批量管理文章状态
✅ 添加标签和分类
✅ 设置特色文章
✅ 查看文章统计

### 原MDX文件

迁移后，原MDX文件可以：
- ✅ 保留作为备份
- ✅ 用于版本对比
- ✅ 随时回滚

不会被自动删除或修改。

## 📚 相关文档

- `database/schema.sql` - 数据库结构
- `api/src/routes/articles.ts` - 文章API
- `admin/src/pages/ArticlesPage.tsx` - 文章管理
- `ADMIN_PAGES_COMPLETE.md` - 管理后台文档

---

**准备好了吗？运行迁移脚本：**

```bash
node scripts/migrate-mdx-to-d1.js
```

🚀 开始你的D1之旅！
