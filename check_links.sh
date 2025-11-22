#!/bin/bash

# 检查所有内部链接是否有效

echo "=== 检查内部链接 ==="
echo

cd /Users/luokun/Documents/GitHub/smartlock

# 提取所有内部链接
echo "提取所有内部链接..."
grep -rh '\](/[a-zA-Z0-9/_-]*' src/content/articles src/pages/tools 2>/dev/null | \
  grep -o '](/[^)#]*' | \
  sed 's/](//' | \
  sort -u | \
  grep -v '^/tools$' | \
  grep -v '^/$' > /tmp/links.txt

echo "找到 $(wc -l < /tmp/links.txt) 个唯一链接"
echo

# 检查每个链接
404_count=0
while read -r link; do
  # 移除开头的斜杠
  path="${link#/}"
  
  # 检查是否是工具链接
  if [[ "$path" == tools/* ]]; then
    tool_name="${path#tools/}"
    if [[ -f "src/pages/tools/${tool_name}.astro" ]] || [[ "$tool_name" == "" ]]; then
      continue
    else
      echo "❌ 404: $link (工具不存在: src/pages/tools/${tool_name}.astro)"
      ((404_count++))
    fi
  # 检查是否是文章链接
  else
    if [[ -f "src/content/articles/${path}.mdx" ]]; then
      continue
    else
      echo "❌ 404: $link (文章不存在: src/content/articles/${path}.mdx)"
      ((404_count++))
    fi
  fi
done < /tmp/links.txt

echo
if [[ $404_count -eq 0 ]]; then
  echo "✅ 所有链接都有效！"
else
  echo "⚠️  发现 $404_count 个404链接"
fi
