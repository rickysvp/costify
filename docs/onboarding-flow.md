# AnyTokn Onboarding Flow 接入引导流程

> 版本: v1.0.1  
> 更新日期: 2026-04-24  
> 状态: 已完成

---

## 概述

AnyTokn 的 Onboarding 流程是一个任务驱动的接入引导系统，帮助新用户在 5 个步骤内完成首次 API 调用并查看成本数据。

---

## 设计目标

1. **降低接入门槛** - 将复杂的 API 接入流程拆解为可执行的步骤
2. **实时反馈** - 每个步骤都有明确的状态标记和完成提示
3. **灵活操作** - 支持手动标记完成，不强制依赖系统自动检测
4. **多语言支持** - 完整的中英文国际化支持

---

## 流程步骤

### Step 0: 开始接入 (Get Started)

**目标**: 让用户了解整个接入流程

**内容**:
- 欢迎语和流程概述
- 5 个步骤的预览列表
- 两个操作按钮:
  - "开始接入" - 进入第一步
  - "查看集成指南" - 展开下方的工具配置说明

---

### Step 1: 创建项目 (Create Project)

**目标**: 引导用户创建第一个项目

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 1: 创建你的第一个项目          │
│  项目是 AnyTokn 中资源管理的基本单位  │
├─────────────────────────────────────┤
│                                     │
│     [Building Icon]                 │
│     你还没有创建任何项目              │
│                                     │
│     [ 去创建项目 ]                   │
│                                     │
│  ─────────────────────────────────  │
│  已经创建好项目了？标记为完成         │
│     [ 我已完成创建 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 点击"去创建项目"跳转到 `/projects` 页面
- 提供"我已完成创建"按钮，允许手动标记完成
- 标记完成后显示项目名称和"继续获取 API Key"按钮

---

### Step 2: 获取 API Key (Get API Key)

**目标**: 引导用户生成 API Key

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 2: 获取你的 API Key            │
│  API Key 是调用 AnyTokn 服务的凭证    │
├─────────────────────────────────────┤
│                                     │
│     [Key Icon]                      │
│     生成你的第一个 API Key           │
│                                     │
│     [ 去生成 API Key ]               │
│                                     │
│  ─────────────────────────────────  │
│  已经有 API Key 了？标记为完成        │
│     [ 我已完成获取 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 点击"去生成 API Key"跳转到 `/api-keys` 页面
- 提供"我已完成获取"按钮，允许手动标记完成
- 标记完成后显示 API Key 示例和"继续准备测试余额"按钮

---

### Step 3: 准备测试余额 (Prepare Balance)

**目标**: 引导用户充值测试余额

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 3: 准备测试余额                │
│  准备少量测试余额即可发起真实请求     │
├─────────────────────────────────────┤
│  当前余额: $0.00                    │
│                                     │
│  [⚠️ 余额为空。充值后可解锁测试]      │
│                                     │
│  [ 去充值 ]    [ 稍后再说 ]          │
│                                     │
│  ─────────────────────────────────  │
│  已经有余额了？标记为完成            │
│     [ 我已完成准备 ]                 │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 显示当前余额
- 余额为 0 时显示警告提示
- 点击"去充值"跳转到 `/billing` 页面
- 提供"我已完成准备"按钮，设置余额为 $50

---

### Step 4: 测试请求 (Test Request)

**目标**: 帮助用户测试第一个 API 请求

**交互设计**:
```
┌─────────────────────────────────────┐
│  步骤 4: 测试你的第一个请求          │
│  复制代码运行，成功响应即表示接入正常  │
├─────────────────────────────────────┤
│                                     │
│  Base URL: https://api.anytokn.com/v1│
│                                     │
│  [cURL] [JavaScript] [Python]       │
│  ┌─────────────────────────────┐    │
│  │ curl ...                    │    │
│  │   -H "Authorization: ..."   │    │
│  │   -d '{...}'                │    │
│  └─────────────────────────────┘    │
│                                     │
│  预期响应:                          │
│  ┌─────────────────────────────┐    │
│  │ { "choices": [...] }        │    │
│  └─────────────────────────────┘    │
│                                     │
│  [✓ 我已跑通测试请求]                │
│                                     │
└─────────────────────────────────────┘
```

**功能说明**:
- 显示 Base URL: `https://api.anytokn.com/v1`
- 提供 cURL、JavaScript、Python 三种代码示例
- 代码中自动填入用户的 API Key
- 显示预期响应示例
- "我已跑通测试请求"按钮标记完成并进入最后一步

---

### Step 5: 查看结果 (View Results)

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
const [hasProject, setHasProject] = useState(false);
const [hasApiKey, setHasApiKey] = useState(false);
const [balance, setBalance] = useState(0);
const [testCompleted, setTestCompleted] = useState(false);
```

### 步骤定义

```typescript
const steps = [
  { id: 'start', title: '开始接入', titleEn: 'Get Started' },
  { id: 'project', title: '创建项目', titleEn: 'Create Project' },
  { id: 'apikey', title: '获取 API Key', titleEn: 'Get API Key' },
  { id: 'balance', title: '准备测试余额', titleEn: 'Prepare Balance' },
  { id: 'test', title: '测试请求', titleEn: 'Test Request' },
  { id: 'result', title: '查看结果', titleEn: 'View Results' },
];
```

### 状态计算

```typescript
const steps: OnboardingStep[] = [
  { id: 'start', status: currentStep === 0 ? 'current' : 'done' },
  { id: 'project', status: hasProject ? 'done' : currentStep === 1 ? 'current' : 'todo' },
  { id: 'apikey', status: hasApiKey ? 'done' : currentStep === 2 ? 'current' : 'todo' },
  { id: 'balance', status: balance > 0 ? 'done' : currentStep === 3 ? 'current' : 'todo' },
  { id: 'test', status: testCompleted ? 'done' : currentStep === 4 ? 'current' : 'todo' },
  { id: 'result', status: currentStep === 5 ? 'current' : 'todo' },
];
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
| v1.0.1 | 2026-04-24 | 重新设计 Onboarding 流程，改为任务驱动模式 |
| v1.0.0 | 2026-04-20 | 基础文档页面 |

---

## 相关链接

- [消息通知文档](./notification-messages.md)
- [版本迭代记录](../src/pages/Changelog.tsx)
- [原型页面](../src/pages/Docs.tsx)
