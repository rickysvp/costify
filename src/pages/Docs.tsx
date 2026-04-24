import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Copy,
  ChevronRight,
  Key,
  Globe,
  Zap,
  Cpu,
  BarChart3,
  Shield,
  Code2,
  LayoutDashboard,
  Users,
  Wallet,
  ArrowRight,
  Building2,
  Terminal,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Play,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import { API_BASE } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

// Compute a displayable API base URL
const getDisplayApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001/api';
  if (API_BASE.startsWith('http')) return API_BASE;
  return window.location.origin + API_BASE;
};

const DISPLAY_API_BASE = getDisplayApiBase();

// ---------- Types ----------
type StepStatus = 'todo' | 'current' | 'done' | 'warning';

interface OnboardingStep {
  id: string;
  title: string;
  titleEn: string;
  status: StepStatus;
}

// ---------- Code Block Component ----------
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{language}</span>
        <button
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-slate-900 rounded-b-lg p-4 overflow-x-auto">
        <code className="text-xs leading-relaxed text-slate-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ---------- Main Component ----------
export default function Docs() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isEn = lang === 'en';

  // Onboarding state
  const [currentStep, setCurrentStep] = useState(0);
  const [apiRefExpanded, setApiRefExpanded] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'js' | 'python'>('curl');

  // Mock state (to be replaced with real API calls)
  const [hasProject, setHasProject] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [balance, setBalance] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');

  // Steps definition
  const steps: OnboardingStep[] = [
    { id: 'start', title: '开始接入', titleEn: 'Get Started', status: currentStep === 0 ? 'current' : 'done' },
    { id: 'project', title: '创建项目', titleEn: 'Create Project', status: hasProject ? 'done' : currentStep === 1 ? 'current' : 'todo' },
    { id: 'apikey', title: '获取 API Key', titleEn: 'Get API Key', status: hasApiKey ? 'done' : currentStep === 2 ? 'current' : 'todo' },
    { id: 'balance', title: '准备测试余额', titleEn: 'Prepare Balance', status: balance > 0 ? 'done' : currentStep === 3 ? 'current' : balance > 0 && balance < 10 ? 'warning' : 'todo' },
    { id: 'test', title: '测试请求', titleEn: 'Test Request', status: testCompleted ? 'done' : currentStep === 4 ? 'current' : 'todo' },
    { id: 'result', title: '查看结果', titleEn: 'View Results', status: currentStep === 5 ? 'current' : 'todo' },
  ];

  const completedCount = steps.filter(s => s.status === 'done').length;

  // Code examples
  const codeExamples = {
    curl: `curl ${DISPLAY_API_BASE}/v1/chat/completions \\
  -H "Authorization: Bearer ${apiKeyValue || 'your-api-key'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello, AnyTokn!"}]
  }'`,
    js: `const response = await fetch('${DISPLAY_API_BASE}/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKeyValue || 'your-api-key'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello, AnyTokn!' }]
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

response = requests.post(
    '${DISPLAY_API_BASE}/v1/chat/completions',
    headers={
        'Authorization': 'Bearer ${apiKeyValue or "your-api-key"}',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'user', 'content': 'Hello, AnyTokn!'}]
    }
)

data = response.json()
print(data)`,
  };

  const responseExample = `{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! I'm ready to help you with AnyTokn."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}`;

  // Step renderers
  const renderStartStep = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          {isEn ? 'Welcome to AnyTokn' : '欢迎使用 AnyTokn'}
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          {isEn 
            ? 'This is not just documentation—this is your path to integrating AnyTokn. Complete 5 steps to make your first real request and see your first cost data.'
            : '这不只是文档——这是你的 AnyTokn 接入路径。完成 5 个步骤，跑通第一个真实请求，看到第一份成本数据。'}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          {isEn ? 'What you will accomplish:' : '你将完成：'}
        </h3>
        <div className="space-y-3">
          {steps.slice(1).map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                {idx + 1}
              </div>
              <span className="text-sm text-slate-700">{isEn ? step.titleEn : step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
        >
          {isEn ? 'Start Onboarding' : '开始接入'}
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setApiRefExpanded(true)}
          className="px-6 py-3 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
        >
          {isEn ? 'View API Reference' : '查看 API Reference'}
        </button>
      </div>
    </div>
  );

  const renderProjectStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 1: Create Your First Project' : '步骤 1：创建你的第一个项目'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'Projects are the basic unit of resource management in AnyTokn. Each project has independent API Keys, budgets, and usage tracking.'
            : '项目是 AnyTokn 中资源管理的基本单位。每个项目拥有独立的 API Key、预算和用量追踪。'}
        </p>
      </div>

      {!hasProject ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">
            {isEn ? 'You haven\'t created any projects yet.' : '你还没有创建任何项目。'}
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all mx-auto"
          >
            <Building2 className="w-4 h-4" />
            {isEn ? 'Go Create Project' : '去创建项目'}
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-emerald-900">
              {isEn ? 'Project Created' : '项目已创建'}
            </span>
          </div>
          <p className="text-emerald-800 mb-4">{projectName || (isEn ? 'My First Project' : '我的第一个项目')}</p>
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            {isEn ? 'Continue to Get API Key' : '继续获取 API Key'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const renderApiKeyStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 2: Get Your API Key' : '步骤 2：获取你的 API Key'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'API Key is your credential for calling AnyTokn services. Each project can have multiple Keys with independent budgets and permissions.'
            : 'API Key 是调用 AnyTokn 服务的凭证。每个项目可以创建多个 Key，支持独立设置预算和权限。'}
        </p>
      </div>

      {!hasApiKey ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">
            {isEn ? 'Generate your first API Key to start using AnyTokn.' : '生成你的第一个 API Key 开始使用 AnyTokn。'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/api-keys')}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
            >
              <Key className="w-4 h-4" />
              {isEn ? 'Generate API Key' : '去生成 API Key'}
            </button>
            <button
              onClick={() => setApiRefExpanded(true)}
              className="px-6 py-3 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              {isEn ? 'View Auth Docs' : '查看认证说明'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-emerald-900">
              {isEn ? 'API Key Created' : 'API Key 已创建'}
            </span>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 mb-4">
            <code className="text-xs text-slate-300 font-mono">
              {apiKeyValue || 'sk-xxxxxxxxxxxx'}
            </code>
          </div>
          <button
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            {isEn ? 'Continue to Prepare Balance' : '继续准备测试余额'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const renderBalanceStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 3: Prepare Test Balance' : '步骤 3：准备测试余额'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'You\'ve completed project and API Key setup. Now just prepare a small amount of test balance to make real requests and record cost data.'
            : '你已经完成项目和 API Key 配置。现在只需要准备少量测试余额，就可以发起真实请求并记录成本数据。'}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-600">{isEn ? 'Current Balance' : '当前余额'}</span>
          <span className="text-2xl font-bold text-slate-900">${balance.toFixed(2)}</span>
        </div>

        {balance === 0 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              {isEn ? 'Balance is empty. Recharge to unlock real request testing.' : '余额为空。充值后可解锁真实请求测试。'}
            </span>
          </div>
        )}

        {balance > 0 && balance < 10 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              {isEn ? 'Low balance. Consider recharging for more tests.' : '余额较低。建议充值以进行更多测试。'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/billing')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            <Wallet className="w-4 h-4" />
            {isEn ? 'Go to Recharge' : '去充值'}
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="px-6 py-3 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
          >
            {isEn ? 'Skip for now' : '稍后再说'}
          </button>
        </div>
      </div>

      {balance > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-emerald-900">
              {isEn ? 'Balance Ready' : '余额已准备'}
            </span>
          </div>
          <button
            onClick={() => setCurrentStep(4)}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            {isEn ? 'Continue to Test Request' : '继续测试请求'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const renderTestStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 4: Test Your First Request' : '步骤 4：测试你的第一个请求'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'Copy the code below and run it in your terminal or application. A successful response means your integration is working.'
            : '复制下面的代码，在终端或应用中运行。成功收到响应意味着你的接入已正常工作。'}
        </p>
      </div>

      {balance === 0 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-4">
          <AlertCircle className="w-5 h-5" />
          <span>
            {isEn ? 'Insufficient balance. Recharge first to make real requests.' : '余额不足。请先充值以发起真实请求。'}
          </span>
          <button
            onClick={() => setCurrentStep(3)}
            className="ml-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all"
          >
            {isEn ? 'Go Recharge' : '去充值'}
          </button>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">Base URL</span>
          <code className="text-xs text-slate-300 font-mono">{DISPLAY_API_BASE}/v1</code>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          {(['curl', 'js', 'python'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setCodeLang(lang)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                codeLang === lang
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'curl' ? 'cURL' : lang === 'js' ? 'JavaScript' : 'Python'}
            </button>
          ))}
        </div>
        <CodeBlock code={codeExamples[codeLang]} language={codeLang === 'curl' ? 'bash' : codeLang} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-800 mb-2">
          {isEn ? 'Expected Response' : '预期响应'}
        </h3>
        <CodeBlock code={responseExample} language="json" />
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-emerald-900 mb-2">
          {isEn ? 'Success Criteria' : '成功判定'}
        </h3>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>✓ {isEn ? 'HTTP 200 status code' : 'HTTP 200 状态码'}</li>
          <li>✓ {isEn ? 'Response contains "choices" array' : '响应包含 "choices" 数组'}</li>
          <li>✓ {isEn ? 'Usage data shows token consumption' : 'Usage 数据显示 token 消耗'}</li>
        </ul>
      </div>

      <button
        onClick={() => {
          setTestCompleted(true);
          setCurrentStep(5);
        }}
        disabled={balance === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all"
      >
        <Check className="w-4 h-4" />
        {isEn ? 'I\'ve Successfully Tested' : '我已跑通测试请求'}
      </button>
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isEn ? 'Congratulations!' : '恭喜！'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'You\'ve completed the onboarding. Now you can view your first call, cost, or savings data.'
            : '你已完成接入引导。现在可以查看你的第一份调用、成本或节省数据。'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors cursor-pointer"
             onClick={() => navigate('/dashboard')}>
          <LayoutDashboard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">Dashboard</h3>
          <p className="text-xs text-slate-500">
            {isEn ? 'View overview' : '查看总览'}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors cursor-pointer"
             onClick={() => navigate('/reports')}>
          <BarChart3 className="w-8 h-8 text-rose-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">Reports</h3>
          <p className="text-xs text-slate-500">
            {isEn ? 'View reports' : '查看报告'}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors cursor-pointer"
             onClick={() => navigate('/billing')}>
          <Wallet className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">Billing</h3>
          <p className="text-xs text-slate-500">
            {isEn ? 'Manage balance' : '管理余额'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          {isEn ? 'Go to Dashboard' : '前往 Dashboard'}
        </button>
        <button
          onClick={() => navigate('/reports')}
          className="px-6 py-3 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
        >
          {isEn ? 'View Reports' : '查看 Reports'}
        </button>
      </div>
    </div>
  );

  // API Reference Section
  const renderApiReference = () => (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <button
        onClick={() => setApiRefExpanded(!apiRefExpanded)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">
            {isEn ? 'API Reference' : 'API Reference'}
          </span>
          <span className="text-sm text-slate-500">
            {isEn ? '(Click to expand)' : '(点击展开)'}
          </span>
        </div>
        {apiRefExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {apiRefExpanded && (
        <div className="space-y-8 pb-8">
          {/* Auth */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {isEn ? 'Authentication' : '认证方式'}
            </h3>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-3">
                {isEn ? 'All API requests require Bearer token authentication in the header:' : '所有 API 请求需要在 Header 中携带 Bearer Token 认证：'}
              </p>
              <CodeBlock code={`Authorization: Bearer your-api-key`} language="http" />
            </div>
          </section>

          {/* Models */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {isEn ? 'Available Models' : '可用模型'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'gpt-4', name: 'GPT-4', desc: isEn ? 'Most capable' : '最强能力' },
                { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: isEn ? 'Fast & capable' : '快速且强大' },
                { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: isEn ? 'Cost effective' : '性价比' },
                { id: 'claude-3-opus', name: 'Claude 3 Opus', desc: isEn ? 'Anthropic best' : 'Anthropic 最强' },
              ].map((model) => (
                <div key={model.id} className="bg-slate-50 rounded-lg p-3">
                  <p className="font-medium text-slate-900 text-sm">{model.name}</p>
                  <p className="text-xs text-slate-500">{model.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Request Params */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {isEn ? 'Request Parameters' : '请求参数'}
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-slate-600 font-medium">{isEn ? 'Param' : '参数'}</th>
                    <th className="text-left py-2 text-slate-600 font-medium">{isEn ? 'Type' : '类型'}</th>
                    <th className="text-left py-2 text-slate-600 font-medium">{isEn ? 'Required' : '必填'}</th>
                    <th className="text-left py-2 text-slate-600 font-medium">{isEn ? 'Description' : '说明'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-mono text-xs">model</td>
                    <td className="py-2">string</td>
                    <td className="py-2">{isEn ? 'Yes' : '是'}</td>
                    <td className="py-2">{isEn ? 'Model ID' : '模型 ID'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-mono text-xs">messages</td>
                    <td className="py-2">array</td>
                    <td className="py-2">{isEn ? 'Yes' : '是'}</td>
                    <td className="py-2">{isEn ? 'Conversation messages' : '对话消息'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">temperature</td>
                    <td className="py-2">number</td>
                    <td className="py-2">{isEn ? 'No' : '否'}</td>
                    <td className="py-2">{isEn ? 'Randomness (0-2)' : '随机性 (0-2)'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );

  // Step status icon
  const StepIcon = ({ status }: { status: StepStatus }) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'current':
        return <Circle className="w-5 h-5 text-emerald-600 fill-emerald-100" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEn ? 'Start with AnyTokn' : '开始接入 AnyTokn'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {isEn 
                  ? `Complete ${completedCount} of 5 steps to make your first request and see cost data`
                  : `完成 ${completedCount}/5 个步骤，跑通第一个真实请求，看到第一份成本数据`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">{completedCount}<span className="text-slate-400 text-lg">/5</span></div>
              <div className="text-xs text-slate-500">{isEn ? 'Completed' : '已完成'}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Steps */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                {isEn ? 'Onboarding Steps' : '接入步骤'}
              </h3>
              <div className="space-y-1">
                {steps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                      currentStep === idx
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <StepIcon status={step.status} />
                    <span className="flex-1">{isEn ? step.titleEn : step.title}</span>
                    {step.status === 'done' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>

              {/* API Reference Link */}
              <button
                onClick={() => setApiRefExpanded(!apiRefExpanded)}
                className="w-full flex items-center gap-3 px-3 py-2.5 mt-4 pt-4 border-t border-slate-100 text-left text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="flex-1">API Reference</span>
                {apiRefExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              {currentStep === 0 && renderStartStep()}
              {currentStep === 1 && renderProjectStep()}
              {currentStep === 2 && renderApiKeyStep()}
              {currentStep === 3 && renderBalanceStep()}
              {currentStep === 4 && renderTestStep()}
              {currentStep === 5 && renderResultStep()}
            </div>

            {/* API Reference */}
            {renderApiReference()}
          </div>
        </div>
      </div>
    </div>
  );
}
