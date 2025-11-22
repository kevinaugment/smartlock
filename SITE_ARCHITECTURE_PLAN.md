# 智能门锁网站完整架构规划

> **核心理念**：计算器为决策入口，Pillar为知识中心，Support为问题解决  
> **层级**：2层（Pillar → Support），取消过度细分

---

## 🏠 网站结构总览

```
首页 (/)
│
├─ 📊 计算器中心 (/tools)
│   └─ 15个决策工具
│
├─ 📚 知识中心 (/guides, /protocols, /security, /use-cases)
│   ├─ 第1层：Pillar文章（12篇）← 权威中心
│   └─ 第2层：Support文章（35-40篇）← 快速答案
│
└─ 🔍 文章列表 (/articles)
    ├─ 按主题分类
    └─ 按使用场景分类
```

---

## 📊 现有文章统计与分类

**总计**：54篇

**目录分布**：
- `guides/`: 3篇
- `protocols/`: 2篇
- `security/`: 3篇
- `integration/`: 1篇
- `technical/`: 1篇
- `use-cases/`: 5篇
- `support/`: 39篇（占72%）⚠️

**问题诊断**：
- ❌ Support占比过高（72% vs 理想60%）
- ❌ Pillar严重不足（仅2-3篇 vs 理想12篇）
- ❌ 无清晰的层级区分（目录混乱）

---

## 🎯 重组方案：2层架构

### 第1层：Pillar Hub（12篇权威文章）

**定义**：4000-6000字，完整知识体系，5-8个计算器链接

#### 1. 协议主题 Pillar（3篇）

```
✅ 保留-扩展
/protocols/smart-lock-protocols-overview.mdx（当前不存在，需新建）
├─ 整合来源：wifi-cloud-lock, matter-for-locks
├─ 计算器：Protocol Wizard, Battery Calculator, TCO
├─ 向下链接：所有协议相关Support
└─ 规划字数：5000

❌ 删除/合并
- wifi-cloud-lock-architecture.mdx → 合并到protocols-overview
- matter-for-smart-locks.mdx → 合并到protocols-overview

🆕 新建
/protocols/zigbee-vs-zwave-comparison.mdx（高优先级）
├─ 计算器：Protocol Wizard, Mesh Planner, RF Estimator
└─ 字数：3500

🆕 新建
/protocols/thread-matter-future.mdx（中优先级）
├─ 计算器：Integration Checker, Protocol Wizard
└─ 字数：3000
```

#### 2. 安全主题 Pillar（2篇）

```
✅ 保留-扩展
/security/smart-lock-security-complete-analysis.mdx（需新建）
├─ 整合来源：threat-modeling-security-architecture, zwave-s2-security
├─ 计算器：Offline Scorecard, Emergency Evaluator, Protocol Wizard
└─ 字数：4500

❌ 删除/合并
- threat-modeling-security-architecture.mdx → 合并到security-complete
- zwave-s2-security-architecture.mdx → 合并到security-complete

✅ 保留-独立
/security/data-privacy-compliance-guide.mdx（企业专项）
├─ 计算器：Multi-Property Planner
└─ 保持3000字，作为Pillar
```

#### 3. 安装部署 Pillar（2篇）

```
✅ 保留-扩展
/guides/door-compatibility-guide.mdx（升级为Pillar）
├─ 计算器：Door Compatibility Checker, Installation Estimator
├─ 扩展内容：测量、准备、适配器
└─ 目标字数：4000

🆕 新建
/installation/smart-lock-installation-complete-guide.mdx
├─ 整合来源：install-step-by-step, test-after-install, setup-checklist
├─ 计算器：Door Compatibility, Installation Estimator
└─ 字数：4000
```

#### 4. 电池管理 Pillar（1篇）

```
🆕 新建（Phase 1已规划）
/installation/smart-lock-battery-life-guide.mdx
├─ 整合来源：6篇电池相关文章
├─ 计算器：Battery Calculator, Protocol Wizard, RF Estimator, TCO
└─ 字数：5000
```

#### 5. 场景应用 Pillar（3篇）

