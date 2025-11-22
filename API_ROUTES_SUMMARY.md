# 🎯 API路由完整总结

## ✅ 已实现的路由（共8个模块）

### 1. Auth路由 - `/api/auth`
- POST `/login` - 登录
- POST `/register` - 注册
- GET `/me` - 当前用户
- POST `/logout` - 登出

### 2. Articles路由 - `/api/articles`
- GET `/` - 列表（搜索、分页、筛选）
- GET `/:id` - 单篇（含标签和关联）
- POST `/` - 创建（自动标签）
- PUT `/:id` - 更新
- DELETE `/:id` - 删除
- POST `/batch` - 批量操作
- POST `/:id/view` - 增加浏览

### 3. Categories路由 - `/api/categories`
- GET `/` - 树形列表
- GET `/:id` - 单个
- POST `/` - 创建
- PUT `/:id` - 更新
- DELETE `/:id` - 删除

### 4. Calculators路由 - `/api/calculators`
- GET `/` - 列表
- GET `/:id` - 单个（含关联）
- POST `/` - 创建
- PUT `/:id` - 更新
- DELETE `/:id` - 删除
- POST `/:id/articles` - 关联文章
- POST `/:id/tools` - 关联工具

### 5. Pages路由 - `/api/pages`
- GET `/` - 列表
- GET `/:id` - 单个
- POST `/` - 创建
- PUT `/:id` - 更新
- DELETE `/:id` - 删除

### 6. Settings路由 - `/api/settings`
- GET `/` - 所有设置
- GET `/:key` - 单个设置
- PUT `/:key` - 更新
- POST `/batch` - 批量更新
- GET `/navigation/:location` - 导航
- POST `/navigation` - 更新导航

### 7. Media路由 - `/api/media`
- GET `/` - 列表
- POST `/upload` - 上传R2
- DELETE `/:id` - 删除

### 8. Analytics路由 - `/api/analytics`
- GET `/stats` - 统计
- GET `/popular` - 热门

## 📊 API功能特性

✅ JWT认证和授权
✅ Bcrypt密码加密
✅ 审计日志记录
✅ 参数化查询（防注入）
✅ 分页和搜索
✅ 批量操作
✅ 文件上传R2
✅ 关联查询
✅ 树形结构
✅ 浏览计数

## 🚀 快速启动

```bash
cd api
npm install
npm run dev
```

访问：http://localhost:8787

## 📝 下一步

继续创建React管理后台页面
