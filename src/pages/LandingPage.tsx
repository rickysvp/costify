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
  Globe,
  Play,
} from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/anytokn.png" alt="AnyTokn" className="h-10 w-auto rounded-xl shadow-sm" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/demo"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <Play className="w-4 h-4" />
              <span>{lang === 'zh' ? 'Demo' : 'Demo'}</span>
            </Link>

            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-xs tracking-wider">{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>

            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              {t.nav.login}
            </Link>

            <Link
              to="/login"
              className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              {t.nav.bookPilot}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-100 shadow-xl"
        >
          <div className="px-4 py-6 space-y-2">
            <div className="space-y-2">
              <Link
                to="/demo"
                className="flex items-center gap-2 w-full px-4 py-3 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Play className="w-5 h-5" />
                <span>Demo</span>
              </Link>

              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-2 w-full px-4 py-3 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Globe className="w-5 h-5" />
                <span>{lang === 'zh' ? 'Switch to English' : '切换到中文'}</span>
              </button>

              <Link
                to="/contact"
                className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                {t.nav.login}
              </Link>

              <Link
                to="/login"
                className="block w-full text-center bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-base mt-4 shadow-lg shadow-emerald-200"
              >
                {t.nav.bookPilot}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// AI Model Logo Components
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const ClaudeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const GeminiLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const LlamaLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const MistralLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20h-13L12 5.5z"/>
  </svg>
);

const DeepSeekLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

