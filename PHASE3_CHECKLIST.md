# Phase 3 执行清单：计算器-文章链接网络

**时间**：Week 5-6 | **工作量**：60小时

---

## 🎯 目标
- 15个计算器页面内容增强（每个+2500字）
- 在49篇文章中添加计算器CTA
- 创建Tools Center导航页
- 建立200+双向链接

---

## Week 5: 计算器页面增强

### 任务：15个计算器页面内容补充

**标准结构**（每页2500-3000字）：
```
1. 概述（200字）- 为什么需要这个工具
2. 快速使用（400字）- 参数说明
3. 【计算器组件】
4. 方法论（800字）- 公式、假设、数据来源
5. 实际案例（600字）- 2-3个场景
6. 优化建议（300字）- 基于结果的行动
7. 相关资源（200字）- 其他工具+文章
8. FAQ（500字）- 10-15问
```

---

### Day 19-20: Tier 1计算器（16h，每个1.6h）

**高优先级10个**：

```
□ TCO Calculator（2h）
  - 链接Pillar: Protocols Guide, Battery Guide
  - 链接Support: cost-comparison, subscription
  - 链接工具: Battery Calculator, Protocol Wizard
  - 案例：WiFi单门 vs Zigbee 5门 vs Z-Wave办公楼

□ Battery Life Comparison（2h）
  - 链接Pillar: Battery Guide, Protocols Guide
  - 链接Support: maximize-battery, change-battery
  - 案例：日均5次 vs 20次 vs 50次

□ Protocol Wizard（2h）
  - 链接Pillar: Protocols Guide, Security Analysis
  - 链接Support: 各协议文章
  - 案例：公寓/别墅/短租

□ Door Compatibility（1.5h）
  - 链接Pillar: Installation Guide
  - 链接Support: door-prep, install-steps
  - 案例：标准门/防盗门/玻璃门

□ STR ROI Calculator（2h）
  - 链接Pillar: Airbnb Guide
  - 链接Support: guest-code, automation
  - 案例：月10单 vs 20单 vs 30单

□ RF Coverage Estimator（1.5h）
  - 链接Pillar: Protocols Guide
  - 链接Support: offline-issues, wont-pair
  - 案例：公寓/别墅/办公楼

□ Integration Checker（1.5h）
  - 链接Pillar: Protocols Guide
  - 链接Support: 平台集成系列
  - 案例：HomeKit/Google/Alexa

□ Offline Scorecard（1.5h）
  - 链接Pillar: Security Analysis
  - 链接Support: emergency-battery
  - 案例：评分30/60/90分场景

□ Automation Time Savings（1.5h）
  - 链接Pillar: Airbnb Guide
  - 链接Support: guest-code
  - 案例：月10/20/30单时间节省

□ Multi-Property Planner（1.5h）
  - 链接Pillar: Long-Term Rental Guide
  - 链接Support: fleet-management
  - 案例：5房/10房/50房方案
```

---

### Day 21-22: Tier 2-3计算器（8h）

```
□ Installation Estimator（1.5h）
□ Mesh Node Planner（1.5h）
□ Credential Capacity（1.5h）
□ Subscription vs Purchase（1.5h）
□ Emergency Backup Evaluator（1.5h）
```

---

## Week 6: 文章反向CTA + Tools Center

### Day 23-24: 49篇文章添加CTA（16h）

**标准CTA格式**：
```markdown
---
📊 **实用工具推荐**

根据您的情况快速计算：
- ⚙️ [工具名称](/tools/xxx) - 30字描述
- ⚙️ [工具名称](/tools/xxx) - 30字描述

2分钟获取个性化建议 →
---
```

**插入规则**：
```
Pillar文章（6篇）：3-5个计算器CTA
- 分散在各主要章节
- 每1000字至少1个
- 工作量：6 × 30分钟 = 3h

Deep Dive文章（11篇）：2-3个CTA
- 相关性高的工具
- 工作量：11 × 20分钟 = 3.7h

Support文章（32篇）：1-2个CTA
- 解决问题后的优化工具
- 工作量：32 × 15分钟 = 8h

总计：14.7h（向上取整16h）
```

**具体分配**：
```
□ Day 23: 处理25篇（8h）
  - 6篇Pillar（3h）
  - 11篇Deep Dive（3.7h）
  - 8篇Support（2h）

□ Day 24: 处理24篇Support（8h）
```

---

### Day 25: Tools Center页面（8h）

**文件**：`/tools/index.astro`

```
□ 上午（4h）：页面结构
  - Hero section：标题+描述
  - 4个分类网格：
    * 🔴 购买决策（4个工具）
    * 🟡 部署规划（4个工具）
    * 🟢 运营优化（4个工具）
    * 🔵 风险评估（3个工具）
  - 每个工具卡片：
    * 图标
    * 标题
    * 30字描述
    * 使用场景标签
    * "开始使用"按钮

□ 下午（4h）：内容填充 + SEO
  - 15个工具描述撰写
  - 使用场景标签（独栋/公寓/短租/办公等）
  - SEO优化：
    * Title: "Smart Lock Calculators & Decision Tools"
    * Meta: 150字描述
    * Schema: CollectionPage
  - 响应式设计测试
```

**页面大纲**：
```markdown
# Smart Lock Decision Tools

帮您在5分钟内做出明智决策的15个专业计算器

## 🔴 购买决策工具
[4个工具卡片网格]

## 🟡 部署规划工具
[4个工具卡片网格]

## 🟢 运营优化工具
[4个工具卡片网格]

## 🔵 风险评估工具
[3个工具卡片网格]

## 为什么使用我们的工具？
- 基于真实数据（不是估算）
- 2分钟快速计算
- 可分享结果链接
- 完全免费

## 相关文章
[链接到6篇Pillar]
```

---

### Day 26: 全站链接测试（4h）

```
□ 自动化测试（2h）
  - 运行链接检查工具（Screaming Frog/Broken Link Checker）
  - 检查所有计算器链接（200+）
  - 检查工具页面到文章链接（15个工具×3-5个）
  
□ 手动抽查（1h）
  - 测试10个代表性页面
  - 验证CTA点击流程
  - 移动端测试
  
□ 修复问题（1h）
  - 修复broken links
  - 调整CTA位置（如果UX不佳）
```

---

## 质量标准

### 计算器页面验收
```
□ 每页字数：2500-3000 ✓
□ 内容完整：
  - 概述、使用、方法论、案例、FAQ ✓
□ 链接数量：
  - 文章链接：5-8个 ✓
  - 其他工具链接：2-3个 ✓
□ SEO优化完整 ✓
```

### 文章CTA验收
```
□ 49篇全部添加CTA ✓
□ CTA格式统一 ✓
□ 链接正确（无404）✓
□ 位置合理（不影响阅读）✓
```

### Tools Center验收
```
□ 15个工具全部展示 ✓
□ 分类清晰合理 ✓
□ 每个描述精准（30字）✓
□ 移动端友好 ✓
□ 加载速度<2秒 ✓
```

---

## 产出文件

**新建**：
- `/tools/index.astro`（Tools Center）

**修改**：
- 15个计算器页面（每个+2500字）
- 49篇文章（添加CTA）

**链接统计**：
- 计算器→文章：75-120个
- 文章→计算器：120-200个
- 总双向链接：195-320个

---

## Phase 3完成指标

```
□ 15个计算器页面增强完成 ✓
□ 49篇文章CTA添加完成 ✓
□ Tools Center页面上线 ✓
□ 200+链接测试通过 ✓
□ 无404/broken links ✓
□ 用户路径流畅（工具↔文章）✓
```
