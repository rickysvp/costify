import { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  Key,
  Globe,
  Zap,
  Cpu,
  BarChart3,
  Shield,
  Code2,
  Compass,
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  ArrowRight,
  Sparkles,
  Building2,
} from 'lucide-react';
import { API_BASE } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

// Compute a displayable API base URL (absolute path)
const getDisplayApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001/api';
  if (API_BASE.startsWith('http')) return API_BASE;
  return window.location.origin + API_BASE;
};

const DISPLAY_API_BASE = getDisplayApiBase();

// ---------- 代码块组件 ----------
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-800 rounded-t-lg border-b border-surface-700">
        <span className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">{language}</span>
        <button
          className="flex items-center gap-1 text-xs text-surface-400 hover:text-surface-200 transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-surface-900 rounded-b-lg p-4 overflow-x-auto">
        <code className="text-xs leading-relaxed text-surface-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ---------- 信息卡片组件 ----------
function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Globe;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="card-header flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

// ---------- KV 行组件 ----------
function KVRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-50 last:border-0">
      <span className="text-xs text-surface-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium text-surface-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
        <button
          className="p-1 rounded hover:bg-surface-100 transition-colors"
          onClick={handleCopy}
          title="复制"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3 text-surface-400" />
          )}
        </button>
      </div>
    </div>
  );
}

// ---------- 代码示例数据 ----------
const curlExample = `curl ${DISPLAY_API_BASE}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer csk_your_api_key_here" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'`;

const jsExample = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${DISPLAY_API_BASE}/v1',
  apiKey: 'csk_your_api_key_here',
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, how are you?' },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  console.log(response.choices[0].message.content);

  // AnyTokn 成本元数据
console.log('Routed Model:', response.anytokn?.routed_model);
console.log('Cache Hit:', response.anytokn?.cache_hit);
console.log('Estimated Cost:', response.anytokn?.estimated_cost);
console.log('Remaining Balance:', response.anytokn?.remaining_balance);
}

main();`;

const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url="${DISPLAY_API_BASE}/v1",
    api_key="csk_your_api_key_here",
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, how are you?"},
    ],
    temperature=0.7,
    max_tokens=1024,
)

print(response.choices[0].message.content)

# AnyTokn 成本元数据
print(f"Routed Model: {response.anytokn.routed_model}")
print(f"Cache Hit: {response.anytokn.cache_hit}")
print(f"Estimated Cost: {response.anytokn.estimated_cost}")
print(f"Remaining Balance: {response.anytokn.remaining_balance}")`;

const responseExample = `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1712995200,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing well, thank you..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 42,
    "total_tokens": 67
  },
  "anytokn": {
    "routed_model": "gpt-4o-mini",
    "cache_hit": true,
    "estimated_cost": 0.0012,
    "remaining_balance": 4850.50
  }
}`;

// ---------- 可用模型列表 ----------
const models = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', category: '旗舰' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', category: '轻量' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', category: '高级' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', category: '经济' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', category: '旗舰' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', category: '轻量' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', category: '经济' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'DeepSeek', category: '推理' },
  { id: 'qwen-max', name: 'Qwen Max', provider: 'Alibaba', category: '高级' },
  { id: 'qwen-plus', name: 'Qwen Plus', provider: 'Alibaba', category: '标准' },
];

// ---------- 请求参数 ----------
const requestParams = [
  { name: 'model', type: 'string', required: true, desc: '模型 ID，如 gpt-4o、claude-3.5-sonnet' },
  { name: 'messages', type: 'array', required: true, desc: '消息数组，包含 role 和 content' },
  { name: 'temperature', type: 'number', required: false, desc: '采样温度，0-2，默认 0.7' },
  { name: 'max_tokens', type: 'integer', required: false, desc: '最大生成 token 数，默认 1024' },
  { name: 'top_p', type: 'number', required: false, desc: '核采样参数，0-1' },
  { name: 'stream', type: 'boolean', required: false, desc: '是否流式输出，默认 false' },
];

// ---------- AnyTokn 元数据 ----------
const anytoknMetadata = [
  { key: 'routed_model', type: 'string', desc: '实际路由到的模型（可能与请求模型不同）' },
  { key: 'cache_hit', type: 'boolean', desc: '是否命中语义缓存' },
  { key: 'estimated_cost', type: 'number', desc: '本次请求预估成本（USD）' },
  { key: 'remaining_balance', type: 'number', desc: '当前账户剩余余额（USD）' },
];

