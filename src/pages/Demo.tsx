import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Send, Loader2, TrendingDown, Clock, DollarSign,
  BarChart3, CheckCircle2, AlertTriangle, Layers, Scissors, Route,
  FileText, ChevronRight, X, Minus, Plus, ArrowDownRight, ArrowUpRight,
  Target, Gauge, Sparkles, BrainCircuit, Filter, AlignLeft, Table2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

// ==================== 专业场景预设 ====================
const PRESET_SCENARIOS = [
  {
    id: 'customer-support',
    category: 'Customer Support',
    categoryZh: '客户支持',
    icon: BrainCircuit,
    prompt: 'Customer inquiry: "I haven\'t received my order #ORD-20260418 yet. Can you check the status?"',
    promptZh: '客户咨询："我的订单 #ORD-20260418 还没收到，能查一下状态吗？"',
    description: 'High-volume support tickets with repetitive context',
    descriptionZh: '大量重复上下文的客服工单',
  },
  {
    id: 'rag-knowledge',
    category: 'RAG Knowledge Base',
    categoryZh: 'RAG 知识库',
    icon: Filter,
    prompt: 'Query: "What are the pricing tiers for enterprise API access and volume discounts?"',
    promptZh: '查询："企业 API 访问的定价层级和批量折扣是什么？"',
    description: 'Document-grounded Q&A with large retrieval context',
    descriptionZh: '基于文档检索的大上下文问答',
  },
  {
    id: 'agent-workflow',
    category: 'Agent Workflow',
    categoryZh: 'Agent 工作流',
    icon: Table2,
    prompt: 'Task: "Compare cloud providers AWS, GCP, Azure for ML workloads and recommend the best option"',
    promptZh: '任务："对比 AWS、GCP、Azure 云厂商的 ML 工作负载表现并推荐最优方案"',
    description: 'Multi-step reasoning with accumulated conversation history',
    descriptionZh: '多步推理，累积对话历史',
  },
  {
    id: 'content-generation',
    category: 'Content Generation',
    categoryZh: '内容生成',
    icon: AlignLeft,
    prompt: 'Generate a technical summary of the attached 50-page research paper on transformer architecture optimizations',
    promptZh: '生成一份关于 Transformer 架构优化的 50 页研究论文的技术摘要',
    description: 'Long-form content summarization and extraction',
    descriptionZh: '长文档摘要和信息提取',
  },
];

// ==================== 优化步骤定义 ====================
interface OptimizationStep {
  phase: string;
  phaseEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: any;
  beforeTokens: number;
  afterTokens: number;
  beforeText: string;
  afterText: string;
  techniques: string[];
  techniquesEn: string[];
  impact: 'critical' | 'high' | 'medium' | 'low';
}

