import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Code2,
  Terminal,
  Zap,
  ShieldCheck,
  BarChart3,
  Search,
  LayoutDashboard,
  Globe,
  Hexagon,
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
          {/* Mock Floating Provider Icons */}
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
        { title: "减少低价值 Token 消耗", desc: "识别上下文冗余、重复输入和