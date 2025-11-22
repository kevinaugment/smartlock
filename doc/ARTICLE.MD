# 智能门锁核心文章规划文档

> **核心原则**：每篇文章解决真实搜索需求，提供可操作建议，技术深度而非营销

---

## 优先级分级

- 🔴 **Tier 1 Pillar** (12篇) - 4000-5000字，网站核心基石
- 🟡 **Tier 2 Deep Dive** (15篇) - 2500-3500字，技术深度支撑  
- 🟢 **Tier 3 Long-tail** (10-15篇) - 1800-2500字，细分问题

---

## 🔴 Tier 1: Pillar基石文章

### 1. 智能门锁通信协议完整指南
- **URL**: `/protocols/smart-lock-protocols-overview`
- **字数**: 4500字
- **搜索意图**: "smart lock protocols", "zigbee vs wifi smart lock"
- **优先级**: ⭐⭐⭐⭐⭐

**核心内容**:
- 协议快速对比表（Wi-Fi/Zigbee/Z-Wave/Thread/Matter）
- 每个协议详解（工作原理、优劣势、适合场景、真实案例）
- 决策树（帮助用户选择）
- 未来趋势（Matter影响）
- 链接到[协议选择计算器](/tools/protocol-selection-wizard)

**关键价值**: 整个网站的锚点文章，解决最常见技术选择困惑

---

### 2. 智能门锁安全性完整分析
- **URL**: `/security/smart-lock-security-analysis`
- **字数**: 4000字
- **搜索意图**: "are smart locks safe", "can smart locks be hacked"
- **优先级**: ⭐⭐⭐⭐⭐

**核心内容**:
- 直接回答："Smart locks CAN be secure, IF..."
- 完整威胁模型（物理/RF/网络/社会工程）
- 加密机制深度解析（Zigbee 3.0, Z-Wave S2, Matter）
- 真实攻击案例分析（4个真实CVE案例）
- 智能锁vs传统锁全面对比表
- 安全最佳实践（购买/配置/运营）
- 不同场景风险评估（住宅/短租/办公室）

**关键价值**: 权威解答购买前最大顾虑，建立信任

---

### 3. Airbnb智能门锁完整设置指南
- **URL**: `/use-cases/smart-locks-airbnb-guide`
- **字数**: 4000字
- **搜索意图**: "best smart lock for airbnb", "automate airbnb check-in"
- **优先级**: ⭐⭐⭐⭐⭐

**核心内容**:
- 为什么Airbnb需要智能锁（痛点+ROI量化）
- 核心需求分析（动态密码/时间限制/清洁工管理/日志）
- 三级技术方案对比：
  - 方案A: 手动管理（1-2房源）
  - 方案B: 半自动API/IFTTT（3-5房源）
  - 方案C: 全自动PMS集成（6+房源）
- 完整工作流设计（订单确认→密码生成→客人入住→清洁→下一位）
- 多房源管理策略
- 常见问题处理（密码不工作/客人locked out/电池耗尽）
- 安全和隐私考虑
- 实际案例（单房源 vs 10房源）
- 链接到[短租ROI计算器](/tools/short-term-rental-roi-calculator)

**关键价值**: 细分市场完整解决方案，高商业价值

---

### 4. 智能门锁故障排查完整指南
- **URL**: `/installation/smart-lock-troubleshooting-guide`
- **字数**: 3500字
- **搜索意图**: "smart lock won't connect", "zigbee lock offline"
- **优先级**: ⭐⭐⭐⭐⭐

**核心内容**:
- 快速诊断流程图
- 问题分类（初次配对失败/频繁掉线/完全无响应/响应慢）
- 症状1: 初次配对失败（5个原因+解决方案）
- 症状2: 频繁掉线（RF信号/电池/干扰/mesh拓扑）
- 症状3: 完全无响应
- 症状4: 响应慢（>5秒）
- 按协议分类的特殊问题（Wi-Fi/Zigbee/Z-Wave独有问题）
- 诊断工具和日志使用
- 预防措施
- 链接到[RF覆盖评估器](/tools/rf-coverage-estimator)

**关键价值**: 解决用户购买后最常见问题，降低退货率

---