```
🆕 新建（高优先级）
/use-cases/smart-locks-airbnb-complete-guide.mdx
├─ 整合来源：hotel-hospitality-deployment
├─ 计算器：STR ROI, Automation Savings, TCO, Protocol Wizard
└─ 字数：4500

🆕 新建
/use-cases/smart-locks-long-term-rental-strategy.mdx
├─ 整合来源：long-term-rental-property-strategy
├─ 计算器：Multi-Property Planner, TCO, Credential Capacity
└─ 字数：3500

✅ 保留-扩展
/use-cases/enterprise-commercial-deployment.mdx（需新建）
├─ 整合来源：education-campus, government-facility, healthcare-facility
├─ 计算器：Multi-Property Planner, Installation Estimator, Credential Capacity
└─ 字数：4000

❌ 删除/合并（4篇→1篇）
- hotel-hospitality-deployment.mdx → 合并到airbnb-guide
- education-campus-deployment.mdx → 合并到enterprise
- government-public-facility.mdx → 合并到enterprise
- healthcare-facility-deployment.mdx → 合并到enterprise
```

#### 6. 故障排查 Pillar（1篇）

```
✅ 保留-优化
/guides/complete-troubleshooting-guide.mdx
├─ 删除：电池章节（已移到battery-life-guide）
├─ 计算器：所有诊断类工具
├─ 向下链接：所有故障Support文章
└─ 优化为4000字
```

---

### 第2层：Support快速答案（35-40篇）

**定义**：1200-1800字，单一问题解决，1-2个计算器链接

#### 主题1：电池管理 Support（3篇保留）

```
✅ 保留-简化
support/how-to-change-smart-lock-battery.mdx（1200字）
support/emergency-battery-died-locked-out.mdx（1800字）

❌ 删除（3篇→Pillar）
- maximize-smart-lock-battery-life.mdx → 301到battery-life-guide
- 另2篇已在Phase 1规划删除
```

#### 主题2：连接配对 Support（4篇→2篇）

```
✅ 保留-扩展
support/smart-lock-pairing-complete-guide.mdx（需新建，整合3篇）

❌ 删除/合并
- smart-lock-wont-pair → 合并
- pair-smart-lock-with-hub.mdx → 合并
- hub-cant-find-lock.mdx → 合并

✅ 保留-独立
support/improve-connection-stability.mdx（已配对后掉线）
```

#### 主题3：安装操作 Support（5篇保留）

```
✅ 保留（但需简化，链接到Installation Pillar）
support/install-smart-lock-step-by-step.mdx（1500字）
support/test-smart-lock-after-install.mdx（1200字）
support/smart-lock-setup-checklist.mdx（1000字）

❌ 考虑删除（内容可合并到Pillar）
support/calibrate-smart-lock.mdx → 合并到install-step-by-step?
support/clean-maintain-smart-lock.mdx → 独立保留（维护专项）
```

#### 主题4：访客管理 Support（7篇→5篇）

```
✅ 保留
support/create-temporary-guest-code.mdx
support/how-to-add-user-code.mdx
support/delete-smart-lock-user.mdx
support/share-access-securely.mdx

⚠️ 合并
support/change-master-code.mdx + forgot-master-code-reset.mdx
→ 合并为：master-code-management.mdx

❌ 可能删除
support/multiple-failed-code-attempts.mdx → 合并到security-best-practices?
```

#### 主题5：故障排查 Support（15篇→12篇）

```
✅ 保留-独立问题
support/smart-lock-code-not-working.mdx
support/door-sensor-not-working.mdx
support/fingerprint-not-recognized.mdx
support/lock-motor-noise-troubleshooting.mdx
support/smart-lock-wont-lock-unlock-completely.mdx
support/lock-auto-relocks-immediately.mdx
support/smart-lock-shows-wrong-status.mdx
support/command-timeout-errors.mdx
support/smart-lock-disconnects-after-power-outage.mdx

⚠️ 需评估是否合并
support/lock-unresponsive-after-firmware-update.mdx
support/improve-auto-lock-reliability.mdx

❌ 可能删除/合并
support/lock-history-not-showing.mdx → 合并到troubleshooting-guide?
```

#### 主题6：智能家居集成 Support（4篇→3篇）

```
✅ 保留
support/connect-lock-to-homekit.mdx
support/set-up-lock-automations.mdx
support/doorbell-smart-lock-integration.mdx

⚠️ 需检查重复
support/local-vs-cloud-architecture.mdx（可能与协议Pillar重复）
→ 如果是Support级快速对比，保留；否则删除
```

#### 主题7：安全与合规 Support（3篇）

```
✅ 保留
support/secure-smart-lock-best-practices.mdx
support/audit-trail-forensic-analysis.mdx

❌ 删除（已有Pillar）
support/buying-guide-choose-right-lock.mdx → 删除或大幅简化，链接到Pillar
```

#### 主题8：固件与维护 Support（3篇）

```
✅ 保留
support/update-smart-lock-firmware.mdx
support/clean-maintain-smart-lock.mdx

⚠️ 可能合并
technical/firmware-update-security-management.mdx
→ 与update-firmware重复？评估合并
```

