import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Send, Loader2, TrendingDown, Clock, DollarSign,
  BarChart3, CheckCircle2, AlertTriangle, Layers, Scissors, Route,
  FileText, ChevronRight, X, ArrowDown, Minus, Plus
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

// 详细的优化步骤数据
interface OptimizationStep {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: any;
  beforeTokens: number;
  afterTokens: number;
  beforeText: string;
  afterText: string;
  savings: number;
  details: string[];
  detailsEn: string[];
}

const OPTIMIZATION_STEPS: Record<string, OptimizationStep[]> = {
  support: [
    {
      name: '原始 Prompt',
      nameEn: 'Original Prompt',
      description: '用户输入的原始查询',
      descriptionEn: 'User\'s original query',
      icon: FileText,
      beforeTokens: 24,
      afterTokens: 24,
      beforeText: '帮我查一下订单 #ORD-20260418 的物流状态',
      afterText: '帮我查一下订单 #ORD-20260418 的物流状态',
      savings: 0,
      details: ['原始输入，未做处理'],
      detailsEn: ['Original input, no processing'],
    },
    {
      name: 'Prompt 压缩',
      nameEn: 'Prompt Compression',
      description: '移除冗余词汇，保留关键信息',
      descriptionEn: 'Remove redundant words, keep key info',
      icon: Scissors,
      beforeTokens: 24,
      afterTokens: 18,
      beforeText: '帮我查一下订单 #ORD-20260418 的物流状态',
      afterText: '查订单 #ORD-20260418 物流',
      savings: 25,
      details: ['移除礼貌用语"帮我"、"一下"', '移除冗余动词"查"重复', '简化"物流状态"为"物流"'],
      detailsEn: ['Remove polite words', 'Remove redundant verbs', 'Simplify "shipping status" to "shipping"'],
    },
    {
      name: '系统指令优化',
      nameEn: 'System Instruction Optimization',
      description: '精简系统角色设定',
      descriptionEn: 'Streamline system role setup',
      icon: Layers,
      beforeTokens: 156,
      afterTokens: 89,
      beforeText: '你是一个专业的客服助手，你需要以礼貌、专业的态度回答用户的问题。请提供详细的物流信息，包括发货时间、预计送达时间、物流公司、运单号等。如果用户的问题超出你的能力范围，请引导用户联系人工客服。',
      afterText: '客服助手。提供物流信息：发货时间、预计送达、物流公司、运单号。',
      savings: 43,
      details: ['移除角色描述中的形容词', '删除超出能力范围的兜底话术', '将长句改为关键词列表'],
      detailsEn: ['Remove adjectives from role desc', 'Remove fallback phrases', 'Convert long sentences to keywords'],
    },
    {
      name: '上下文裁剪',
      nameEn: 'Context Trimming',
      description: '移除无关历史对话',
      descriptionEn: 'Remove irrelevant conversation history',
      icon: Route,
      beforeTokens: 342,
      afterTokens: 0,
      beforeText: '[历史对话: 用户之前询问了3个其他订单的状态，以及退换货政策]',
      afterText: '(无相关历史上下文)',
      savings: 100,
      details: ['当前查询与历史订单无关', '退换货政策与物流查询无关', '仅保留当前订单相关上下文'],
      detailsEn: ['Current query unrelated to history', 'Return policy irrelevant to shipping', 'Keep only current order context'],
    },
    {
      name: '输出约束',
      nameEn: 'Output Constraint',
      description: '控制输出长度和格式',
      descriptionEn: 'Control output length and format',
      icon: CheckCircle2,
      beforeTokens: 423,
      afterTokens: 198,
      beforeText: '您好，感谢您联系我们。关于您提到的订单问题，我已经查询了您的订单记录。您的订单 #ORD-20260418 已于4月20日发货，预计4月23日送达。物流单号为 SF1234567890，您可以通过顺丰官网查询实时物流信息。如果超过预计送达时间仍未收到，请再次联系我们，我们会帮您跟进处理。祝您购物愉快！',
      afterText: '订单 #ORD-20260418 | 状态: 已发货 | 发货: 4/20 | 预计: 4/23 | 物流: 顺丰 SF1234567890 | 查询: sf-express.com',
      savings: 53,
      details: ['移除问候语和结束语', '使用结构化格式替代自然语言', '删除重复信息（"联系我们"出现2次）', '将长句拆分为关键字段'],
      detailsEn: ['Remove greetings and closings', 'Use structured format', 'Remove duplicate info', 'Split into key fields'],
    },
  ],
  rag: [
    {
      name: '原始 Prompt',
      nameEn: 'Original Prompt',
      description: '用户输入的原始查询',
      descriptionEn: 'User\'s original query',
      icon: FileText,
      beforeTokens: 18,
      afterTokens: 18,
      beforeText: 'AnyTokn 的计费方式是什么？',
      afterText: 'AnyTokn 的计费方式是什么？',
      savings: 0,
      details: ['原始输入，未做处理'],
      detailsEn: ['Original input, no processing'],
    },
    {
      name: '检索结果去重',
      nameEn: 'Deduplicate Retrieved Results',
      description: '移除重复检索段落',
      descriptionEn: 'Remove duplicate retrieved passages',
      icon: Scissors,
      beforeTokens: 2847,
      afterTokens: 1423,
      beforeText: '[5篇文档，包含重复的价格说明和计费示例]',
      afterText: '[2篇文档，去重后保留核心计费信息]',
      savings: 50,
      details: ['文档1和文档3内容重复度85%', '移除示例中的重复计费说明', '仅保留最新版本的价格表'],
      detailsEn: ['Doc 1 & 3 85% duplicate', 'Remove duplicate billing examples', 'Keep only latest price table'],
    },
    {
      name: '上下文排序',
      nameEn: 'Context Ranking',
      description: '按相关性排序，保留Top-K',
      descriptionEn: 'Rank by relevance, keep Top-K',
      icon: Layers,
      beforeTokens: 1423,
      afterTokens: 568,
      beforeText: '[按时间排序的2篇文档，包含大量无关的产品介绍]',
      afterText: '[按相关性排序，仅保留计费相关段落]',
      savings: 60,
      details: ['产品介绍与计费问题无关', '按向量相似度重新排序', '仅保留与"计费"最相关的Top-3段落'],
      detailsEn: ['Product intro irrelevant to billing', 'Re-rank by vector similarity', 'Keep only Top-3 relevant passages'],
    },
    {
      name: '输出精简',
      nameEn: 'Output Condensation',
      description: '去除冗余引用，直接给出答案',
      descriptionEn: 'Remove redundant quotes, direct answer',
      icon: CheckCircle2,
      beforeTokens: 567,
      afterTokens: 189,
      beforeText: '根据检索到的文档内容，AnyTokn 的计费方式采用按量计费模式。具体来说，系统会根据您实际使用的 token 数量进行计费，包括输入 token 和输出 token。输入 token 的价格为每 1K token $0.0015，输出 token 的价格为每 1K token $0.002。',
      afterText: 'AnyTokn 按量计费：输入 $0.0015/1K token，输出 $0.002/1K token。',
      savings: 67,
      details: ['移除"根据检索到的文档内容"等过渡句', '删除重复的价格单位说明', '使用表格化表达替代自然语言'],
      detailsEn: ['Remove transition sentences', 'Remove duplicate price units', 'Use tabular expression'],
    },
  ],
  agent: [
    {
      name: '原始 Prompt',
      nameEn: 'Original Prompt',
      description: '用户输入的原始查询',
      descriptionEn: 'User\'s original query',
      icon: FileText,
      beforeTokens: 28,
      afterTokens: 28,
      beforeText: '对比方案A、B、C的优缺点并给出建议',
      afterText: '对比方案A、B、C的优缺点并给出建议',
      savings: 0,
      details: ['原始输入，未做处理'],
      detailsEn: ['Original input, no processing'],
    },
    {
      name: '多轮历史裁剪',
      nameEn: 'Multi-turn History Pruning',
      description: '移除已解决的历史对话',
      descriptionEn: 'Remove resolved conversation history',
      icon: Scissors,
      beforeTokens: 1245,
      afterTokens: 312,
      beforeText: '[历史5轮对话：用户之前询问了方案A的详细架构、方案B的成本估算、方案C的技术栈，均已回答]',
      afterText: '[保留当前轮次：仅需对比三个方案]',
      savings: 75,
      details: ['历史5轮对话与当前对比任务无关', '已回答的问题无需重复携带', '仅保留当前轮次的对比指令'],
      detailsEn: ['Previous 5 turns irrelevant', 'Answered questions need not repeat', 'Keep only current comparison'],
    },
    {
      name: '结构化输出',
      nameEn: 'Structured Output',
      description: '强制结构化格式，减少冗余',
      descriptionEn: 'Enforce structured format, reduce redundancy',
      icon: CheckCircle2,
      beforeTokens: 612,
      afterTokens: 298,
      beforeText: '好的，我来帮您分析一下这三个方案的对比。首先是方案A，它的优势在于部署简单，维护成本低，但是扩展性有限。方案B的优势是扩展性好，支持高并发，但是初期投入较高...',
      afterText: '| 方案 | 优势 | 劣势 | 适用场景 |\n| A | 部署简单、成本低 | 扩展有限 | 小规模 |\n| B | 扩展好、高并发 | 投入高、复杂 | 快速增长 |\n| C | 折中兼顾 | 极端场景弱 | 中等规模 |',
      savings: 51,
      details: ['移除过渡句"好的，我来帮您分析"', '使用Markdown表格替代自然语言', '删除重复的主语"方案X的优势/劣势"'],
      detailsEn: ['Remove filler sentences', 'Use Markdown table', 'Remove repeated subjects'],
    },
  ],
  summary: [
    {
      name: '原始 Prompt',
      nameEn: 'Original Prompt',
      description: '用户输入的原始查询',
      descriptionEn: 'User\'s original query',
      icon: FileText,
      beforeTokens: 22,
      afterTokens: 22,
      beforeText: '总结这篇关于AI成本管理的文章',
      afterText: '总结这篇关于AI成本管理的文章',
      savings: 0,
      details: ['原始输入，未做处理'],
      detailsEn: ['Original input, no processing'],
    },
    {
      name: '文档预处理',
      nameEn: 'Document Preprocessing',
      description: '去除无关段落，保留核心论点',
      descriptionEn: 'Remove irrelevant passages, keep core arguments',
      icon: Scissors,
      beforeTokens: 5234,
      afterTokens: 2891,
      beforeText: '[完整文档：包含引言、背景介绍、3个案例研究、未来展望、参考文献]',
      afterText: '[精简文档：去除引言和参考文献，保留核心论点和1个关键案例]',
      savings: 45,
      details: ['引言部分与总结目的无关', '3个案例中选择最具代表性的1个', '参考文献不影响摘要质量'],
      detailsEn: ['Intro irrelevant to summary', 'Select 1 representative case', 'References don\'t affect summary'],
    },
    {
      name: '摘要输出优化',
      nameEn: 'Summary Output Optimization',
      description: '结构化摘要，避免逐段复述',
      descriptionEn: 'Structured summary, avoid paragraph-by-paragraph restating',
      icon: CheckCircle2,
      beforeTokens: 1247,
      afterTokens: 684,
      beforeText: '本文主要讨论了人工智能在企业成本管理中的应用。文章首先介绍了传统成本管理面临的挑战，包括数据分散、实时性不足和预测能力有限等问题。随后...',
      afterText: '本文探讨 AI 在企业成本管理中的应用：1）传统成本管理面临数据分散、实时性不足、预测能力有限等挑战；2）AI 通过自动数据采集、实时监控、智能预测改善这些问题；3）在 API 成本管理领域，token 优化、智能路由、预算预警可降低 30-50% 调用成本；4）实际案例验证了不同规模企业的成本节约效果；5）未来趋势是更精细的优化策略和更智能的自动化决策。',
      savings: 45,
      details: ['使用编号列表替代自然语言段落', '删除过渡词"首先"、"随后"、"最后"', '每个论点保留核心动词和名词'],
      detailsEn: ['Use numbered list', 'Remove transition words', 'Keep core verbs and nouns'],
    },
  ],
};

