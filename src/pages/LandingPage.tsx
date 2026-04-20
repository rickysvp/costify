import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ArrowRight,
  Terminal,
  Zap,
  ShieldCheck,
  BarChart3,
  Search,
  Globe,
} from "lucide-react";
import { type Language } from '../i18n';

// --- Components ---

const Navbar = ({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = {
    zh: { platform: '平台', solutions: '解决方案', engine: '优化引擎', pricing: '定价', bookPilot: '预约试点' },
    en: { platform: 'Platform', solutions: 'Solutions', engine: 'Optimization Engine', pricing: 'Pricing', bookPilot: 'Book a Pilot' }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-sm">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AnyTokn</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
            <a href="#platform" className="hover:text-indigo-600 transition-colors">{navItems[lang].platform}</a>
            <a href="#solutions" className="hover:text-indigo-600 transition-colors">{navItems[lang].solutions}</a>
            <a href="#engine" className="hover:text-indigo-600 transition-colors">{navItems[lang].engine}</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">{navItems[lang].pricing}</a>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
            <Link 
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm shadow-indigo-100"
            >
              {navItems[lang].bookPilot}
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-6 space-y-4">
          <a href="#platform" className="block text-lg font-medium text-slate-900">{navItems[lang].platform}</a>
          <a href="#solutions" className="block text-lg font-medium text-slate-900">{navItems[lang].solutions}</a>
          <a href="#engine" className="block text-lg font-medium text-slate-900">{navItems[lang].engine}</a>
          <a href="#pricing" className="block text-lg font-medium text-slate-900">{navItems[lang].pricing}</a>
          <Link to="/login" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-center">
            {navItems[lang].bookPilot}
          </Link>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      badge: '企业级 AI 成本效率',
      title: '控制 AI 成本，',
      titleHighlight: '不牺牲质量',
      subtitle: 'AnyTokn 是企业级高质量 Token 优化与成本控制系统。通过高质量感知压缩引擎、Token 调度与长期追踪优化，帮助企业在生成式 AI 生产工作流中系统性降低成本。',
      cta1: '预约试点',
      cta2: '联系团队',
      dashboardLabel: '让每一笔 Token 支出更可见、更可控、更值得。',
      sidebarItems: ['成本可视化', '高质量优化', '策略控制', '节省可追踪']
    },
    en: {
      badge: 'Enterprise AI Cost Efficiency',
      title: 'Control AI cost without',
      titleHighlight: 'compromising quality',
      subtitle: 'AnyTokn is an enterprise-grade token optimization and cost control system for generative AI workflows. Reduce wasted token spend with quality-aware compression, token orchestration, and long-term optimization.',
      cta1: 'Book a Pilot',
      cta2: 'Speak with the Team',
      dashboardLabel: 'Operational visibility for high-quality savings',
      sidebarItems: ['Spend visibility', 'Quality-aware optimization', 'Policy controls', 'Measurable savings']
    }
  };

  const t = content[lang];

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-tight"
        >
          {t.badge}
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.title}<br />
          <span className="text-indigo-600">{t.titleHighlight}</span>
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t.subtitle}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link 
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
          >
            {t.cta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login"
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
          >
            {t.cta2}
          </Link>
        </motion.div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto relative group">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-100 shadow-sm text-sm font-semibold text-slate-500 z-20">
          {t.dashboardLabel}
        </div>
        {/* Floating Icons Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[10%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3s' }}>
            <img src="https://picsum.photos/seed/openai/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">OpenAI</span>
          </div>
          <div className="absolute bottom-40 left-[5%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '4s' }}>
            <img src="https://picsum.photos/seed/anthropic/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Anthropic</span>
          </div>
          <div className="absolute top-32 right-[8%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3.5s' }}>
            <img src="https://picsum.photos/seed/google/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-center leading-none text-slate-900">Google<br />Gemini</span>
          </div>
          <div className="absolute top-10 right-[15%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '4.5s' }}>
            <img src="https://picsum.photos/seed/groq/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Groq</span>
          </div>
          <div className="absolute bottom-20 right-[12%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '5s' }}>
            <img src="https://picsum.photos/seed/llama/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Llama</span>
          </div>
          <div className="absolute bottom-40 right-[4%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3.2s' }}>
            <img src="https://picsum.photos/seed/mistral/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Mistral AI</span>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="flex-1 px-8">
              <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-xl py-1.5 px-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <div className="h-2 w-32 bg-slate-200 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
            </div>
          </div>
          <div className="flex h-[550px]">
            <aside className="w-64 border-r border-slate-100 p-8 shrink-0 hidden md:block space-y-6">
              {t.sidebarItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 ${i === 0 ? 'text-indigo-600 bg-indigo-50/50 p-3 rounded-2xl -mx-3' : 'text-slate-400'}`}>
                  <div className={`w-5 h-5 rounded-lg shrink-0 ${i === 0 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  <span className={`text-xs font-bold ${i === 0 ? 'text-indigo-700' : 'text-slate-400'}`}>{item}</span>
                </div>
              ))}
            </aside>
            <main className="flex-1 p-10 space-y-10 overflow-hidden">
               <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-6 w-64 bg-slate-100 rounded-lg" />
                    <div className="h-3 w-40 bg-slate-50 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2 text-xs font-semibold text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Cloud Live</span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                      <div className="flex justify-between">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <div className="w-4 h-4 bg-indigo-500 rounded" />
                        </div>
                        <span className="text-green-500 text-xs font-bold">+12%</span>
                      </div>
                      <div className="h-2 w-16 bg-slate-50 rounded-full" />
                      <div className="h-6 w-24 bg-slate-900 rounded-lg" />
                    </div>
                  ))}
               </div>
               <div className="h-72 bg-slate-50 border border-slate-100 rounded-3xl flex items-end p-8 gap-3">
                  {[4,2,7,5,8,3,9,1,4,6,2,8,3,4,6,3,1,7,8,4].map((h, i) => (
                    <motion.div 
                      key={i} 
                      className={`flex-1 rounded-t-xl transition-all ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 10}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  ))}
               </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const IntegrationPanel = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '一套面向高质量节省的系统能力',
      subtitle: 'AnyTokn 不是一次性的 Prompt 压缩工具，也不是简单的模型路由或成本看板。它围绕高质量节省，把压缩、调度和长期优化统一在同一套产品体系中。',
      capabilities: [
        { title: "高质量感知压缩引擎", desc: "在不破坏关键语义和任务完成度的前提下，压缩低价值 Token 输入。" },
        { title: "Token 调度引擎", desc: "根据任务复杂度、质量目标和工作流优先级，动态分配 Token 资源。" },
        { title: "长期追踪数据优化", desc: "基于历史调用、成本表现和结果反馈，持续优化未来的使用策略。" },
        { title: "预算与策略控制", desc: "把成本约束、使用边界和优化规则纳入统一控制体系。" }
      ],
      codeComment: '# AnyTokn 优化已激活',
      codeWorkflow: 'enterprise-copilot-v2',
      codeQuality: '0.98',
      codePriority: 'high'
    },
    en: {
      title: 'A high-quality savings system for production AI',
      subtitle: 'AnyTokn is not a one-off prompt compression tool. It is a system designed to continuously improve the cost-quality balance of enterprise generative AI.',
      capabilities: [
        { title: "Quality-aware compression engine", desc: "Compress low-value context and redundant input while preserving the information that matters for task completion." },
        { title: "Token orchestration engine", desc: "Allocate token budget by task complexity, workflow priority, and quality target." },
        { title: "Long-term optimization loop", desc: "Use historical performance and usage patterns to continuously refine future token efficiency." },
        { title: "Budget and policy controls", desc: "Turn optimization into a governed operating layer with visibility, limits, and enforcement." }
      ],
      codeComment: '# AnyTokn optimization active',
      codeWorkflow: 'enterprise-copilot-v2',
      codeQuality: '0.98',
      codePriority: 'high'
    }
  };

  const t = content[lang];

  const capabilities = [
    { title: t.capabilities[0].title, desc: t.capabilities[0].desc, icon: <Zap className="w-5 h-5" />, color: "text-indigo-400 bg-indigo-400/10" },
    { title: t.capabilities[1].title, desc: t.capabilities[1].desc, icon: <Terminal className="w-5 h-5" />, color: "text-emerald-400 bg-emerald-400/10" },
    { title: t.capabilities[2].title, desc: t.capabilities[2].desc, icon: <BarChart3 className="w-5 h-5" />, color: "text-amber-400 bg-amber-400/10" },
    { title: t.capabilities[3].title, desc: t.capabilities[3].desc, icon: <ShieldCheck className="w-5 h-5" />, color: "text-purple-400 bg-purple-400/10" }
  ];

  const [activeCap, setActiveCap] = useState(0);

  return (
    <section id="engine" className="py-32 px-4 bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{t.title}</h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">{t.subtitle}</p>
      </div>
      <div className="max-w-5xl mx-auto rounded-[32px] bg-slate-800/30 border border-slate-700/30 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-700/30">
          {capabilities.map((cap, i) => (
            <button 
              key={i}
              onClick={() => setActiveCap(i)}
              className={`flex flex-col items-center gap-3 px-6 py-8 transition-all border-r border-slate-700/30 last:border-r-0 ${activeCap === i ? 'bg-slate-800/50' : 'hover:bg-slate-800/20'}`}
            >
              <div className={`p-3 rounded-xl ${cap.color}`}>
                {cap.icon}
              </div>
              <span className={`text-xs font-bold text-center leading-tight ${activeCap === i ? 'text-white' : 'text-slate-500'}`}>{cap.title}</span>
            </button>
          ))}
        </div>
        <div className="p-16 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl font-bold">{capabilities[activeCap].title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{capabilities[activeCap].desc}</p>
          </div>
          <div className="w-full max-w-2xl bg-[#080b10] rounded-2xl border border-slate-700/50 p-8 font-mono text-sm overflow-hidden">
             <div className="flex gap-2 mb-6 opacity-30">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
             </div>
             <div className="text-left space-y-2">
                <p className="text-indigo-400">{t.codeComment}</p>
                <p><span className="text-emerald-400">await</span> anytokn.optimize({'{'}</p>
                <p>&nbsp;&nbsp;workflowId: <span className="text-emerald-400">"{t.codeWorkflow}"</span>,</p>
                <p>&nbsp;&nbsp;qualityConstraint: <span className="text-amber-400">{t.codeQuality}</span>,</p>
                <p>&nbsp;&nbsp;priority: <span className="text-indigo-400">"{t.codePriority}"</span></p>
                <p>{'})'};</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '为真实生产环境中的 AI 成本问题而构建',
      cards: [
        { title: "减少低价值 Token 消耗", desc: "识别上下文冗余、重复输入和粗放调用，减少不必要的推理支出。", badge: "发现浪费", badgeValue: "-42% Tokens", iconColor: "bg-red-50 text-red-600 fill-red-600" },
        { title: "保护输出质量", desc: "在质量约束下做优化，避免节省带来结果退化。", badge: "质量不变", badgeValue: "99.8%", iconColor: "bg-emerald-50 text-emerald-600" },
        { title: "建立长期优化能力", desc: "不是只优化一次请求，而是持续改进后续 Token 使用效率。", items: [{ label: '全局预算', val: '84%', color: 'bg-indigo-500' }, { label: 'Token 策略', val: '已激活', color: 'bg-emerald-500' }, { label: '成本上限', val: '¥12k/月', color: 'bg-amber-500' }] }
      ]
    },
    en: {
      title: 'Built to reduce waste, protect quality, and improve control',
      cards: [
        { title: "Reduce wasted token spend", desc: "Identify low-value token usage across prompts, context, and multi-step workflows before it turns into recurring cost.", badge: "Waste detected", badgeValue: "-42% Tokens", iconColor: "bg-red-50 text-red-600 fill-red-600" },
        { title: "Protect output quality", desc: "Optimize under quality constraints so efficiency gains do not come at the expense of task performance.", badge: "Quality Invariant", badgeValue: "99.8%", iconColor: "bg-emerald-50 text-emerald-600" },
        { title: "Improve operational control", desc: "Apply budgets, policies, and workflow-level optimization logic across production AI usage.", items: [{ label: 'Global Budget', val: '84%', color: 'bg-indigo-500' }, { label: 'Token Policy', val: 'Active', color: 'bg-emerald-500' }, { label: 'Cost Limit', val: '$12k/mo', color: 'bg-amber-500' }] }
      ]
    }
  };

  const t = content[lang];

  return (
    <section id="platform" className="py-32 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">{t.title}</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-indigo-50 w-fit rounded-2xl">
              <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{t.cards[0].title}</h3>
            <p className="text-slate-500 leading-relaxed">{t.cards[0].desc}</p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center relative h-56 justify-center overflow-hidden">
             <div className="w-full space-y-2 opacity-40">
                <div className="h-2 w-3/4 bg-slate-200 rounded" />
                <div className="h-2 w-1/2 bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-200 rounded" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 scale-110">
                   <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Zap className="w-4 h-4 fill-red-600" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t.cards[0].badge}</span>
                      <span className="text-sm font-bold text-slate-900">{t.cards[0].badgeValue}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-emerald-50 w-fit rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{t.cards[1].title}</h3>
            <p className="text-slate-500 leading-relaxed">{t.cards[1].desc}</p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center relative h-56 justify-center overflow-hidden">
             <div className="h-32 w-32 border-4 border-emerald-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-2xl font-black text-emerald-600">{t.cards[1].badgeValue}</span>
             </div>
             <span className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t.cards[1].badge}</span>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-amber-50 w-fit rounded-2xl">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{t.cards[2].title}</h3>
            <p className="text-slate-500 leading-relaxed">{t.cards[2].desc}</p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col space-y-4 h-56">
             {t.cards[2].items?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                   <span className="text-xs font-bold text-slate-500">{item.label}</span>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${item.color}`}>{item.val}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Solutions = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '适用于真实的生成式 AI 工作流',
      solutions: [
        { title: "AIGC 运营", desc: "降低内容生成链路中的 Token 浪费，提升生产效率与预算可控性。" },
        { title: "办公生产力", desc: "优化知识问答、文档生成与内部 Copilot 的长期使用成本。" },
        { title: "金融与合规", desc: "在更重视准确性、稳定性与审慎性的流程中实现更稳健的成本控制。" },
        { title: "AI 教育", desc: "支撑大规模教学辅助、反馈生成与互动问答场景的持续优化。" },
        { title: "Agent 自动化", desc: "为多步骤、长链路 Agent 工作流建立更合理的 Token 使用方式。" }
      ]
    },
    en: {
      title: 'Built for real generative AI workloads',
      solutions: [
        { title: "AIGC Operations", desc: "Improve efficiency across content production pipelines with lower token waste and more predictable costs." },
        { title: "Workplace Productivity", desc: "Optimize internal copilots, knowledge workflows, and document generation without degrading usefulness." },
        { title: "Finance & Compliance", desc: "Support more controlled AI usage in workflows where quality, traceability, and policy discipline matter." },
        { title: "AI Education", desc: "Reduce the long-term cost of tutoring, feedback, and large-scale learning interactions." },
        { title: "Agentic Automation", desc: "Control token usage across multi-step agent workflows with clearer efficiency logic and better guardrails." }
      ]
    }
  };

  const t = content[lang];

  return (
    <section id="solutions" className="py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-16 text-center">{t.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {t.solutions.map((sol, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-200 transition-all group">
              <h4 className="text-lg font-bold text-slate-900 mb-4">{sol.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">{sol.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LogoCloud = () => {
  const logos = [
    { name: 'together.ai', url: 'https://picsum.photos/seed/t1/100/30' },
    { name: 'GA WOLF', url: 'https://picsum.photos/seed/t2/100/30' },
    { name: 'CLAY', url: 'https://picsum.photos/seed/t3/100/30' },
    { name: 'Flevine', url: 'https://picsum.photos/seed/t4/100/30' },
    { name: 'PadPitch', url: 'https://picsum.photos/seed/t5/100/30' },
  ];

  return (
    <section className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Used across high-consumption generative AI workflows</p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all">
          {logos.map(logo => (
            <div key={logo.name} className="flex items-center gap-2">
               <img src={logo.url} alt={logo.name} className="h-6 md:h-8 object-contain" referrerPolicy="no-referrer" />
               <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Proof = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '看见支出，识别浪费，持续优化',
      subtitle: '从团队、项目和工作流维度追踪 Token 消耗，识别可压缩、可调度、可治理的使用模式，并持续衡量优化结果。',
      bullets: ["工作流级支出可视化", "按使用模式识别优化机会", "质量敏感的控制逻辑", "随时间的节省追踪"],
      badge: "平均成本降低 -30%"
    },
    en: {
      title: 'See where cost goes — and where savings come from',
      subtitle: 'Track spend across teams, projects, and workflows. Identify optimization opportunities, apply controls, and measure results over time.',
      bullets: ["Workflow-level spend visibility", "Optimization opportunities by usage pattern", "Quality-sensitive control logic", "Savings tracking over time"],
      badge: "-30% Avg Cost Reduction"
    }
  };

  const t = content[lang];

  return (
    <section className="py-32 px-4 bg-slate-50 border-t border-slate-100">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">{t.title}</h2>
             <p className="text-lg text-slate-500 leading-relaxed">{t.subtitle}</p>
             <div className="space-y-4">
                {t.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                     </div>
                     <span className="text-slate-700 font-medium">{bullet}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="flex-1 bg-white rounded-[40px] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative">
             <div className="space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                      <div className="h-8 w-40 bg-slate-900 rounded-xl" />
                   </div>
                   <div className="h-12 w-32 bg-indigo-50 border border-indigo-100 rounded-xl" />
                </div>
                <div className="space-y-6">
                   {[65, 42, 88].map((w, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Workflow {i+1}</span>
                           <span>{w}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all" style={{ width: `${w}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold shadow-emerald-500/20 italic">
                {t.badge}
             </div>
          </div>
       </div>
    </section>
  );
};

const Testimonial = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '为正在把 AI 从试验推向生产的团队而设计',
      quote: 'AnyTokn 帮我们第一次真正看清了 AI 成本花在什么地方，也让优化不再只是一次性技巧，而变成持续运行的系统能力。',
      author: '试点客户',
      role: 'AI 平台团队'
    },
    en: {
      title: 'Designed for teams moving AI from experimentation to production',
      quote: 'AnyTokn helped us move from rough AI spend estimates to a more controllable and explainable cost structure.',
      author: 'Pilot customer',
      role: 'AI platform team'
    }
  };

  const t = content[lang];

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h2>
      </div>
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] px-10 py-24 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        
        <div className="flex flex-col items-center text-center space-y-12 relative z-10">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400" />
          </div>
          <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-white tracking-tight max-w-3xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-bold text-white uppercase tracking-widest text-sm">{t.author}</p>
            <p className="text-lg font-medium text-slate-400">{t.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '优化的价值，会随着规模放大',
      stat1: { value: 'XX 万 / XX 亿', label: '已优化 Token', desc: '覆盖生产级生成式 AI 调用' },
      stat2: { value: 'XX%', label: '识别出的潜在浪费', desc: '来自重复上下文与低价值输入模式' },
      stat3: { value: 'XX', label: '受控工作流', desc: '纳入预算与优化策略管理' }
    },
    en: {
      title: 'Optimization becomes more valuable at scale',
      stat1: { value: 'XXM+', label: 'tokens optimized', desc: 'Across production AI workflows' },
      stat2: { value: 'XX%', label: 'potential waste identified', desc: 'Across repeated prompt and context patterns' },
      stat3: { value: 'XX', label: 'workflows under control', desc: 'With policy-aware optimization logic' }
    }
  };

  const t = content[lang];

  return (
    <section className="py-32 px-4 bg-slate-50 border-y border-slate-200 text-center">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0">
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-indigo-600">{t.stat1.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{t.stat1.label}</p>
            <p className="text-slate-500">{t.stat1.desc}</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-emerald-500">{t.stat2.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{t.stat2.label}</p>
            <p className="text-slate-500">{t.stat2.desc}</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8">
          <p className="text-6xl font-black tracking-tighter text-amber-500">{t.stat3.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{t.stat3.label}</p>
            <p className="text-slate-500">{t.stat3.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Enterprise = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '面向企业部署而构建',
      subtitle: '治理不是 AnyTokn 的主定义，但它是高质量节省体系进入企业生产环境的必要条件。',
      items: ["权限隔离", "成本归因", "预算控制", "策略执行", "可视化追踪", "私有化部署准备"],
      status: '就绪'
    },
    en: {
      title: 'Built for enterprise deployment',
      subtitle: 'Governance is not the product identity of AnyTokn, but it is a necessary condition for high-quality savings in production environments.',
      items: ["Role-based access", "Cost attribution", "Budget controls", "Policy enforcement", "Auditability", "Private deployment readiness"],
      status: 'Ready'
    }
  };

  const t = content[lang];

  return (
    <section className="py-32 px-4 bg-slate-900 overflow-hidden text-white relative">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{t.title}</h2>
             <p className="text-slate-400 text-lg leading-relaxed">{t.subtitle}</p>
             <div className="grid grid-cols-2 gap-4">
                {t.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                     <ShieldCheck className="w-5 h-5 text-indigo-400" />
                     <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="relative">
             <div className="p-8 bg-slate-800/50 rounded-[40px] border border-slate-700/50 backdrop-blur-xl">
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Deployment Status</span>
                      <span className="text-emerald-400">{t.status}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-indigo-500" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-slate-700/30" />
                      ))}
                   </div>
                </div>
             </div>
             <div className="absolute -top-6 -right-6 p-4 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20 rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
             </div>
          </div>
       </div>
    </section>
  );
};

const FinalCTA = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      title: '把 Token 从不断膨胀的成本项，变成可持续优化的生产资源',
      subtitle: '面向真实生成式 AI 工作流，建立更高质量、更可控、可持续优化的成本结构。',
      cta1: '预约试点',
      cta2: '联系团队'
    },
    en: {
      title: 'Bring cost efficiency to your AI workflows',
      subtitle: 'Turn token usage from a growing cost center into an optimizable production resource.',
      cta1: 'Book a Pilot',
      cta2: 'Speak with the Team'
    }
  };

  const t = content[lang];

  return (
    <section className="py-32 px-4 bg-white relative">
       <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">{t.title}</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
             <Link 
               to="/login"
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
             >
               {t.cta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link 
               to="/login"
               className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
             >
               {t.cta2}
             </Link>
          </div>
       </div>
    </section>
  );
};

const Footer = ({ lang }: { lang: Language }) => {
  const content = {
    zh: {
      tagline: 'AnyTokn 帮助企业在不牺牲输出质量的前提下，系统性减少低价值 Token 消耗。',
      product: '产品',
      productItems: ['文档', '定价方案', '支持模型', '开源'],
      engineering: '工程',
      engineeringItems: ['API 参考', 'SDK', '安全', '更新日志'],
      resources: '资源',
      resourcesItems: ['博客', '案例研究', '系统状态', '指南'],
      company: '公司',
      companyItems: ['关于', '联系', '招聘', '法律'],
      copyright: '© 2026 Helicone AI. 保留所有权利。',
      privacy: '隐私政策',
      terms: '服务条款',
      cookies: 'Cookie 政策'
    },
    en: {
      tagline: 'AnyTokn helps enterprises reduce wasted token spend without compromising output quality.',
      product: 'Product',
      productItems: ['Documentation', 'Pricing Plans', 'Supported Models', 'Open Source'],
      engineering: 'Engineering',
      engineeringItems: ['API Reference', 'SDKs', 'Security', 'Changelog'],
      resources: 'Resources',
      resourcesItems: ['Blog', 'Case Studies', 'System Status', 'Guides'],
      company: 'Company',
      companyItems: ['About', 'Contact', 'Careers', 'Legal'],
      copyright: '© 2026 Helicone AI. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy'
    }
  };

  const t = content[lang];

  return (
    <footer className="bg-slate-50 text-slate-500 py-24 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
        <div className="col-span-2 md:col-span-1 space-y-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-indigo-100 shadow-lg">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">AnyTokn</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs font-medium">{t.tagline}</p>
          <div className="flex gap-5">
            <Twitter className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.product}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {t.productItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.engineering}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {t.engineeringItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.resources}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {t.resourcesItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.company}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {t.companyItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 text-[13px] flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-medium">{t.copyright}</p>
        <div className="flex gap-10 font-bold">
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.privacy}</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.terms}</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.cookies}</a>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('zh');

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <IntegrationPanel lang={lang} />
        <Features lang={lang} />
        <Solutions lang={lang} />
        <LogoCloud />
        <Proof lang={lang} />
        <Testimonial lang={lang} />
        <Stats lang={lang} />
        <Enterprise lang={lang} />
        <FinalCTA lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