// ---------- 主组件 ----------
export default function Docs() {
  const { t, lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('onboarding');

  const isEn = lang === 'en';

  // 翻译内容
  const i18n = {
    title: isEn ? 'Documentation' : '接入指南',
    subtitle: isEn 
      ? 'AnyTokn is compatible with OpenAI API format, zero code changes required'
      : 'AnyTokn 兼容 OpenAI API 格式，零代码改动即可接入',
    sections: {
      onboarding: { label: isEn ? 'Getting Started' : '新人导览', icon: Compass },
      quickstart: { label: isEn ? 'Quick Start' : '快速开始', icon: Zap },
      auth: { label: isEn ? 'Authentication' : '认证方式', icon: Key },
      params: { label: isEn ? 'Request Params' : '请求参数', icon: Code2 },
      response: { label: isEn ? 'Response Format' : '响应格式', icon: BarChart3 },
      models: { label: isEn ? 'Available Models' : '可用模型', icon: Cpu },
    },
    onboarding: {
      welcomeTitle: isEn ? 'Welcome to AnyTokn Dashboard' : '欢迎使用 AnyTokn Dashboard',
      welcomeDesc: isEn 
        ? 'This guide will help you quickly understand the core features of Dashboard, helping you efficiently manage AI Token resources, optimize costs, and monitor usage.'
        : '本指南将带你快速了解 Dashboard 的核心功能，帮助你高效管理 AI Token 资源、优化成本并监控使用情况。',
      quickStartTitle: isEn ? '5-Minute Quick Start' : '5 分钟快速上手',
      steps: [
        {
          step: isEn ? 'Step 1' : '第 1 步',
          title: isEn ? 'Explore Dashboard' : '认识仪表盘',
          desc: isEn 
            ? 'The Dashboard homepage displays your core data: monthly consumption, savings, API call count, and other key metrics.'
            : 'Dashboard 首页展示了你的核心数据：本月消耗、节省金额、API 调用次数等关键指标。',
          action: isEn ? 'View Dashboard' : '查看仪表盘',
          doc: isEn ? 'Quick Start Guide' : '查看快速开始',
        },
        {
          step: isEn ? 'Step 2' : '第 2 步',
          title: isEn ? 'Create Your First Project' : '创建你的第一个项目',
          desc: isEn 
            ? 'Projects are the basic unit of resource management. It is recommended to create separate projects for different business scenarios to facilitate cost tracking and permission management.'
            : '项目是资源管理的基本单位。建议为不同的业务场景创建独立项目，便于成本追踪和权限管理。',
          action: isEn ? 'Create Project' : '创建项目',
          doc: isEn ? 'Project Documentation' : '查看项目文档',
        },
        {
          step: isEn ? 'Step 3' : '第 3 步',
          title: isEn ? 'Get API Key' : '获取 API Key',
          desc: isEn 
            ? 'API Key is the credential for calling AnyTokn services. Each project can create multiple Keys, supporting independent budget and permission settings.'
            : 'API Key 是调用 AnyTokn 服务的凭证。每个项目可以创建多个 Key，支持独立设置预算和权限。',
          action: isEn ? 'Manage API Keys' : '管理 API Keys',
          doc: isEn ? 'Authentication Documentation' : '查看认证文档',
        },
        {
          step: isEn ? 'Step 4' : '第 4 步',
          title: isEn ? 'Integrate Your Application' : '接入你的应用',
          desc: isEn 
            ? 'AnyTokn is fully compatible with OpenAI API format. Simply modify the baseURL and API Key to integrate.'
            : 'AnyTokn 完全兼容 OpenAI API 格式，只需修改 baseURL 和 API Key 即可接入。',
          action: isEn ? 'Integration Guide' : '查看接入指南',
          doc: isEn ? 'API Documentation' : '查看 API 文档',
        },
        {
          step: isEn ? 'Step 5' : '第 5 步',
          title: isEn ? 'Monitor Usage' : '监控使用情况',
          desc: isEn 
            ? 'Regularly check usage reports and cost analysis, and use intelligent routing and caching to further reduce costs.'
            : '定期查看使用报告和成本分析，利用智能路由和缓存优化进一步降低成本。',
          action: isEn ? 'View Reports' : '查看报告',
          routing: isEn ? 'Routing Config' : '路由配置',
          alerts: isEn ? 'Alert Settings' : '告警设置',
        },
      ],
    },
  };

  const sections = [
    { id: 'onboarding', label: i18n.sections.onboarding.label, icon: Compass },
    { id: 'quickstart', label: i18n.sections.quickstart.label, icon: Zap },
    { id: 'auth', label: i18n.sections.auth.label, icon: Key },
    { id: 'params', label: i18n.sections.params.label, icon: Code2 },
    { id: 'response', label: i18n.sections.response.label, icon: BarChart3 },
    { id: 'models', label: i18n.sections.models.label, icon: Cpu },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">{i18n.title}</h1>
        <p className="text-sm text-surface-500 mt-1">
          {i18n.subtitle}
        </p>
      </div>

      {/* 导航标签 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeSection === s.id
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-surface-600 hover:bg-surface-50 border border-surface-200'
              }`}
              onClick={() => setActiveSection(s.id)}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 新人导览 */}
      {activeSection === 'onboarding' && (
        <div className="space-y-6">
          {/* 欢迎卡片 */}
          <div className="card p-6 bg-gradient-to-br from-brand-50 to-surface-50 border-brand-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{i18n.onboarding.welcomeTitle}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {i18n.onboarding.welcomeDesc}
                </p>
              </div>
            </div>
          </div>

          {/* 导览步骤 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-600" />
              {i18n.onboarding.quickStartTitle}
            </h3>

            {/* 步骤 1: 了解仪表盘 */}
            <div className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-blue text-[10px]">{i18n.onboarding.steps[0].step}</span>
                      <h4 className="text-sm font-semibold text-surface-800">{i18n.onboarding.steps[0].title}</h4>
                    </div>
                    <p className="text-xs text-surface-600 mb-3">
                      {i18n.onboarding.steps[0].desc}
                    </p>
                  </div>
                </div>
                {/* 图片和链接 */}
                <div className="mt-4">
                  <div className="rounded-lg border border-surface-200 overflow-hidden mb-3">
                    <img 
                      src="/onboarding/dashboard-preview.png" 
                      alt={isEn ? "Dashboard Preview" : "仪表盘预览"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isEn 
                          ? 'https://placehold.co/600x300/f5f5f5/404040?text=Dashboard+Preview'
                          : 'https://placehold.co/600x300/f5f5f5/404040?text=仪表盘预览';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href="/dashboard" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {i18n.onboarding.steps[0].action}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/docs/quickstart" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[0].doc}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤 2: 创建项目 */}
            <div className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-emerald text-[10px]">{i18n.onboarding.steps[1].step}</span>
                      <h4 className="text-sm font-semibold text-surface-800">{i18n.onboarding.steps[1].title}</h4>
                    </div>
                    <p className="text-xs text-surface-600 mb-3">
                      {i18n.onboarding.steps[1].desc}
                    </p>
                  </div>
                </div>
                {/* 图片和链接 */}
                <div className="mt-4">
                  <div className="rounded-lg border border-surface-200 overflow-hidden mb-3">
                    <img 
                      src="/onboarding/projects-preview.png" 
                      alt={isEn ? "Project Management" : "项目管理"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isEn 
                          ? 'https://placehold.co/600x300/f0fdf4/166534?text=Project+Management'
                          : 'https://placehold.co/600x300/f0fdf4/166534?text=项目管理';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href="/projects" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {i18n.onboarding.steps[1].action}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/docs#quickstart" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[1].doc}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤 3: 获取 API Key */}
            <div className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-purple text-[10px]">{i18n.onboarding.steps[2].step}</span>
                      <h4 className="text-sm font-semibold text-surface-800">{i18n.onboarding.steps[2].title}</h4>
                    </div>
                    <p className="text-xs text-surface-600 mb-3">
                      {i18n.onboarding.steps[2].desc}
                    </p>
                  </div>
                </div>
                {/* 图片和链接 */}
                <div className="mt-4">
                  <div className="rounded-lg border border-surface-200 overflow-hidden mb-3">
                    <img 
                      src="/onboarding/apikeys-preview.png" 
                      alt={isEn ? "API Key Management" : "API Key 管理"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isEn 
                          ? 'https://placehold.co/600x300/f3e8ff/7c3aed?text=API+Key+Management'
                          : 'https://placehold.co/600x300/f3e8ff/7c3aed?text=API+Key+管理';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href="/api-keys" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {i18n.onboarding.steps[2].action}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/docs/auth" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[2].doc}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤 4: 接入代码 */}
            <div className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-amber text-[10px]">{i18n.onboarding.steps[3].step}</span>
                      <h4 className="text-sm font-semibold text-surface-800">{i18n.onboarding.steps[3].title}</h4>
                    </div>
                    <p className="text-xs text-surface-600 mb-3">
                      {i18n.onboarding.steps[3].desc}
                    </p>
                  </div>
                </div>
                {/* 图片和链接 */}
                <div className="mt-4">
                  <div className="rounded-lg border border-surface-200 overflow-hidden mb-3">
                    <img 
                      src="/onboarding/integration-preview.png" 
                      alt={isEn ? "API Integration" : "API 接入"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isEn 
                          ? 'https://placehold.co/600x300/fffbeb/d97706?text=API+Integration'
                          : 'https://placehold.co/600x300/fffbeb/d97706?text=API+接入';
                      }}
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-surface-900 mb-3">
                    <code className="text-[10px] font-mono text-surface-300">
                      baseURL: &quot;{DISPLAY_API_BASE}/v1&quot;
                    </code>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href="/docs/quickstart" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      {i18n.onboarding.steps[3].action}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/docs/params" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[3].doc}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤 5: 监控与优化 */}
            <div className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-rose text-[10px]">{i18n.onboarding.steps[4].step}</span>
                      <h4 className="text-sm font-semibold text-surface-800">{i18n.onboarding.steps[4].title}</h4>
                    </div>
                    <p className="text-xs text-surface-600 mb-3">
                      {i18n.onboarding.steps[4].desc}
                    </p>
                  </div>
                </div>
                {/* 图片和链接 */}
                <div className="mt-4">
                  <div className="rounded-lg border border-surface-200 overflow-hidden mb-3">
                    <img 
                      src="/onboarding/analytics-preview.png" 
                      alt={isEn ? "Analytics & Reports" : "数据分析"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isEn 
                          ? 'https://placehold.co/600x300/fff1f2/e11d48?text=Analytics+%26+Reports'
                          : 'https://placehold.co/600x300/fff1f2/e11d48?text=数据分析';
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-surface-50 text-center">
                      <p className="text-xs font-medium text-surface-700">{isEn ? 'Analytics' : '数据分析'}</p>
                      <p className="text-[10px] text-surface-500">{isEn ? 'View Reports' : '查看详细报表'}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50 text-center">
                      <p className="text-xs font-medium text-surface-700">{isEn ? 'Cost Center' : '成本中心'}</p>
                      <p className="text-[10px] text-surface-500">{isEn ? 'Budget & Routing' : '预算与路由'}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50 text-center">
                      <p className="text-xs font-medium text-surface-700">{isEn ? 'Alerts' : '告警设置'}</p>
                      <p className="text-[10px] text-surface-500">{isEn ? 'Get Notified' : '异常及时通知'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href="/reports" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      {i18n.onboarding.steps[4].action}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/routing" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[4].routing}
                    </a>
                    <a 
                      href="/settings" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      {i18n.onboarding.steps[4].alerts}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 核心功能速览 */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" />
              {isEn ? 'Core Features Overview' : '核心功能速览'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: LayoutDashboard, label: isEn ? 'Dashboard' : '仪表盘', desc: isEn ? 'Data Overview' : '数据总览', color: 'blue' },
                { icon: Building2, label: isEn ? 'Projects' : '项目中心', desc: isEn ? 'Resource Management' : '资源管理', color: 'emerald' },
                { icon: Key, label: isEn ? 'API Management' : 'API 管理', desc: isEn ? 'Keys & Billing' : '密钥与计费', color: 'purple' },
                { icon: BarChart3, label: isEn ? 'Analytics' : '数据分析', desc: isEn ? 'Usage Reports' : '使用报告', color: 'rose' },
                { icon: Wallet, label: isEn ? 'Cost Center' : '成本中心', desc: isEn ? 'Budget Control' : '预算控制', color: 'amber' },
                { icon: Users, label: isEn ? 'Members' : '成员管理', desc: isEn ? 'Permission Mgmt' : '权限分配', color: 'cyan' },
                { icon: Globe, label: isEn ? 'API Market' : 'API 市场', desc: isEn ? 'Model Selection' : '模型选择', color: 'violet' },
                { icon: Settings, label: isEn ? 'Settings' : '系统设置', desc: isEn ? 'Preferences' : '偏好配置', color: 'slate' },
              ].map((item, idx) => {
                const Icon = item.icon;
                const colorClasses: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600',
                  emerald: 'bg-emerald-50 text-emerald-600',
                  purple: 'bg-purple-50 text-purple-600',
                  rose: 'bg-rose-50 text-rose-600',
                  amber: 'bg-amber-50 text-amber-600',
                  cyan: 'bg-cyan-50 text-cyan-600',
                  violet: 'bg-violet-50 text-violet-600',
                  slate: 'bg-slate-50 text-slate-600',
                };
                return (
                  <div key={idx} className="p-3 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${colorClasses[item.color]} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-surface-800">{item.label}</p>
                    <p className="text-[10px] text-surface-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 下一步提示 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50 border border-brand-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-800">{isEn ? 'Ready to start?' : '准备好开始了吗？'}</p>
                <p className="text-xs text-surface-600">{isEn ? 'Check "Quick Start" for detailed code examples' : '查看「快速开始」获取详细的代码示例'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveSection('quickstart')}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              {isEn ? 'Quick Start' : '查看快速开始'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 快速开始 */}
      {activeSection === 'quickstart' && (
        <div className="space-y-6">
          {/* 步骤说明 */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-800 mb-4">三步接入 AnyTokn</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: 1,
                  title: '获取 API Key',
                  desc: '在 API Keys 页面创建密钥，以 csk_ 开头',
                  icon: Key,
                },
                {
                  step: 2,
                  title: '修改 baseURL',
                  desc: '将 OpenAI SDK 的 baseURL 指向 AnyTokn',
                  icon: Globe,
                },
                {
                  step: 3,
                  title: '开始使用',
                  desc: '无需其他改动，自动享受成本优化',
                  icon: Zap,
                },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 p-4 rounded-lg bg-surface-50 border border-surface-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-brand-700">{item.step}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3.5 h-3.5 text-brand-600" />
                        <p className="text-sm font-medium text-surface-800">{item.title}</p>
                      </div>
                      <p className="text-xs text-surface-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 代码示例 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-600" />
              代码示例
            </h3>
            <CodeBlock code={curlExample} language="bash" />
            <CodeBlock code={jsExample} language="javascript" />
            <CodeBlock code={pythonExample} language="python" />
          </div>
        </div>
      )}

      {/* 认证方式 */}
      {activeSection === 'auth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={Key} title="认证信息">
            <KVRow label="Base URL" value={`${DISPLAY_API_BASE}/v1/chat/completions`} mono />
            <KVRow label="认证方式" value="Bearer Token" />
            <KVRow label="Token 前缀" value="csk_" mono />
            <KVRow label="Header 名称" value="Authorization" />
          </InfoCard>

          <InfoCard icon={Shield} title="安全说明">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-surface-600">API Key 仅在创建时显示一次，请妥善保管</p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-surface-600">所有请求通过 HTTPS 加密传输</p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-surface-600">支持 IP 白名单限制访问来源</p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-surface-600">密钥可随时轮换，不影响服务连续性</p>
              </div>
            </div>
          </InfoCard>

          <div className="md:col-span-2">
            <InfoCard icon={Terminal} title="认证示例">
              <CodeBlock
                language="bash"
                code={`# 在请求头中携带 Bearer Token
curl ${DISPLAY_API_BASE}/v1/chat/completions \\
  -H "Authorization: Bearer csk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hi"}]}'`}
              />
            </InfoCard>
          </div>
        </div>
      )}

      {/* 请求参数 */}
      {activeSection === 'params' && (
        <div className="space-y-6">
          <InfoCard icon={Code2} title="请求参数">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="table-header">参数名</th>
                    <th className="table-header">类型</th>
                    <th className="table-header">必填</th>
                    <th className="table-header">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {requestParams.map(p => (
                    <tr key={p.name} className="border-b border-surface-50">
                      <td className="table-cell">
                        <code className="text-xs font-mono text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                          {p.name}
                        </code>
                      </td>
                      <td className="table-cell">
                        <span className="text-xs text-surface-600">{p.type}</span>
                      </td>
                      <td className="table-cell">
                        {p.required ? (
                          <span className="badge-red text-[10px]">必填</span>
                        ) : (
                          <span className="badge-gray text-[10px]">可选</span>
                        )}
                      </td>
                      <td className="table-cell text-xs text-surface-600">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>

          <InfoCard icon={BarChart3} title="AnyTokn 响应元数据">
            <p className="text-xs text-surface-500 mb-3">
              每次请求的响应中会包含 <code className="font-mono text-brand-700 bg-brand-50 px-1 rounded">anytokn</code> 字段，提供成本追踪信息：
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="table-header">字段</th>
                    <th className="table-header">类型</th>
                    <th className="table-header">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {anytoknMetadata.map(m => (
                    <tr key={m.key} className="border-b border-surface-50">
                      <td className="table-cell">
                        <code className="text-xs font-mono text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                          {m.key}
                        </code>
                      </td>
                      <td className="table-cell">
                        <span className="text-xs text-surface-600">{m.type}</span>
                      </td>
                      <td className="table-cell text-xs text-surface-600">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>
      )}

      {/* 响应格式 */}
      {activeSection === 'response' && (
        <div className="space-y-6">
          <InfoCard icon={BarChart3} title="完整响应示例">
            <CodeBlock code={responseExample} language="json" />
          </InfoCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-medium text-surface-500">智能路由</span>
              </div>
              <p className="text-sm font-semibold text-surface-800">routed_model</p>
              <p className="text-xs text-surface-400 mt-1">
                请求 gpt-4o 可能被路由到 gpt-4o-mini，节省成本同时保持质量
              </p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-surface-500">语义缓存</span>
              </div>
              <p className="text-sm font-semibold text-surface-800">cache_hit</p>
              <p className="text-xs text-surface-400 mt-1">
                相似请求命中缓存时直接返回，成本降为 0
              </p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-surface-500">实时成本</span>
              </div>
              <p className="text-sm font-semibold text-surface-800">estimated_cost</p>
              <p className="text-xs text-surface-400 mt-1">
                每次请求返回精确成本估算，无需手动计算
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 可用模型 */}
      {activeSection === 'models' && (
        <div className="space-y-6">
          <InfoCard icon={Cpu} title="可用模型列表">
            <p className="text-xs text-surface-500 mb-4">
              AnyTokn 支持多种主流大语言模型，通过统一接口访问。模型 ID 可直接用于 <code className="font-mono text-brand-700 bg-brand-50 px-1 rounded">model</code> 参数。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="table-header">模型 ID</th>
                    <th className="table-header">名称</th>
                    <th className="table-header">提供商</th>
                    <th className="table-header">类别</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(m => (
                    <tr key={m.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                      <td className="table-cell">
                        <code className="text-xs font-mono text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                          {m.id}
                        </code>
                      </td>
                      <td className="table-cell text-xs font-medium text-surface-800">{m.name}</td>
                      <td className="table-cell text-xs text-surface-600">{m.provider}</td>
                      <td className="table-cell">
                        <span
                          className={`badge text-[10px] ${
                            m.category === '旗舰'
                              ? 'bg-purple-50 text-purple-700'
                              : m.category === '高级'
                              ? 'bg-blue-50 text-blue-700'
                              : m.category === '轻量'
                              ? 'bg-emerald-50 text-emerald-700'
                              : m.category === '经济'
                              ? 'bg-amber-50 text-amber-700'
                              : m.category === '推理'
                              ? 'bg-violet-50 text-violet-700'
                              : 'bg-surface-100 text-surface-600'
                          }`}
                        >
                          {m.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoCard>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-surface-800">模型选择建议</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                <p className="text-xs font-medium text-purple-800">旗舰模型</p>
                <p className="text-xs text-purple-600 mt-1">适合复杂推理、创意写作、代码生成等高要求场景</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-medium text-emerald-800">轻量模型</p>
                <p className="text-xs text-emerald-600 mt-1">适合简单问答、分类、提取等日常任务，性价比高</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-xs font-medium text-amber-800">经济模型</p>
                <p className="text-xs text-amber-600 mt-1">适合批量处理、日志分析等大规模低复杂度任务</p>
              </div>
              <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
                <p className="text-xs font-medium text-violet-800">推理模型</p>
                <p className="text-xs text-violet-600 mt-1">适合数学证明、逻辑推理等需要深度思考的场景</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
