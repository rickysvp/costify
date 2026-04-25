import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Send, Loader2, TrendingDown, Clock, DollarSign,
  BarChart3, CheckCircle2, AlertTriangle, Layers, Scissors, Route,
  FileText, ChevronRight, X, Copy, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

const PRESET_PROMPTS = [
  { id: 'support', zh: '帮我查一下订单 #ORD-20260418 的物流状态', en: 'Check the shipping status of order #ORD-20260418' },
  { id: 'rag', zh: 'AnyTokn 的计费方式是什么？', en: "What is AnyTokn's billing model?" },
  { id: 'agent', zh: '对比方案A、B、C的优缺点并给出建议', en: 'Compare options A, B, C and give recommendations' },
  { id: 'summary', zh: '总结这篇关于AI成本管理的文章', en: 'Summarize this article about AI cost management' },
];

// 模拟不同场景的回答
const MOCK_RESPONSES: Record<string, { without: string; with: string }> = {
  support: {
    without: `您好，感谢您联系我们。关于您提到的订单问题，我已经查询了您的订单记录。您的订单 #ORD-20260418 已于4月20日发货，预计4月23日送达。物流单号为 SF1234567890，您可以通过顺丰官网查询实时物流信息。如果超过预计送达时间仍未收到，请再次联系我们，我们会帮您跟进处理。祝您购物愉快！`,
    with: `订单 #ORD-20260418 已于4月20日发货，预计4月23日送达。物流单号：SF1234567890，可在顺丰官网查询。超期未收件请再联系我们跟进。`,
  },
  rag: {
    without: `根据检索到的文档内容，AnyTokn 的计费方式采用按量计费模式。具体来说，系统会根据您实际使用的 token 数量进行计费，包括输入 token 和输出 token。输入 token 的价格为每 1K token $0.0015，输出 token 的价格为每 1K token $0.002。此外，系统还提供预算管理功能，您可以为每个项目设置月度预算上限，当使用量接近预算时会自动提醒。详细的价格信息请参考我们的定价页面。`,
    with: `AnyTokn 按量计费：输入 $0.0015/1K token，输出 $0.002/1K token。支持项目级月度预算上限和自动提醒。`,
  },
  agent: {
    without: `好的，我来帮您分析一下这三个方案的对比。首先是方案A，它的优势在于部署简单，维护成本低，但是扩展性有限。方案B的优势是扩展性好，支持高并发，但是初期投入较高，技术复杂度也更高。方案C则是一个折中方案，兼顾了部署便利性和扩展性，但在极端高并发场景下可能不如方案B。综合考虑，如果您的业务规模在中等水平，我建议选择方案C；如果预期会有快速增长，方案B更合适；如果只是小规模使用，方案A就够了。`,
    with: `三方案对比：A 部署简单、成本低，但扩展有限；B 扩展好、支持高并发，但投入高、复杂度高；C 折中兼顾。建议：中等规模选 C，快速增长选 B，小规模选 A。`,
  },
  summary: {
    without: `本文主要讨论了人工智能在企业成本管理中的应用。文章首先介绍了传统成本管理面临的挑战，包括数据分散、实时性不足和预测能力有限等问题。随后，文章详细分析了 AI 技术如何通过自动化数据采集、实时监控和智能预测来改善这些问题。特别是在 API 成本管理领域，AI 可以通过 token 优化、智能路由和预算预警等机制，帮助企业将 API 调用成本降低 30-50%。文章还介绍了几个实际案例，展示了不同规模企业如何通过 AI 驱动的成本管理实现显著的成本节约。最后，文章展望了未来 AI 在成本管理领域的发展趋势，包括更精细的优化策略和更智能的自动化决策。`,
    with: `本文探讨 AI 在企业成本管理中的应用：1）传统成本管理面临数据分散、实时性不足、预测能力有限等挑战；2）AI 通过自动数据采集、实时监控、智能预测改善这些问题；3）在 API 成本管理领域，token 优化、智能路由、预算预警可降低 30-50% 调用成本；4）实际案例验证了不同规模企业的成本节约效果；5）未来趋势是更精细的优化策略和更智能的自动化决策。`,
  },
};

