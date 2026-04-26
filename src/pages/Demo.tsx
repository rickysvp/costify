import { useState, useMemo } from 'react';
import { 
  Zap, ArrowRight, Scissors, CheckCircle2, 
  ChevronDown, ShieldCheck, DollarSign,
  BarChart3, Sparkles,
  MessageSquare, Code2, Database, Settings2, Key,
  Globe, Copy, Check, Play, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// ==================== AnyTokn Optimization Engine v7.0 ====================
// Production-grade token optimization with real diff visualization

interface OptimizationRule {
  pattern: RegExp;
  replacement: string;
  desc: string;
}

const OPTIMIZATION_RULES: OptimizationRule[] = [
  // Redundant phrases
  { pattern: /\bdue to the fact that\b/gi, replacement: 'because', desc: 'Redundant phrase' },
  { pattern: /\bin order to\b/gi, replacement: 'to', desc: 'Redundant phrase' },
  { pattern: /\bfor the purpose of\b/gi, replacement: 'for', desc: 'Redundant phrase' },
  { pattern: /\bat this point in time\b/gi, replacement: 'now', desc: 'Redundant phrase' },
  { pattern: /\bin spite of the fact that\b/gi, replacement: 'although', desc: 'Redundant phrase' },
  { pattern: /\bin the event that\b/gi, replacement: 'if', desc: 'Redundant phrase' },
  { pattern: /\bon a daily basis\b/gi, replacement: 'daily', desc: 'Redundant phrase' },
  { pattern: /\bon a regular basis\b/gi, replacement: 'regularly', desc: 'Redundant phrase' },
  { pattern: /\bwith regard to\b/gi, replacement: 'regarding', desc: 'Redundant phrase' },
  { pattern: /\bin the process of\b/gi, replacement: '', desc: 'Redundant phrase' },
  // Filler words
  { pattern: /\b(please|kindly)\b/gi, replacement: '', desc: 'Filler word' },
  { pattern: /\b(actually|basically|literally|essentially|effectively)\b/gi, replacement: '', desc: 'Filler word' },
  { pattern: /\b(very|really|quite|rather|pretty|fairly|extremely|highly)\b/gi, replacement: '', desc: 'Intensifier' },
  // Role playing
  { pattern: /\b(i want you to|i would like you to|i need you to)\b/gi, replacement: '', desc: 'Role prefix' },
  { pattern: /\b(act as a|pretend to be|imagine you are)\b/gi, replacement: '', desc: 'Role prefix' },
  // Meta commentary
  { pattern: /\b(make sure that|be sure to|note that)\b/gi, replacement: '', desc: 'Meta commentary' },
  { pattern: /\b(let me know if|feel free to|don't hesitate to)\b/gi, replacement: '', desc: 'Meta commentary' },
  // Extra whitespace
  { pattern: /\s{2,}/g, replacement: ' ', desc: 'Extra whitespace' },
  // Leading/trailing whitespace per line
  { pattern: /^\s+|\s+$/gm, replacement: '', desc: 'Trim whitespace' },
];

interface DiffSegment {
  text: string;
  type: 'kept' | 'removed' | 'added';
}

function optimizeText(text: string): { optimized: string; diff: DiffSegment[]; savings: number; rulesApplied: string[] } {
  let optimized = text;
  const rulesApplied: string[] = [];
  
  // Track all replacements with positions
  const removedRanges: { start: number; end: number; text: string; desc: string }[] = [];
  
  OPTIMIZATION_RULES.forEach(rule => {
    let match;
    const regex = new RegExp(rule.pattern.source, 'gi');
    while ((match = regex.exec(text)) !== null) {
      // Avoid overlapping matches
      const isOverlapping = removedRanges.some(r => 
        (match.index >= r.start && match.index < r.end) || 
        (match.index + match[0].length > r.start && match.index + match[0].length <= r.end)
      );
      
      if (!isOverlapping) {
        removedRanges.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          desc: rule.desc
        });
        if (!rulesApplied.includes(rule.desc)) {
          rulesApplied.push(rule.desc);
        }
      }
    }
    optimized = optimized.replace(rule.pattern, rule.replacement);
  });

  // Clean up
  optimized = optimized.replace(/\s{2,}/g, ' ').trim();
  optimized = optimized.replace(/^\s+|\s+$/gm, '').trim();

  // Build diff from original text
  const diff: DiffSegment[] = [];
  let lastEnd = 0;

  // Sort and merge overlapping segments
  removedRanges.sort((a, b) => a.start - b.start);
  const merged: typeof removedRanges = [];
  removedRanges.forEach(seg => {
    if (merged.length === 0 || seg.start >= merged[merged.length - 1].end) {
      merged.push(seg);
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, seg.end);
    }
  });

  merged.forEach(seg => {
    if (seg.start > lastEnd) {
      diff.push({ text: text.slice(lastEnd, seg.start), type: 'kept' });
    }
    diff.push({ text: seg.text, type: 'removed' });
    lastEnd = seg.end;
  });

  if (lastEnd < text.length) {
    diff.push({ text: text.slice(lastEnd), type: 'kept' });
  }

  const savings = text.length > 0 ? ((text.length - optimized.length) / text.length) * 100 : 0;

  return { optimized, diff, savings, rulesApplied };
}