### 5. Zigbee vs Z-Wave智能门锁技术对比
- **URL**: `/protocols/zigbee-vs-zwave-locks`
- **字数**: 3500字
- **搜索意图**: "zigbee vs zwave smart lock", "which is better"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- 快速结论表格
- 技术架构对比（频段/mesh原理/安全）
- 电池寿命实测对比
- 穿墙能力和范围对比
- 干扰因素（Zigbee vs Wi-Fi共存问题）
- 生态系统对比（产品丰富度/价格/Hub选择）
- Matter兼容性路径
- 场景推荐（公寓选Zigbee, 大房子选Z-Wave）
- 链接到[电池对比计算器](/tools/battery-life-comparison)

---

### 6. 本地 vs 云端智能门锁架构对比
- **URL**: `/protocols/local-vs-cloud-architecture`
- **字数**: 3500字
- **搜索意图**: "smart lock local control", "smart lock cloud privacy"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- 架构图对比（本地Hub vs 云端API vs 混合）
- 延迟和可靠性对比
- 隐私和安全分析
- 离线场景处理
- 成本对比（订阅费 vs 一次性买断）
- 功能权衡（远程访问 vs 隐私）
- 推荐方案（不同用户需求）
- 链接到[离线容错评分器](/tools/offline-resilience-scorecard)

---

### 7. 智能门锁电池寿命完整指南
- **URL**: `/installation/smart-lock-battery-life-guide`
- **字数**: 3000字
- **搜索意图**: "smart lock battery life", "how often replace battery"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- Wi-Fi vs Zigbee vs Z-Wave电池寿命对比（真实测试数据）
- 影响因素（协议/使用频率/温度/功能）
- 延长电池寿命技巧
- 低电量应急处理
- 电池类型选择（碱性 vs 锂电池）
- 年度成本计算
- 链接到[电池对比计算器](/tools/battery-life-comparison)

---

### 8. 智能门锁门兼容性完整指南
- **URL**: `/installation/door-compatibility-guide`
- **字数**: 3000字
- **搜索意图**: "will smart lock fit my door", "smart lock compatibility"
- **优先级**: ⭐⭐⭐⭐⭐

**核心内容**:
- 门类型分类（标准deadbolt/mortise/无孔）
- 关键尺寸：门厚度、backset、孔位
- 区域标准差异（美国/欧洲/中国）
- 如何测量现有门
- Retrofit vs Replace决策
- 常见问题（金属门/玻璃门/双开门）
- 适配器和改造方案
- 链接到[门锁兼容性检查器](/tools/door-lock-compatibility-checker)

**关键价值**: 防止用户购买错误产品，降低退货率

---

### 9. 租户智能门锁解决方案
- **URL**: `/use-cases/smart-locks-for-renters`
- **字数**: 3000字
- **搜索意图**: "smart lock for apartment renter", "temporary smart lock"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- 租户特殊约束（不能永久改门/租约限制/搬家复原）
- 非破坏性安装方案（overlay deadbolt/retrofit kit）
- 保留现有钥匙的方案
- 与房东沟通策略（含模板信）
- 搬家时拆除流程
- 预算友好方案（$100-200）
- 租约法律考虑（disclaimer）

**关键价值**: 巨大的被忽视市场

---

### 10. 智能门锁 vs 传统门锁完整对比
- **URL**: `/guides/smart-lock-vs-traditional-lock`
- **字数**: 3000字
- **搜索意图**: "should i get smart lock", "smart lock pros and cons"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- 直接回答：谁应该/不应该买智能锁
- 全面对比表（安全/便利/成本/维护）
- 典型使用场景分析
- 隐形成本（电池/订阅/时间）
- 过渡方案（保留物理钥匙+智能锁）
- 决策清单

**关键价值**: 基础决策文章，大量搜索流量入口

---

### 11. 智能门锁电池耗尽应急处理
- **URL**: `/guides/smart-lock-battery-emergency`
- **字数**: 2500字
- **搜索意图**: "what happens when smart lock battery dies", "locked out"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- 电池耗尽前的预警（提前30天提醒）
- 应急供电方法（9V电池外接/USB充电）
- 物理钥匙备份策略
- Keypad备份密码
- 预防措施（监控电池/定期更换）

**关键价值**: 消除用户最大恐惧

---

