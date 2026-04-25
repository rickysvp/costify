import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Send,
  Loader2,
  TrendingDown,
  Clock,
  DollarSign,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Scissors,
  Route,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEMO_SCENARIOS } from '../data/demoData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const PRESET_PROMPTS = [
  { id: 'support', zh: '帮我查一下订单 #ORD-20260418 的物流状态', en: 'Check the shipping status of order #ORD-20260418' },
  { id: 'rag', zh: 'AnyTokn 的计费方式是什么？', en: "What is AnyTokn's billing model?" },
  { id: 'agent', zh: '对比方案A、B、C的优缺点并给出建议', en: 'Compare options A, B, C and give recommendations' },
  { id: 'summary', zh: '总结这篇关于AI成本管理的文章', en: 'Summarize this article about AI cost management' },
];

function countTokens(text: string): number {
  return Math.round(text.length * 0.6 + Math.random() * 50);
}

function simulateOptimize(input: string) {
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

  return {
    baseline: {
      inputTokens,
      outputTokens,
      totalTokens,
      latencyMs,
      cost,
      costStr: `$${cost.toFixed(4)}`,
    },
    optimized: {
      inputTokens: optInputTokens,
      outputTokens: optOutputTokens,
      totalTokens: optTotalTokens,
      latencyMs: optLatencyMs,
      cost: optCost,
      costStr: `$${optCost.toFixed(4)}`,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'quality'>('overview');

  const handleRun = useCallback(() => {
    if (!userInput.trim()) return;
    setIsRunning(true);
    setHasResult(false);
    setTimeout(() => {
      const res = simulateOptimize(userInput);
      setResult(res);
      setIsRunning(false);
      setHasResult(true);
    }, 1500);
  }, [userInput]);

  const handlePreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setUserInput(isEn ? preset.en : preset.zh);
    setHasResult(false);
  };

  const chartData = result
    ? [
        { name: isEn ? 'Input' : '输入', baseline: result.baseline.inputTokens, optimized: result.optimized.inputTokens },
        { name: isEn ? 'Output' : '输出', baseline: result.baseline.outputTokens, optimized: result.optimized.outputTokens },
        { name: isEn ? 'Total' : '总计', baseline: result.baseline.totalTokens, optimized: result.optimized.totalTokens },
      ]
    : [];

  const costChartData = result
    ? [
        { name: isEn ? 'Cost' : '成本', baseline: result.baseline.cost * 1000, optimized: result.optimized.cost * 1000 },
        { name: isEn ? 'Latency' : '延迟', baseline: result.baseline.latencyMs, optimized: result.optimized.latencyMs },
      ]
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
            {isEn ? 'Token Optimization Demo' : 'Token 优化演示'}
          </div>
          <h1 className="heading-hero mb-4">
            {isEn ? 'See exactly how much you save' : '精确查看你能节省多少'}
          </h1>
          <p className="body-text max-w-2xl mb-8 text-base">
            {isEn
              ? 'Enter any prompt and get a detailed breakdown of token usage, cost, latency, and quality impact before and after optimization.'
              : '输入任意 prompt，获取优化前后 token 用量、成本、延迟和质量影响的详细分解。'}
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
                <span className="text-sm font-semibold text-neutral-800">{isEn ? 'Input Prompt' : '输入 Prompt'}</span>
              </div>
              <span className="text-xs text-neutral-400">{isEn ? 'Try presets or type your own' : '试试预设或输入自定义内容'}</span>
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
                  {isRunning ? (isEn ? 'Optimizing...' : '优化中...') : (isEn ? 'Run Analysis' : '运行分析')}
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
              <p className="text-sm text-neutral-600">{isEn ? 'Analyzing prompt structure and running optimization engine...' : '分析 prompt 结构并运行优化引擎...'}</p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-neutral-400">
                <span>{isEn ? 'Compressing prompt' : '压缩 prompt'}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{isEn ? 'Trimming context' : '裁剪上下文'}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{isEn ? 'Optimizing output' : '优化输出'}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {hasResult && result && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-neutral-200">
              {[
                { id: 'overview' as const, label: isEn ? 'Overview' : '概览', icon: BarChart3 },
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

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard
                    icon={TrendingDown}
                    label={isEn ? 'Token Savings' : 'Token 节省'}
                    value={`${result.savings.totalPct}%`}
                    subtext={isEn ? `${result.baseline.totalTokens.toLocaleString()} → ${result.optimized.totalTokens.toLocaleString()}` : `${result.baseline.totalTokens.toLocaleString()} → ${result.optimized.totalTokens.toLocaleString()}`}
                    color="emerald"
                  />
                  <KpiCard
                    icon={DollarSign}
                    label={isEn ? 'Cost Savings' : '成本节省'}
                    value={`${result.savings.costPct}%`}
                    subtext={isEn ? `Save $${result.savings.dollarSaved.toFixed(4)} per call` : `每次调用节省 $${result.savings.dollarSaved.toFixed(4)}`}
                    color="blue"
                  />
                  <KpiCard
                    icon={Clock}
                    label={isEn ? 'Latency Reduction' : '延迟降低'}
                    value={`${result.savings.latencyPct}%`}
                    subtext={isEn ? `${result.baseline.latencyMs}ms → ${result.optimized.latencyMs}ms` : `${result.baseline.latencyMs}ms → ${result.optimized.latencyMs}ms`}
                    color="violet"
                  />
                  <KpiCard
                    icon={CheckCircle2}
                    label={isEn ? 'Quality Status' : '质量状态'}
                    value={isEn ? 'Preserved' : '保持'}
                    subtext={isEn ? 'Core meaning intact' : '核心语义完整'}
                    color="amber"
                  />
                </div>

                {/* Comparison Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Token Usage Comparison' : 'Token 用量对比'}</h3>
                    </div>
                    <div className="card-body">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Bar dataKey="baseline" name={isEn ? 'Baseline' : '优化前'} fill="#9ca3af" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="optimized" name={isEn ? 'Optimized' : '优化后'} fill="#000000" radius={[4, 4, 0, 0]} />
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
                            <Tooltip
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Bar dataKey="baseline" name={isEn ? 'Baseline' : '优化前'} fill="#9ca3af" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="optimized" name={isEn ? 'Optimized' : '优化后'} fill="#000000" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Detailed Metrics Tab */}
            {activeTab === 'detailed' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Detailed Breakdown' : '详细分解'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header">{isEn ? 'Metric' : '指标'}</th>
                        <th className="table-header text-right">{isEn ? 'Baseline' : '优化前'}</th>
                        <th className="table-header text-right">{isEn ? 'Optimized' : '优化后'}</th>
                        <th className="table-header text-right">{isEn ? 'Savings' : '节省'}</th>
                        <th className="table-header">{isEn ? 'Impact' : '影响'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <MetricRow
                        label={isEn ? 'Input Tokens' : '输入 Token'}
                        baseline={result.baseline.inputTokens.toLocaleString()}
                        optimized={result.optimized.inputTokens.toLocaleString()}
                        savings={`${result.savings.inputPct}%`}
                        impact={result.savings.inputPct > 30 ? 'high' : 'medium'}
                      />
                      <MetricRow
                        label={isEn ? 'Output Tokens' : '输出 Token'}
                        baseline={result.baseline.outputTokens.toLocaleString()}
                        optimized={result.optimized.outputTokens.toLocaleString()}
                        savings={`${result.savings.outputPct}%`}
                        impact={result.savings.outputPct > 30 ? 'high' : 'medium'}
                      />
                      <MetricRow
                        label={isEn ? 'Total Tokens' : '总 Token'}
                        baseline={result.baseline.totalTokens.toLocaleString()}
                        optimized={result.optimized.totalTokens.toLocaleString()}
                        savings={`${result.savings.totalPct}%`}
                        impact={result.savings.totalPct > 30 ? 'high' : 'medium'}
                        highlight
                      />
                      <MetricRow
                        label={isEn ? 'Latency' : '延迟'}
                        baseline={`${result.baseline.latencyMs}ms`}
                        optimized={`${result.optimized.latencyMs}ms`}
                        savings={`${result.savings.latencyPct}%`}
                        impact={result.savings.latencyPct > 20 ? 'high' : 'medium'}
                      />
                      <MetricRow
                        label={isEn ? 'Cost per Call' : '单次成本'}
                        baseline={result.baseline.costStr}
                        optimized={result.optimized.costStr}
                        savings={`${result.savings.costPct}%`}
                        impact={result.savings.costPct > 30 ? 'high' : 'medium'}
                        highlight
                      />
                    </tbody>
                  </table>
                </div>

                {/* Monthly Projection */}
                <div className="card-body border-t border-neutral-100">
                  <h4 className="text-sm font-semibold text-neutral-800 mb-4">{isEn ? 'Monthly Projection (10K calls)' : '月度预估（1万次调用）'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProjectionCard
                      label={isEn ? 'Baseline Cost' : '优化前成本'}
                      value={`$${(result.baseline.cost * 10000).toFixed(2)}`}
                      type="neutral"
                    />
                    <ProjectionCard
                      label={isEn ? 'Optimized Cost' : '优化后成本'}
                      value={`$${(result.optimized.cost * 10000).toFixed(2)}`}
                      type="good"
                    />
                    <ProjectionCard
                      label={isEn ? 'Monthly Savings' : '月度节省'}
                      value={`$${(result.savings.dollarSaved * 10000).toFixed(2)}`}
                      type="savings"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quality Analysis Tab */}
            {activeTab === 'quality' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Quality Preservation' : '质量保持'}</h3>
                  </div>
                  <div className="card-body space-y-4">
                    <QualityItem
                      label={isEn ? 'Semantic Completeness' : '语义完整性'}
                      score={95}
                      desc={isEn ? 'Core meaning fully preserved' : '核心语义完整保留'}
                    />
                    <QualityItem
                      label={isEn ? 'Factual Accuracy' : '事实准确性'}
                      score={98}
                      desc={isEn ? 'All facts and data remain correct' : '所有事实和数据保持正确'}
                    />
                    <QualityItem
                      label={isEn ? 'Response Structure' : '响应结构'}
                      score={90}
                      desc={isEn ? 'Logical flow maintained, slightly more concise' : '逻辑流程保持，略微更简洁'}
                    />
                    <QualityItem
                      label={isEn ? 'Tone & Style' : '语气风格'}
                      score={88}
                      desc={isEn ? 'Professional tone preserved, less verbose' : '专业语气保持，减少冗余'}
                    />
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Optimization Techniques' : '优化技术'}</h3>
                  </div>
                  <div className="card-body space-y-3">
                    <TechniqueItem
                      icon={Scissors}
                      title={isEn ? 'Prompt Compression' : 'Prompt 压缩'}
                      desc={isEn ? 'Removes redundant instructions and filler words' : '移除冗余指令和填充词'}
                      impact={`-${result.savings.inputPct}%`}
                    />
                    <TechniqueItem
                      icon={Layers}
                      title={isEn ? 'Context Trimming' : '上下文裁剪'}
                      desc={isEn ? 'Keeps only high-relevance context segments' : '仅保留高相关性上下文片段'}
                      impact="-28%"
                    />
                    <TechniqueItem
                      icon={Route}
                      title={isEn ? 'Smart Routing' : '智能路由'}
                      desc={isEn ? 'Routes to optimal model based on task complexity' : '根据任务复杂度路由到最优模型'}
                      impact={`-${result.savings.latencyPct}%`}
                    />
                  </div>
                </div>

                <div className="card lg:col-span-2">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Trade-off Analysis' : '权衡分析'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TradeOffCard
                        type="positive"
                        title={isEn ? 'Significant Savings' : '显著节省'}
                        desc={isEn ? `${result.savings.totalPct}% reduction in token usage directly translates to lower costs` : `${result.savings.totalPct}% 的 token 减少直接转化为更低成本`}
                      />
                      <TradeOffCard
                        type="positive"
                        title={isEn ? 'Faster Response' : '更快响应'}
                        desc={isEn ? `${result.savings.latencyPct}% lower latency improves user experience` : `${result.savings.latencyPct}% 的延迟降低改善用户体验`}
                      />
                      <TradeOffCard
                        type="neutral"
                        title={isEn ? 'Minor Trade-off' : '轻微权衡'}
                        desc={isEn ? 'Response may be slightly more concise, but core meaning is fully preserved' : '响应可能略微更简洁，但核心语义完整保留'}
                      />
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
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? 'Start optimizing your API costs today' : '今天开始优化你的 API 成本'}</h2>
          <p className="text-neutral-400 mb-8">{isEn ? 'Join teams that save 30-50% on their LLM API costs without sacrificing quality.' : '加入那些在不牺牲质量的情况下节省 30-50% LLM API 成本的团队。'}</p>
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
function KpiCard({ icon: Icon, label, value, subtext, color }: { icon: any; label: string; value: string; subtext: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    violet: 'text-violet-600 bg-violet-50',
    amber: 'text-amber-600 bg-amber-50',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-neutral-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-[11px] text-neutral-400 mt-1">{subtext}</p>
    </div>
  );
}

function MetricRow({
  label,
  baseline,
  optimized,
  savings,
  impact,
  highlight,
}: {
  label: string;
  baseline: string;
  optimized: string;
  savings: string;
  impact: 'high' | 'medium' | 'low';
  highlight?: boolean;
}) {
  const impactBadge = {
    high: { text: 'High', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { text: 'Medium', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    low: { text: 'Low', class: 'bg-neutral-50 text-neutral-600 border-neutral-200' },
  };
  return (
    <tr className={highlight ? 'bg-neutral-50/50' : ''}>
      <td className="table-cell font-medium">{label}</td>
      <td className="table-cell text-right text-neutral-500">{baseline}</td>
      <td className="table-cell text-right font-medium">{optimized}</td>
      <td className="table-cell text-right">
        <span className="text-emerald-600 font-semibold">{savings}</span>
      </td>
      <td className="table-cell">
        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded border ${impactBadge[impact].class}`}>{impactBadge[impact].text}</span>
      </td>
    </tr>
  );
}

function ProjectionCard({ label, value, type }: { label: string; value: string; type: 'neutral' | 'good' | 'savings' }) {
  const typeStyles = {
    neutral: 'text-neutral-600',
    good: 'text-emerald-600',
    savings: 'text-emerald-700 font-bold',
  };
  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className={`text-xl ${typeStyles[type]}`}>{value}</p>
    </div>
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
  const icons = {
    positive: CheckCircle2,
    neutral: AlertTriangle,
    negative: AlertTriangle,
  };
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
