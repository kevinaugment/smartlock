# Smart Lock Hub - 精细化执行计划

> **执行原则**: 以页面为维度，逐个深入处理，确保每个页面精细化开发  
> **创建时间**: 2024-11-22  
> **基于**: SITE_ARCHITECTURE_PLAN.md + SITE_READINESS_REPORT.md

---

## 📊 当前状态分析

### 现有内容统计
- **总文章数**: 40篇 MDX
- **目录分布**:
  - guides/: 4篇
  - installation/: 1篇 ✅ (battery-life-guide)
  - integration/: 1篇
  - protocols/: 2篇 ✅ (protocols-overview, zigbee-vs-zwave)
  - security/: 2篇 ✅ (security-complete, data-privacy)
  - support/: 30篇
  - use-cases/: 缺失❌ (需要创建3个Pillar)

### 目标架构 (SITE_ARCHITECTURE_PLAN.md)
- **Pillar Hub**: 12篇 (当前6篇 → 缺少6篇)
- **Support**: 35-40篇 (当前30篇 → 基本符合)

### 关键差距
1. ❌ **缺少6篇Pillar文章**（use-cases类）
2. ⚠️ **现有Pillar文章需要优化**（增加计算器链接和内部链接）
3. ⚠️ **Support文章缺少向上链接**（需要链接到Pillar Hub）
4. ⚠️ **工具页面缺少文章推荐链接**

---

## 🎯 批次化执行计划

### **BATCH 1: 优化现有Pillar文章** ⭐ 优先级：HIGH
**目标**: 为6篇现有Pillar增加5-8个计算器链接和15-20个Support链接

#### 1.1 protocols/smart-lock-protocols-overview.mdx
- [x] 修复工具URL（已完成）
- [ ] 添加Calculator集成：
  - 头部Quick Selector: Protocol Wizard, Battery Calc, TCO (已有✅)
  - WiFi章节: Battery Calc, TCO
  - Zigbee章节: Protocol Wizard, Mesh Planner
  - Z-Wave章节: RF Estimator, Protocol Wizard
  - Matter章节: Integration Checker
  - 底部Tools区: 已有4个工具✅
- [ ] 添加Support链接（15-20个）：
  - WiFi相关: support/improve-connection-stability, support/smart-lock-disconnects-after-power-outage
  - Zigbee相关: support/pairing-guide, support/hub-cant-find-lock
  - Z-Wave相关: support/pairing-guide, support/command-timeout-errors
  - Matter相关: support/connect-lock-to-homekit, support/set-up-lock-automations
  - 通用: support/how-to-change-smart-lock-battery, support/install-smart-lock-step-by-step

#### 1.2 protocols/zigbee-vs-zwave-comparison.mdx
- [x] 修复工具URL（已完成）
- [ ] 添加Calculator集成（目标6-8个）：
  - 头部: Protocol Wizard, Mesh Planner
  - Battery章节: Battery Calc
  - Cost章节: TCO Calculator
  - Mesh章节: RF Estimator, Mesh Node Planner
  - 底部Tools区: 已有4个✅
- [ ] 添加Support链接（12-15个）：
  - 配对: support/pairing-guide
  - 连接: support/improve-connection-stability
  - 电池: support/how-to-change-smart-lock-battery, support/emergency-battery-died-locked-out
  - 安装: support/install-smart-lock-step-by-step

#### 1.3 security/smart-lock-security-complete-analysis.mdx
- [ ] 检查现状
- [ ] 添加Calculator集成（目标5-8个）：
  - Offline Scorecard
  - Emergency Backup Evaluator
  - Protocol Wizard
  - Multi-Property Planner（企业部分）
- [ ] 添加Support链接（10-15个）：
  - support/secure-smart-lock-best-practices
  - support/audit-trail-forensic-analysis
  - support/multiple-failed-code-attempts
  - support/share-access-securely
  - support/change-master-code

#### 1.4 security/data-privacy-compliance-guide.mdx
- [ ] 检查现状
- [ ] 添加Calculator集成（3-5个）：
  - Multi-Property Planner
  - Credential Capacity
  - Offline Scorecard
- [ ] 添加Support链接（8-10个）

#### 1.5 installation/smart-lock-battery-life-guide.mdx
- [x] 修复工具URL（已完成）
- [ ] 添加Calculator集成（目标6个）：
  - 头部: Battery Calc ✅
  - 协议对比: Protocol Wizard
  - 优化章节: RF Estimator
  - 成本章节: TCO Calculator ✅
  - 底部Tools: 已有4个✅
- [ ] 添加Support链接（5-8个）：
  - support/how-to-change-smart-lock-battery ✅
  - support/emergency-battery-died-locked-out ✅
  - support/improve-connection-stability
  - support/calibrate-smart-lock

