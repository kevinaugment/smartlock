# 文章层级关系图谱

> **简化架构**：2层（Pillar → Support），取消Deep Dive过度细分

---

## 📊 文章层级总览

```
                    🏠 首页 + 📊 15个计算器
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
    
第1层：PILLAR（12篇，4000-6000字）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 协议Hub（3篇）    🟢 安装Hub（3篇）    🔴 场景Hub（3篇）
🟡 安全Hub（2篇）    🟣 故障Hub（1篇）

                            ↓
                    
第2层：SUPPORT（35-40篇，1200-1800字）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

按9个主题分组：电池(3) | 配对(2) | 安装(5) | 访客(5) | 
故障(12) | 集成(3) | 安全(3) | 固件(2) | 指纹(2)
```

---

## 🔵 协议主题（1 Hub + 3 Support）

### Pillar Hub
```
🆕 protocols/smart-lock-protocols-overview.mdx（5000字）
├─ 整合来源：wifi-cloud-lock + matter-for-locks
├─ 计算器：Protocol Wizard, Battery Calc, TCO, Mesh Planner
├─ 向下链接：所有协议相关Support
└─ ✅ 已删除2篇（2024-11-22）：
   ✅ wifi-cloud-lock-architecture.mdx（备份：archive/deleted/2024-11/）
   ✅ matter-for-smart-locks.mdx（备份：archive/deleted/2024-11/）

🆕 protocols/zigbee-vs-zwave-comparison.mdx（3500字）
├─ 计算器：Protocol Wizard, Mesh Planner, RF Estimator
└─ 向下链接：pairing, connection相关Support

🆕 protocols/thread-matter-future.mdx（3000字）
├─ 计算器：Integration Checker, Protocol Wizard
└─ 向下链接：集成相关Support
```

### Support文章
```
✅ support/local-vs-cloud-architecture.mdx
├─ 向上：protocols-overview
└─ 计算器：Offline Scorecard

✅ support/improve-connection-stability.mdx（掉线问题）
├─ 向上：protocols-overview
└─ 计算器：RF Estimator

🆕 support/smart-lock-pairing-guide.mdx（整合3篇）
├─ 向上：protocols-overview, zigbee-vs-zwave
├─ 计算器：Protocol Wizard
└─ 删除3篇：
   ❌ wont-pair
   ❌ pair-with-hub
   ❌ hub-cant-find-lock
```

---

## 🟡 安全主题（2 Hub + 6 Support）

### Pillar Hub
```
🆕 security/smart-lock-security-complete-analysis.mdx（4500字）
├─ 整合来源：threat-modeling + zwave-s2-security
├─ 计算器：Offline Scorecard, Emergency Evaluator, Protocol Wizard
└─ ✅ 已删除2篇（2024-11-22）：
   ✅ threat-modeling-security-architecture.mdx（备份：archive/deleted/2024-11/）
   ✅ zwave-s2-security-architecture.mdx（备份：archive/deleted/2024-11/）

✅ security/data-privacy-compliance-guide.mdx（企业专项）
├─ 保持现状（3000字，Pillar级）
└─ 计算器：Multi-Property Planner, Credential Capacity
```

### Support文章
```
✅ support/secure-smart-lock-best-practices.mdx
✅ support/audit-trail-forensic-analysis.mdx
✅ support/share-access-securely.mdx

⚠️ support/multiple-failed-code-attempts.mdx
└─ 评估是否合并到best-practices

❌ support/buying-guide-choose-right-lock.mdx（删除或极简化）
```

---

## 🟢 安装部署主题（3 Hub + 5 Support）

### Pillar Hub
```
✅ guides/door-compatibility-guide.mdx（扩展为Pillar 4000字）
├─ 计算器：Door Compatibility Checker, Installation Estimator
└─ 扩展：测量、准备、适配器详解

🆕 installation/smart-lock-installation-complete-guide.mdx（4000字）
├─ 整合来源：install-step-by-step + setup-checklist
├─ 计算器：Door Compatibility, Installation Estimator
└─ 部分整合：test-after-install

🆕 installation/smart-lock-battery-life-guide.mdx（5000字）
├─ 整合来源：6篇电池文章
├─ 计算器：Battery Calc, Protocol Wizard, RF Estimator, TCO
└─ 删除3篇：
   ❌ maximize-battery-life
   ❌ battery-dies-too-fast
   ❌ low-battery-warning
```

