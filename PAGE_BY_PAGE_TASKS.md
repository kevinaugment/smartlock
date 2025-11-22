# 逐页执行任务清单

> **原则**：一次一页，完成再继续

---

## 批次总览

| 批次 | 任务 | 页面数 | 时间 | 优先级 |
|------|------|--------|------|--------|
| Batch 1 | 删除8篇重复 | 8 | 4-6h | 🔥 立即 |
| Batch 2 | 电池Pillar | 1 | 20h | 🔥 立即 |
| Batch 3 | 简化2篇 | 2 | 8h | 🔥 立即 |
| Batch 4 | 配对Guide | 1 | 12h | ⭐ 本周 |
| Batch 5 | 协议Pillar | 1 | 28h | ⭐ 本周 |
| Batch 6+ | 其他Pillar | 6 | 140h | 后续 |

---

## 🔥 Batch 1: 删除重复（8页，每页30-45min）

### 标准删除流程（6步）

```bash
1. 读取文件，记录关键内容（10min）
2. 备份到archive/deleted/（2min）
3. 提取独特内容到笔记（10min）
4. 删除源文件（1min）
5. 配置301重定向（10min）
6. Git提交（2min）
```

### Page 1.1: wifi-cloud-lock-architecture.mdx

```bash
文件：src/content/articles/protocols/wifi-cloud-lock-architecture.mdx
重定向到：/protocols/smart-lock-protocols-overview#wifi
任务：
□ 读取并记录WiFi架构独特内容
□ 复制文件到archive/deleted/2024-11/
□ 删除源文件
□ 编辑astro.config.mjs添加重定向
□ Git commit: "Delete: wifi-cloud-lock (merge to overview)"
```

### Page 1.2-1.8: 其他7篇

| 页面 | 文件 | 重定向目标 |
|------|------|-----------|
| 1.2 | matter-for-smart-locks | protocols-overview#matter |
| 1.3 | threat-modeling-security | security-complete#threat |
| 1.4 | zwave-s2-security | security-complete#zwave |
| 1.5 | hotel-hospitality | airbnb-guide |
| 1.6 | education-campus | enterprise#education |
| 1.7 | government-facility | enterprise#government |
| 1.8 | healthcare-facility | enterprise#healthcare |

每页执行相同6步流程

---

## 🔥 Batch 2: 电池Pillar（1页，20h）

### Page 2.1: battery-life-guide.mdx（新建）

**5个Phase执行**：

#### Phase A: 准备（2h）
```bash
□ 创建workspace/battery-pillar/
□ 收集6篇源文章：
  - how-to-change-battery
  - maximize-battery-life
  - emergency-battery-died
  - battery-dies-too-fast（如存在）
  - low-battery-warning（如存在）
  - troubleshooting（电池部分）
□ 逐篇分析内容并创建内容矩阵
□ 确定每部分内容来源
```

#### Phase B: 大纲（3h）
```bash
□ 创建文件：installation/smart-lock-battery-life-guide.mdx
□ 撰写8个章节大纲（5000-6000字）：
  1. Quick Matrix（300字）
  2. Fundamentals（1200字）
  3. Maximizing（1500字）
  4. Diagnosing（1000字）
  5. Replacement（800字）
  6. Emergency（500字）
  7. FAQ（700字）
  8. Resources
□ 标记6个计算器嵌入位置
```

#### Phase C: 撰写（12h）
```bash
Day 1（6h）：
□ Section 1-2（3h）
□ Section 3（3h）

Day 2（6h）：
□ Section 4-6（4h）
□ Section 7-8（2h）
```

#### Phase D: 链接（2h）
```bash
□ 添加6个计算器链接
□ 添加15-20个内部文章链接
□ 添加2-3个图表
```

#### Phase E: 验证（1h）
```bash
□ 字数检查：5000-6000
□ 链接测试
□ SEO优化
□ Git提交
```

---

## 🔥 Batch 3: 简化Support（2页）

### Page 3.1: how-to-change-battery（简化，4h）

```bash
当前：1250字（含理论）
目标：1200字（纯操作）

任务：
□ 删除电池类型理论（300字）→ 链接Pillar
□ 删除更换策略理论（200字）→ 链接Pillar
□ 保留8个品牌操作步骤（700字）
□ 添加Quick Answer（100字）
□ 添加5个向上链接
□ Git提交
```

### Page 3.2: emergency-battery-died（简化，4h）

```bash
当前：3200字
目标：1800字

任务：
□ 删除预防理论（800字）→ 简要+链接
□ 删除寿命分析（600字）→ 链接Pillar
□ 保留9V应急详细（1000字）
□ 保留物理钥匙（400字）
□ 扩展应急决策树（200字）
□ 添加5个链接
□ Git提交
```

---

## 🔥 Batch 4: 配对Guide（1页，12h）

### Page 4.1: smart-lock-pairing-guide（新建）

```bash
文件：guides/smart-lock-pairing-complete-guide.mdx
字数：4000-4500
整合：wont-pair + pair-with-hub + hub-cant-find

任务：
□ Phase A: 收集3篇源文章（1h）
□ Phase B: 创建大纲7章节（2h）
□ Phase C: 撰写内容（7h）
□ Phase D: 添加链接（1h）
□ Phase E: 验证（1h）
```

---

## ⭐ Batch 5: 协议Pillar（1页，28h）

### Page 5.1: protocols-overview（新建）

```bash
文件：protocols/smart-lock-protocols-overview.mdx
字数：5000
整合：wifi-cloud + matter

Phase A: 准备（3h）
Phase B: 大纲8章节（4h）
Phase C: 撰写（16h）
Phase D: 链接6个工具（3h）
Phase E: 验证（2h）
```

---

## 📊 进度跟踪

创建 `DAILY_PROGRESS.md`：

```markdown
# 日期：2024-11-22

## 今日目标
- [ ] Batch 1: 删除页面1.1-1.3（3页）

## 完成情况
| 时间 | 页面 | 状态 | 备注 |
|------|------|------|------|
| 10:00 | 1.1 wifi-cloud | ✅ | Git: abc123 |
| 11:00 | 1.2 matter | ⏳ | 进行中 |
| - | 1.3 threat | ⏳ | 待开始 |

## 遇到的问题
- 无

## 明日计划
- [ ] 完成Batch 1剩余5页
- [ ] 开始Batch 2准备
```

---

## 🚀 立即执行：第1页

**现在开始执行 Page 1.1**

```bash
# 进入项目目录
cd /Users/luokun/Documents/GitHub/smartlock

# 1. 读取文件
open src/content/articles/protocols/wifi-cloud-lock-architecture.mdx

# 2. 备份
mkdir -p archive/deleted/2024-11
cp src/content/articles/protocols/wifi-cloud-lock-architecture.mdx \
   archive/deleted/2024-11/

# 3. 记录独特内容（手动在笔记中）

# 4. 删除文件
git rm src/content/articles/protocols/wifi-cloud-lock-architecture.mdx

# 5. 编辑重定向
# 编辑 astro.config.mjs，添加：
# '/protocols/wifi-cloud-lock-architecture': '/protocols/smart-lock-protocols-overview#wifi'

# 6. 提交
git add astro.config.mjs
git commit -m "Delete: wifi-cloud-lock-architecture.mdx (merged to protocols-overview)"

# 7. 更新进度日志
echo "✅ Page 1.1 完成 - $(date)" >> DAILY_PROGRESS.md
```

**预计时间**：30-45分钟  
**完成后**：继续 Page 1.2
