#!/bin/bash

echo "=========================================="
echo "智能门锁网站 - 完整扫描报告"
echo "=========================================="
echo

cd /Users/luokun/Documents/GitHub/smartlock

# 1. 扫描所有MDX文件
echo "📄 扫描所有内容文件..."
mdx_files=$(find src/content/articles -name "*.mdx" | wc -l)
echo "   找到 $mdx_files 个MDX文件"
echo

# 2. 扫描所有工具页面
echo "🔧 扫描所有工具页面..."
tool_files=$(find src/pages/tools -name "*.astro" -not -name "index.astro" | wc -l)
echo "   找到 $tool_files 个工具页面"
echo

# 3. 提取所有内部链接
echo "🔗 提取所有内部链接..."
grep -rh '\]\(/' src/content/articles src/pages/tools 2>/dev/null | \
  grep -o '](/[^)]*' | \
  sed 's/](//' | \
  sed 's/#.*//' | \
  sort -u | \
  grep -v '^/$' > /tmp/all_internal_links.txt

link_count=$(wc -l < /tmp/all_internal_links.txt)
echo "   找到 $link_count 个唯一内部链接"
echo

# 4. 验证每个链接
echo "✓ 验证链接有效性..."
echo "=========================================="
echo

broken_links=0
broken_list=""

while IFS= read -r link; do
  path="${link#/}"
  
  if [ -z "$path" ]; then
    continue
  fi
  
  # 检查工具链接
  if echo "$path" | grep -q "^tools/"; then
    tool=$(echo "$path" | sed 's/^tools\///')
    if [ -z "$tool" ]; then
      continue
    fi
    if [ ! -f "src/pages/tools/${tool}.astro" ]; then
      echo "❌ 404: $link"
      echo "   期望文件: src/pages/tools/${tool}.astro"
      broken_links=$((broken_links + 1))
      broken_list="${broken_list}${link}\n"
    fi
  else
    # 检查文章链接
    if [ ! -f "src/content/articles/${path}.mdx" ]; then
      echo "❌ 404: $link"
      echo "   期望文件: src/content/articles/${path}.mdx"
      broken_links=$((broken_links + 1))
      broken_list="${broken_list}${link}\n"
    fi
  fi
done < /tmp/all_internal_links.txt

echo
echo "=========================================="
echo

# 5. 检查Markdown语法错误
echo "📝 检查Markdown语法错误..."
echo "=========================================="
echo

# 检查未闭合的代码块
unclosed_blocks=0
find src/content/articles -name "*.mdx" | while read -r file; do
  opening=$(grep -c '^```' "$file")
  # 代码块必须成对出现
  if [ $((opening % 2)) -ne 0 ]; then
    echo "⚠️  未闭合的代码块: $file"
    unclosed_blocks=$((unclosed_blocks + 1))
  fi
done

echo

# 6. 检查重复的文章slug
echo "🔍 检查重复的文章slug..."
echo "=========================================="
echo

find src/content/articles -name "*.mdx" | \
  sed 's|src/content/articles/||' | \
  sed 's|\.mdx$||' | \
  awk -F'/' '{print $NF}' | \
  sort | uniq -d > /tmp/duplicate_slugs.txt

dup_count=$(wc -l < /tmp/duplicate_slugs.txt)
if [ $dup_count -gt 0 ]; then
  echo "⚠️  发现 $dup_count 个重复的slug:"
  cat /tmp/duplicate_slugs.txt | while read slug; do
    echo "   - $slug"
    find src/content/articles -name "${slug}.mdx" | sed 's/^/     /'
  done
else
  echo "✅ 无重复slug"
fi

echo
echo "=========================================="
echo

# 7. 生成完整报告
echo "📊 完整扫描报告"
echo "=========================================="
echo
echo "内容统计:"
echo "  - MDX文章: $mdx_files 个"
echo "  - 工具页面: $tool_files 个"
echo "  - 内部链接: $link_count 个"
echo
echo "链接验证:"
echo "  - 有效链接: $((link_count - broken_links)) 个"
echo "  - 404链接: $broken_links 个"
echo

if [ $broken_links -gt 0 ]; then
  echo "❌ 发现 $broken_links 个失效链接，需要修复！"
  echo
  echo "失效链接列表:"
  echo -e "$broken_list" | grep -v '^$' | sort -u
else
  echo "✅ 所有链接都有效！"
fi

echo
echo "=========================================="
echo "扫描完成"
echo "=========================================="