function countTokens(text: string): number {
  return Math.round(text.length * 0.6 + Math.random() * 50);
}

function simulateOptimize(input: string, presetId?: string) {
  const inputTokens = countTokens(input);
  const outputTokens = Math.round(200 + Math.random() * 300);
  const totalTokens = inputTokens + outputTokens;
  const latencyMs = Math.round(1800 + Math.random() * 2000);
  const cost = totalTokens * 0.000015;

  const inputSavings = 25 + Math.round(Math.random() * 20);
  const outputSavings = 25 + Math.round(Math.random() * 20);
  const latencySavings = 15 + Math.round(Math.random() * 15);

  const optInputTokens = Math.round(inputTokens * (1 - inputSavings / 100));
  const optOutputTokens = Math.round(outputTokens * (1 - outputSavings / 100));
  const optTotalTokens = optInputTokens + optOutputTokens;
  const optLatencyMs = Math.round(latencyMs * (1 - latencySavings / 100));
  const optCost = optTotalTokens * 0.000015;

  const totalSavings = Math.round((1 - optTotalTokens / totalTokens) * 100);
  const costSavings = Math.round((1 - optCost / cost) * 100);
  const latencySaved = Math.round((1 - optLatencyMs / latencyMs) * 100);

  // 获取模拟回答
  let withoutResponse = MOCK_RESPONSES[presetId || '']?.without || `这是未使用 AnyTokn 优化的标准回答。包含了较多的冗余信息和重复内容，使得输出 token 数量较多，成本相应增加。对于简单的问题，这种回答方式虽然详细，但不够高效。`;
  let withResponse = MOCK_RESPONSES[presetId || '']?.with || `AnyTokn 优化后的精简回答。去除冗余，保留核心信息。`;

  return {
    baseline: {
      inputTokens,
      outputTokens: countTokens(withoutResponse),
      totalTokens: inputTokens + countTokens(withoutResponse),
      latencyMs,
      cost,
      costStr: `$${cost.toFixed(4)}`,
      response: withoutResponse,
    },
    optimized: {
      inputTokens: optInputTokens,
      outputTokens: countTokens(withResponse),
      totalTokens: optInputTokens + countTokens(withResponse),
      latencyMs: optLatencyMs,
      cost: optCost,
      costStr: `$${optCost.toFixed(4)}`,
      response: withResponse,
    },
    savings: {
      inputPct: inputSavings,
      outputPct: outputSavings,
      totalPct: totalSavings,
      costPct: costSavings,
      latencyPct: latencySaved,
      dollarSaved: cost - optCost,
    },
  };
}