#### 1.6 guides/complete-troubleshooting-guide.mdx
- [ ] 检查现状
- [ ] 删除电池章节（已移到battery-life-guide）
- [ ] 添加Calculator集成（8-10个诊断工具）：
  - Protocol Wizard
  - Battery Calc
  - RF Estimator
  - Offline Scorecard
  - Emergency Backup Evaluator
- [ ] 添加Support链接（20-25个）：
  - 链接所有故障类Support文章

---

### **BATCH 2: 创建缺失的Pillar文章** ⭐ 优先级：MEDIUM

#### 2.1 use-cases/smart-locks-airbnb-complete-guide.mdx
- [x] 文件已存在✅
- [x] 修复工具URL（已完成）
- [ ] 检查内容完整性（4500字目标）
- [ ] 确保包含5-8个Calculator：
  - STR ROI Calculator ✅
  - TCO Calculator ✅
  - Automation Savings ✅
  - Protocol Wizard ✅
  - Door Compatibility
  - Installation Estimator
- [ ] 添加Support链接（8-12个）：
  - support/create-temporary-guest-code
  - support/share-access-securely
  - support/how-to-add-user-code
  - support/delete-smart-lock-user
  - support/install-smart-lock-step-by-step
  - support/improve-auto-lock-reliability

#### 2.2 use-cases/enterprise-commercial-deployment.mdx
- [x] 文件已存在✅
- [x] 修复工具URL（已完成）
- [ ] 检查内容完整性（4000字目标）
- [ ] 确保包含5-8个Calculator：
  - Multi-Property Planner ✅
  - Installation Estimator ✅
  - TCO Calculator ✅
  - Credential Capacity ✅
  - Offline Scorecard
  - Emergency Backup Evaluator
- [ ] 添加Support链接（10-15个）

#### 2.3 use-cases/long-term-rental-strategy.mdx
- [x] 文件已存在✅
- [x] 修复工具URL（已完成）
- [ ] 检查内容完整性（3500字目标）
- [ ] 确保包含5-8个Calculator：
  - Multi-Property Planner ✅
  - TCO Calculator ✅
  - Credential Capacity ✅
  - Protocol Wizard
  - Door Compatibility
- [ ] 添加Support链接（8-12个）

#### 2.4 guides/door-compatibility-guide.mdx (升级为Pillar)
- [ ] 检查现状
- [ ] 扩展为4000字Pillar
- [ ] 添加Calculator集成（4-5个）：
  - Door Compatibility Checker（主要）
  - Installation Estimator
  - Protocol Wizard
- [ ] 添加Support链接（8-10个）：
  - support/install-smart-lock-step-by-step
  - support/calibrate-smart-lock
  - support/lock-motor-noise-troubleshooting

#### 2.5 guides/smart-lock-pairing-complete-guide.mdx
- [ ] 检查是否为Pillar级别
- [ ] 如是，添加Calculator集成（5-8个）
- [ ] 添加Support链接（10-15个）

#### 2.6 integration/enterprise-system-integration.mdx
- [ ] 评估是否升级为Pillar
- [ ] 如是，扩展内容并添加工具链接

---

### **BATCH 3: 优化Support文章** ⭐ 优先级：LOW

**目标**: 为30篇Support文章添加向上链接（2-3个Pillar + 1-2个工具）

#### 3.1 电池管理 Support (2篇)
- support/how-to-change-smart-lock-battery.mdx
  - [ ] 向上链接: battery-life-guide Pillar
  - [ ] 工具: Battery Calc
- support/emergency-battery-died-locked-out.mdx
  - [ ] 向上链接: battery-life-guide Pillar
  - [ ] 工具: Emergency Backup Evaluator

#### 3.2 连接配对 Support (2篇)
- support/smart-lock-pairing-complete-guide.mdx (如果是Support级别)
- support/improve-connection-stability.mdx
  - [ ] 向上链接: protocols-overview, zigbee-vs-zwave
  - [ ] 工具: RF Estimator, Mesh Planner

#### 3.3 安装操作 Support (3篇)
- support/install-smart-lock-step-by-step.mdx
  - [ ] 向上链接: door-compatibility-guide
  - [ ] 工具: Door Compatibility, Installation Estimator
- support/calibrate-smart-lock.mdx
- support/clean-maintain-smart-lock.mdx

#### 3.4 访客管理 Support (7篇)
- support/create-temporary-guest-code.mdx → airbnb-guide
- support/how-to-add-user-code.mdx → airbnb-guide, rental-strategy
- support/delete-smart-lock-user.mdx
- support/share-access-securely.mdx → airbnb-guide, security-complete
- support/change-master-code.mdx → security-complete
- support/forgot-master-code-reset.mdx → security-complete
- support/multiple-failed-code-attempts.mdx → security-complete

#### 3.5 故障排查 Support (10篇)
全部向上链接到 complete-troubleshooting-guide
- support/smart-lock-code-not-working.mdx
- support/door-sensor-not-working.mdx
- support/fingerprint-not-recognized.mdx
- support/lock-motor-noise-troubleshooting.mdx
- support/lock-auto-relocks-immediately.mdx
- support/command-timeout-errors.mdx
- support/smart-lock-disconnects-after-power-outage.mdx
- support/lock-unresponsive-after-firmware-update.mdx
- support/improve-auto-lock-reliability.mdx

