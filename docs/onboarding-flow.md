# AnyTokn Onboarding Flow 接入引导流程

> 版本: v1.0.1  
> 更新日期: 2026-04-28  
> 状态: 已完成

---

## 概述

AnyTokn 的 Onboarding 流程是一个任务驱动的接入引导系统，帮助新用户在 4 个步骤内完成首次 API 调用并查看成本数据。

---

## 设计目标

1. **降低接入门槛** - 将复杂的 API 接入流程拆解为可执行的步骤
2. **实时反馈** - 每个步骤都有明确的状态标记和完成提示
3. **灵活操作** - 支持手动标记完成，不强制依赖系统自动检测
4. **多语言支持** - 完整的中英文国际化支持
5. **成本可视化** - 直观展示用量和节省效果

---

## 流程步骤

### Step 0: 开始接入 (Get Started)

**目标**: 让用户了解整个接入流程

**内容**:
- 欢迎语和流程概述
- 4 个步骤的预览列表
- 两个操作按钮:
  - "开始接入" - 进入第一步
  - "查看集成指南" - 展开下方的工具配置说明

---

### Step 1: 获取 API Key (Get API Key)

**目标**: 引导用户生成 API Key

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 1: 获取你的 API Key            │
│  API Key 是调用 AnyTokn 服务的凭证    │
├─────────────────────────────────────┤
│                                     │
│     [Key Icon]                      │
│     生成你的第一个 API Key           │
│                                     │
│     [ 去生成 API Key ]               │
│                                     │
│  ─────────────────────────────────  │
│  请粘贴你刚才生成的 API Key          │
│  ┌─────────────────────────────┐    │
│  │ sk-anytokn-...              │    │
│  └─────────────────────────────┘    │
│                                     │
│  已经有 API Key 了？标记为完成        │
│     [ 我已完成获取 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 点击"去生成 API Key"跳转到 `/api-keys` 页面
- 提供输入框让用户粘贴生成的 API Key
- 提供"我已完成获取"按钮，允许手动标记完成
- 标记完成后显示"继续充值余额"按钮

---

### Step 2: 充值余额 (Recharge Balance)

**目标**: 引导用户充值测试余额

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 2: 充值余额                    │
│  充值后即可发起真实请求              │
├─────────────────────────────────────┤
│  当前余额: $0.00                    │
│                                     │
│  [⚠️ 余额为空。充值后可解锁测试]      │
│                                     │
│  [ 充值 $50 ]    [ 稍后再说 ]        │
│                                     │
│  ─────────────────────────────────  │
│  已经有余额了？标记为完成            │
│     [ 我已完成充值 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 显示当前余额
- 余额为 0 时显示警告提示
- 点击"充值 $50"直接增加余额（演示模式）
- 提供"我已完成充值"按钮，设置余额为 $50
- 充值成功后显示"继续测试请求"按钮

---

### Step 3: 测试请求 (Test Request)

**目标**: 帮助用户测试第一个 API 请求，展示用量和节省

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 3: 测试你的第一个请求          │
│  输入 Prompt 或选择推荐，体验极速响应 │
├─────────────────────────────────────┤
│                                     │
│  你的问题                           │
│  ┌─────────────────────────────┐    │
│  │ [输入框]                     │    │
│  └─────────────────────────────┘    │
│                                     │
│  或选择系统推荐：                    │
│  ┌────────────┐  ┌────────────┐    │
│  │ 📊 复杂分析 │  │ 🏗️ 系统设计 │    │
│  │ Transformer │  │ 微服务架构  │    │
│  │ 架构对比    │  │ 10万并发   │    │
│  └────────────┘  └────────────┘    │
│  ┌────────────┐  ┌────────────┐    │
│  │ 📅 产品策略 │  │ 💰 成本分析 │    │
│  │ 12月路线图  │  │ K8s迁移TCO │    │
│  └────────────┘  └────────────┘    │
│                                     │
│     [ 运行测试 ]                     │
│                                     │
│  ───────── 运行后显示 ─────────     │
│                                     │
│  ┌────────┐┌────────┐┌────────┐    │
│  │ 输入   ││ 输出   ││ 总成本  │    │
│  │ 856    ││ 1,247  ││ $0.042 │    │
│  │ tokens ││ tokens ││        │    │
│  └────────┘└────────┘└────────┘    │
│                                     │
│  使用 AnyTokn 节省                   │
│  $0.018 (42.9%)                     │
│  原始成本: $0.060  缓存命中: 35%    │
│                                     │
│     [ 查看成本分析 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 提供 Prompt 输入框，支持自由输入
- 4 个系统推荐的复杂测试用例（带分类标签）:
  - 📊 **复杂分析** - Transformer 架构企业级对比
  - 🏗️ **系统设计** - 10万+并发电商平台微服务
  - 📅 **产品策略** - AI客服平台12个月路线图
  - 💰 **成本分析** - K8s迁移5年TCO对比
- 点击推荐 Prompt 自动填入输入框
- "运行测试"按钮发起请求（带加载动画）
- 成功后显示:
  - 输入/输出 Token 数量
  - 总成本
  - AnyTokn 节省金额和百分比
  - 原始成本对比
  - 缓存命中率
- "查看成本分析"按钮进入最后一步

---

### Step 4: 查看结果 (View Results)

**目标**: 引导用户查看 Dashboard 和相关功能

**交互设计**:
```
┌─────────────────────────────────────┐
│           [✓ 恭喜!]                 │
│     你已完成接入引导                │
├─────────────────────────────────────┤
│                                     │
│  [Dashboard]  [Reports]  [Billing]  │
│  查看总览     查看报告    管理余额   │
│                                     │
│  [ 前往 Dashboard ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 显示完成祝贺
- 三个快捷入口: Dashboard、Reports、Billing
- "前往 Dashboard"主按钮
- 完成后不再显示悬浮快速入口

---

## 悬浮快速入口

当用户离开接入指南页面但尚未完成时，界面右下侧显示悬浮按钮:

```
┌─────────────────────────┐
│  🚀 快速接入 AnyTokn     │
│     快速接入  →          │
└─────────────────────────┘
```

**显示条件**:
- 不在 `/docs` 页面
- 未完成接入指南 (`localStorage.getItem('anytokn_onboarding_completed') !== 'true'`)

**点击行为**: 跳转回 `/docs` 页面

---

## 集成指南

### OpenClaw 配置

```yaml
# OpenClaw Config
base_url: https://api.anytokn.com/v1
api_key: sk-your-api-key
```

### Hermes 工作流

```
Provider: OpenAI Compatible
Base URL: https://api.anytokn.com/v1
Model: gpt-3.5-turbo
```

### n8n 节点配置

```
Base URL: https://api.anytokn.com/v1
API Key: sk-your-api-key
```

### Python 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.anytokn.com/v1",
    api_key="sk-your-api-key"
)

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

---

## 技术实现

### 状态管理

```typescript
// 步骤状态
const [currentStep, setCurrentStep] = useState(0);

// 完成状态
const [hasApiKey, setHasApiKey] = useState(false);
const [balance, setBalance] = useState(0);
const [testCompleted, setTestCompleted] = useState(false);

// 测试 Prompt
const [testPrompt, setTestPrompt] = useState('');
```

### 步骤定义

```typescript
const steps = [
  { id: 'start', title: '开始接入', titleEn: 'Get Started' },
  { id: 'apikey', title: '获取 API Key', titleEn: 'Get API Key' },
  { id: 'balance', title: '充值余额', titleEn: 'Recharge Balance' },
  { id: 'test', title: '测试请求', titleEn: 'Test Request' },
  { id: 'result', title: '查看结果', titleEn: 'View Results' },
];
```

### 完成标记

```typescript
// 当用户到达最后一步时，标记接入指南已完成
useEffect(() => {
  if (currentStep === 4) {
    localStorage.setItem('anytokn_onboarding_completed', 'true');
  }
}, [currentStep]);
```

---

## 国际化

所有文案支持中英文切换，通过 `useLanguage` hook 实现:

```typescript
const { lang } = useLanguage();
const isEn = lang === 'en';

// 使用示例
<p>{isEn ? 'Welcome to AnyTokn' : '欢迎使用 AnyTokn'}</p>
```

---

## 更新记录

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.1 | 2026-04-28 | 优化接入流程：移除创建项目步骤、改为充值余额、增加复杂 Prompt 测试、展示用量和节省数据、添加悬浮快速入口 |
| v1.0.1 | 2026-04-24 | 重新设计 Onboarding 流程，改为任务驱动模式 |
| v1.0.0 | 2026-04-20 | 基础文档页面 |

---

## 相关链接

- [注册流程优化 - 邀请成员业务链条](./registration-flow-optimization.md)
- [消息通知文档](./notification-messages.md)
- [版本迭代记录](../src/pages/Changelog.tsx)
- [原型页面](../src/pages/Docs.tsx)
