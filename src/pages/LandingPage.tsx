import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon,
  Globe,
  ArrowRight,
  Shield,
  Zap,
  Check,
  Menu,
  X,
  BarChart3,
  Lock,
  Users,
  Target,
  Code2,
  Layers,
  Sparkles,
  ChevronRight,
  Cpu,
  LineChart,
  Wallet,
  Bell,
  TrendingDown,
  PieChart,
  Activity,
  FileText,
  Building2,
  GraduationCap,
  Bot,
} from 'lucide-react';
import { type Language } from '../i18n';

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

// Value Card Component
const ValueCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

// Scene Card Component
const SceneCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-5 rounded-lg bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

// Stat Card Component
const StatCard = ({ value, label, sublabel }: { value: string; label: string; sublabel: string }) => (
  <div className="text-center p-6">
    <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{value}</div>
    <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>
    <div className="text-xs text-slate-500">{sublabel}</div>
  </div>
);

// Trust Item Component
const TrustItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <Check className="w-4 h-4 text-blue-500" />
    <span>{text}</span>
  </div>
);

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('zh');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const coreValues = [
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: lang === 'zh' ? '减少低价值 Token 消耗' : 'Reduce Low-Value Token Usage',
      description: lang === 'zh' 
        ? '识别上下文冗余、重复输入和粗放调用，减少不必要的推理支出。'
        : 'Identify context redundancy, repetitive inputs, and coarse calls to reduce unnecessary inference costs.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: lang === 'zh' ? '保护输出质量' : 'Protect Output Quality',
      description: lang === 'zh'
        ? '在质量约束下做优化，避免节省带来结果退化。'
        : 'Optimize under quality constraints to avoid degradation from cost savings.',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: lang === 'zh' ? '建立长期优化能力' : 'Build Long-term Optimization',
      description: lang === 'zh'
        ? '不是只优化一次请求，而是持续改进后续 Token 使用效率。'
        : 'Not just optimizing a single request, but continuously improving Token usage efficiency.',
    },
  ];

  const capabilities = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: lang === 'zh' ? '高质量感知压缩引擎' : 'Quality-Aware Compression Engine',
      description: lang === 'zh' 
        ? '在不破坏关键语义和任务完成度的前提下，压缩低价值 Token 输入。'
        : 'Compress low-value Token inputs without breaking key semantics and task completion.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: lang === 'zh' ? 'Token 调度引擎' : 'Token Scheduling Engine',
      description: lang === 'zh'
        ? '根据任务复杂度、质量目标和工作流优先级，动态分配 Token 资源。'
        : 'Dynamically allocate Token resources based on task complexity, quality goals, and workflow priority.',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: lang === 'zh' ? '长期追踪数据优化' : 'Long-term Tracking Optimization',
      description: lang === 'zh'
        ? '基于历史调用、成本表现和结果反馈，持续优化未来的使用策略。'
        : 'Continuously optimize future usage strategies based on historical calls, cost performance, and result feedback.',
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: lang === 'zh' ? '预算与策略控制' : 'Budget & Strategy Control',
      description: lang === 'zh'
        ? '把成本约束、使用边界和优化规则纳入统一控制体系。'
        : 'Integrate cost constraints, usage boundaries, and optimization rules into a unified control system.',
    },
  ];

  const scenes = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: lang === 'zh' ? 'AIGC 运营' : 'AIGC Operations',
      description: lang === 'zh' ? '降低内容生成链路中的 Token 浪费，提升生产效率与预算可控性。' : 'Reduce Token waste in content generation pipelines.',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: lang === 'zh' ? '办公生产力' : 'Office Productivity',
      description: lang === 'zh' ? '优化知识问答、文档生成与内部 Copilot 的长期使用成本。' : 'Optimize long-term usage costs for knowledge Q&A and document generation.',
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      title: lang === 'zh' ? '金融与合规' : 'Finance & Compliance',
      description: lang === 'zh' ? '在更重视准确性、稳定性与审慎性的流程中实现更稳健的成本控制。' : 'Achieve more robust cost control in accuracy-focused processes.',
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      title: lang === 'zh' ? 'AI 教育' : 'AI Education',
      description: lang === 'zh' ? '支撑大规模教学辅助、反馈生成与互动问答场景的持续优化。' : 'Support continuous optimization for large-scale teaching assistance.',
    },
    {
      icon: <Bot className="w-4 h-4" />,
      title: lang === 'zh' ? 'Agent 自动化' : 'Agent Automation',
      description: lang === 'zh' ? '为多步骤、长链路 Agent 工作流建立更合理的 Token 使用方式。' : 'Establish more reasonable Token usage for multi-step Agent workflows.',
    },
  ];

  const trustItems = [
    lang === 'zh' ? '权限隔离' : 'Permission Isolation',
    lang === 'zh' ? '成本归因' : 'Cost Attribution',
    lang === 'zh' ? '预算控制' : 'Budget Control',
    lang === 'zh' ? '策略执行' : 'Policy Enforcement',
    lang === 'zh' ? '可视化追踪' : 'Visual Tracking',
    lang === 'zh' ? '私有化部署准备' : 'Private Deployment Ready',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">AnyTokn</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '平台' : 'Platform'}
              </a>
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '解决方案' : 'Solutions'}
              </a>
              <a href="#engine" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '优化引擎' : 'Optimization Engine'}
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '定价' : 'Pricing'}
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'zh' ? 'EN' : '中文'}</span>
              </button>

              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {lang === 'zh' ? '预约试点' : 'Book Pilot'}
              </Link>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <nav className="flex flex-col gap-4">
                <a href="#platform" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '平台' : 'Platform'}</a>
                <a href="#solutions" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '解决方案' : 'Solutions'}</a>
                <a href="#engine" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '优化引擎' : 'Optimization Engine'}</a>
                <a href="#pricing" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '定价' : 'Pricing'}</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                {lang === 'zh' ? '控制 AI 成本' : 'Control AI Costs'}
                <br />
                <span className="text-blue-600">{lang === 'zh' ? '不牺牲质量' : 'Without Sacrificing Quality'}</span>
              </h1>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {lang === 'zh'
                  ? 'AnyTokn 是企业级高质量 Token 优化与成本控制系统。通过高质量感知压缩引擎、Token 调度与长期追踪优化，帮助企业在生成式 AI 生产工作流中系统性降低成本。'
                  : 'AnyTokn is an enterprise-grade high-quality Token optimization and cost control system.'}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  lang === 'zh' ? '成本可视化' : 'Cost Visibility',
                  lang === 'zh' ? '高质量优化' : 'Quality Optimization',
                  lang === 'zh' ? '策略控制' : 'Policy Control',
                  lang === 'zh' ? '节省可追踪' : 'Trackable Savings',
                ].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  {lang === 'zh' ? '预约试点' : 'Book Pilot'}
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-center"
                >
                  {lang === 'zh' ? '联系团队' : 'Contact Team'}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
              <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-medium text-slate-600">{lang === 'zh' ? '成本概览' : 'Cost Overview'}</div>
                  <div className="text-xs text-slate-400">{lang === 'zh' ? '实时' : 'Real-time'}</div>
                </div>
                <div className="h-32 bg-slate-50 rounded-lg flex items-end p-3 gap-1 mb-4">
                  {[35, 55, 40, 70, 50, 65, 45, 80, 55, 75, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%`, opacity: 0.6 + (i % 3) * 0.2 }} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">¥12.5K</div>
                    <div className="text-xs text-slate-500">{lang === 'zh' ? '本月成本' : 'Monthly Cost'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">-35%</div>
                    <div className="text-xs text-slate-500">{lang === 'zh' ? '优化节省' : 'Savings'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">98%</div>
                    <div className="text-xs text-slate-500">{lang === 'zh' ? '质量保持' : 'Quality'}</div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500 mt-4">
                {lang === 'zh' ? '让每一笔 Token 支出更可见、更可控、更值得。' : 'Make every Token expenditure more visible, controllable, and worthwhile.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Section */}
      <section id="platform" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {lang === 'zh' ? '为真实生产环境中的 AI 成本问题而构建' : 'Built for Real Production AI Cost Challenges'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'zh'
                ? 'AnyTokn 解决的不是"少用一点 Token"这样的局部问题，而是企业在规模化使用生成式 AI 后普遍出现的核心经营问题：大量 Token 支出并没有稳定转化为等比例业务价值。'
                : 'AnyTokn addresses not just "using fewer Tokens" but the core business problem: Token spending does not consistently translate into proportional business value.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, i) => (
              <ValueCard key={i} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="engine" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {lang === 'zh' ? '一套面向高质量节省的系统能力' : 'A System for Quality-Focused Savings'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'zh'
                ? 'AnyTokn 不是一次性的 Prompt 压缩工具，也不是简单的模型路由或成本看板。它围绕高质量节省，把压缩、调度和长期优化统一在同一套产品体系中。'
                : 'AnyTokn is not a one-time Prompt compression tool or simple model routing. It unifies compression, scheduling, and long-term optimization.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <FeatureCard key={i} {...cap} />
            ))}
          </div>
        </div>
      </section>

      {/* Scenes Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {lang === 'zh' ? '适用于真实的生成式 AI 工作流' : 'For Real Generative AI Workflows'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene, i) => (
              <SceneCard key={i} {...scene} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Proof Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {lang === 'zh' ? '看见支出，识别浪费，持续优化' : 'See Spending, Identify Waste, Continuously Optimize'}
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                {lang === 'zh'
                  ? '从团队、项目和工作流维度追踪 Token 消耗，识别可压缩、可调度、可治理的使用模式，并持续衡量优化结果。'
                  : 'Track Token consumption from team, project, and workflow dimensions, identifying compressible, schedulable, and governable usage patterns.'}
              </p>
              <div className="space-y-3">
                {[
                  lang === 'zh' ? '查看成本分布与异常波动' : 'View cost distribution and anomalies',
                  lang === 'zh' ? '识别低价值 Token 消耗' : 'Identify low-value Token consumption',
                  lang === 'zh' ? '应用预算与策略控制' : 'Apply budget and policy controls',
                  lang === 'zh' ? '追踪节省结果与质量表现' : 'Track savings results and quality performance',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-lg font-medium text-blue-400">
                {lang === 'zh' ? 'AnyTokn 的价值，不是更便宜地调用模型，而是更高质量地节省成本。' : 'AnyTokn\'s value is not cheaper model calls, but higher-quality cost savings.'}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
              <div className="relative bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-medium text-slate-300">{lang === 'zh' ? '成本分析' : 'Cost Analysis'}</div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-sm text-slate-300">{lang === 'zh' ? '重复上下文' : 'Repeated Context'}</span>
                    <span className="text-sm font-semibold text-red-400">-28%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-sm text-slate-300">{lang === 'zh' ? '模型调度' : 'Model Routing'}</span>
                    <span className="text-sm font-semibold text-emerald-400">-15%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-sm text-slate-300">{lang === 'zh' ? '语义缓存' : 'Semantic Cache'}</span>
                    <span className="text-sm font-semibold text-emerald-400">-22%</span>
                  </div>
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang === 'zh' ? '总计节省' : 'Total Savings'}</span>
                      <span className="text-2xl font-bold text-emerald-400">-35%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {lang === 'zh' ? '面向企业部署而构建' : 'Built for Enterprise Deployment'}
            </h2>
            <p className="text-slate-600">
              {lang === 'zh'
                ? '治理不是 AnyTokn 的主定义，但它是高质量节省体系进入企业生产环境的必要条件。'
                : 'Governance is not AnyTokn\'s main definition, but it is necessary for enterprise production environments.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
                <TrustItem text={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            {lang === 'zh' ? '为正在把 AI 从试验推向生产的团队而设计' : 'Designed for Teams Moving AI from Experiment to Production'}
          </h2>
          
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
              &ldquo;{lang === 'zh'
                ? 'AnyTokn 帮我们第一次真正看清了 AI 成本花在什么地方，也让优化不再只是一次性技巧，而变成持续运行的系统能力。'
                : 'AnyTokn helped us truly see where AI costs are spent for the first time, turning optimization from a one-time trick into a continuously running system capability.'}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {lang === 'zh' ? '试' : 'P'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{lang === 'zh' ? '试点客户' : 'Pilot Customer'}</p>
                <p className="text-sm text-slate-500">{lang === 'zh' ? 'AI 平台团队' : 'AI Platform Team'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {lang === 'zh' ? '优化的价值，会随着规模放大' : 'Optimization Value Scales with Size'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              value={lang === 'zh' ? 'XX 万 / XX 亿' : 'XX M / XX B'} 
              label={lang === 'zh' ? '已优化 Token' : 'Tokens Optimized'} 
              sublabel={lang === 'zh' ? '覆盖生产级生成式 AI 调用' : 'Covering production generative AI calls'}
            />
            <StatCard 
              value="XX%" 
              label={lang === 'zh' ? '识别出的潜在浪费' : 'Potential Waste Identified'} 
              sublabel={lang === 'zh' ? '来自重复上下文与低价值输入模式' : 'From repeated context and low-value input patterns'}
            />
            <StatCard 
              value="XX" 
              label={lang === 'zh' ? '受控工作流' : 'Controlled Workflows'} 
              sublabel={lang === 'zh' ? '纳入预算与优化策略管理' : 'Under budget and optimization policy management'}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {lang === 'zh' ? '把 Token 从不断膨胀的成本项，变成可持续优化的生产资源' : 'Transform Token from an Ever-Expanding Cost into a Continuously Optimizable Production Resource'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {lang === 'zh'
              ? '面向真实生成式 AI 工作流，建立更高质量、更可控、可持续优化的成本结构。'
              : 'For real generative AI workflows, establish a higher-quality, more controllable, and continuously optimizable cost structure.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              {lang === 'zh' ? '预约试点' : 'Book Pilot'}
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              {lang === 'zh' ? '联系团队' : 'Contact Team'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '产品' : 'Product'}</h4>
              <ul className="space-y-2">
                <li><a href="#platform" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '平台' : 'Platform'}</a></li>
                <li><a href="#engine" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '优化引擎' : 'Optimization Engine'}</a></li>
                <li><a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '定价' : 'Pricing'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '解决方案' : 'Solutions'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">AIGC</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '办公生产力' : 'Productivity'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '金融合规' : 'Finance'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '资源' : 'Resources'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '文档' : 'Docs'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '关于我们' : 'About'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '联系' : 'Contact'}</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Hexagon className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white">AnyTokn</span>
            </div>
            <p className="text-sm text-slate-500">
              {lang === 'zh' 
                ? 'AnyTokn 帮助企业在不牺牲输出质量的前提下，系统性减少低价值 Token 消耗。'
                : 'AnyTokn helps enterprises systematically reduce low-value Token consumption without sacrificing output quality.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