### 12. 智能门锁总拥有成本详解
- **URL**: `/guides/smart-lock-total-cost-ownership`
- **字数**: 3000字
- **搜索意图**: "smart lock cost", "how much does smart lock really cost"
- **优先级**: ⭐⭐⭐⭐

**核心内容**:
- TCO组成（硬件/安装/电池/订阅/维护）
- 隐藏成本（Hub/适配器/时间）
- 5年成本对比（不同协议/方案）
- 节省成本（避免换锁/lockout）
- 不同场景TCO分析（单门/多门/短租）
- 链接到[TCO计算器](/tools/smart-lock-tco-calculator)

---

## 🟡 Tier 2: 深度支撑文章（15篇精选）

### 协议深度（5篇）
1. **Matter智能门锁技术深度解析** (3000字)
   - `/protocols/matter-for-smart-locks`
   - Matter架构、迁移路径、当前产品

2. **Thread协议智能门锁详解** (2500字)
   - `/protocols/thread-for-smart-locks`
   - Thread vs Zigbee、HomeKit集成

3. **Z-Wave S2安全架构详解** (3000字)
   - `/security/zwave-s2-security-architecture`
   - S2三级安全、DSK配对、命令加密

4. **Wi-Fi智能门锁云端架构分析** (2500字)
   - `/protocols/wifi-cloud-lock-architecture`
   - 云端API设计、延迟分析、隐私考虑

5. **智能家居平台集成指南** (3000字)
   - `/protocols/platform-integration-guide`
   - HomeKit/Google/Alexa/SmartThings集成方式

### 安装和运维（3篇）
6. **智能门锁RF网络规划指南** (2500字)
   - `/installation/rf-planning-guide`
   - Link budget、mesh设计、中继器放置

7. **多单元建筑智能门锁部署** (3000字)
   - `/use-cases/multi-unit-buildings`
   - 大规模部署、网络规划、住户隐私

8. **智能门锁固件更新和安全管理** (2500字)
   - `/security/firmware-updates-security`
   - OTA更新、漏洞管理、安全公告追踪

### 场景应用（4篇）
9. **办公室智能门锁访问控制** (3000字)
   - `/use-cases/office-access-control`
   - 权限管理、审计日志、员工onboarding/offboarding

10. **长租房产智能门锁策略** (2500字)
    - `/use-cases/long-term-rental-locks`
    - vs短租差异、租客隐私、租约管理

11. **智能门锁离线能力设计** (2500字)
    - `/protocols/offline-capability-design`
    - 断网/停电场景、本地控制、应急方案

12. **智能门锁凭证管理最佳实践** (2500字)
    - `/security/credential-management-best-practices`
    - 密码策略、轮换频率、最小权限

### 高级主题（3篇）
13. **智能门锁威胁建模** (3000字)
    - `/security/threat-modeling-smart-locks`
    - 攻击树、风险评估、缓解措施

14. **如何评估智能门锁技术规格** (2500字)
    - `/guides/evaluate-smart-lock-specs`
    - 规格表解读、营销话术识破、对比方法

15. **智能门锁生态系统对比** (2500字)
    - `/guides/smart-lock-ecosystem-comparison`
    - 开放 vs 封闭、生态锁定风险、迁移策略

---

## 🟢 Tier 3: 长尾内容（10篇精选）

1. **金属门智能锁安装指南** (2000字)
2. **玻璃门智能锁解决方案** (1800字)
3. **智能门锁与视频门铃集成** (2000字)
4. **智能门锁保险和保修考虑** (2000字)
5. **智能门锁在寒冷气候的性能** (1800字)
6. **智能门锁电磁干扰和屏蔽** (2000字)
7. **智能门锁维护计划指南** (1800字)
8. **智能门锁与物业管理系统集成** (2500字)
9. **智能门锁隐私合规指南** (2000字) - GDPR/CCPA考虑
10. **智能门锁从Zigbee迁移到Matter** (2000字)

---

## 内容创作标准

### 质量要求
- ✅ 基于真实用户搜索意图
- ✅ 包含具体数据和案例
- ✅ 可操作的建议和清单
- ✅ 技术准确，引用来源
- ✅ 中立客观，避免营销
- ✅ 链接到相关计算器工具

