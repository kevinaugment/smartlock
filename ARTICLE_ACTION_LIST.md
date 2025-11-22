# 54篇文章处理决策清单

> **简明版**：每篇文章的处理动作（保留/删除/修改/新建）

---

## 📋 现有54篇文章处理清单

### 🔵 Guides（3篇）

| # | 文件名 | 决策 | 原因 | 目标层级 |
|---|--------|------|------|---------|
| 1 | complete-troubleshooting-guide.md | ✅ 保留-修改 | 删除电池章节，保持Pillar | Pillar |
| 2 | disaster-recovery-business-continuity.mdx | ⚠️ 评估 | 企业场景，可能合并到enterprise | - |
| 3 | door-compatibility-guide.mdx | ✅ 保留-扩展 | 升级为Pillar 4000字 | Pillar |

---

### 🔵 Protocols（2篇）

| # | 文件名 | 决策 | 原因 | 新位置 |
|---|--------|------|------|--------|
| 4 | matter-for-smart-locks.mdx | ✅ 已删除 (2024-11-22) | 合并到protocols-overview | 备份: archive/deleted/2024-11/ |
| 5 | wifi-cloud-lock-architecture.mdx | ✅ 已删除 (2024-11-22) | 合并到protocols-overview | 备份: archive/deleted/2024-11/ |

---

### 🔵 Security（3篇）

| # | 文件名 | 决策 | 原因 | 目标 |
|---|--------|------|------|------|
| 6 | data-privacy-compliance-guide.mdx | ✅ 保留 | 企业专项，保持Pillar | Pillar |
| 7 | threat-modeling-security-architecture.mdx | ✅ 已删除 (2024-11-22) | 合并到security-complete | 备份: archive/deleted/2024-11/ |
| 8 | zwave-s2-security-architecture.mdx | ✅ 已删除 (2024-11-22) | 合并到security-complete | 备份: archive/deleted/2024-11/ |

---

### 🔵 Integration（1篇）

| # | 文件名 | 决策 | 原因 | 目标 |
|---|--------|------|------|------|
| 9 | enterprise-system-integration.mdx | ⚠️ 评估 | 可能合并到enterprise-deployment或升级为Pillar | - |

---

### 🔵 Technical（1篇）

| # | 文件名 | 决策 | 原因 | 新位置 |
|---|--------|------|------|--------|
| 10 | firmware-update-security-management.mdx | ✅ 已删除 (2024-11-22) | 与support/update-firmware重复 | 备份: archive/deleted/2024-11/ |

---

### 🔵 Use-Cases（5篇）

| # | 文件名 | 决策 | 原因 | 新位置 |
|---|--------|------|------|--------|
| 11 | education-campus-deployment.mdx | ✅ 已删除 (2024-11-22) | 合并到enterprise-commercial | 备份: archive/deleted/2024-11/ |
| 12 | government-public-facility-deployment.mdx | ✅ 已删除 (2024-11-22) | 合并到enterprise-commercial | 备份: archive/deleted/2024-11/ |
| 13 | healthcare-facility-deployment.mdx | ✅ 已删除 (2024-11-22) | 合并到enterprise-commercial | 备份: archive/deleted/2024-11/ |
| 14 | hotel-hospitality-deployment.mdx | ✅ 已删除 (2024-11-22) | 合并到airbnb-complete-guide | 备份: archive/deleted/2024-11/ |
| 15 | long-term-rental-property-strategy.mdx | ✅ 保留-重写 | 扩展为Pillar 3500字 | Pillar |

---

### 🔵 Support（39篇）

#### 电池管理（假设6篇，实际可能更少）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 16 | how-to-change-smart-lock-battery.mdx | ✅ 保留-简化 | 1200字纯操作，链接Pillar |
| 17 | maximize-smart-lock-battery-life.mdx | ✅ 已删除 (2024-11-22) | 合并到battery-life-guide Pillar，备份: archive/deleted/2024-11/ |
| 18 | emergency-battery-died-locked-out.mdx | ✅ 保留-简化 | 1800字应急方案 |
| 19 | （battery-dies-too-fast.mdx假设存在）| ❌ 删除 | 合并到Pillar |
| 20 | （low-battery-warning.mdx假设存在）| ❌ 删除 | 合并到Pillar |

