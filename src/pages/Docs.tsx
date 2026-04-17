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
} from 'lucide-react';
import { API_BASE } from '../config';

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
  const [activeSection, setActiveSection] = useState('quickstart');

  const sections = [
    { id: 'quickstart', label: '快速开始', icon: Zap },
    { id: 'auth', label: '认证方式', icon: Key },
    { id: 'params', label: '请求参数', icon: Code2 },
    { id: 'response', label: '响应格式', icon: BarChart3 },
    { id: 'models', label: '可用模型', icon: Cpu },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">接入指南</h1>
        <p className="text-sm text-surface-500 mt-1">
          AnyTokn 兼容 OpenAI API 格式，零代码改动即可接入
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
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
              onClick={() => setActiveSection(s.id)}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

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
