#!/bin/bash

cd /Users/luokun/Documents/GitHub/smartlock

echo "=== 验证所有内部链接 ==="
echo

# 提取所有内部链接
grep -rh '](/[a-zA-Z0-9/_-]*' src/content/articles src/pages/tools 2>/dev/null | \
  grep -o '](/[^)#]*' | \
  sed 's/](//' | \
  sort -u > /tmp/all_links.txt

total=$(wc -l < /tmp/all_links.txt)
echo "找到 $total 个唯一链接"
echo

broken=0

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
      broken=$((broken + 1))
    fi
  else
    # 检查文章链接
    if [ ! -f "src/content/articles/${path}.mdx" ]; then
      echo "❌ 404: $link"
      broken=$((broken + 1))
    fi
  fi
done < /tmp/all_links.txt

echo
echo "总计: $total 个链接"
echo "有效: $((total - broken)) 个"
echo "404: $broken 个"

if [ $broken -eq 0 ]; then
  echo
  echo "✅ 所有链接都有效！"
else
  echo
  echo "⚠️  请修复上述404链接"
fi