#### 配对连接（假设4篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 21 | pair-smart-lock-with-hub.mdx | ✅ 已删除 (2024-11-22) | 合并到pairing-guide，备份: archive/deleted/2024-11/ |
| 22 | hub-cant-find-lock.mdx | ✅ 已删除 (2024-11-22) | 合并到pairing-guide，备份: archive/deleted/2024-11/ |
| 23 | （wont-pair假设存在）| ❌ 删除 | 合并到pairing-guide |
| 24 | improve-connection-stability.mdx | ✅ 保留 | 掉线独立问题 |

#### 安装操作（5篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 25 | install-smart-lock-step-by-step.mdx | ✅ 保留-简化 | 1500字纯步骤 |
| 26 | test-smart-lock-after-install.mdx | ✅ 保留 | 1200字验收清单 |
| 27 | smart-lock-setup-checklist.mdx | ✅ 保留 | 1000字快速清单 |
| 28 | calibrate-smart-lock.mdx | ⚠️ 考虑合并 | 可能合并到install-step |
| 29 | clean-maintain-smart-lock.mdx | ✅ 保留 | 维护专项 |

#### 访客管理（7篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 30 | create-temporary-guest-code.mdx | ✅ 保留 | 高频操作 |
| 31 | how-to-add-user-code.mdx | ✅ 保留 | 基础操作 |
| 32 | delete-smart-lock-user.mdx | ✅ 保留 | 基础操作 |
| 33 | share-access-securely.mdx | ✅ 保留 | 安全相关 |
| 34 | change-master-code.mdx | ⚠️ 合并 | 与forgot-master合并 |
| 35 | forgot-master-code-reset.mdx | ⚠️ 合并 | 合并为master-code-mgmt |
| 36 | multiple-failed-code-attempts.mdx | ⚠️ 评估 | 可能合并到security |

#### 故障排查（15篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 37 | smart-lock-code-not-working.mdx | ✅ 保留 | 高频问题 |
| 38 | door-sensor-not-working.mdx | ✅ 保留 | 独立故障 |
| 39 | fingerprint-not-recognized.mdx | ✅ 保留 | 独立故障 |
| 40 | lock-motor-noise-troubleshooting.mdx | ✅ 保留 | 独立故障 |
| 41 | smart-lock-wont-lock-unlock-completely.mdx | ✅ 保留 | 高频问题 |
| 42 | lock-auto-relocks-immediately.mdx | ✅ 保留 | 独立故障 |
| 43 | smart-lock-shows-wrong-status.mdx | ✅ 保留 | 同步问题 |
| 44 | command-timeout-errors.mdx | ✅ 保留 | 网络问题 |
| 45 | smart-lock-disconnects-after-power-outage.mdx | ✅ 保留 | 独立场景 |
| 46 | lock-unresponsive-after-firmware-update.mdx | ✅ 保留 | 固件问题 |
| 47 | improve-auto-lock-reliability.mdx | ✅ 保留 | 配置优化 |
| 48 | lock-history-not-showing.mdx | ✅ 已删除 (2024-11-22) | 已合并到troubleshooting，备份: archive/deleted/2024-11/ |

#### 智能家居集成（4篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 49 | connect-lock-to-homekit.mdx | ✅ 保留 | 高频操作 |
| 50 | set-up-lock-automations.mdx | ✅ 保留 | 场景配置 |
| 51 | doorbell-smart-lock-integration.mdx | ✅ 保留 | 集成专项 |
| 52 | local-vs-cloud-architecture.mdx | ⚠️ 评估 | 可能与Pillar重复 |

#### 安全与维护（3篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 53 | secure-smart-lock-best-practices.mdx | ✅ 保留 | 安全基础 |
| 54 | audit-trail-forensic-analysis.mdx | ✅ 保留 | 企业安全 |
| 55 | buying-guide-choose-right-lock.mdx | ✅ 已删除 (2024-11-22) | 与Pillar重复，备份: archive/deleted/2024-11/ |

#### 指纹管理（2篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 56 | add-fingerprint-to-lock.mdx | ✅ 保留 | 基础操作 |
| 57 | （fingerprint-not-recognized重复）| - | 已在故障排查 |

#### 固件更新（1篇）