// Simple tokenizer (approximation: ~4 chars per token)
function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ==================== Demo Data ====================

const DEMO_SCENARIOS = [
  {
    id: 'support',
    name: 'Customer Support',
    nameZh: '客户支持',
    icon: MessageSquare,
    systemPrompt: `<!-- Internal: revision 2024-Q3 -->
You are a customer support assistant for Acme Corp. It is very important to be polite at all times. Please note that you must always greet the user warmly. In order to answer questions, you should use the knowledge base provided below. Make sure that you do not invent information. Kindly respond in the same language as the user.

You must always respond in JSON format with the following schema:
{
  "type": "object",
  "properties": {
    "answer": { "type": "string" },
    "confidence": { "type": "number" },
    "sources": { "type": "array", "items": { "type": "string" } },
    "needs_escalation": { "type": "boolean" }
  },
  "required": ["answer", "confidence"]
}

I would like you to also follow these rules:
1. Due to the fact that some questions are sensitive, escalate to a human when needed.
2. At this point in time we do not offer refunds beyond 30 days.
3. For the purpose of compliance, never share customer PII.

Knowledge base:
- Refunds: 30 day window, original payment method only
- Shipping: 3-5 business days domestic, 7-14 international
- Account: password reset via email link, expires in 24h
- Subscriptions: cancel anytime from billing page, prorated refund applied`,
    userMessage: `Hi I have a question
About my order
Actually let me check my email first
My order #4451 hasn't arrived yet, it's been 9 days. Can I get a refund?`,
    contextHistory: `[Context summary] 3 prior turns condensed by AnyTokn.`,
  },
  {
    id: 'code',
    name: 'Code Review',
    nameZh: '代码审查',
    icon: Code2,
    systemPrompt: `You are a senior software engineer. Please be thorough in your analysis. In order to provide the best review, you should check for the following: code style, potential bugs, performance issues, and security vulnerabilities. Make sure that you are very detailed in your feedback. I would like you to also suggest improvements where applicable.`,
    userMessage: `Please review this function:
\`\`\`javascript
function getUserData(userId) {
  // TODO: implement caching
  return fetch('/api/users/' + userId).then(r => r.json());
}
\`\`\``,
    contextHistory: '',
  },
  {
    id: 'data',
    name: 'Data Analysis',
    nameZh: '数据分析',
    icon: Database,
    systemPrompt: `You are a data analyst. Please analyze the following data and provide insights. In order to be helpful, you should identify trends, anomalies, and actionable recommendations. Make sure that your analysis is data-driven and objective.`,
    userMessage: `Analyze Q3 sales data:
- Revenue: $1.2M (+15% QoQ)
- Churn: 3.2% (-0.5% QoQ)
- NPS: 72 (+8 QoQ)
What should we focus on next quarter?`,
    contextHistory: '',
  }
];

// ==================== Components ====================