function countTokens(text: string): number {
  return Math.round(text.length * 0.6 + Math.random() * 50);
}

export default function Demo() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [userInput, setUserInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'pipeline' | 'comparison' | 'projection'>('pipeline');

  const handleRun = useCallback(() => {
    if (!userInput.trim()) return;
    setIsRunning(true);
    setHasResult(false);
    
    const preset = PRESET_PROMPTS.find(p => p.zh === userInput || p.en === userInput);
    setSelectedPreset(preset?.id || '');
    
    setTimeout(() => {
      setIsRunning(false);
      setHasResult(true);
      setExpandedSteps(new Set([0, 1, 2, 3, 4]));
    }, 1500);
  }, [userInput]);

  const handlePreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setUserInput(isEn ? preset.en : preset.zh);
    setHasResult(false);
  };

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const steps = selectedPreset ? OPTIMIZATION_STEPS[selectedPreset] || [] : [];
  
  const totalBefore = steps.reduce((sum, s) => sum + s.beforeTokens, 0);
  const totalAfter = steps.reduce((sum, s) => sum + s.afterTokens, 0);
  const totalSavings = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;

  const chartData = steps.map((s, i) => ({
    step: i + 1,
    name: isEn ? s.nameEn : s.name,
    before: s.beforeTokens,
    after: s.afterTokens,
    saved: s.beforeTokens - s.afterTokens,
  }));

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
            {isEn ? 'Step-by-Step Optimization Pipeline' : '逐层优化流水线'}
          </div>
          <h1 className="heading-hero mb-4">
            {isEn ? 'See every optimization step' : '看清每一步优化'}
          </h1>
          <p className="body-text max-w-2xl mb-8 text-base">
            {isEn
              ? 'Not just before/after. See exactly how each optimization layer reduces tokens, with real text comparisons.'
              : '不只是前后对比。看清每一层优化如何减少 token，附带真实文本对比。'}
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
              <span className="text-xs text-neutral-400">{isEn ? 'Choose a preset to see step-by-step optimization' : '选择预设查看逐层优化'}</span>
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
                  {isRunning ? (isEn ? 'Analyzing...' : '分析中...') : (isEn ? 'Show Optimization Steps' : '显示优化步骤')}
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
              <p className="text-sm text-neutral-600">{isEn ? 'Running optimization pipeline...' : '运行优化流水线...'}</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-400">
                <span>Prompt Compression</span>
                <ChevronRight className="w-3 h-3" />
                <span>Context Trimming</span>
                <ChevronRight className="w-3 h-3" />
                <span>Output Optimization</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {hasResult && steps.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Summary Banner */}
            <div className="card bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">{totalBefore.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Original Tokens' : '原始 Token'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">{totalAfter.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Optimized Tokens' : '优化后 Token'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">{totalSavings}%</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Total Savings' : '总节省'}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">{(totalBefore - totalAfter).toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Tokens Saved' : '节省 Token'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-neutral-200">
              {[
                { id: 'pipeline' as const, label: isEn ? 'Optimization Pipeline' : '优化流水线', icon: Layers },
                { id: 'comparison' as const, label: isEn ? 'Visual Comparison' : '可视化对比', icon: BarChart3 },
                { id: 'projection' as const, label: isEn ? 'Cost Projection' : '成本预估', icon: DollarSign },
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

            {/* Pipeline Tab */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isExpanded = expandedSteps.has(index);
                  const isLast = index === steps.length - 1;
                  
                  return (
                    <div key={index} className="card">
                      {/* Step Header */}
                      <div 
                        className="card-header flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors"
                        onClick={() => toggleStep(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-neutral-800">{isEn ? step.nameEn : step.name}</span>
                              <span className="text-xs text-neutral-400">{isEn ? step.descriptionEn : step.description}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-neutral-500">{step.beforeTokens.toLocaleString()} → {step.afterTokens.toLocaleString()} tokens</span>
                              {step.savings > 0 && (
                                <span className="text-xs font-semibold text-emerald-600">-{step.savings}%</span>
                              )}
                              {step.savings === 0 && (
                                <span className="text-xs text-neutral-400">{isEn ? 'No change' : '无变化'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {step.savings > 0 && (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              -{step.savings}%
                            </span>
                          )}
                          {isExpanded ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
                        </div>
                      </div>

                      {/* Step Detail */}
                      {isExpanded && (
                        <div className="card-body border-t border-neutral-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Before */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <X className="w-3 h-3 text-red-500" />
                                <span className="text-xs font-medium text-red-600">{isEn ? 'Before' : '优化前'}</span>
                                <span className="text-xs text-neutral-400">({step.beforeTokens} tokens)</span>
                              </div>
                              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                <p className="text-sm text-neutral-700 leading-relaxed">{step.beforeText}</p>
                              </div>
                            </div>

                            {/* After */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-600">{isEn ? 'After' : '优化后'}</span>
                                <span className="text-xs text-neutral-400">({step.afterTokens} tokens)</span>
                              </div>
                              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                <p className="text-sm text-neutral-700 leading-relaxed">{step.afterText}</p>
                              </div>
                            </div>
                          </div>

                          {/* Optimization Details */}
                          {step.details.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-neutral-100">
                              <p className="text-xs font-medium text-neutral-600 mb-2">{isEn ? 'What changed:' : '具体变化：'}</p>
                              <div className="space-y-1">
                                {(isEn ? step.detailsEn : step.details).map((detail, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-neutral-600">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comparison Tab */}
            {activeTab === 'comparison' && (
              <>
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Token Reduction per Step' : '每步 Token 减少量'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                          <Bar dataKey="before" name={isEn ? 'Before' : '优化前'} fill="#fca5a5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="after" name={isEn ? 'After' : '优化后'} fill="#86efac" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Cumulative Token Flow' : '累积 Token 流向'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="space-y-2">
                      {steps.map((step, i) => {
                        const cumulativeBefore = steps.slice(0, i + 1).reduce((sum, s) => sum + s.beforeTokens, 0);
                        const cumulativeAfter = steps.slice(0, i + 1).reduce((sum, s) => sum + s.afterTokens, 0);
                        const widthPercent = cumulativeBefore > 0 ? (cumulativeAfter / cumulativeBefore) * 100 : 100;
                        
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500 w-24 truncate">{isEn ? step.nameEn : step.name}</span>
                            <div className="flex-1 h-6 bg-red-100 rounded overflow-hidden relative">
                              <div 
                                className="h-full bg-emerald-400 rounded transition-all duration-700"
                                style={{ width: `${widthPercent}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-neutral-700">
                                {cumulativeAfter.toLocaleString()} / {cumulativeBefore.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Projection Tab */}
            {activeTab === 'projection' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-red-50 border-red-200">
                  <div className="card-body text-center">
                    <p className="text-xs text-red-600 mb-2">{isEn ? 'Without AnyTokn (1M calls)' : '不使用 AnyTokn（100万次调用）'}</p>
                    <p className="text-3xl font-bold text-red-700">${(totalBefore * 0.000015 * 1000000).toFixed(0)}</p>
                    <p className="text-xs text-red-500 mt-1">{totalBefore.toLocaleString()} tokens/call</p>
                  </div>
                </div>
                <div className="card bg-emerald-50 border-emerald-200">
                  <div className="card-body text-center">
                    <p className="text-xs text-emerald-600 mb-2">{isEn ? 'With AnyTokn (1M calls)' : '使用 AnyTokn（100万次调用）'}</p>
                    <p className="text-3xl font-bold text-emerald-700">${(totalAfter * 0.000015 * 1000000).toFixed(0)}</p>
                    <p className="text-xs text-emerald-500 mt-1">{totalAfter.toLocaleString()} tokens/call</p>
                  </div>
                </div>
                <div className="card bg-blue-50 border-blue-200">
                  <div className="card-body text-center">
                    <p className="text-xs text-blue-600 mb-2">{isEn ? 'Your Savings (1M calls)' : '你的节省（100万次调用）'}</p>
                    <p className="text-3xl font-bold text-blue-700">${((totalBefore - totalAfter) * 0.000015 * 1000000).toFixed(0)}</p>
                    <p className="text-xs text-blue-500 mt-1">{totalSavings}% {isEn ? 'reduction' : '减少'}</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? 'See the difference in every layer' : '看清每一层的差异'}</h2>
          <p className="text-neutral-400 mb-8">{isEn ? 'AnyTokn optimizes at every step, not just the final output.' : 'AnyTokn 在每一步都进行优化，不只是最终输出。'}</p>
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