### Support文章
```
✅ support/install-smart-lock-step-by-step.mdx（简化为1500字）
├─ 向上：installation-complete-guide
└─ 删除理论，保留步骤

✅ support/how-to-change-smart-lock-battery.mdx（1200字）
├─ 向上：battery-life-guide
└─ 仅保留操作步骤

✅ support/emergency-battery-died-locked-out.mdx（1800字）
├─ 向上：battery-life-guide
└─ 聚焦应急方案

✅ support/test-smart-lock-after-install.mdx（1200字）
├─ 向上：installation-guide
└─ 验收清单

✅ support/smart-lock-setup-checklist.mdx（1000字）
├─ 向上：installation-guide
└─ 快速清单

⚠️ support/calibrate-smart-lock.mdx（考虑合并到install-step）
⚠️ support/clean-maintain-smart-lock.mdx（独立保留）
```

---

## 🔴 场景应用主题（3 Hub + 10 Support）

### Pillar Hub
```
🆕 use-cases/smart-locks-airbnb-complete-guide.mdx（4500字）
├─ 整合来源：hotel-hospitality-deployment
├─ 计算器：STR ROI, Automation Savings, TCO, Protocol Wizard
└─ ✅ 已删除1篇（2024-11-22）：
   ✅ hotel-hospitality-deployment.mdx（备份：archive/deleted/2024-11/）

🆕 use-cases/long-term-rental-strategy.mdx（3500字）
├─ 扩展来源：long-term-rental-property-strategy
├─ 计算器：Multi-Property Planner, TCO, Credential Capacity
└─ 重写现有文章

🆕 use-cases/enterprise-commercial-deployment.mdx（4000字）
├─ 整合来源：education + government + healthcare
├─ 计算器：Multi-Property Planner, Installation Estimator
└─ ✅ 已删除3篇（2024-11-22）：
   ✅ education-campus-deployment.mdx（备份：archive/deleted/2024-11/）
   ✅ government-public-facility-deployment.mdx（备份：archive/deleted/2024-11/）
   ✅ healthcare-facility-deployment.mdx（备份：archive/deleted/2024-11/）
```

### Support文章
```
访客管理（5篇）：
✅ support/create-temporary-guest-code.mdx
✅ support/how-to-add-user-code.mdx
✅ support/delete-smart-lock-user.mdx
✅ support/share-access-securely.mdx

⚠️ 合并2篇为1篇：
support/change-master-code.mdx + forgot-master-code-reset.mdx
→ master-code-management.mdx

集成自动化（3篇）：
✅ support/connect-lock-to-homekit.mdx
✅ support/set-up-lock-automations.mdx
✅ support/doorbell-smart-lock-integration.mdx
```

---

## 🟣 故障排查主题（1 Hub + 12 Support）

### Pillar Hub
```
✅ guides/complete-troubleshooting-guide.mdx（优化为4000字）
├─ 删除：电池章节（已移到battery-life-guide）
├─ 计算器：所有诊断类工具（8-10个）
└─ 向下链接：所有故障Support（12-15篇）
```

### Support文章（保留12篇）
```
✅ support/smart-lock-code-not-working.mdx
✅ support/door-sensor-not-working.mdx
✅ support/fingerprint-not-recognized.mdx
✅ support/lock-motor-noise-troubleshooting.mdx
✅ support/smart-lock-wont-lock-unlock-completely.mdx
✅ support/lock-auto-relocks-immediately.mdx
✅ support/smart-lock-shows-wrong-status.mdx
✅ support/command-timeout-errors.mdx
✅ support/smart-lock-disconnects-after-power-outage.mdx
✅ support/lock-unresponsive-after-firmware-update.mdx
✅ support/improve-auto-lock-reliability.mdx

❌ 考虑删除/合并：
support/lock-history-not-showing.mdx → 合并到troubleshooting Hub
```

---

## 🟤 其他主题 Support（9篇）

