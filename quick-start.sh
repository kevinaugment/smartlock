#!/bin/bash

echo "🚀 Smart Lock CMS 快速启动脚本"
echo "================================"
echo ""

# 检查wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ wrangler未安装"
    echo "   运行: npm install -g wrangler"
    exit 1
fi

echo "✅ wrangler已安装"
echo ""

# 检查数据库ID
if ! grep -q "database_id.*=.*\".*\"" wrangler.toml 2>/dev/null; then
    echo "⚠️  wrangler.toml中未配置database_id"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 运行: wrangler d1 create smartlock"
    echo "2. 复制返回的database_id"
    echo "3. 更新wrangler.toml中的database_id"
    echo "4. 运行: wrangler d1 execute smartlock --file=database/schema.sql"
    echo "5. 运行: node scripts/migrate-mdx-to-d1.js"
    echo ""
    exit 1
fi

echo "✅ 数据库配置已设置"
echo ""

# 检查API依赖
if [ ! -d "api/node_modules" ]; then
    echo "📦 安装API依赖..."
    cd api && npm install && cd ..
fi

# 检查Admin依赖
if [ ! -d "admin/node_modules" ]; then
    echo "📦 安装Admin依赖（需要几分钟）..."
    cd admin && npm install && cd ..
fi

echo ""
echo "================================"
echo "🎉 准备就绪！"
echo "================================"
echo ""
echo "请打开2个终端窗口："
echo ""
echo "终端1 - API服务:"
echo "  cd api && npm run dev"
echo ""
echo "终端2 - 管理后台:"
echo "  cd admin && npm run dev"
echo ""
echo "然后访问: http://localhost:5173"
echo "登录: admin@smartlock.com / admin123"
echo ""
