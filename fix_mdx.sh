#!/bin/bash
# 批量修复MDX文件脚本

process_file() {
    local src=$1
    local dest=$2
    
    cp "$src" "$dest"
    
    # 批量替换所有已知问题
    sed -i '' \
        -e 's/□ /- /g' \
        -e 's/☑ /- /g' \
        -e 's/^```$/```text/g' \
        -e "s/won't/will not/g" \
        -e "s/can't/cannot/g" \
        -e "s/doesn't/does not/g" \
        -e "s/isn't/is not/g" \
        -e "s/haven't/have not/g" \
        -e "s/wasn't/was not/g" \
        -e "s/wouldn't/would not/g" \
        -e 's/  -  / - /g' \
        -e 's/= /equals /g' \
        "$dest"
    
    echo "✓ $(basename $src)"
}

# 导出函数
export -f process_file

# 批量处理Support文件
for file in /tmp/problem_mdx_files/*.mdx; do
    name=$(basename "$file" .mdx)
    
    # 跳过已修复的
    if [ "$name" = "disaster-recovery-business-continuity" ] || [ "$name" = "door-sensor-not-working" ] || [ "$name" = "door-compatibility-guide" ]; then
        continue
    fi
    
    # 判断目录
    category="support"
    [[ "$name" == *"guide"* ]] && category="guides"
    [[ "$name" == *"integration"* ]] && category="integration"
    [[ "$name" == *"deployment"* ]] && category="use-cases"
    [[ "$name" == *"strategy"* ]] && category="use-cases"
    
    dest="src/content/articles/$category/$name.mdx"
    
    if [ ! -f "$dest" ]; then
        process_file "$file" "$dest"
    fi
done