### SEO优化
- 目标关键词密度1-2%
- H2/H3清晰层级结构
- 内部链接网络（pillar↔子文章↔工具）
- Schema.org TechArticle markup
- 图片alt文本优化

### 用户体验
- 开头直接回答核心问题
- 使用表格/图表辅助理解
- FAQ章节（10-15个问题）
- 实际案例和场景
- 相关资源链接（计算器+文章）

---

## 实施时间表

### Phase 1: MVP基石（4-6周）
**目标**: 发布6-8篇Tier 1 pillar文章

- Week 1-2: 
  - 协议指南
  - 安全分析
  - 故障排查
  
- Week 3-4:
  - Zigbee vs Z-Wave
  - Airbnb指南
  - 门兼容性
  
- Week 5-6:
  - 本地vs云端
  - 电池寿命
  - TCO详解

### Phase 2: 深度扩展（4-6周）
- 完成剩余Tier 1（4篇）
- 开始Tier 2（8-10篇）

### Phase 3: 内容完善（持续）
- 完成Tier 2
- 根据用户反馈添加Tier 3
- 优化现有文章（基于搜索数据）

---

## 与计算器的联动矩阵

| 文章 | 关联计算器 | 联动方式 |
|-----|----------|---------|
| 协议指南 | 协议选择器 + 电池对比器 | 文章解释原理，工具辅助决策 |
| TCO详解 | TCO计算器 + 短租ROI | 文章讲方法论，工具计算实例 |
| 故障排查 | RF覆盖评估器 | 文章诊断问题，工具规划解决方案 |
| Airbnb指南 | 短租ROI + 自动化评估 | 文章设计流程，工具量化收益 |
| 门兼容性 | 兼容性检查器 | 文章教测量，工具匹配产品 |
| 电池寿命 | 电池对比器 | 文章分析影响因素，工具对比协议 |

---

## 成功指标

### 内容质量
- 平均停留时间 > 4分钟
- 跳出率 < 60%
- 页面深度 > 2（阅读多页）
- 社交分享/外部引用

### SEO表现
- 目标关键词排名Top 10
- 长尾关键词覆盖率
- Featured snippet获取
- 外部权威站点链接

### 商业价值
- 工具使用转化率 > 15%
- AdSense审核通过
- 成为行业参考资料

---

## 💡 Support支持文章

**62篇快速问题解决指南** - 详见 [`/doc/SUPPORT.MD`](./SUPPORT.MD)

### Support文章定位
- **字数**: 800-1500字（快速阅读）
- **目标**: 解决单一具体问题
- **格式**: Quick Answer + Step-by-Step + Prevention
- **SEO**: 针对长尾关键词（"smart lock code not working"）

### 5大分类
- 🔴 **故障排查**（28篇）：连接/验证/机械/电源/性能/软件问题
- 🔵 **操作指南**（15篇）：初次设置/用户管理/维护/集成
- 🚨 **应急处理**（5篇）：电池耗尽/忘记密码/完全失灵/丢失手机/天气损坏
- 🔧 **优化技巧**（8篇）：延长电池/稳定连接/加快响应/安全加固
- 🛡️ **预防维护**（6篇）：月度检查/季节保养/固件管理/健康监控

### 与Core Articles的区别
| | Core Articles | Support Articles |
|---|---|---|
| **定位** | 教科书（全面深入） | 字典（快速查询） |
| **字数** | 4000-5000字 | 800-1500字 |
| **示例** | "智能门锁故障排查完整指南" | "为什么锁总是离线？" |
| **用途** | 学习理解 | 快速解决 |

### 实施优先级
- **Priority 1**（10篇）：与Tier 1 Pillar同步发布最高频问题
- **Priority 2**（20篇）：Phase 2扩展高频问题和关键操作
- **Priority 3**（32篇）：Phase 3完整覆盖

详细文章列表和规格见 [`SUPPORT.MD`](./SUPPORT.MD)

---

**最终目标**: 打造智能门锁领域最权威的技术知识库，而非内容农场

**内容矩阵总览**：
- 📚 37篇Core Articles（深度技术内容）
- 💡 62篇Support Articles（快速问题解决）
- 🧮 15个Calculators（决策辅助工具）
- **总计**: 99篇文章 + 15个工具 = 完整知识体系
