# Phase 1 执行清单：重复内容整合

**时间**：Week 1-2 | **工作量**：48小时

---

## 🎯 目标
- 减少5篇文章（54→49）
- 消除70%重复内容
- 创建1个电池Pillar + 1个配对Guide
- 建立第一组计算器-文章链接

---

## Week 1: 电池主题整合

### Day 1: 内容收集与大纲（8h）
```
□ 打开6篇电池文章，标注重复内容
□ 创建内容对比Excel表
□ 撰写 battery-life-guide.mdx 完整大纲（5000-6000字）
□ 标记6个计算器嵌入位置
```

### Day 2-3: Pillar撰写（12h）
```
□ Section 1: Quick Decision Matrix（300字）+ 计算器CTA
□ Section 2: Battery Fundamentals（1200字）
  - 协议功耗对比（WiFi/Zigbee/Z-Wave/Thread）
  - 电池化学对比表
  - 10品牌实测数据
  - 嵌入：Protocol Wizard
□ Section 3: Maximizing Life（1500字）
  - RF信号优化（700字）
  - 电池化学优化（400字）
  - 功能配置（300字）
  - 嵌入：RF Coverage Estimator, TCO Calculator
□ Section 4: Diagnosing Drain（1000字）+ Battery Calculator
□ Section 5: Replacement Strategy（800字）
□ Section 6: Emergency Power（500字）
□ Section 7: FAQ（700字）
□ Section 8: Tools & Resources（计算器列表）
```

### Day 4: Support文章简化（8h）
```
□ how-to-change-battery
  - 删除理论部分（500字）→ 链接到Pillar
  - 保留：品牌步骤、注意事项（700字）
  - 添加5个向上链接
  - 最终：1200字
  
□ emergency-battery-died
  - 删除预防理论（1400字）→ 链接到Pillar
  - 保留：9V应急、物理钥匙（1800字）
  - 添加3个向上链接
  - 最终：1800字
```

### Day 5: 重定向与清理（8h）
```
□ astro.config.mjs 添加301：
  - maximize-battery-life → battery-life-guide#maximizing
  - battery-dies-too-fast → battery-life-guide#diagnosing
  - low-battery-warning → battery-life-guide#replacement
  
□ 删除3个源文件（备份到/archive）

□ 更新sitemap.xml

□ 全站搜索替换旧URL（40-50处）：
  grep -r "maximize-battery-life" src/

□ 测试301重定向

□ 提交Google Search Console
```

---

## Week 2: 连接配对整合

### Day 6-7: Pairing Guide创建（12h）
```
□ 创建 /guides/pairing-complete-guide.mdx（4000字）

□ Section 1: Quick Troubleshooting（300字）+ Protocol Wizard
□ Section 2: Pairing Mechanism（600字）
□ Section 3: Step-by-Step（1200字）
  - WiFi锁（4品牌）
  - Zigbee锁（5品牌）
  - Z-Wave锁（4品牌）
□ Section 4: Hub Discovery（800字）+ RF Estimator
□ Section 5: Advanced Troubleshooting（600字）
□ Section 6: Prevention（300字）
□ Section 7: FAQ（200字）
```

### Day 8: 配对主题清理（6h）
```
□ 301重定向：
  - wont-pair → pairing-guide#troubleshooting
  - pair-with-hub → pairing-guide#step-by-step
  - hub-cant-find → pairing-guide#discovery

□ 删除2个源文件

□ 更新全站链接（20-30处）

□ 测试 & 提交GSC
```

---

## 质量检查

### Battery Life Guide验收标准
```
□ 字数：5000-6000 ✓
□ 计算器链接：6个正常 ✓
□ 内部文章链接：15-20个 ✓
□ 原创图表：3-5个 ✓
□ SEO完整（title/meta/schema）✓
□ 移动端友好 ✓
```

### 技术实施验收
```
□ 6个301重定向测试通过 ✓
□ 全站无404错误 ✓
□ sitemap已更新 ✓
□ GSC已提交 ✓
```

---

## 产出文件

**新建**：
- `/installation/smart-lock-battery-life-guide.mdx`（5500字）
- `/guides/smart-lock-pairing-complete-guide.mdx`（4200字）

**修改**：
- `/support/how-to-change-smart-lock-battery.mdx`（简化）
- `/support/emergency-battery-died-locked-out.mdx`（简化）
- `astro.config.mjs`（6个重定向）
- `sitemap.xml`

**删除**：
- 5个旧文章文件（已301）