const OPTIMIZATION_PIPELINE: Record<string, OptimizationStep[]> = {
  'customer-support': [
    {
      phase: 'Input Layer',
      phaseEn: 'Input Layer',
      title: 'Prompt Compression',
      titleEn: 'Prompt Compression',
      description: '移除冗余表达，保留核心语义',
      descriptionEn: 'Remove redundant expressions, preserve core semantics',
      icon: Scissors,
      beforeTokens: 28,
      afterTokens: 18,
      beforeText: 'Customer inquiry: "I haven\'t received my order #ORD-20260418 yet. Can you check the status?"',
      afterText: 'Order status check: #ORD-20260418',
      techniques: ['移除礼貌用语和冗余从句', '提取关键实体（订单号）', '将问句转为指令式表达'],
      techniquesEn: ['Remove polite phrases and redundant clauses', 'Extract key entities (order ID)', 'Convert question to imperative'],
      impact: 'medium',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'System Instruction Optimization',
      titleEn: 'System Instruction Optimization',
      description: '精简系统角色设定，去除冗余约束',
      descriptionEn: 'Streamline system role, remove redundant constraints',
      icon: Target,
      beforeTokens: 245,
      afterTokens: 78,
      beforeText: 'You are a helpful customer support assistant. You should be polite, professional, and thorough. Provide detailed information about shipping status, including carrier details, tracking numbers, estimated delivery dates, and any delays. If the issue is complex, escalate to human support. Always end with a friendly closing.',
      afterText: 'Support agent: Provide shipping status (carrier, tracking, ETA). Escalate if needed.',
      techniques: ['移除角色描述中的形容词堆砌', '删除超出当前任务范围的兜底话术', '将长句改为结构化关键词列表'],
      techniquesEn: ['Remove adjective stacking in role description', 'Delete fallback phrases beyond current task', 'Convert long sentences to structured keywords'],
      impact: 'high',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'Conversation History Pruning',
      titleEn: 'Conversation History Pruning',
      description: '裁剪无关历史对话，保留相关上下文',
      descriptionEn: 'Prune irrelevant history, retain relevant context',
      icon: Filter,
      beforeTokens: 892,
      afterTokens: 0,
      beforeText: '[Previous 8 turns: User asked about return policy, refund process, shipping methods, product specifications, warranty info, account settings, password reset, and previous order #ORD-20260315]',
      afterText: '(No relevant conversation history for current query)',
      techniques: ['识别当前查询与历史对话的关联度', '移除已解决话题的完整对话记录', '仅保留与当前订单相关的上下文片段'],
      techniquesEn: ['Identify relevance between current query and history', 'Remove resolved topic conversations', 'Retain only context related to current order'],
      impact: 'critical',
    },
    {
      phase: 'Output Layer',
      phaseEn: 'Output Layer',
      title: 'Response Format Optimization',
      titleEn: 'Response Format Optimization',
      description: '结构化输出，去除冗余表达',
      descriptionEn: 'Structured output, remove redundant expressions',
      icon: Gauge,
      beforeTokens: 312,
      afterTokens: 89,
      beforeText: 'Hello! Thank you for reaching out to us. I understand your concern about order #ORD-20260418. I have checked our system and found that your order was shipped on April 20th via SF Express. The tracking number is SF1234567890. Based on our estimates, it should arrive by April 23rd. You can track the real-time status on the SF Express website. If you do not receive it by the estimated date, please contact us again and we will be happy to assist you further. We appreciate your patience and understanding. Have a great day!',
      afterText: 'Order #ORD-20260418 | Status: Shipped | Carrier: SF Express | Tracking: SF1234567890 | ETA: Apr 23 | Track: sf-express.com | Contact us if not received by ETA.',
      techniques: ['移除问候语和结束语', '使用结构化格式替代自然语言段落', '删除重复信息（多次出现"contact us"）', '将长句拆分为关键字段'],
      techniquesEn: ['Remove greetings and closings', 'Use structured format instead of natural language', 'Remove duplicate info (multiple "contact us")', 'Split long sentences into key fields'],
      impact: 'high',
    },
  ],
  'rag-knowledge': [
    {
      phase: 'Input Layer',
      phaseEn: 'Input Layer',
      title: 'Query Refinement',
      titleEn: 'Query Refinement',
      description: '优化查询表达，提升检索精度',
      descriptionEn: 'Optimize query expression, improve retrieval precision',
      icon: Scissors,
      beforeTokens: 22,
      afterTokens: 16,
      beforeText: 'What are the pricing tiers for enterprise API access and volume discounts?',
      afterText: 'Enterprise API pricing tiers & volume discounts',
      techniques: ['移除疑问词，转为关键词检索', '提取核心实体（pricing, enterprise, volume discounts）', '使用符号连接提升检索匹配度'],
      techniquesEn: ['Remove question words, convert to keywords', 'Extract core entities', 'Use symbols to improve retrieval matching'],
      impact: 'medium',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'Retrieval Deduplication',
      titleEn: 'Retrieval Deduplication',
      description: '去重检索结果，移除重复段落',
      descriptionEn: 'Deduplicate retrieval results, remove duplicate passages',
      icon: Filter,
      beforeTokens: 3847,
      afterTokens: 1245,
      beforeText: '[Retrieved 8 documents: Pricing v1.0 (85% overlap with v2.0), Pricing v2.0 (current), FAQ (repeated pricing table), Blog post (same content as docs), Case study (irrelevant), API reference (partial overlap), Terms of service (no pricing), Changelog (minor updates)]',
      afterText: '[Retrieved 2 documents: Pricing v2.0 (current), API reference (complementary)]',
      techniques: ['计算文档间相似度，移除重复度>80%的文档', '优先保留最新版本文档', '移除与查询无关的文档类型（Case study, Terms）'],
      techniquesEn: ['Calculate document similarity, remove duplicates >80%', 'Prioritize latest version documents', 'Remove irrelevant document types'],
      impact: 'critical',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'Context Ranking & Trimming',
      titleEn: 'Context Ranking & Trimming',
      description: '按相关性排序，保留Top-K段落',
      descriptionEn: 'Rank by relevance, retain Top-K passages',
      icon: Target,
      beforeTokens: 1245,
      afterTokens: 423,
      beforeText: '[Full documents with introduction, background, examples, edge cases, implementation details, migration guides, all pricing tables]',
      afterText: '[Top-3 relevant passages: Enterprise tier definition, Volume discount matrix, API call pricing formula]',
      techniques: ['按向量相似度重新排序段落', '移除与查询无关的章节（背景介绍、迁移指南）', '仅保留Top-3最相关段落'],
      techniquesEn: ['Re-rank passages by vector similarity', 'Remove irrelevant sections', 'Retain only Top-3 most relevant passages'],
      impact: 'high',
    },
    {
      phase: 'Output Layer',
      phaseEn: 'Output Layer',
      title: 'Answer Condensation',
      titleEn: 'Answer Condensation',
      description: '精简回答，去除冗余引用',
      descriptionEn: 'Condense answer, remove redundant citations',
      icon: Gauge,
      beforeTokens: 445,
      afterTokens: 156,
      beforeText: 'Based on the retrieved documentation, AnyTokn offers three pricing tiers for enterprise customers. The Starter tier begins at $499/month for up to 1M tokens. The Growth tier is $1,499/month for up to 5M tokens. The Enterprise tier offers custom pricing for unlimited usage. Volume discounts are available starting at 10M tokens/month, with a 15% discount at 50M tokens and 25% discount at 100M tokens.',
      afterText: '| Tier | Price | Tokens |\n| Starter | $499/mo | 1M |\n| Growth | $1,499/mo | 5M |\n| Enterprise | Custom | Unlimited |\n\nVolume Discounts: 10M+ → 15% off | 50M+ → 25% off',
      techniques: ['移除"Based on retrieved documentation"等过渡句', '使用Markdown表格替代自然语言描述', '删除重复的价格单位说明'],
      techniquesEn: ['Remove transition sentences', 'Use Markdown tables instead of natural language', 'Remove duplicate price unit descriptions'],
      impact: 'high',
    },
  ],
  'agent-workflow': [
    {
      phase: 'Input Layer',
      phaseEn: 'Input Layer',
      title: 'Task Decomposition',
      titleEn: 'Task Decomposition',
      description: '分解复杂任务，提取子任务',
      descriptionEn: 'Decompose complex task, extract subtasks',
      icon: Scissors,
      beforeTokens: 34,
      afterTokens: 28,
      beforeText: 'Compare cloud providers AWS, GCP, Azure for ML workloads and recommend the best option',
      afterText: 'ML workload comparison: AWS vs GCP vs Azure → recommendation',
      techniques: ['提取核心动词（Compare, recommend）', '识别比较对象（AWS, GCP, Azure）', '明确任务目标（recommendation）'],
      techniquesEn: ['Extract core verbs', 'Identify comparison targets', 'Clarify task objective'],
      impact: 'low',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'Multi-turn History Compression',
      titleEn: 'Multi-turn History Compression',
      description: '压缩多轮历史，移除已解决内容',
      descriptionEn: 'Compress multi-turn history, remove resolved content',
      icon: Filter,
      beforeTokens: 2156,
      afterTokens: 534,
      beforeText: '[Previous 6 turns: User asked about AWS pricing, GCP GPU availability, Azure ML Studio features, networking costs, storage options, and support response times. All questions were answered in detail.]',
      afterText: '[Compressed history: AWS pricing (answered), GCP GPU (answered), Azure ML (answered), networking (answered), storage (answered), support (answered)]',
      techniques: ['将已回答的问题压缩为摘要标记', '移除完整的回答内容，仅保留结论', '保留未解决或待跟进的问题'],
      techniquesEn: ['Compress answered questions to summary markers', 'Remove full answers, retain conclusions only', 'Retain unresolved or pending issues'],
      impact: 'critical',
    },
    {
      phase: 'Output Layer',
      phaseEn: 'Output Layer',
      title: 'Structured Reasoning Output',
      titleEn: 'Structured Reasoning Output',
      description: '结构化推理输出，减少冗余',
      descriptionEn: 'Structured reasoning output, reduce redundancy',
      icon: Gauge,
      beforeTokens: 678,
      afterTokens: 298,
      beforeText: 'Let me analyze these three cloud providers for ML workloads. First, AWS offers the most mature ecosystem with SageMaker, but can be complex to configure. GCP provides excellent TensorFlow integration and TPU access, which is great for deep learning. Azure has strong enterprise integration and good Windows support. For most ML workloads, I recommend GCP due to its superior AI/ML tooling and cost-effectiveness for training jobs. However, if you need enterprise features, Azure might be better. AWS is best if you need the broadest service ecosystem.',
      afterText: '| Provider | Strengths | Weaknesses | Best For |\n| AWS | Broad ecosystem, SageMaker | Complex, expensive | General ML, enterprise |\n| GCP | TPU access, TF integration | Smaller ecosystem | Deep learning, training |\n| Azure | Enterprise integration | Limited Linux tooling | Windows shops, corporate |\n\n**Recommendation**: GCP for deep learning, Azure for enterprise, AWS for breadth.',
      techniques: ['移除过渡句（"Let me analyze", "First"）', '使用Markdown表格替代自然语言段落', '删除重复的主语和连接词'],
      techniquesEn: ['Remove transition sentences', 'Use Markdown tables', 'Remove repeated subjects and conjunctions'],
      impact: 'high',
    },
  ],
  'content-generation': [
    {
      phase: 'Input Layer',
      phaseEn: 'Input Layer',
      title: 'Document Preprocessing',
      titleEn: 'Document Preprocessing',
      description: '预处理文档，提取核心内容',
      descriptionEn: 'Preprocess document, extract core content',
      icon: Scissors,
      beforeTokens: 48,
      afterTokens: 32,
      beforeText: 'Generate a technical summary of the attached 50-page research paper on transformer architecture optimizations',
      afterText: 'Summarize: Transformer architecture optimizations (50pp paper)',
      techniques: ['提取核心任务（Summarize）', '识别文档类型和主题', '移除冗余修饰词'],
      techniquesEn: ['Extract core task', 'Identify document type and topic', 'Remove redundant modifiers'],
      impact: 'low',
    },
    {
      phase: 'Context Layer',
      phaseEn: 'Context Layer',
      title: 'Content Extraction & Filtering',
      titleEn: 'Content Extraction & Filtering',
      description: '提取关键章节，过滤无关内容',
      descriptionEn: 'Extract key sections, filter irrelevant content',
      icon: Filter,
      beforeTokens: 12456,
      afterTokens: 4234,
      beforeText: '[Full 50-page paper: Abstract, Introduction, Related Work, Methodology (detailed), Experiments (all tables), Results (all figures), Discussion, Future Work, References (200 entries)]',
      afterText: '[Extracted: Abstract, Methodology (key algorithms), Results (main findings), Conclusion]',
      techniques: ['识别关键章节（Abstract, Methodology, Results）', '移除参考文献和附录', '过滤实验细节，保留核心发现'],
      techniquesEn: ['Identify key sections', 'Remove references and appendices', 'Filter experiment details, retain core findings'],
      impact: 'critical',
    },
    {
      phase: 'Output Layer',
      phaseEn: 'Output Layer',
      title: 'Summary Structuring',
      titleEn: 'Summary Structuring',
      description: '结构化摘要，避免逐段复述',
      descriptionEn: 'Structure summary, avoid paragraph-by-paragraph restating',
      icon: Gauge,
      beforeTokens: 1567,
      afterTokens: 534,
      beforeText: 'This paper presents several optimizations for transformer architectures. The authors first introduce the motivation behind their work, explaining that current transformers suffer from high computational costs. They then propose a novel attention mechanism that reduces complexity from O(n²) to O(n log n). The experimental results show significant improvements in training speed without sacrificing accuracy. The paper concludes with a discussion of limitations and future directions.',
      afterText: '**Key Contributions:**\n1. Novel attention mechanism: O(n²) → O(n log n)\n2. Training speed: +40% improvement\n3. Accuracy: Maintained (±0.2%)\n4. Applicable to: BERT, GPT, T5 variants\n\n**Method:** Sparse attention pattern + gradient checkpointing\n\n**Results:** Tested on GLUE, WMT, WikiText benchmarks',
      techniques: ['使用结构化标题替代自然语言段落', '提取关键数字和指标', '删除背景介绍和过渡句'],
      techniquesEn: ['Use structured headings', 'Extract key numbers and metrics', 'Remove background and transitions'],
      impact: 'high',
    },
  ],
};