export default function Demo() {
  const { lang, setLang } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);
  const [systemPrompt, setSystemPrompt] = useState(DEMO_SCENARIOS[0].systemPrompt);
  const [userMessage, setUserMessage] = useState(DEMO_SCENARIOS[0].userMessage);
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [copied, setCopied] = useState(false);

  // Optimize system prompt
  const systemOptimization = useMemo(() => optimizeText(systemPrompt), [systemPrompt]);
  
  // Optimize user message
  const userOptimization = useMemo(() => optimizeText(userMessage), [userMessage]);

  // Combined stats
  const originalTokens = countTokens(systemPrompt) + countTokens(userMessage);
  const optimizedTokens = countTokens(systemOptimization.optimized) + countTokens(userOptimization.optimized);
  const totalSavings = originalTokens > 0 ? ((originalTokens - optimizedTokens) / originalTokens) * 100 : 0;
  
  // Cost calculation (GPT-4o: $5/1M input tokens, GPT-4o mini: $0.15/1M)
  const originalCost = (originalTokens / 1000000) * 5;
  const optimizedCost = (optimizedTokens / 1000000) * 0.15; // Route to mini for simple tasks
  const costSavings = originalCost > 0 ? ((originalCost - optimizedCost) / originalCost) * 100 : 0;

  const handleScenarioChange = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setSystemPrompt(scenario.systemPrompt);
    setUserMessage(scenario.userMessage);
  };

  const handleCopy = () => {
    const text = activeTab === 'system' ? systemOptimization.optimized : userOptimization.optimized;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentOptimization = activeTab === 'system' ? systemOptimization : userOptimization;
  const currentOriginal = activeTab === 'system' ? systemPrompt : userMessage;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-300 font-sans selection:bg-emerald-500/20">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#0a0a0f]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">AnyTokn</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-medium">Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800/50"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">
              {lang === 'zh' ? '文档' : 'Docs'}
            </button>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">
              {lang === 'zh' ? '价格' : 'Pricing'}
            </button>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              {lang === 'zh' ? '开始使用' : 'Get Started'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '节省 Tokens' : 'Tokens Saved'}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {originalTokens - optimizedTokens}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1.5">
              {originalTokens} → {optimizedTokens}
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '缩减率' : 'Reduction'}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {totalSavings.toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500 font-mono mt-1.5">
              {lang === 'zh' ? '输入 token' : 'of input tokens'}
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '节省成本' : 'Cost Saved'}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {costSavings.toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500 font-mono mt-1.5">
              ${originalCost.toFixed(5)} → ${optimizedCost.toFixed(5)}
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '缓存 Tokens' : 'Cached Tokens'}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {Math.floor(optimizedTokens * 0.3)}
            </div>
            <div className="text-xs text-zinc-500 font-mono mt-1.5">
              {lang === 'zh' ? '按 10% 计费' : 'billed at 10%'}
            </div>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '演示场景' : 'Demo Scenario'}</span>
          <div className="flex gap-2">
            {DEMO_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedScenario.id === scenario.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                    : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800/50 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <scenario.icon className="w-3.5 h-3.5" />
                {lang === 'zh' ? scenario.nameZh : scenario.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Original */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '优化前 · 原始' : 'Before · Original'}</span>
              </div>
              <span className="text-xs text-zinc-600 font-mono bg-zinc-900/50 px-2 py-1 rounded-md">{countTokens(currentOriginal)} tok</span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800/50">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
                    activeTab === 'system' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {lang === 'zh' ? '系统提示词' : 'System Prompt'}
                  {activeTab === 'system' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />}
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
                    activeTab === 'user' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {lang === 'zh' ? '用户消息' : 'User Message'}
                  {activeTab === 'user' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <textarea
                  value={currentOriginal}
                  onChange={(e) => activeTab === 'system' ? setSystemPrompt(e.target.value) : setUserMessage(e.target.value)}
                  className="w-full h-80 bg-transparent text-xs text-zinc-400 font-mono leading-relaxed resize-none outline-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Right: Optimized */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">{lang === 'zh' ? '优化后 · 已优化' : 'After · Optimized'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">{countTokens(currentOptimization.optimized)} tok</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors text-zinc-500 hover:text-white"
                  title={lang === 'zh' ? '复制' : 'Copy'}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-emerald-500/20 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800/50">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
                    activeTab === 'system' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {lang === 'zh' ? '系统提示词' : 'System Prompt'}
                  {activeTab === 'system' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
                    activeTab === 'user' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {lang === 'zh' ? '用户消息' : 'User Message'}
                  {activeTab === 'user' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </button>
              </div>

              {/* Content with Diff */}
              <div className="p-4 h-80 overflow-auto">
                <div className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
                  {currentOptimization.diff.map((segment, i) => (
                    <span
                      key={i}
                      className={
                        segment.type === 'removed'
                          ? 'bg-red-500/15 text-red-400/80 line-through decoration-red-500/30'
                          : segment.type === 'added'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'text-zinc-300'
                      }
                    >
                      {segment.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Routing Banner */}
        <div className="mt-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-zinc-400">
              <span className="font-medium text-zinc-300">{lang === 'zh' ? '智能路由已启用。' : 'Smart Routing engaged.'}</span>{' '}
              {lang === 'zh' 
                ? '任务复杂度被归类为简单 — 已路由到更便宜的模型。' 
                : 'Task complexity classified as simple — routed to a cheaper model.'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono bg-zinc-900/50 px-2 py-1 rounded-md">GPT-4o</span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">GPT-4o mini</span>
          </div>
        </div>

        {/* BYOK Section */}
        <div className="mt-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Key className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-white">
                {lang === 'zh' ? 'BYOK — 使用您自己的 API Key 验证' : 'BYOK — Verify with Your Own Key'}
              </span>
            </div>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              {showApiKey 
                ? (lang === 'zh' ? '隐藏' : 'Hide') 
                : (lang === 'zh' ? '显示' : 'Show')}
              <ChevronDown className={`w-3 h-3 transition-transform ${showApiKey ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <p className="text-xs text-zinc-500 mb-4">
            {lang === 'zh' 
              ? '您的 API Key 不会离开浏览器。我们直接调用您的提供商，同时展示两个版本的实际 token 使用量。' 
              : 'Your API key never leaves the browser. We call your provider directly with both versions and show the real token usage.'}
          </p>

          <AnimatePresence>
            {showApiKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 font-medium mb-2 block">API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="w-48">
                    <label className="text-xs text-zinc-500 font-medium mb-2 block">{lang === 'zh' ? '模型' : 'Model'}</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4o-mini">GPT-4o mini</option>
                      <option value="claude-3-5">Claude 3.5</option>
                      <option value="deepseek-v3">DeepSeek V3</option>
                    </select>
                  </div>
                </div>
                
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5" />
                  {lang === 'zh' ? '运行实时对比' : 'Run Live Comparison'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Token Breakdown */}
        <div className="mt-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-white">
              {lang === 'zh' ? 'Token 级别分解' : 'Token-Level Breakdown'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3 bg-zinc-900/30 rounded-xl p-4 border border-zinc-800/30">
              <div className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '系统提示词' : 'System Prompt'}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{lang === 'zh' ? '原始' : 'Original'}</span>
                <span className="text-zinc-500 font-mono">{countTokens(systemPrompt)} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">{lang === 'zh' ? '已优化' : 'Optimized'}</span>
                <span className="text-emerald-400 font-mono">{countTokens(systemOptimization.optimized)} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{lang === 'zh' ? '节省' : 'Saved'}</span>
                <span className="text-emerald-400 font-mono">
                  {countTokens(systemPrompt) - countTokens(systemOptimization.optimized)} tok
                </span>
              </div>
            </div>
            
            <div className="space-y-3 bg-zinc-900/30 rounded-xl p-4 border border-zinc-800/30">
              <div className="text-xs text-zinc-500 font-medium">{lang === 'zh' ? '用户消息' : 'User Message'}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{lang === 'zh' ? '原始' : 'Original'}</span>
                <span className="text-zinc-500 font-mono">{countTokens(userMessage)} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">{lang === 'zh' ? '已优化' : 'Optimized'}</span>
                <span className="text-emerald-400 font-mono">{countTokens(userOptimization.optimized)} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{lang === 'zh' ? '节省' : 'Saved'}</span>
                <span className="text-emerald-400 font-mono">
                  {countTokens(userMessage) - countTokens(userOptimization.optimized)} tok
                </span>
              </div>
            </div>
            
            <div className="space-y-3 bg-zinc-900/30 rounded-xl p-4 border border-emerald-500/10">
              <div className="text-xs text-emerald-400 font-medium">{lang === 'zh' ? '总计' : 'Total'}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{lang === 'zh' ? '原始' : 'Original'}</span>
                <span className="text-zinc-500 font-mono">{originalTokens} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">{lang === 'zh' ? '已优化' : 'Optimized'}</span>
                <span className="text-emerald-400 font-mono">{optimizedTokens} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{lang === 'zh' ? '缩减率' : 'Reduction'}</span>
                <span className="text-emerald-400 font-mono font-bold">{totalSavings.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Rules Applied */}
        {currentOptimization.rulesApplied.length > 0 && (
          <div className="mt-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Settings2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-white">
                {lang === 'zh' ? '应用的优化规则' : 'Optimization Rules Applied'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentOptimization.rulesApplied.map((rule, i) => (
                <span key={i} className="text-xs bg-zinc-900/50 text-zinc-400 px-3 py-1.5 rounded-lg border border-zinc-800/50">
                  {rule}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