const Hero = () => {
  const { lang, t } = useLanguage();

  // Scattered floating logos around the title
  const floatingLogos = [
    { Icon: OpenAILogo, name: 'GPT', color: 'text-emerald-600', bg: 'bg-emerald-50', top: '-15%', left: '5%', size: 'w-10 h-10', delay: 0 },
    { Icon: ClaudeLogo, name: 'Claude', color: 'text-orange-600', bg: 'bg-orange-50', top: '10%', left: '-8%', size: 'w-9 h-9', delay: 0.2 },
    { Icon: GeminiLogo, name: 'Gemini', color: 'text-blue-600', bg: 'bg-blue-50', bottom: '20%', left: '2%', size: 'w-8 h-8', delay: 0.4 },
    { Icon: LlamaLogo, name: 'Llama', color: 'text-indigo-600', bg: 'bg-indigo-50', top: '-10%', right: '8%', size: 'w-10 h-10', delay: 0.1 },
    { Icon: MistralLogo, name: 'Mistral', color: 'text-purple-600', bg: 'bg-purple-50', top: '25%', right: '-5%', size: 'w-9 h-9', delay: 0.3 },
    { Icon: DeepSeekLogo, name: 'DeepSeek', color: 'text-cyan-600', bg: 'bg-cyan-50', bottom: '15%', right: '3%', size: 'w-8 h-8', delay: 0.5 },
  ];

  return (
    <section className="pt-48 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8 relative">
        {/* Floating scattered logos */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {floatingLogos.map((logo, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: logo.top,
                left: logo.left,
                right: logo.right,
                bottom: logo.bottom,
              }}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0, -5, 0],
              }}
              transition={{
                opacity: { delay: logo.delay, duration: 0.5 },
                scale: { delay: logo.delay, duration: 0.5 },
                y: { 
                  delay: logo.delay + 0.5, 
                  duration: 4 + Math.random() * 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className={`${logo.bg} rounded-xl border border-slate-100 shadow-lg p-2 flex flex-col items-center gap-1`}>
                <div className={`${logo.color} ${logo.size}`}>
                  <logo.Icon />
                </div>
                <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap">{logo.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.hero.newTitleHighlight ? (
            <>
              {t.hero.newTitle}<br />
              <span className="text-emerald-600">{t.hero.newTitleHighlight}</span>
            </>
          ) : (
            <span className="text-emerald-600">{t.hero.newTitle}</span>
          )}
        </motion.h1>
        
        {/* Mobile scattered logos */}
        <div className="flex md:hidden justify-center gap-2 flex-wrap relative z-10">
          {floatingLogos.slice(0, 4).map((logo, i) => (
            <motion.div
              key={i}
              className={`${logo.bg} rounded-lg border border-slate-100 shadow-sm p-1.5 flex items-center gap-1`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`${logo.color} w-5 h-5`}>
                <logo.Icon />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{logo.name}</span>
            </motion.div>
          ))}
        </div>
        <motion.p 
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t.hero.newDescription}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            to="/login"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
          >
            {t.hero.newCta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/demo"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-slate-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
          >
            {lang === 'zh' ? 'BYOK 实时对比' : 'BYOK Live Demo'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto relative group">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-100 shadow-sm text-sm font-semibold text-slate-500 z-20">
          {t.hero.dashboardLabel}
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

        {/* Dashboard Mockup - 基于真实管理后台 */}
        <motion.div 
          className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* 顶部导航栏 */}
          <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/anytokn.png" alt="AnyTokn" className="h-7 w-auto rounded-lg" />
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-sm font-semibold text-slate-600">{lang === 'zh' ? '成本控制台' : 'Cost Console'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
            </div>
          </div>

          <div className="flex h-[580px]">
            {/* 左侧导航 */}
            <aside className="w-56 border-r border-slate-100 bg-slate-50/50 p-4 shrink-0 hidden md:block">
              <div className="space-y-1">
                {[
                  { icon: '□', label: lang === 'zh' ? '总览' : 'Overview', active: true },
                  { icon: '◎', label: lang === 'zh' ? '项目' : 'Projects', active: false },
                  { icon: '◐', label: lang === 'zh' ? '预算管理' : 'Budget', active: false },
                  { icon: '◇', label: lang === 'zh' ? '优化引擎' : 'Optimization', active: false },
                  { icon: '○', label: lang === 'zh' ? 'API 密钥' : 'API Keys', active: false },
                  { icon: '△', label: lang === 'zh' ? '设置' : 'Settings', active: false },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${item.active ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/60'}`}>
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              
              {/* 快速统计 */}
              <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{lang === 'zh' ? '本月节省' : 'Saved This Month'}</p>
                <p className="text-2xl font-bold text-emerald-600">$12,847</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-emerald-500 font-medium">↓ 34%</span>
                  <span className="text-xs text-slate-400">{lang === 'zh' ? '较上月' : 'vs last month'}</span>
                </div>
              </div>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 p-6 space-y-6 overflow-hidden bg-slate-50/30">
              {/* 页面标题 */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{lang === 'zh' ? '成本总览' : 'Cost Overview'}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{lang === 'zh' ? '实时监控您的 AI Token 消耗' : 'Real-time monitoring of your AI token usage'}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition-colors">
                    {lang === 'zh' ? '导出报告' : 'Export'}
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                    {lang === 'zh' ? '添加项目' : 'Add Project'}
                  </button>
                </div>
              </div>

              {/* 核心指标卡片 */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: lang === 'zh' ? '总消耗' : 'Total Spend', value: '$48,293', change: '+12%', trend: 'up', color: 'emerald' },
                  { label: lang === 'zh' ? 'Token 用量' : 'Token Usage', value: '2.4B', change: '+8%', trend: 'up', color: 'blue' },
                  { label: lang === 'zh' ? '请求次数' : 'Requests', value: '1.2M', change: '+23%', trend: 'up', color: 'purple' },
                  { label: lang === 'zh' ? '节省金额' : 'Saved', value: '$12,847', change: '+34%', trend: 'down', color: 'amber' },
                ].map((card, i) => (
                  <motion.div 
                    key={i} 
                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <p className="text-xs font-medium text-slate-500 mb-2">{card.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.trend === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        {card.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 图表区域 */}
              <div className="grid grid-cols-3 gap-4">
                {/* 主图表 */}
                <div className="col-span-2 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">{lang === 'zh' ? '消耗趋势' : 'Spend Trend'}</h3>
                    <div className="flex gap-1">
                      {['7D', '30D', '90D'].map((period, i) => (
                        <button key={i} className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${i === 1 ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-48 flex items-end gap-2">
                    {[35, 45, 30, 55, 40, 60, 50, 70, 45, 65, 55, 75, 60, 80, 50, 70, 65, 85, 55, 75].map((h, i) => (
                      <motion.div 
                        key={i} 
                        className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: i * 0.02 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-slate-400">
                    <span>Jan 1</span>
                    <span>Jan 7</span>
                    <span>Jan 14</span>
                    <span>Jan 21</span>
                    <span>Jan 28</span>
                  </div>
                </div>

                {/* 模型分布 */}
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">{lang === 'zh' ? '模型分布' : 'Model Distribution'}</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'GPT-4', percent: 45, color: 'bg-emerald-500' },
                      { name: 'Claude 3', percent: 28, color: 'bg-blue-500' },
                      { name: 'Gemini', percent: 15, color: 'bg-purple-500' },
                      { name: 'Others', percent: 12, color: 'bg-slate-300' },
                    ].map((model, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-slate-700">{model.name}</span>
                          <span className="text-slate-500">{model.percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${model.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${model.percent}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 最近活动 */}
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">{lang === 'zh' ? '最近活动' : 'Recent Activity'}</h3>
                <div className="space-y-3">
                  {[
                    { action: lang === 'zh' ? 'API 调用' : 'API Call', project: 'Customer Support Bot', cost: '$124.50', time: '2m ago', status: 'success' },
                    { action: lang === 'zh' ? '预算警报' : 'Budget Alert', project: 'Marketing AI', cost: '$2,000', time: '15m ago', status: 'warning' },
                    { action: lang === 'zh' ? '路由优化' : 'Route Optimized', project: 'Data Analysis', cost: '-$45.20', time: '1h ago', status: 'success' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.action}</p>
                          <p className="text-xs text-slate-500">{item.project}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${item.cost.startsWith('-') ? 'text-emerald-600' : 'text-slate-900'}`}>{item.cost}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const IntegrationPanel = () => {
  const { lang } = useLanguage();
  
  const capabilities = lang === 'zh' ? [
    {
      title: "高质量感知压缩引擎",
      desc: "在不破坏关键语义和任务完成度的前提下，压缩低价值 Token 输入。",
      icon: <Zap className="w-5 h-5" />,
      color: "text-emerald-400 bg-emerald-400/10"
    },
    {
      title: "Token 调度引擎",
      desc: "根据任务复杂度、质量目标和工作流优先级，动态分配 Token 资源。",
      icon: <Terminal className="w-5 h-5" />,
      color: "text-emerald-400 bg-emerald-400/10"
    },
    {
      title: "长期追踪数据优化",
      desc: "基于历史调用、成本表现和结果反馈，持续优化未来的使用策略。",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-amber-400 bg-amber-400/10"
    },
    {
      title: "预算与策略控制",
      desc: "把成本约束、使用边界和优化规则纳入统一控制体系。",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-purple-400 bg-purple-400/10"
    }
  ] : [
    {
      title: "Quality-aware compression engine",
      desc: "Compress low-value context and redundant input while preserving the information that matters for task completion.",
      icon: <Zap className="w-5 h-5" />,
      color: "text-emerald-400 bg-emerald-400/10"
    },
    {
      title: "Token orchestration engine",
      desc: "Allocate token budget by task complexity, workflow priority, and quality target.",
      icon: <Terminal className="w-5 h-5" />,
      color: "text-emerald-400 bg-emerald-400/10"
    },
    {
      title: "Long-term optimization loop",
      desc: "Use historical performance and usage patterns to continuously refine future token efficiency.",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-amber-400 bg-amber-400/10"
    },
    {
      title: "Budget and policy controls",
      desc: "Turn optimization into a governed operating layer with visibility, limits, and enforcement.",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-purple-400 bg-purple-400/10"
    }
  ];

  const [activeCap, setActiveCap] = useState(0);

  return (
    <section className="py-32 px-4 bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {lang === 'zh' ? '一套面向企业级高质量Token优化引擎' : 'An Enterprise-Grade High-Quality Token Optimization Engine'}
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
          {lang === 'zh' 
            ? 'AnyTokn 不是一次性的 Prompt 压缩工具，也不是简单的模型路由或成本看板。它围绕高质量节省，把压缩、调度和长期优化统一在同一套产品体系中。'
            : 'AnyTokn is not a one-off prompt compression tool. It is a system designed to continuously improve the cost-quality balance of enterprise generative AI.'}
        </p>
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
        <div className="p-16 flex flex-col items-center text-center space-y-8">
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
                <p className="text-emerald-400">{lang === 'zh' ? '# AnyTokn 优化已激活' : '# AnyTokn optimization active'}</p>
                <p><span className="text-emerald-400">await</span> anytokn.optimize({'{'}</p>
                <p>&nbsp;&nbsp;workflowId: <span className="text-emerald-400">"enterprise-copilot-v2"</span>,</p>
                <p>&nbsp;&nbsp;qualityConstraint: <span className="text-amber-400">0.98</span>,</p>
                <p>&nbsp;&nbsp;priority: <span className="text-emerald-400">"high"</span></p>
                <p>{'})'};</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '为真实生产环境中的 AI 成本问题而构建',
    cards: [
      { title: "减少低价值 Token 消耗", desc: "识别上下文冗余、重复输入和粗放调用，减少不必要的推理支出。", badge: "发现浪费", badgeValue: "-42% Tokens" },
      { title: "保护输出质量", desc: "在质量约束下做优化，避免节省带来结果退化。", badge: "质量不变", badgeValue: "99.8%" },
      { title: "建立长期优化能力", desc: "不是只优化一次请求，而是持续改进后续 Token 使用效率。", items: [{ label: '全局预算', val: '84%' }, { label: 'Token 策略', val: '已激活' }, { label: '成本上限', val: '¥12k/月' }] }
    ]
  } : {
    title: 'Built to reduce waste, protect quality, and improve control',
    cards: [
      { title: "Reduce wasted token spend", desc: "Identify low-value token usage across prompts, context, and multi-step workflows before it turns into recurring cost.", badge: "Waste detected", badgeValue: "-42% Tokens" },
      { title: "Protect output quality", desc: "Optimize under quality constraints so efficiency gains do not come at the expense of task performance.", badge: "Quality Invariant", badgeValue: "99.8%" },
      { title: "Improve operational control", desc: "Apply budgets, policies, and workflow-level optimization logic across production AI usage.", items: [{ label: 'Global Budget', val: '84%' }, { label: 'Token Policy', val: 'Active' }, { label: 'Cost Limit', val: '$12k/mo' }] }
    ]
  };

  return (
    <section className="py-32 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">{content.title}</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-emerald-50 w-fit rounded-2xl">
              <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{content.cards[0].title}</h3>
            <p className="text-slate-500 leading-relaxed">{content.cards[0].desc}</p>
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{content.cards[0].badge}</span>
                      <span className="text-sm font-bold text-slate-900">{content.cards[0].badgeValue}</span>
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
            <h3 className="text-2xl font-bold tracking-tight">{content.cards[1].title}</h3>
            <p className="text-slate-500 leading-relaxed">{content.cards[1].desc}</p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center relative h-56 justify-center overflow-hidden">
             <div className="h-32 w-32 border-4 border-emerald-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-2xl font-black text-emerald-600">{content.cards[1].badgeValue}</span>
             </div>
             <span className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{content.cards[1].badge}</span>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-amber-50 w-fit rounded-2xl">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{content.cards[2].title}</h3>
            <p className="text-slate-500 leading-relaxed">{content.cards[2].desc}</p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col space-y-4 h-56">
             {content.cards[2].items?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                   <span className="text-xs font-bold text-slate-500">{item.label}</span>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`}>{item.val}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Solutions = () => {
  const { lang } = useLanguage();

  const solutions = lang === 'zh' ? [
    { title: "AIGC 运营", desc: "降低内容生成链路中的 Token 浪费，提升生产效率与预算可控性。" },
    { title: "办公生产力", desc: "优化知识问答、文档生成与内部 Copilot 的长期使用成本。" },
    { title: "金融与合规", desc: "在更重视准确性、稳定性与审慎性的流程中实现更稳健的成本控制。" },
    { title: "AI 教育", desc: "支撑大规模教学辅助、反馈生成与互动问答场景的持续优化。" },
    { title: "Agent 自动化", desc: "为多步骤、长链路 Agent 工作流建立更合理的 Token 使用方式。" }
  ] : [
    { title: "AIGC Operations", desc: "Improve efficiency across content production pipelines with lower token waste and more predictable costs." },
    { title: "Workplace Productivity", desc: "Optimize internal copilots, knowledge workflows, and document generation without degrading usefulness." },
    { title: "Finance & Compliance", desc: "Support more controlled AI usage in workflows where quality, traceability, and policy discipline matter." },
    { title: "AI Education", desc: "Reduce the long-term cost of tutoring, feedback, and large-scale learning interactions." },
    { title: "Agentic Automation", desc: "Control token usage across multi-step agent workflows with clearer efficiency logic and better guardrails." }
  ];

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-16 text-center">
          {lang === 'zh' ? '适用于真实的生成式 AI 工作流' : 'Built for real generative AI workloads'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {solutions.map((sol, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all group">
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
    { name: 'OpenAI', src: '/logos/openai.svg' },
    { name: 'Anthropic', src: '/logos/anthropic.svg' },
    { name: 'Google', src: '/logos/google.svg' },
    { name: 'Meta', src: '/logos/meta.svg' },
    { name: 'Mistral', src: '/logos/mistral.svg' },
    { name: 'DeepSeek', src: '/logos/deepseek.svg' },
    { name: 'Moonshot', src: '/logos/moonshot.svg' },
    { name: 'Zhipu AI', src: '/logos/zhipu.svg' },
  ];

  return (
    <section className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Used across high-consumption generative AI workflows</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-all">
          {logos.map(logo => (
            <div key={logo.name} className="flex items-center gap-2">
               <img src={logo.src} alt={logo.name} className="h-6 md:h-8 object-contain" />
               <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Proof = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '看见支出，识别浪费，持续优化',
    subtitle: '从团队、项目和工作流维度追踪 Token 消耗，识别可压缩、可调度、可治理的使用模式，并持续衡量优化结果。',
    bullets: ["工作流级支出可视化", "按使用模式识别优化机会", "质量敏感的控制逻辑", "随时间的节省追踪"],
    badge: "平均成本降低 -30%"
  } : {
    title: 'See where cost goes — and where savings come from',
    subtitle: 'Track spend across teams, projects, and workflows. Identify optimization opportunities, apply controls, and measure results over time.',
    bullets: ["Workflow-level spend visibility", "Optimization opportunities by usage pattern", "Quality-sensitive control logic", "Savings tracking over time"],
    badge: "-30% Avg Cost Reduction"
  };

  return (
    <section className="py-32 px-4 bg-slate-50 border-t border-slate-100">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">{content.title}</h2>
             <p className="text-lg text-slate-500 leading-relaxed">{content.subtitle}</p>
             <div className="space-y-4">
                {content.bullets.map((bullet, i) => (
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
                   <div className="h-12 w-32 bg-emerald-50 border border-emerald-100 rounded-xl" />
                </div>
                <div className="space-y-6">
                   {[65, 42, 88].map((w, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Workflow {i+1}</span>
                           <span>{w}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 transition-all" style={{ width: `${w}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold shadow-emerald-500/20 italic">
                {content.badge}
             </div>
          </div>
       </div>
    </section>
  );
};

const Testimonial = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '为正在把 AI 从试验推向生产的团队而设计',
    quote: 'AnyTokn 帮我们第一次真正看清了 AI 成本花在什么地方，也让优化不再只是一次性技巧，而变成持续运行的系统能力。',
    author: '试点客户',
    role: 'AI 平台团队'
  } : {
    title: 'Designed for teams moving AI from experimentation to production',
    quote: 'AnyTokn helped us move from rough AI spend estimates to a more controllable and explainable cost structure.',
    author: 'Pilot customer',
    role: 'AI platform team'
  };

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{content.title}</h2>
      </div>
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] px-10 py-24 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        
        <div className="flex flex-col items-center text-center space-y-12 relative z-10">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400" />
          </div>
          <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-white tracking-tight max-w-3xl">
            &ldquo;{content.quote}&rdquo;
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-bold text-white uppercase tracking-widest text-sm">{content.author}</p>
            <p className="text-lg font-medium text-slate-400">{content.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '优化的价值，会随着规模放大',
    stat1: { value: 'XX 万 / XX 亿', label: '已优化 Token', desc: '覆盖生产级生成式 AI 调用' },
    stat2: { value: 'XX%', label: '识别出的潜在浪费', desc: '来自重复上下文与低价值输入模式' },
    stat3: { value: 'XX', label: '受控工作流', desc: '纳入预算与优化策略管理' }
  } : {
    title: 'Optimization becomes more valuable at scale',
    stat1: { value: 'XXM+', label: 'tokens optimized', desc: 'Across production AI workflows' },
    stat2: { value: 'XX%', label: 'potential waste identified', desc: 'Across repeated prompt and context patterns' },
    stat3: { value: 'XX', label: 'workflows under control', desc: 'With policy-aware optimization logic' }
  };

  return (
    <section className="py-32 px-4 bg-slate-50 border-y border-slate-200 text-center">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{content.title}</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0">
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-emerald-600">{content.stat1.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{content.stat1.label}</p>
            <p className="text-slate-500">{content.stat1.desc}</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-emerald-500">{content.stat2.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{content.stat2.label}</p>
            <p className="text-slate-500">{content.stat2.desc}</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8">
          <p className="text-6xl font-black tracking-tighter text-amber-500">{content.stat3.value}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">{content.stat3.label}</p>
            <p className="text-slate-500">{content.stat3.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Enterprise = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '面向企业部署而构建',
    subtitle: '治理不是 AnyTokn 的主定义，但它是高质量节省体系进入企业生产环境的必要条件。',
    items: ["权限隔离", "成本归因", "预算控制", "策略执行", "可视化追踪", "私有化部署准备"],
    status: '就绪'
  } : {
    title: 'Built for enterprise deployment',
    subtitle: 'Governance is not the product identity of AnyTokn, but it is a necessary condition for high-quality savings in production environments.',
    items: ["Role-based access", "Cost attribution", "Budget controls", "Policy enforcement", "Auditability", "Private deployment readiness"],
    status: 'Ready'
  };

  return (
    <section className="py-32 px-4 bg-slate-900 overflow-hidden text-white relative">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{content.title}</h2>
             <p className="text-slate-400 text-lg leading-relaxed">{content.subtitle}</p>
             <div className="grid grid-cols-2 gap-4">
                {content.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                     <ShieldCheck className="w-5 h-5 text-emerald-400" />
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
                      <span className="text-emerald-400">{content.status}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-emerald-500" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-slate-700/30" />
                      ))}
                   </div>
                </div>
             </div>
             <div className="absolute -top-6 -right-6 p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20 rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
             </div>
          </div>
       </div>
    </section>
  );
};

const FinalCTA = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '把 Token 从不断膨胀的成本项，变成可持续优化的生产资源',
    subtitle: '面向真实生成式 AI 工作流，建立更高质量、更可控、可持续优化的成本结构。',
    cta1: '预约试点',
    cta2: '联系团队'
  } : {
    title: 'Bring cost efficiency to your AI workflows',
    subtitle: 'Turn token usage from a growing cost center into an optimizable production resource.',
    cta1: 'Book a Pilot',
    cta2: 'Speak with the Team'
  };

  return (
    <section className="py-32 px-4 bg-white relative">
       <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">{content.title}</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{content.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
             <Link 
               to="/login"
               className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
             >
               {content.cta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link 
               to="/login"
               className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
             >
               {content.cta2}
             </Link>
          </div>
       </div>
    </section>
  );
};

const Footer = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    tagline: 'AnyTokn 帮助企业在不牺牲输出质量的前提下，系统性减少低价值 Token 消耗。',
    product: '产品',
    productItems: ['文档', '定价方案', '支持模型', '开源'],
    engineering: '工程',
    engineeringItems: ['API 参考', 'SDK', '安全', '更新日志'],
    resources: '资源',
    resourcesItems: ['博客', '案例研究', '系统状态', '指南'],
    company: '公司',
    companyItems: ['关于', '联系', '招聘', '法律'],
    copyright: '© 2026 AnyTokn. 保留所有权利。',
    privacy: '隐私政策',
    terms: '服务条款',
    cookies: 'Cookie 政策'
  } : {
    tagline: 'AnyTokn helps enterprises reduce wasted token spend without compromising output quality.',
    product: 'Product',
    productItems: ['Documentation', 'Pricing Plans', 'Supported Models', 'Open Source'],
    engineering: 'Engineering',
    engineeringItems: ['API Reference', 'SDKs', 'Security', 'Changelog'],
    resources: 'Resources',
    resourcesItems: ['Blog', 'Case Studies', 'System Status', 'Guides'],
    company: 'Company',
    companyItems: ['About', 'Contact', 'Careers', 'Legal'],
    copyright: '© 2026 AnyTokn. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookie Policy'
  };

  return (
    <footer className="bg-slate-50 text-slate-500 py-24 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
        <div className="col-span-2 md:col-span-1 space-y-8">
          <div className="flex items-center text-slate-900">
              <img src="/anytokn.png" alt="AnyTokn" className="h-10 w-auto rounded-lg" />
            </div>
          <p className="text-sm leading-relaxed max-w-xs font-medium">{content.tagline}</p>
          <div className="flex gap-5">
            <Twitter className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.product}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {content.productItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.engineering}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {content.engineeringItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.resources}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {content.resourcesItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.company}</h4>
          <ul className="space-y-3 text-sm font-medium">
            {content.companyItems.map((item, i) => (
              <li key={i}><a href="#" className="hover:text-emerald-600 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 text-[13px] flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-medium">{content.copyright}</p>
        <div className="flex gap-10 font-bold">
          <a href="#" className="hover:text-emerald-600 transition-colors">{content.privacy}</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">{content.terms}</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">{content.cookies}</a>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <IntegrationPanel />
        <Features />
        <Solutions />
        <LogoCloud />
        <Proof />
        <Testimonial />
        <Stats />
        <Enterprise />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