// ==================== 组件 ====================
export default function Demo() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'pipeline' | 'metrics' | 'projection'>('pipeline');

  const handleScenarioSelect = useCallback((scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setHasResult(false);
  }, []);

  const handleRun = useCallback(() => {
    if (!selectedScenario) return;
    setIsRunning(true);
    setHasResult(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasResult(true);
      setExpandedSteps(new Set([0, 1, 2, 3]));
    }, 1800);
  }, [selectedScenario]);

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

  const steps = selectedScenario ? OPTIMIZATION_PIPELINE[selectedScenario] || [] : [];
  
  const totalBefore = steps.reduce((sum, s) => sum + s.beforeTokens, 0);
  const totalAfter = steps.reduce((sum, s) => sum + s.afterTokens, 0);
  const totalSavings = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;
  const totalSaved = totalBefore - totalAfter;

  const chartData = steps.map((s, i) => ({
    name: isEn ? s.titleEn : s.title,
    before: s.beforeTokens,
    after: s.afterTokens,
    saved: s.beforeTokens - s.afterTokens,
  }));

  const currentScenario = PRESET_SCENARIOS.find(s => s.id === selectedScenario);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'critical': return isEn ? 'Critical' : '关键';
      case 'high': return isEn ? 'High' : '高';
      case 'medium': return isEn ? 'Medium' : '中';
      default: return isEn ? 'Low' : '低';
    }
  };

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
            {isEn ? 'Token Optimization Engine' : 'Token 优化引擎'}
          </div>
          <h1 className="heading-hero mb-4">
            {isEn ? 'See exactly where tokens are saved' : '看清 Token 在哪里被节省'}
          </h1>
          <p className="body-text max-w-2xl mb-8 text-base text-neutral-600">
            {isEn
              ? 'Select a scenario to see the complete optimization pipeline. Every layer, every technique, every token saved — visualized.'
              : '选择场景查看完整优化流水线。每一层、每种技术、每个节省的 Token —— 可视化呈现。'}
          </p>
        </div>
      </section>

      {/* Scenario Selection */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = selectedScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className={`card p-5 text-left transition-all ${
                    isSelected 
                      ? 'ring-2 ring-black border-black' 
                      : 'hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-neutral-900">{isEn ? scenario.category : scenario.categoryZh}</h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{isEn ? scenario.description : scenario.descriptionZh}</p>
                      <p className="text-xs text-neutral-400 mt-2 font-mono">{isEn ? scenario.prompt.slice(0, 60) + '...' : scenario.promptZh.slice(0, 40) + '...'}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedScenario && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">{isEn ? 'Selected:' : '已选择：'}</span>
                <span className="text-sm font-medium text-neutral-900">{isEn ? currentScenario?.category : currentScenario?.categoryZh}</span>
              </div>
              <button 
                onClick={handleRun} 
                disabled={isRunning}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isRunning ? (isEn ? 'Processing...' : '处理中...') : (isEn ? 'Run Optimization Pipeline' : '运行优化流水线')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Loading */}
      {isRunning && (
        <section className="px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="card p-12">
              <div className="flex items-center justify-center gap-8">
                {['Input', 'Context', 'Output'].map((phase, i) => (
                  <div key={phase} className="text-center">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <span className="text-xs font-bold text-neutral-500">{phase}</span>
                    </div>
                    <p className="text-xs text-neutral-400">{isEn ? `Optimizing ${phase} Layer...` : `优化${phase}层...`}</p>
                  </div>
                ))}
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
            <div className="card bg-black text-white">
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold">{totalBefore.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Original Tokens' : '原始 Token'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{totalAfter.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Optimized Tokens' : '优化后 Token'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{totalSavings}%</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Reduction' : '减少比例'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{totalSaved.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Tokens Saved' : '节省 Token'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-200">
              {[
                { id: 'pipeline' as const, label: isEn ? 'Optimization Pipeline' : '优化流水线', icon: Layers },
                { id: 'metrics' as const, label: isEn ? 'Metrics Analysis' : '指标分析', icon: BarChart3 },
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
                  const savings = step.beforeTokens > 0 ? Math.round((1 - step.afterTokens / step.beforeTokens) * 100) : 0;
                  
                  return (
                    <div key={index} className="card overflow-hidden">
                      {/* Step Header */}
                      <div 
                        className="card-header flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors"
                        onClick={() => toggleStep(index)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-medium text-neutral-400 uppercase">{isEn ? step.phaseEn : step.phase}</span>
                            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-neutral-600" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-neutral-900">{isEn ? step.titleEn : step.title}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${getImpactColor(step.impact)}`}>
                                {getImpactLabel(step.impact)}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{isEn ? step.descriptionEn : step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">{step.beforeTokens.toLocaleString()} → {step.afterTokens.toLocaleString()}</p>
                            {savings > 0 && (
                              <p className="text-xs font-bold text-emerald-600">-{savings}%</p>
                            )}
                          </div>
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
                                <span className="text-xs font-medium text-red-600">{isEn ? 'Before Optimization' : '优化前'}</span>
                                <span className="text-xs text-neutral-400">{step.beforeTokens.toLocaleString()} tokens</span>
                              </div>
                              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                <p className="text-sm text-neutral-700 leading-relaxed font-mono text-xs">{step.beforeText}</p>
                              </div>
                            </div>

                            {/* After */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs font-medium text-emerald-600">{isEn ? 'After Optimization' : '优化后'}</span>
                                <span className="text-xs text-neutral-400">{step.afterTokens.toLocaleString()} tokens</span>
                              </div>
                              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                <p className="text-sm text-neutral-700 leading-relaxed font-mono text-xs">{step.afterText}</p>
                              </div>
                            </div>
                          </div>

                          {/* Techniques */}
                          <div className="mt-4 pt-4 border-t border-neutral-100">
                            <p className="text-xs font-semibold text-neutral-700 mb-2">{isEn ? 'Optimization Techniques:' : '优化技术：'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {(isEn ? step.techniquesEn : step.techniques).map((tech, i) => (
                                <div key={i} className="flex items-start gap-2 p-2 bg-neutral-50 rounded-lg">
                                  <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-neutral-600">{tech}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <>
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Token Reduction by Optimization Step' : '每步优化 Token 减少量'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={80} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value: number) => value.toLocaleString()}
                          />
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
                    <div className="space-y-3">
                      {steps.map((step, i) => {
                        const cumulativeBefore = steps.slice(0, i + 1).reduce((sum, s) => sum + s.beforeTokens, 0);
                        const cumulativeAfter = steps.slice(0, i + 1).reduce((sum, s) => sum + s.afterTokens, 0);
                        const widthPercent = cumulativeBefore > 0 ? (cumulativeAfter / cumulativeBefore) * 100 : 100;
                        
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500 w-28 truncate">{isEn ? step.titleEn : step.title}</span>
                            <div className="flex-1 h-8 bg-red-100 rounded overflow-hidden relative">
                              <div 
                                className="h-full bg-emerald-400 rounded transition-all duration-700"
                                style={{ width: `${widthPercent}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-neutral-700">
                                {cumulativeAfter.toLocaleString()} / {cumulativeBefore.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium w-12 text-right">
                              -{Math.round((1 - cumulativeAfter / cumulativeBefore) * 100)}%
                            </span>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-red-50 border-red-200">
                    <div className="card-body text-center">
                      <p className="text-xs text-red-600 mb-2 font-medium">{isEn ? 'Without AnyTokn' : '不使用 AnyTokn'}</p>
                      <p className="text-3xl font-bold text-red-700">${(totalBefore * 0.000015 * 1000000).toFixed(0)}</p>
                      <p className="text-xs text-red-500 mt-1">{isEn ? 'per 1M calls' : '每百万次调用'}</p>
                      <p className="text-xs text-red-400 mt-1">{totalBefore.toLocaleString()} tokens/call</p>
                    </div>
                  </div>
                  <div className="card bg-emerald-50 border-emerald-200">
                    <div className="card-body text-center">
                      <p className="text-xs text-emerald-600 mb-2 font-medium">{isEn ? 'With AnyTokn' : '使用 AnyTokn'}</p>
                      <p className="text-3xl font-bold text-emerald-700">${(totalAfter * 0.000015 * 1000000).toFixed(0)}</p>
                      <p className="text-xs text-emerald-500 mt-1">{isEn ? 'per 1M calls' : '每百万次调用'}</p>
                      <p className="text-xs text-emerald-400 mt-1">{totalAfter.toLocaleString()} tokens/call</p>
                    </div>
                  </div>
                  <div className="card bg-blue-50 border-blue-200">
                    <div className="card-body text-center">
                      <p className="text-xs text-blue-600 mb-2 font-medium">{isEn ? 'Monthly Savings' : '月度节省'}</p>
                      <p className="text-3xl font-bold text-blue-700">${((totalBefore - totalAfter) * 0.000015 * 1000000).toFixed(0)}</p>
                      <p className="text-xs text-blue-500 mt-1">{totalSavings}% {isEn ? 'reduction' : '减少'}</p>
                      <p className="text-xs text-blue-400 mt-1">{isEn ? 'at 1M calls/month' : '每月百万次调用'}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Break-even Analysis' : '盈亏平衡分析'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: isEn ? 'Daily Calls' : '日调用量', value: '10,000' },
                        { label: isEn ? 'Daily Savings' : '日节省', value: `$${((totalBefore - totalAfter) * 0.000015 * 10000).toFixed(2)}` },
                        { label: isEn ? 'Monthly Savings' : '月节省', value: `$${((totalBefore - totalAfter) * 0.000015 * 300000).toFixed(0)}` },
                        { label: isEn ? 'Annual Savings' : '年节省', value: `$${((totalBefore - totalAfter) * 0.000015 * 3600000).toFixed(0)}` },
                      ].map((item, i) => (
                        <div key={i} className="text-center p-3 bg-neutral-50 rounded-lg">
                          <p className="text-xs text-neutral-500 mb-1">{item.label}</p>
                          <p className="text-lg font-bold text-neutral-900">{item.value}</p>
                        </div>
                      ))}
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
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? 'Optimize every layer of your LLM pipeline' : '优化 LLM 流水线的每一层'}</h2>
          <p className="text-neutral-400 mb-8">{isEn ? 'From input compression to output formatting, AnyTokn reduces tokens at every step.' : '从输入压缩到输出格式化，AnyTokn 在每一步都减少 Token。'}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              {isEn ? 'Start Optimizing' : '开始优化'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/docs" className="btn-secondary inline-flex items-center gap-2">
              {isEn ? 'Read Documentation' : '阅读文档'}
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