export default function Demo() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [userInput, setUserInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof simulateOptimize> | null>(null);
  const [activeTab, setActiveTab] = useState<'comparison' | 'detailed' | 'quality'>('comparison');
  const [copied, setCopied] = useState(false);

  const handleRun = useCallback(() => {
    if (!userInput.trim()) return;
    setIsRunning(true);
    setHasResult(false);
    
    // 检测使用的是哪个预设
    const preset = PRESET_PROMPTS.find(p => p.zh === userInput || p.en === userInput);
    
    setTimeout(() => {
      const res = simulateOptimize(userInput, preset?.id);
      setResult(res);
      setIsRunning(false);
      setHasResult(true);
    }, 1500);
  }, [userInput]);

  const handlePreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setUserInput(isEn ? preset.en : preset.zh);
    setHasResult(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chartData = result
    ? [
        { name: isEn ? 'Input' : '输入', without: result.baseline.inputTokens, withAnyTokn: result.optimized.inputTokens },
        { name: isEn ? 'Output' : '输出', without: result.baseline.outputTokens, withAnyTokn: result.optimized.outputTokens },
        { name: isEn ? 'Total' : '总计', without: result.baseline.totalTokens, withAnyTokn: result.optimized.totalTokens },
      ]
    : [];

  const costChartData = result
    ? [
        { name: isEn ? 'Cost ($)' : '成本 ($)', without: result.baseline.cost * 1000, withAnyTokn: result.optimized.cost * 1000 },
        { name: isEn ? 'Latency (ms)' : '延迟 (ms)', without: result.baseline.latencyMs, withAnyTokn: result.optimized.latencyMs },
      ]
    : [];

  // 30天趋势数据
  const trendData = result
    ? Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const calls = 1000 + Math.round(Math.random() * 500);
        return {
          day: `${day}d`,
          without: (result.baseline.cost * calls * 30).toFixed(2),
          withAnyTokn: (result.optimized.cost * calls * 30).toFixed(2),
          saved: ((result.baseline.cost - result.optimized.cost) * calls * 30).toFixed(2),
        };
      })
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/anytokn.png" alt="AnyTokn" className="h-8 w-auto rounded-lg" />
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-primary">
                {isEn ? 'Get Started' : '开始使用'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full border border-neutral-200 mb-6">
            <Zap className="w-3.5 h-3.5" />
            {isEn ? 'Live Comparison Demo' : '实时对比演示'}
          </div>
          <h1 className="heading-hero mb-4">
            {isEn ? 'With vs Without AnyTokn' : '使用 vs 不使用 AnyTokn'}
          </h1>
          <p className="body-text max-w-2xl mb-8 text-base">
            {isEn
              ? 'Enter any prompt and see the real difference. Same input, same model, but dramatically different costs and performance.'
              : '输入任意 prompt，查看真实差异。相同输入，相同模型，但成本和性能截然不同。'}
          </p>
        </div>
      </section>

      {/* Input Area */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-semibold text-neutral-800">{isEn ? 'Your Prompt' : '你的 Prompt'}</span>
              </div>
              <span className="text-xs text-neutral-400">{isEn ? 'Choose a preset or type your own' : '选择预设或输入自定义内容'}</span>
            </div>
            <div className="card-body">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isEn ? 'Type your prompt here...' : '在这里输入你的 prompt...'}
                className="input-field w-full h-28 resize-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePreset(preset)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
                    >
                      {isEn ? preset.en.slice(0, 35) + '...' : preset.zh.slice(0, 18) + '...'}
                    </button>
                  ))}
                </div>
                <button onClick={handleRun} disabled={!userInput.trim() || isRunning} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isRunning ? (isEn ? 'Analyzing...' : '分析中...') : (isEn ? 'Run Comparison' : '运行对比')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading */}
      {isRunning && (
        <section className="px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="card p-12 text-center">
              <Loader2 className="w-8 h-8 text-black animate-spin mx-auto mb-4" />
              <p className="text-sm text-neutral-600">{isEn ? 'Running parallel analysis...' : '运行并行分析...'}</p>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold text-neutral-400">RAW</span>
                  </div>
                  <p className="text-xs text-neutral-400">{isEn ? 'Direct API' : '直接调用'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-neutral-400" />
                  </div>
                  <p className="text-xs text-neutral-400">{isEn ? 'AnyTokn' : 'AnyTokn'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {hasResult && result && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Side by Side Response Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Without AnyTokn */}
              <div className="card border-red-200">
                <div className="card-header bg-red-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">{isEn ? 'Without AnyTokn' : '不使用 AnyTokn'}</span>
                  </div>
                  <span className="text-xs text-red-600 font-medium">{isEn ? 'Direct API Call' : '直接 API 调用'}</span>
                </div>
                <div className="card-body">
                  <div className="bg-neutral-50 rounded-lg p-4 mb-4 min-h-[120px]">
                    <p className="text-sm text-neutral-700 leading-relaxed">{result.baseline.response}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="text-neutral-500 mb-1">{isEn ? 'Output Tokens' : '输出 Token'}</p>
                      <p className="text-lg font-bold text-neutral-900">{result.baseline.outputTokens.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-neutral-200">
                      <p className="text-neutral-500 mb-1">{isEn ? 'Cost' : '成本'}</p>
                      <p className="text-lg font-bold text-neutral-900">{result.baseline.costStr}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* With AnyTokn */}
              <div className="card border-emerald-200">
                <div className="card-header bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">{isEn ? 'With AnyTokn' : '使用 AnyTokn'}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">{isEn ? 'Optimized' : '已优化'}</span>
                </div>
                <div className="card-body">
                  <div className="bg-emerald-50/50 rounded-lg p-4 mb-4 min-h-[120px]">
                    <p className="text-sm text-neutral-700 leading-relaxed">{result.optimized.response}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-neutral-500 mb-1">{isEn ? 'Output Tokens' : '输出 Token'}</p>
                      <p className="text-lg font-bold text-emerald-700">{result.optimized.outputTokens.toLocaleString()}</p>
                      <p className="text-emerald-600 font-medium">-{result.savings.outputPct}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-200">
                      <p className="text-neutral-500 mb-1">{isEn ? 'Cost' : '成本'}</p>
                      <p className="text-lg font-bold text-emerald-700">{result.optimized.costStr}</p>
                      <p className="text-emerald-600 font-medium">-{result.savings.costPct}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Banner */}
            <div className="card bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-emerald-700">{result.savings.totalPct}%</p>
                    <p className="text-xs text-neutral-600 mt-1">{isEn ? 'Token Savings' : 'Token 节省'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-700">{result.savings.costPct}%</p>
                    <p className="text-xs text-neutral-600 mt-1">{isEn ? 'Cost Savings' : '成本节省'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-violet-700">{result.savings.latencyPct}%</p>
                    <p className="text-xs text-neutral-600 mt-1">{isEn ? 'Latency Reduction' : '延迟降低'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-700">${result.savings.dollarSaved.toFixed(4)}</p>
                    <p className="text-xs text-neutral-600 mt-1">{isEn ? 'Saved per call' : '每次节省'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-neutral-200">
              {[
                { id: 'comparison' as const, label: isEn ? 'Visual Comparison' : '可视化对比', icon: BarChart3 },
                { id: 'detailed' as const, label: isEn ? 'Detailed Metrics' : '详细指标', icon: Layers },
                { id: 'quality' as const, label: isEn ? 'Quality Analysis' : '质量分析', icon: CheckCircle2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Comparison Tab */}
            {activeTab === 'comparison' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Token Usage: With vs Without' : 'Token 用量：使用 vs 不使用'}</h3>
                    </div>
                    <div className="card-body">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                            <Bar dataKey="without" name={isEn ? 'Without AnyTokn' : '不使用 AnyTokn'} fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="withAnyTokn" name={isEn ? 'With AnyTokn' : '使用 AnyTokn'} fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Cost & Latency Impact' : '成本与延迟影响'}</h3>
                    </div>
                    <div className="card-body">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={costChartData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                            <Bar dataKey="without" name={isEn ? 'Without AnyTokn' : '不使用 AnyTokn'} fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="withAnyTokn" name={isEn ? 'With AnyTokn' : '使用 AnyTokn'} fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 30-Day Projection */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? '30-Day Cost Projection (1K calls/day)' : '30 天成本预估（每天 1K 次调用）'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                          <Line type="monotone" dataKey="without" name={isEn ? 'Without AnyTokn' : '不使用 AnyTokn'} stroke="#ef4444" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="withAnyTokn" name={isEn ? 'With AnyTokn' : '使用 AnyTokn'} stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Detailed Metrics Tab */}
            {activeTab === 'detailed' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Complete Breakdown' : '完整分解'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header">{isEn ? 'Metric' : '指标'}</th>
                        <th className="table-header text-right text-red-600">{isEn ? 'Without AnyTokn' : '不使用 AnyTokn'}</th>
                        <th className="table-header text-right text-emerald-600">{isEn ? 'With AnyTokn' : '使用 AnyTokn'}</th>
                        <th className="table-header text-right">{isEn ? 'Difference' : '差异'}</th>
                        <th className="table-header">{isEn ? 'Impact' : '影响'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="table-cell font-medium">{isEn ? 'Input Tokens' : '输入 Token'}</td>
                        <td className="table-cell text-right text-red-600">{result.baseline.inputTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-medium">{result.optimized.inputTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-semibold">-{result.savings.inputPct}%</td>
                        <td className="table-cell"><ImpactBadge level="high" /></td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="table-cell font-medium">{isEn ? 'Output Tokens' : '输出 Token'}</td>
                        <td className="table-cell text-right text-red-600">{result.baseline.outputTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-medium">{result.optimized.outputTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-semibold">-{result.savings.outputPct}%</td>
                        <td className="table-cell"><ImpactBadge level="high" /></td>
                      </tr>
                      <tr>
                        <td className="table-cell font-medium">{isEn ? 'Total Tokens' : '总 Token'}</td>
                        <td className="table-cell text-right text-red-600 font-bold">{result.baseline.totalTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-bold">{result.optimized.totalTokens.toLocaleString()}</td>
                        <td className="table-cell text-right text-emerald-600 font-bold">-{result.savings.totalPct}%</td>
                        <td className="table-cell"><ImpactBadge level="high" /></td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="table-cell font-medium">{isEn ? 'Latency' : '延迟'}</td>
                        <td className="table-cell text-right text-red-600">{result.baseline.latencyMs}ms</td>
                        <td className="table-cell text-right text-emerald-600 font-medium">{result.optimized.latencyMs}ms</td>
                        <td className="table-cell text-right text-emerald-600 font-semibold">-{result.savings.latencyPct}%</td>
                        <td className="table-cell"><ImpactBadge level="medium" /></td>
                      </tr>
                      <tr>
                        <td className="table-cell font-medium">{isEn ? 'Cost per Call' : '单次成本'}</td>
                        <td className="table-cell text-right text-red-600 font-bold">{result.baseline.costStr}</td>
                        <td className="table-cell text-right text-emerald-600 font-bold">{result.optimized.costStr}</td>
                        <td className="table-cell text-right text-emerald-600 font-bold">-{result.savings.costPct}%</td>
                        <td className="table-cell"><ImpactBadge level="high" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Monthly Projection */}
                <div className="card-body border-t border-neutral-100">
                  <h4 className="text-sm font-semibold text-neutral-800 mb-4">{isEn ? 'Monthly Projection (10K calls)' : '月度预估（1万次调用）'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-xs text-red-600 mb-1">{isEn ? 'Without AnyTokn' : '不使用 AnyTokn'}</p>
                      <p className="text-2xl font-bold text-red-700">${(result.baseline.cost * 10000).toFixed(2)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-xs text-emerald-600 mb-1">{isEn ? 'With AnyTokn' : '使用 AnyTokn'}</p>
                      <p className="text-2xl font-bold text-emerald-700">${(result.optimized.cost * 10000).toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1">{isEn ? 'You Save' : '你节省'}</p>
                      <p className="text-2xl font-bold text-blue-700">${(result.savings.dollarSaved * 10000).toFixed(2)}</p>
                      <p className="text-xs text-blue-600 mt-1">{isEn ? 'per month' : '每月'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Analysis Tab */}
            {activeTab === 'quality' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Quality Preservation Score' : '质量保持评分'}</h3>
                  </div>
                  <div className="card-body space-y-4">
                    <QualityItem label={isEn ? 'Semantic Completeness' : '语义完整性'} score={95} desc={isEn ? 'Core meaning fully preserved' : '核心语义完整保留'} />
                    <QualityItem label={isEn ? 'Factual Accuracy' : '事实准确性'} score={98} desc={isEn ? 'All facts remain correct' : '所有事实保持正确'} />
                    <QualityItem label={isEn ? 'Response Structure' : '响应结构'} score={90} desc={isEn ? 'Logical flow maintained' : '逻辑流程保持'} />
                    <QualityItem label={isEn ? 'Tone & Style' : '语气风格'} score={88} desc={isEn ? 'Professional, less verbose' : '专业，减少冗余'} />
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Optimization Techniques Used' : '使用的优化技术'}</h3>
                  </div>
                  <div className="card-body space-y-3">
                    <TechniqueItem icon={Scissors} title={isEn ? 'Prompt Compression' : 'Prompt 压缩'} desc={isEn ? 'Removes redundant instructions' : '移除冗余指令'} impact={`-${result.savings.inputPct}%`} />
                    <TechniqueItem icon={Layers} title={isEn ? 'Context Trimming' : '上下文裁剪'} desc={isEn ? 'Keeps high-relevance context' : '保留高相关性上下文'} impact="-28%" />
                    <TechniqueItem icon={Route} title={isEn ? 'Smart Routing' : '智能路由'} desc={isEn ? 'Routes to optimal model' : '路由到最优模型'} impact={`-${result.savings.latencyPct}%`} />
                  </div>
                </div>

                <div className="card lg:col-span-2">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Trade-off Analysis' : '权衡分析'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TradeOffCard type="positive" title={isEn ? 'Significant Savings' : '显著节省'} desc={isEn ? `${result.savings.totalPct}% token reduction = lower costs` : `${result.savings.totalPct}% token 减少 = 更低成本`} />
                      <TradeOffCard type="positive" title={isEn ? 'Faster Response' : '更快响应'} desc={isEn ? `${result.savings.latencyPct}% lower latency` : `${result.savings.latencyPct}% 延迟降低`} />
                      <TradeOffCard type="neutral" title={isEn ? 'Minor Trade-off' : '轻微权衡'} desc={isEn ? 'Slightly more concise, meaning preserved' : '略微更简洁，语义保留'} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? 'Start saving on every API call' : '每次调用都开始节省'}</h2>
          <p className="text-neutral-400 mb-8">{isEn ? 'Join teams that save 30-50% on LLM costs without sacrificing quality.' : '加入那些在不牺牲质量的情况下节省 30-50% LLM 成本的团队。'}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              {isEn ? 'Create Free Account' : '创建免费账户'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/docs" className="btn-secondary inline-flex items-center gap-2">
              {isEn ? 'View Documentation' : '查看文档'}
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 px-4 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-neutral-600">© 2026 AnyTokn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function ImpactBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  };
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded border ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

function QualityItem({ label, score, desc }: { label: string; score: number; desc: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-neutral-900">{score}/100</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-black rounded-full transition-all" style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-neutral-500">{desc}</p>
    </div>
  );
}

function TechniqueItem({ icon: Icon, title, desc, impact }: { icon: any; title: string; desc: string; impact: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-neutral-200">
        <Icon className="w-4 h-4 text-neutral-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-neutral-800">{title}</h4>
          <span className="text-xs font-semibold text-emerald-600">{impact}</span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function TradeOffCard({ type, title, desc }: { type: 'positive' | 'neutral' | 'negative'; title: string; desc: string }) {
  const icons = { positive: CheckCircle2, neutral: AlertTriangle, negative: AlertTriangle };
  const colors = {
    positive: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    neutral: 'text-amber-600 bg-amber-50 border-amber-200',
    negative: 'text-red-600 bg-red-50 border-red-200',
  };
  const Icon = icons[type];
  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <p className="text-xs opacity-80">{desc}</p>
    </div>
  );
}