#### 3.6 智能家居集成 Support (3篇)
- support/connect-lock-to-homekit.mdx → protocols-overview (Matter)
- support/set-up-lock-automations.mdx → airbnb-guide, enterprise
- support/doorbell-smart-lock-integration.mdx

#### 3.7 安全与合规 Support (2篇)
- support/secure-smart-lock-best-practices.mdx → security-complete
- support/audit-trail-forensic-analysis.mdx → data-privacy-compliance

#### 3.8 其他 Support
- support/local-vs-cloud-architecture.mdx → protocols-overview
- support/add-fingerprint-to-lock.mdx

---

### **BATCH 4: 更新工具页面** ⭐ 优先级：MEDIUM

**目标**: 每个工具页面添加5-8篇相关文章链接

#### 4.1 Protocol Selection Wizard
- [ ] 添加文章推荐：
  - protocols-overview
  - zigbee-vs-zwave
  - battery-life-guide
  - airbnb-guide
  - enterprise-deployment

#### 4.2 Battery Life Comparison
- [ ] 添加文章推荐：
  - battery-life-guide
  - protocols-overview
  - support/how-to-change-smart-lock-battery
  - support/emergency-battery-died-locked-out

#### 4.3 TCO Calculator
- [ ] 添加文章推荐：
  - protocols-overview
  - zigbee-vs-zwave
  - airbnb-guide
  - enterprise-deployment
  - rental-strategy

#### 4.4 其他12个工具页面
- [ ] 逐个添加5-8篇相关文章链接

---

## 📋 执行检查清单

### Batch 1 检查项（每个Pillar文章）
- [ ] 头部包含Quick Calculator CTA（1-2个）
- [ ] 正文章节包含3-5个Calculator嵌入
- [ ] 底部Tools区包含4-6个工具链接
- [ ] 底部Related Articles包含3-5个Support链接
- [ ] 正文中包含10-15个Support内联链接
- [ ] 总Calculator链接数: 5-8个
- [ ] 总内部链接数: 20-25个

### Batch 3 检查项（每个Support文章）
- [ ] 头部或顶部包含1个主要Pillar链接
- [ ] 正文包含1-2个Calculator链接
- [ ] 底部Related包含2-3个Pillar/Support链接
- [ ] 总内部链接数: 6-9个

### Batch 4 检查项（每个工具页面）
- [ ] 结果页包含"深入学习"区块
- [ ] 推荐5-8篇相关文章（Pillar优先）
- [ ] 推荐2-3个相关工具

---

## 🚀 执行顺序

### Phase 1 (Week 1-2)
1. ✅ 修复所有工具URL（已完成）
2. **Batch 1.1**: protocols-overview (1天)
3. **Batch 1.2**: zigbee-vs-zwave (1天)
4. **Batch 1.5**: battery-life-guide (1天)

### Phase 2 (Week 2-3)
5. **Batch 1.3**: security-complete (1天)
6. **Batch 1.4**: data-privacy (1天)
7. **Batch 1.6**: troubleshooting-guide (1天)

### Phase 3 (Week 3-4)
8. **Batch 2.1**: airbnb-guide 检查优化 (1天)
9. **Batch 2.2**: enterprise-deployment 检查优化 (1天)
10. **Batch 2.3**: rental-strategy 检查优化 (1天)

### Phase 4 (Week 4-5)
11. **Batch 2.4**: door-compatibility 升级 (1天)
12. **Batch 2.5**: pairing-guide 检查 (0.5天)
13. **Batch 2.6**: enterprise-integration 评估 (0.5天)

### Phase 5 (Week 5-7)
14. **Batch 3**: 逐个优化30篇Support（每天3-5篇）

### Phase 6 (Week 7-8)
15. **Batch 4**: 更新15个工具页面（每天2-3个）

---

## ✅ 成功标准

### 架构目标
- [x] 12篇Pillar文章（6篇已有 + 0篇需新建）
- [ ] 每篇Pillar: 5-8个Calculator + 20-25个内链
- [ ] 每篇Support: 1-2个Calculator + 6-9个内链
- [ ] 每个工具: 5-8篇文章推荐

### 内链网络目标
- [ ] 总Calculator-文章链接: 110-172个
- [ ] Pillar→Support链接: 150-200个
- [ ] Support→Pillar链接: 70-120个
- [ ] 工具→文章链接: 75-120个

### 质量标准
- [ ] 无孤岛文章（每篇至少3个内链）
- [ ] Hub-Spoke清晰（每个Hub有5+Spokes）
- [ ] 所有URL正确可访问

---

**下一步行动**: 开始执行 Batch 1.1 - protocols-overview 精细化优化