#### 主题9：指纹管理 Support（2篇）

```
✅ 保留
support/add-fingerprint-to-lock.mdx
support/fingerprint-not-recognized.mdx（已列在故障排查）
```

---

## 📈 删除/合并/新建汇总

### ❌ 建议删除（15-18篇）

**协议主题**（2篇→1篇）：
- wifi-cloud-lock-architecture.mdx → 合并到protocols-overview
- matter-for-smart-locks.mdx → 合并到protocols-overview

**安全主题**（2篇→1篇）：
- threat-modeling-security-architecture.mdx → 合并到security-complete
- zwave-s2-security-architecture.mdx → 合并到security-complete

**场景应用**（4篇→2篇）：
- hotel-hospitality → 合并到airbnb-guide
- education-campus → 合并到enterprise
- government-facility → 合并到enterprise
- healthcare-facility → 合并到enterprise

**电池主题**（3篇→0篇）：
- maximize-battery-life → 合并到battery-life-guide Pillar
- battery-dies-too-fast → 合并到Pillar
- low-battery-warning → 合并到Pillar

**连接配对**（3篇→1篇）：
- wont-pair → 合并到pairing-guide
- pair-with-hub → 合并到pairing-guide
- hub-cant-find → 合并到pairing-guide

**其他Support**（2-3篇）：
- lock-history-not-showing → 合并到troubleshooting
- multiple-failed-attempts → 合并到security-practices
- buying-guide → 删除或极简化

**固件**（1篇重复）：
- technical/firmware-update-security → 合并到support/update-firmware

**总计删除**：15-18篇（54→36-39篇）

---

### 🆕 必须新建（8篇Pillar）

**高优先级**（5篇）：
1. protocols/smart-lock-protocols-overview.mdx（5000字）
2. security/smart-lock-security-complete-analysis.mdx（4500字）
3. installation/smart-lock-battery-life-guide.mdx（5000字）
4. installation/smart-lock-installation-complete-guide.mdx（4000字）
5. use-cases/smart-locks-airbnb-complete-guide.mdx（4500字）

**中优先级**（3篇）：
6. protocols/zigbee-vs-zwave-comparison.mdx（3500字）
7. use-cases/long-term-rental-strategy.mdx（3500字）
8. use-cases/enterprise-commercial-deployment.mdx（4000字）

---

### ⚠️ 需修改/扩展（5篇）

1. guides/door-compatibility-guide.mdx → 扩展为完整Pillar
2. guides/complete-troubleshooting-guide.mdx → 删除电池章节
3. support/pairing-complete-guide.mdx → 新建（整合3篇）
4. security/data-privacy-compliance.mdx → 保持Pillar级别
5. integration/enterprise-system-integration.mdx → 评估是否升级为Pillar

---

## 🔗 内链网络设计

### Hub-Spoke模型

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第0层：首页 (/)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
├─ 4个主要CTA:
│  1. "选择合适的协议" → Protocol Wizard
│  2. "计算总拥有成本" → TCO Calculator
│  3. "学习核心知识" → Knowledge Hub（Pillar列表）
│  4. "快速解决问题" → Popular Support（热门问题）
│
└─ Featured内容:
   - 3个热门Pillar（轮播）
   - 3个常用计算器
   - 5个高频Support文章

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第1层：计算器中心 (/tools)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
├─ 15个计算器（4分类网格）
│  每个计算器页面：
│  ├─ 向下链接：相关Pillar（深入学习）
│  ├─ 横向链接：相关计算器
│  └─ 结果页CTA：Support文章（操作指南）
│
└─ 内链密度：每个工具5-8个文章链接

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第2层：知识中心 - Pillar Hub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
12个Pillar文章，按主题分6组：
│
├─ [Protocols Hub] protocols-overview
│  ├→ 向上：Protocol Wizard, Battery Calc, TCO（5-8个工具）
│  ├→ 向下：15-20个Support（pairing, wifi-setup等）
│  └→ 横向：Security Hub, Battery Hub
│
├─ [Security Hub] security-complete-analysis
│  ├→ 向上：Offline Scorecard, Emergency Evaluator（5-8个）
│  ├→ 向下：10-15个Support（best-practices, audit等）
│  └→ 横向：Protocols Hub
│
├─ [Battery Hub] battery-life-guide
│  ├→ 向上：Battery Calc, RF Estimator, TCO（6个）
│  ├→ 向下：2-3个Support（change, emergency）
│  └→ 横向：Protocols Hub
│
├─ [Installation Hub] installation-guide + door-compatibility
│  ├→ 向上：Door Checker, Installation Estimator（4-5个）
│  ├→ 向下：5-8个Support（install-steps, test等）
│  └→ 横向：Battery Hub
│
├─ [Scenario Hub] airbnb + rental + enterprise（3篇）
│  ├→ 向上：STR ROI, Multi-Property, TCO（各3-5个）
│  ├→ 向下：各自5-10个Support
│  └→ 横向：相互链接（短租vs长租）
│
└─ [Troubleshooting Hub] complete-troubleshooting
   ├→ 向上：所有诊断类工具（8-10个）
   ├→ 向下：所有故障Support（20-25个）
   └→ 横向：所有其他Hub（常见问题入口）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第3层：Support快速答案（35-40篇）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