### 固件管理（2篇保留1篇）
```
✅ support/update-smart-lock-firmware.mdx（保留）

❌ technical/firmware-update-security-management.mdx
└─ 与update-firmware重复，合并
```

### 指纹管理（2篇）
```
✅ support/add-fingerprint-to-lock.mdx
✅ support/fingerprint-not-recognized.mdx（已列在故障）
```

### 维护相关（2篇）
```
✅ support/clean-maintain-smart-lock.mdx
⚠️ support/calibrate-smart-lock.mdx（考虑合并）
```

### 企业集成（1篇）
```
⚠️ integration/enterprise-system-integration.mdx
└─ 评估是否升级为Pillar或合并到enterprise-deployment
```

---

## 📊 删除/保留/新建统计

### ❌ 确定删除（15-17篇）

**协议**（2篇）：
- wifi-cloud-lock-architecture.mdx
- matter-for-smart-locks.mdx

**安全**（2篇）：
- threat-modeling-security-architecture.mdx
- zwave-s2-security-architecture.mdx

**场景**（4篇）：
- hotel-hospitality-deployment.mdx
- education-campus-deployment.mdx
- government-public-facility-deployment.mdx
- healthcare-facility-deployment.mdx

**电池**（3篇）：
- maximize-smart-lock-battery-life.mdx
- battery-dies-too-fast.mdx（隐含在分析中）
- low-battery-warning.mdx（隐含在分析中）

**配对**（3篇）：
- smart-lock-wont-pair.mdx（可能存在）
- pair-smart-lock-with-hub.mdx
- hub-cant-find-lock.mdx

**其他**（1-3篇）：
- technical/firmware-update-security-management.mdx
- support/buying-guide-choose-right-lock.mdx（或极简化）
- support/lock-history-not-showing.mdx（或合并）

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

### ✅ 保留-需修改（5篇）

1. guides/door-compatibility-guide.mdx → 扩展为Pillar
2. guides/complete-troubleshooting-guide.mdx → 删除电池章节
3. security/data-privacy-compliance-guide.mdx → 保持Pillar
4. support/pairing-complete-guide.mdx → 新建（整合3篇）
5. support/master-code-management.mdx → 新建（合并2篇）

---

### ✅ 保留-不变（30-32篇Support）

保持现状，仅添加计算器链接和向上链接到Pillar

---

## 🎯 最终架构数量

| 层级 | 当前 | 删除 | 新建 | 修改 | 最终 |
|------|------|------|------|------|------|
| **Pillar** | 2-3 | 0 | +8 | +3扩展 | **12** |
| **Support** | 39 | -15-17 | +2整合 | +5修改 | **35-38** |
| **总计** | 54 | -15-17 | +10 | +8 | **47-50** |

---

## 🔗 内链关系密度

### Pillar → Support（向下链接）

```
每个Pillar平均链接：10-15个Support
12个Pillar × 12.5 = 150个向下链接
```

### Support → Pillar（向上链接）

```
每个Support链接：2-3个Pillar
37个Support × 2.5 = 93个向上链接
```

### 计算器 ↔ 文章

```
15个计算器 × 6篇文章 = 90个计算器→文章链接
12个Pillar × 6个计算器 = 72个文章→计算器链接
37个Support × 1.5个计算器 = 56个文章→计算器链接

总计：218个计算器-文章链接
```

### 横向链接（同级）

```
Pillar ↔ Pillar：12 × 3 = 36
Support ↔ Support：37 × 2 = 74

总计：110个横向链接
```

### 全站内链总数

```
向下：150
向上：93
计算器双向：218
横向：110
━━━━━━━━━━━━━
总计：571个内链
```

---

## ✅ 架构验收标准

```
□ 2层结构清晰（Pillar 25% + Support 75%）✓
□ 每个Pillar有明确的Support支撑（10-15篇）✓
□ 每个Support有明确的Pillar指向（2-3篇）✓
□ 计算器深度集成（218个链接）✓
□ 无孤岛文章（每篇最少5个内链）✓
□ Hub数量合理（6个主题，12个Pillar）✓
□ 删除重复内容（15-17篇）✓
□ 总文章数量适中（47-50篇）✓
```