| # | 文件名 | 决策 | 原因 |
|---|--------|------|------|
| 58 | update-smart-lock-firmware.mdx | ✅ 保留 | 重要维护 |

---

## 📊 决策统计

### 处理动作汇总

| 决策 | 数量 | 占比 |
|------|------|------|
| ✅ 保留-不变 | 28-30 | 52-56% |
| ✅ 保留-修改 | 3-5 | 6-9% |
| ❌ 删除 | 15-17 | 28-31% |
| ⚠️ 待评估 | 5-7 | 9-13% |
| **总计** | **54** | **100%** |

### 最终文章数量

| 层级 | 删除 | 保留/修改 | 新建 | 最终 |
|------|------|----------|------|------|
| Pillar | 0 | 5 | +8 | 12-13 |
| Support | -15-17 | 33-35 | +2整合 | 35-38 |
| **总计** | **-15-17** | **38-40** | **+10** | **47-51** |

---

## 🆕 必须新建的文章（10篇）

### Pillar级（8篇）

```
🔥 高优先级（5篇）：
1. protocols/smart-lock-protocols-overview.mdx（5000字）
2. security/smart-lock-security-complete-analysis.mdx（4500字）
3. installation/smart-lock-battery-life-guide.mdx（5000字）
4. installation/smart-lock-installation-complete-guide.mdx（4000字）
5. use-cases/smart-locks-airbnb-complete-guide.mdx（4500字）

⭐ 中优先级（3篇）：
6. protocols/zigbee-vs-zwave-comparison.mdx（3500字）
7. use-cases/long-term-rental-strategy.mdx（3500字，重写现有）
8. use-cases/enterprise-commercial-deployment.mdx（4000字）
```

### Support级（2篇整合）

```
9. support/smart-lock-pairing-guide.mdx（整合3篇）
10. support/master-code-management.mdx（合并2篇）
```

---

## ❌ 确定删除的文章（15-17篇）

### 协议（2篇）
- wifi-cloud-lock-architecture.mdx
- matter-for-smart-locks.mdx

### 安全（2篇）
- threat-modeling-security-architecture.mdx
- zwave-s2-security-architecture.mdx

### 固件（1篇）
- technical/firmware-update-security-management.mdx

### 场景（4篇）
- hotel-hospitality-deployment.mdx
- education-campus-deployment.mdx
- government-public-facility-deployment.mdx
- healthcare-facility-deployment.mdx

### 电池（3篇）
- maximize-smart-lock-battery-life.mdx
- （battery-dies-too-fast假设）
- （low-battery-warning假设）

### 配对（3篇）
- pair-smart-lock-with-hub.mdx
- hub-cant-find-lock.mdx
- （wont-pair假设）

### 其他（1-2篇）
- buying-guide-choose-right-lock.mdx
- （可能）lock-history-not-showing.mdx

---

## ⚠️ 需评估的文章（5-7篇）

```
1. disaster-recovery-business-continuity.mdx
   → 评估：是否合并到enterprise-deployment

2. enterprise-system-integration.mdx
   → 评估：升级为Pillar或合并

3. calibrate-smart-lock.mdx
   → 评估：合并到install-step-by-step

4. change-master-code.mdx + forgot-master-code-reset.mdx
   → 确定：合并为master-code-management

5. multiple-failed-code-attempts.mdx
   → 评估：合并到security-best-practices

6. local-vs-cloud-architecture.mdx
   → 评估：是否与Pillar重复

7. lock-history-not-showing.mdx
   → 评估：合并到troubleshooting Hub
```

---

## ✅ 执行优先级

### 立即执行（Phase 1，Week 1-2）

```
删除8-10篇明确重复文章：
❌ wifi-cloud-lock
❌ matter-for-locks
❌ threat-modeling
❌ zwave-s2-security
❌ firmware-security（technical）
❌ 4篇场景（hotel/education/government/healthcare）

设置301重定向
创建battery-life-guide Pillar（整合6篇）
```

### 次要执行（Phase 2-4，Week 3-8）

```
创建5篇高优先级Pillar
评估5-7篇待定文章
删除配对主题3篇（整合后）
```

### 持续优化（Phase 5-6，Week 9-12）

```
修改保留的Support文章（添加链接）
创建3篇中优先级Pillar
评估结果，微调架构
```
