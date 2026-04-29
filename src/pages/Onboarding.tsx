import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Copy,
  Key,
  Globe,
  Zap,
  Cpu,
  BarChart3,
  Code2,
  LayoutDashboard,
  Wallet,
  ArrowRight,
  Terminal,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  Rocket,
  Plus,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Use anytokn.com domain for display
const getDisplayApiBase = () => {
  return 'https://api.anytokn.com';
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

// ---------- Main Component ----------
export default function Onboarding() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isEn = lang === 'en';

  // Onboarding state
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('anytokn_onboarding_step');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [apiRefExpanded, setApiRefExpanded] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSimulatingTest, setIsSimulatingTest] = useState(false);

  // Mock state (to be replaced with real API calls)
  const [hasApiKey, setHasApiKey] = useState(() => localStorage.getItem('anytokn_has_api_key') === 'true');
  const [balance, setBalance] = useState(() => parseFloat(localStorage.getItem('anytokn_balance') || '0'));
  const [apiKeyValue, setApiKeyValue] = useState(() => localStorage.getItem('anytokn_api_key_value') || '');

  // Persistence
  useEffect(() => {
    localStorage.setItem('anytokn_onboarding_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('anytokn_has_api_key', hasApiKey.toString());
  }, [hasApiKey]);

  useEffect(() => {
    localStorage.setItem('anytokn_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('anytokn_api_key_value', apiKeyValue);
  }, [apiKeyValue]);

  // 当完成所有步骤时，标记接入指南已完成
  useEffect(() => {
    if (currentStep === 4) {
      localStorage.setItem('anytokn_onboarding_completed', 'true');
    }
  }, [currentStep]);

  // Steps definition
  const steps: OnboardingStep[] = [
    { id: 'start', title: '开始接入', titleEn: 'Get Started', status: currentStep === 0 ? 'current' : 'done' },
    { id: 'apikey', title: '获取 API Key', titleEn: 'Get API Key', status: hasApiKey ? 'done' : currentStep === 1 ? 'current' : 'todo' },
    { id: 'balance', title: '充值余额', titleEn: 'Recharge Balance', status: balance > 0 ? 'done' : currentStep === 2 ? 'current' : balance > 0 && balance < 10 ? 'warning' : 'todo' },
    { id: 'test', title: '测试请求', titleEn: 'Test Request', status: testCompleted ? 'done' : currentStep === 3 ? 'current' : 'todo' },
    { id: 'result', title: '查看结果', titleEn: 'View Results', status: currentStep === 4 ? 'current' : 'todo' },
  ];

  const completedCount = steps.filter(s => s.status === 'done').length;

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center py-8">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <Rocket className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          {isEn ? 'Welcome to AnyTokn' : '欢迎使用 AnyTokn'}
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">
          {isEn 
            ? 'This is not just documentation—this is your path to integrating AnyTokn. Complete 5 steps to make your first real request.'
            : '这不只是文档——这是你的 AnyTokn 接入路径。完成 5 个步骤，跑通第一个真实请求，开启高效成本管理。'}
        </p>
      </div>

      <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
          {isEn ? 'Journey Map' : '接入路线图'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.slice(1).map((step, idx) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-500 border border-slate-100">
                {idx + 1}
              </div>
              <span className="font-medium text-slate-700">{isEn ? step.titleEn : step.title}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="group relative flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white font-semibold rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          <span>{isEn ? 'Start Onboarding' : '立即开始'}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );

  const renderApiKeyStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 1: Get Your API Key' : '步骤 1：获取你的 API Key'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'API Key is your credential for calling AnyTokn services. Each project can have multiple Keys.'
            : 'API Key 是调用 AnyTokn 服务的凭证。你可以为不同项目创建独立的 Key 以便分类统计成本。'}
        </p>
      </div>

      {!hasApiKey ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6"
          >
            <Key className="w-8 h-8 text-slate-400" />
          </motion.div>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            {isEn ? 'Generate your first API Key to start using AnyTokn.' : '生成你的第一个 API Key，开启智能成本管控之旅。'}
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => navigate('/api-keys')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200"
            >
              <Plus className="w-5 h-5" />
              {isEn ? 'Generate API Key' : '去生成 API Key'}
            </button>
            <button
              onClick={() => {
                setHasApiKey(true);
                setApiKeyValue('sk-anytokn-demo-key-8j2kL9m');
              }}
              className="text-sm text-slate-500 hover:text-emerald-600 font-medium py-2"
            >
              {isEn ? "I've already created one" : "我已创建过 Key"}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-emerald-900 text-lg">
                {isEn ? 'API Key Secured' : 'API Key 已就绪'}
              </span>
              <span className="text-sm text-emerald-600 font-medium opacity-80">
                {isEn ? 'Ready for your first request' : '可以开始发起第一个测试请求了'}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {isEn ? 'Paste your API Key here' : '请粘贴你刚才生成的 API Key'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder={isEn ? 'sk-anytokn-...' : 'sk-anytokn-...'}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pr-10 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {apiKeyValue && (
                <button
                  onClick={() => navigator.clipboard.writeText(apiKeyValue)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  title={isEn ? 'Copy' : '复制'}
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {isEn 
                ? 'Copy the API Key from API Keys page and paste it here'
                : '从 API Keys 页面复制生成的 Key，粘贴到上方输入框'}
            </p>
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-200"
          >
            {isEn ? 'Next: Prepare Balance' : '下一步：准备测试余额'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderBalanceStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 2: Recharge Balance' : '步骤 2：充值余额'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'AnyTokn uses a prepaid model. Recharge a small amount to start your real-world testing.'
            : 'AnyTokn 采用预付费模式。充值少量余额即可开启真实请求测试，体验完整的成本追踪功能。'}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{isEn ? 'Organization Balance' : '组织当前余额'}</span>
          <motion.span 
            key={balance}
            initial={{ scale: 1.2, color: '#059669' }}
            animate={{ scale: 1, color: '#0f172a' }}
            className="text-4xl font-black text-slate-900"
          >
            ${balance.toFixed(2)}
          </motion.span>
        </div>

        {balance === 0 ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              {isEn ? 'Your balance is zero. A recharge is required to unlock real request capabilities.' : '当前余额为 0。充值后可解锁真实模型调用和详细成本报告。'}
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mb-8">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <p className="text-sm text-emerald-800 leading-relaxed">
              {isEn ? 'Balance secured. You are ready to make your first request.' : '余额充足。你可以开始体验 AnyTokn 的极速转发和节省能力。'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setBalance(50)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl border-2 border-slate-200 transition-all hover:border-emerald-500 hover:text-emerald-600"
          >
            <Wallet className="w-5 h-5" />
            {isEn ? 'Recharge $50' : '充值 $50'}
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-xl"
          >
            {isEn ? 'Next: Test' : '下一步：测试请求'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // 系统推荐的测试 Prompts - 复杂问题以测试用量和节省
  const suggestedPrompts = [
    {
      id: 1,
      text: isEn
        ? 'Write a comprehensive technical analysis comparing transformer architectures (GPT, BERT, T5) for enterprise NLP applications. Include performance benchmarks, cost considerations, and specific use case recommendations for each model type. Provide code examples in Python.'
        : '撰写一份全面的技术分析，比较 Transformer 架构（GPT、BERT、T5）在企业级 NLP 应用中的差异。包括性能基准测试、成本考量，以及每种模型类型的具体用例推荐。提供 Python 代码示例。',
      icon: '📊',
      tag: isEn ? 'Complex Analysis' : '复杂分析',
    },
    {
      id: 2,
      text: isEn
        ? 'Design a complete microservices architecture for a high-traffic e-commerce platform handling 100,000+ concurrent users. Include database sharding strategies, caching layers, message queues, load balancing, and auto-scaling configurations. Explain the cost optimization strategies for cloud deployment.'
        : '设计一个完整的微服务架构，用于处理 10 万+ 并发用户的高流量电商平台。包括数据库分片策略、缓存层、消息队列、负载均衡和自动扩缩容配置。解释云部署的成本优化策略。',
      icon: '🏗️',
      tag: isEn ? 'System Design' : '系统设计',
    },
    {
      id: 3,
      text: isEn
        ? 'Create a detailed 12-month product roadmap for an AI-powered customer service platform. Include feature prioritization, technical debt management, team scaling plans, budget allocation across engineering, design, and marketing, plus risk mitigation strategies for each quarter.'
        : '制定一份详细的 12 个月产品路线图，针对 AI 驱动的客服平台。包括功能优先级排序、技术债务管理、团队扩展计划、工程/设计/营销的预算分配，以及每个季度的风险缓解策略。',
      icon: '📅',
      tag: isEn ? 'Product Strategy' : '产品策略',
    },
    {
      id: 4,
      text: isEn
        ? 'Analyze the financial implications of migrating a legacy monolithic application to Kubernetes. Include total cost of ownership comparison over 5 years, infrastructure costs, personnel training expenses, potential downtime costs, and ROI calculations with detailed assumptions and sensitivity analysis.'
        : '分析将遗留单体应用迁移到 Kubernetes 的财务影响。包括 5 年总拥有成本对比、基础设施成本、人员培训费用、潜在停机成本，以及包含详细假设和敏感性分析的投资回报率计算。',
      icon: '💰',
      tag: isEn ? 'Cost Analysis' : '成本分析',
    },
  ];

  const [testPrompt, setTestPrompt] = useState(() => localStorage.getItem('anytokn_test_prompt') || '');

  useEffect(() => {
    localStorage.setItem('anytokn_test_prompt', testPrompt);
  }, [testPrompt]);

  const renderTestStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isEn ? 'Step 3: Test Your First Request' : '步骤 3：测试你的第一个请求'}
        </h2>
        <p className="text-slate-600">
          {isEn 
            ? 'Enter a prompt below or choose from our suggestions, then run the test to see AnyTokn in action.'
            : '在下方输入你的问题，或选择系统推荐的测试 Prompt，然后运行测试体验 AnyTokn 的极速响应。'}
        </p>
      </div>

      {balance === 0 && (
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            {isEn ? 'Insufficient balance. Please recharge first.' : '余额不足。请先充值以解锁测试。'}
          </span>
          <button
            onClick={() => setCurrentStep(2)}
            className="ml-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all"
          >
            {isEn ? 'Go Recharge' : '去充值'}
          </button>
        </div>
      )}

      {/* Prompt 输入区域 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {isEn ? 'Your Prompt' : '输入你的问题'}
        </label>
        <textarea
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder={isEn ? 'Type your question here...' : '在这里输入你想问的问题...'}
          rows={4}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          disabled={isSimulatingTest || testCompleted}
        />
        
        {/* 推荐 Prompts */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-3">
            {isEn ? 'Choose a complex test case to see cost savings in action:' : '选择复杂测试用例，体验用量和节省效果：'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setTestPrompt(prompt.text)}
                disabled={isSimulatingTest || testCompleted}
                className="flex flex-col items-start gap-2 p-4 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{prompt.icon}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {prompt.tag}
                  </span>
                </div>
                <span className="text-xs text-slate-600 group-hover:text-emerald-700 line-clamp-3 leading-relaxed">
                  {prompt.text}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <span>💡</span>
                  <span>{isEn ? 'High token usage' : '高 Token 用量'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 运行按钮 */}
        <button
          onClick={() => {
            setIsSimulatingTest(true);
            setTimeout(() => {
              setIsSimulatingTest(false);
              setTestCompleted(true);
            }, 2500);
          }}
          disabled={balance === 0 || !testPrompt.trim() || isSimulatingTest || testCompleted}
          className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {isSimulatingTest ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isEn ? 'Running...' : '运行中...'}
            </>
          ) : testCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {isEn ? 'Completed' : '已完成'}
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              {isEn ? 'Run Test' : '运行测试'}
            </>
          )}
        </button>
      </div>

      {/* 测试结果展示 */}
      {(isSimulatingTest || testCompleted) && (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
          
          {isSimulatingTest ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-emerald-400 font-mono text-sm uppercase tracking-widest">{isEn ? 'Processing Request...' : '正在处理请求...'}</span>
              </div>
              <div className="space-y-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-1 bg-emerald-500/30 rounded-full overflow-hidden"
                >
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="h-full w-1/3 bg-emerald-400 shadow-[0_0_10px_#34d399]"
                  />
                </motion.div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>CONNECTING...</span>
                  <span>SENDING PAYLOAD...</span>
                  <span>RECEIVING...</span>
                </div>
              </div>
              <div className="mt-8 bg-black/40 rounded-lg p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Request Payload</span>
                  <span className="text-[10px] text-emerald-400 font-mono">~{Math.round(testPrompt.length * 1.5)} tokens</span>
                </div>
                <pre className="text-[10px] text-slate-400 font-mono">
                  {`> POST /v1/chat/completions HTTP/1.1\n> Host: api.anytokn.com\n> Authorization: Bearer sk-anytokn-***\n> Content-Type: application/json\n\n{ "model": "gpt-3.5-turbo", "messages": [{"role":"user","content":"${testPrompt.slice(0, 50)}${testPrompt.length > 50 ? '...' : ''}"}] }`}
                </pre>
              </div>
            </div>
          ) : testCompleted ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{isEn ? 'Success: 200 OK' : '请求成功: 200 OK'}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Latency: 124ms</span>
              </div>
              
              {/* 用量统计 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">{isEn ? 'Input Tokens' : '输入 Token'}</p>
                  <p className="text-lg font-bold text-emerald-300">{Math.round(testPrompt.length * 1.5)}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">{isEn ? 'Output Tokens' : '输出 Token'}</p>
                  <p className="text-lg font-bold text-blue-300">1,247</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">{isEn ? 'Total Cost' : '总成本'}</p>
                  <p className="text-lg font-bold text-purple-300">$0.042</p>
                </div>
              </div>

              {/* 显示用户的 Prompt */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">{isEn ? 'Your Prompt:' : '你的问题：'}</p>
                <p className="text-sm text-slate-200 line-clamp-4">{testPrompt}</p>
              </div>

              {/* 成本节省展示 */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">{isEn ? 'Cost Saved with AnyTokn' : '使用 AnyTokn 节省'}</p>
                    <p className="text-2xl font-black text-emerald-300">$0.018 <span className="text-sm font-normal text-emerald-400/70">(42.9%)</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">{isEn ? 'Original Cost' : '原始成本'}</p>
                    <p className="text-sm text-slate-500 line-through">$0.060</p>
                    <p className="text-[10px] text-emerald-400 mt-1">{isEn ? 'Cache Hit: 35%' : '缓存命中: 35%'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-4 overflow-x-auto border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{isEn ? 'Response Preview' : '响应预览'}</p>
                <pre className="text-xs text-emerald-300 font-mono leading-relaxed">
                  {responseExample}
                </pre>
              </div>
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-900 font-black rounded-xl transition-all hover:bg-slate-100"
              >
                {isEn ? 'Analyze Cost Data' : '查看成本分析'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : null}
        </div>
      )}

      {/* 成本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">{isEn ? 'Model' : '测试模型'}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">GPT-3.5 Turbo</span>
            <span className="text-xs text-slate-400">{isEn ? 'Fast & Cost-effective' : '快速且经济'}</span>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">{isEn ? 'Estimated Savings' : '预计节省'}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-600">35.2%</span>
            <span className="text-[10px] text-slate-400 font-medium">via AnyTokn Cache</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderResultStep = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="text-center py-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          {isEn ? 'Welcome Aboard!' : '接入圆满成功！'}
        </h2>
        <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
          {isEn 
            ? "You've successfully unlocked AnyTokn's powerful analytics. Your integration is live and ready for production."
            : '恭喜！你已经打通了 AnyTokn 的所有核心环节。现在可以开始全方位监控、优化并节省你的模型使用成本了。'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: LayoutDashboard, label: isEn ? 'Dashboard' : '总览面板', color: 'blue', path: '/dashboard', desc: isEn ? 'Usage Overview' : '查看整体概况' },
          { icon: BarChart3, label: isEn ? 'Reports' : '深度报告', color: 'rose', path: '/reports', desc: isEn ? 'Cost Analysis' : '分析成本节省' },
          { icon: Wallet, label: isEn ? 'Billing' : '财务结算', color: 'emerald', path: '/billing', desc: isEn ? 'Manage Funds' : '管理账户资金' },
        ].map((item) => (
          <motion.div 
            key={item.path}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-7 h-7 text-${item.color}-600`} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="relative">
          <h4 className="text-xl font-bold text-white mb-2">{isEn ? 'Ready for production?' : '准备好正式投入使用了吗？'}</h4>
          <p className="text-slate-400 text-sm">{isEn ? 'Apply your API keys to your apps and start saving.' : '现在就将 API Key 集成到你的应用中，立享成本节省。'}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20 whitespace-nowrap"
        >
          {isEn ? 'Go to Dashboard' : '前往数据总览'}
        </button>
      </div>
    </motion.div>
  );

  // Integration Guides Section
  const renderApiReference = () => (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <button
        onClick={() => setApiRefExpanded(!apiRefExpanded)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">
            {isEn ? 'Integration Guides' : '集成指南'}
          </span>
          <span className="text-sm text-slate-500">
            {isEn ? '(Click to expand)' : '(点击展开)'}
          </span>
        </div>
        {apiRefExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {apiRefExpanded && (
        <div className="space-y-6 pb-8">
          {/* OpenClaw */}
          <section className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">OpenClaw</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {isEn 
                ? 'Replace the base URL and API key in your OpenClaw configuration:'
                : '在 OpenClaw 配置中替换 Base URL 和 API Key：'}
            </p>
            <div className="bg-slate-900 rounded-lg p-3">
              <code className="text-xs text-slate-300 font-mono block">
                {isEn ? '# OpenClaw Config' : '# OpenClaw 配置'}<br/>
                base_url: {DISPLAY_API_BASE}/v1<br/>
                api_key: {apiKeyValue || 'your-api-key'}
              </code>
            </div>
          </section>

          {/* Hermes */}
          <section className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">Hermes</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {isEn 
                ? 'Update your Hermes workflow node with these settings:'
                : '在 Hermes 工作流节点中更新以下设置：'}
            </p>
            <div className="bg-slate-900 rounded-lg p-3">
              <code className="text-xs text-slate-300 font-mono block">
                {isEn ? '# Hermes LLM Node' : '# Hermes LLM 节点'}<br/>
                Provider: OpenAI Compatible<br/>
                Base URL: {DISPLAY_API_BASE}/v1<br/>
                Model: gpt-3.5-turbo
              </code>
            </div>
          </section>

          {/* n8n */}
          <section className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">n8n</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {isEn 
                ? 'Use HTTP Request node or OpenAI node with custom base URL:'
                : '使用 HTTP Request 节点或 OpenAI 节点并设置自定义 Base URL：'}
            </p>
            <div className="bg-slate-900 rounded-lg p-3">
              <code className="text-xs text-slate-300 font-mono block">
                {isEn ? '# n8n OpenAI Node' : '# n8n OpenAI 节点'}<br/>
                Base URL: {DISPLAY_API_BASE}/v1<br/>
                API Key: {apiKeyValue || 'your-api-key'}
              </code>
            </div>
          </section>

          {/* Make/Zapier */}
          <section className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">Make / Zapier</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {isEn 
                ? 'Use HTTP module with these headers:'
                : '使用 HTTP 模块并设置以下请求头：'}
            </p>
            <div className="bg-slate-900 rounded-lg p-3">
              <code className="text-xs text-slate-300 font-mono block">
                URL: {DISPLAY_API_BASE}/v1/chat/completions<br/>
                Method: POST<br/>
                Headers: Authorization: Bearer {apiKeyValue || 'your-api-key'}
              </code>
            </div>
          </section>

          {/* Python/Node.js */}
          <section className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">
                {isEn ? 'Custom Code (Python/Node.js)' : '自定义代码 (Python/Node.js)'}
              </h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {isEn 
                ? 'Just change the base URL when initializing the OpenAI client:'
                : '初始化 OpenAI 客户端时只需修改 base_url：'}
            </p>
            <div className="bg-slate-900 rounded-lg p-3">
              <code className="text-xs text-slate-300 font-mono block">
                {isEn ? '# Python' : '# Python'}<br/>
                client = OpenAI(<br/>
                &nbsp;&nbsp;base_url="{DISPLAY_API_BASE}/v1",<br/>
                &nbsp;&nbsp;api_key="{apiKeyValue || 'your-api-key'}"<br/>
                )
              </code>
            </div>
          </section>

          {/* Need Help */}
          <section className="text-center pt-4">
            <p className="text-sm text-slate-600 mb-3">
              {isEn ? 'Need help with other tools?' : '需要其他工具的帮助？'}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              {isEn ? 'Contact Support →' : '联系客服 →'}
            </button>
          </section>
        </div>
      )}
    </div>
  );

  // Step status icon
  const StepIcon = ({ status }: { status: StepStatus }) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'current':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Circle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </motion.div>
        );
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400/50" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-600" />
                {isEn ? 'Onboarding Guide' : '接入引导中心'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn 
                  ? `Complete ${completedCount} of 4 tasks to unlock full features`
                  : `当前已完成 ${completedCount}/4 项任务，即将开启高效之旅`}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  localStorage.removeItem('anytokn_onboarding_step');
                  localStorage.removeItem('anytokn_has_api_key');
                  localStorage.removeItem('anytokn_balance');
                  localStorage.removeItem('anytokn_api_key_value');
                  window.location.reload();
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
              >
                {isEn ? 'Reset Progress' : '重置进度'}
              </button>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">{Math.round((completedCount / 4) * 100)}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{isEn ? 'Completed' : '已完成'}</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                <svg className="w-full h-full -rotate-90 absolute inset-0">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-emerald-500 transition-all duration-1000"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * (completedCount / 4))}
                  />
                </svg>
                <span className="text-xs font-black text-slate-900">{completedCount}</span>
              </div>
            </div>
          </div>
          {/* Progress bar line (Optional) */}
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 4) * 100}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Steps */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-24 shadow-sm">
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                {isEn ? 'Onboarding Flow' : '任务清单'}
              </h3>
              <div className="space-y-1">
                {steps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      currentStep === idx
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      currentStep === idx ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                      <StepIcon status={step.status} />
                    </div>
                    <span className="flex-1 text-sm font-semibold">{isEn ? step.titleEn : step.title}</span>
                    {step.status === 'done' && (
                      <Check className={`w-4 h-4 ${currentStep === idx ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Navigation Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setApiRefExpanded(!apiRefExpanded)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="flex-1 uppercase tracking-widest">{isEn ? 'Guides' : '集成手册'}</span>
                  {apiRefExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm min-h-[600px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  {currentStep === 0 && renderStartStep()}
                  {currentStep === 1 && renderApiKeyStep()}
                  {currentStep === 2 && renderBalanceStep()}
                  {currentStep === 3 && renderTestStep()}
                  {currentStep === 4 && renderResultStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* API Reference */}
            {renderApiReference()}
          </div>
        </div>
      </div>
    </div>
  );
}