每篇Support文章：
├─ 向上链接（2-3个）：
│  - 1个相关Pillar（理论基础）
│  - 1-2个计算器（优化工具）
│
├─ 横向链接（2-3个）：
│  - 相关Support文章
│
└─ 内链密度：6-9个总链接

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
导航与发现
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
├─ 顶部导航:
│  - 首页
│  - 计算器 (/tools)
│  - 知识中心 (/knowledge)
│     ├─ 协议与技术
│     ├─ 安装与维护
│     ├─ 安全与隐私
│     └─ 使用场景
│  - 问题解决 (/support)
│  - 搜索
│
├─ 侧边栏（文章页）:
│  - 目录（TOC）
│  - 相关Pillar（1-2个）
│  - 相关计算器（2-3个）
│  - 相关Support（3-5个）
│
└─ 底部（文章页）:
   - "接下来阅读"（3篇相关）
   - "常见问题"（FAQ）
   - CTA（相关计算器）
```

---

## 📊 最终架构数量

### 内容统计

| 类型 | 当前 | 删除 | 新建 | 最终 | 占比 |
|------|------|------|------|------|------|
| **Pillar** | 2-3 | 0 | +8 | **12** | **25%** |
| **Support** | 39 | -15 | +1 | **35-40** | **75%** |
| **总计** | 54 | -15 | +9 | **47-52** | **100%** |

### 计算器集成

| 层级 | 文章数 | 计算器链接/篇 | 总链接数 |
|------|--------|--------------|---------|
| Pillar | 12 | 5-8个 | 72-96 |
| Support | 38 | 1-2个 | 38-76 |
| **总计** | **50** | - | **110-172** |

### 内部链接密度

| 链接方向 | 数量估算 |
|---------|---------|
| 首页 → Pillar/工具 | 10-12 |
| 工具 → Pillar/Support | 75-120 |
| Pillar → Support | 150-200 |
| Support → Pillar | 70-120 |
| 横向（同级）| 100-150 |
| **总内链** | **405-602** |

---

## 🎯 执行优先级

### Phase 1（Week 1-2）：清理重复
- 删除15篇重复文章
- 设置301重定向
- 创建battery-life-guide Pillar

### Phase 2（Week 3-4）：核心Pillar
- 创建3篇最高优先级Pillar
  - protocols-overview
  - security-complete
  - installation-guide

### Phase 3（Week 5-6）：链接网络
- 为12个Pillar添加计算器链接（72-96个）
- 为38个Support添加向上链接（70-120个）
- 创建Tools Center页面

### Phase 4（Week 7-8）：场景Pillar
- 创建3篇场景Pillar（airbnb/rental/enterprise）
- 补充zigbee-vs-zwave Pillar

### Phase 5（Week 9-10）：Support优化
- 统一35-40篇Support文章格式
- 补充计算器CTA
- 优化内链

---

## ✅ 验收标准

### 架构清晰度
```
□ 2层结构明确（Pillar 25% + Support 75%）✓
□ 无孤岛文章（每篇至少3个内链）✓
□ Hub-Spoke关系清晰（每个Hub有5+Spokes）✓
```

### 计算器集成
```
□ 每个Pillar嵌入5-8个工具 ✓
□ 每个Support嵌入1-2个工具 ✓
□ 工具页面链接5-8篇文章 ✓
□ 总计110-172个工具-文章链接 ✓
```

### 用户旅程
```
□ 首页 → 工具/Pillar（1次点击）✓
□ 工具 → Pillar → Support（2次点击）✓
□ Support → Pillar → 工具（2次点击）✓
□ 无死胡同（每篇有"下一步"）✓
```

### SEO与内链
```
□ 每篇Pillar：20-25个内链 ✓
□ 每篇Support：6-9个内链 ✓
□ 所有301重定向正常 ✓
□ sitemap完整更新 ✓
```
