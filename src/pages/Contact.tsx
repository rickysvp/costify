import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  Zap,
  Globe,
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Building2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-emerald-200 shadow-sm">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AnyTokn</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-emerald-600 transition-colors">{t.nav.platform}</Link>
            <Link to="/" className="hover:text-emerald-600 transition-colors">{t.nav.solutions}</Link>
            <Link to="/" className="hover:text-emerald-600 transition-colors">{t.nav.engine}</Link>
            <Link to="/" className="hover:text-emerald-600 transition-colors">{t.nav.pricing}</Link>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
            <Link 
              to="/contact"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link 
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm shadow-emerald-100"
            >
              {t.nav.bookPilot}
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-6 space-y-4">
          <Link to="/" className="block text-lg font-medium text-slate-900">{t.nav.platform}</Link>
          <Link to="/" className="block text-lg font-medium text-slate-900">{t.nav.solutions}</Link>
          <Link to="/" className="block text-lg font-medium text-slate-900">{t.nav.engine}</Link>
          <Link to="/" className="block text-lg font-medium text-slate-900">{t.nav.pricing}</Link>
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 text-lg font-medium text-slate-900"
          >
            <Globe className="w-5 h-5" />
            <span>{lang === 'zh' ? 'Switch to English' : '切换到中文'}</span>
          </button>
          <Link to="/contact" className="block w-full text-slate-900 py-2 font-medium text-center">
            {t.nav.login}
          </Link>
          <Link to="/login" className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-center">
            {t.nav.bookPilot}
          </Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '开启您的 AI 成本优化之旅',
    subtitle: '我们的专家团队将为您提供专属的解决方案演示，帮助您快速了解 AnyTokn 如何为您的企业节省 AI 成本',
    badge: '专属服务',
  } : {
    title: 'Start Your AI Cost Optimization Journey',
    subtitle: 'Our expert team will provide you with an exclusive solution demo to help you understand how AnyTokn can save AI costs for your business',
    badge: 'Exclusive Service',
  };

  return (
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold tracking-tight mb-8"
        >
          <Sparkles className="w-4 h-4" />
          {content.badge}
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {content.title}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {content.subtitle}
        </motion.p>
      </div>
    </section>
  );
};

const Benefits = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    items: [
      { icon: <MessageSquare className="w-6 h-6" />, title: '一对一咨询', desc: '专属解决方案架构师为您提供个性化建议' },
      { icon: <Users className="w-6 h-6" />, title: '产品演示', desc: '深入了解 AnyTokn 的核心功能与最佳实践' },
      { icon: <Building2 className="w-6 h-6" />, title: '成本评估', desc: '免费获取您的 AI 成本优化潜力分析报告' },
    ]
  } : {
    items: [
      { icon: <MessageSquare className="w-6 h-6" />, title: 'One-on-One Consultation', desc: 'Dedicated solution architect provides personalized recommendations' },
      { icon: <Users className="w-6 h-6" />, title: 'Product Demo', desc: 'Deep dive into AnyTokn core features and best practices' },
      { icon: <Building2 className="w-6 h-6" />, title: 'Cost Assessment', desc: 'Free AI cost optimization potential analysis report' },
    ]
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    title: '',
    teamSize: '',
    monthlySpend: '',
    message: '',
  });

  const content = lang === 'zh' ? {
    title: '预约专属演示',
    subtitle: '填写以下信息，我们将在 24 小时内与您联系',
    name: '姓名',
    namePlaceholder: '请输入您的姓名',
    email: '工作邮箱',
    emailPlaceholder: 'name@company.com',
    company: '公司名称',
    companyPlaceholder: '请输入公司名称',
    title: '职位',
    titlePlaceholder: '如：技术总监',
    teamSize: '团队规模',
    teamSizeOptions: ['1-10人', '11-50人', '51-200人', '201-500人', '500人以上'],
    monthlySpend: '月度 AI 支出',
    spendOptions: ['¥0-5,000', '¥5,000-20,000', '¥20,000-50,000', '¥50,000-100,000', '¥100,000以上', '暂不透露'],
    message: '您希望了解什么？',
    messagePlaceholder: '请简要描述您的需求或问题，我们将为您准备针对性的演示内容...',
    submit: '提交预约',
    submitting: '提交中...',
    success: '预约成功！',
    successDesc: '我们的团队将在 24 小时内与您联系',
    required: '必填项',
  } : {
    title: 'Schedule Your Demo',
    subtitle: 'Fill in the information below and we will contact you within 24 hours',
    name: 'Full Name',
    namePlaceholder: 'Enter your full name',
    email: 'Work Email',
    emailPlaceholder: 'name@company.com',
    company: 'Company Name',
    companyPlaceholder: 'Enter company name',
    title: 'Job Title',
    titlePlaceholder: 'e.g. CTO',
    teamSize: 'Team Size',
    teamSizeOptions: ['1-10', '11-50', '51-200', '201-500', '500+'],
    monthlySpend: 'Monthly AI Spend',
    spendOptions: ['$0-1,000', '$1,000-5,000', '$5,000-10,000', '$10,000-25,000', '$25,000+', 'Prefer not to say'],
    message: 'What would you like to know?',
    messagePlaceholder: 'Briefly describe your needs or questions, we will prepare targeted demo content...',
    submit: 'Schedule Demo',
    submitting: 'Submitting...',
    success: 'Demo Scheduled!',
    successDesc: 'Our team will contact you within 24 hours',
    required: 'Required',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', title: '', teamSize: '', monthlySpend: '', message: '' });
    }, 3000);
  };

  if (submitted) {
    return (
      <section className="py-12 px-4">
        <motion.div
          className="max-w-xl mx-auto p-12 bg-white rounded-3xl border border-slate-100 shadow-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{content.success}</h3>
          <p className="text-slate-500">{content.successDesc}</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 md:p-10 bg-white rounded-3xl border border-slate-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{content.title}</h2>
            <p className="text-slate-500">{content.subtitle}</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.name} <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white"
                  placeholder={content.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.email} <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white"
                  placeholder={content.emailPlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.company} <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white"
                  placeholder={content.companyPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.title}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white"
                  placeholder={content.titlePlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.teamSize}
                </label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">{lang === 'zh' ? '请选择' : 'Select'}</option>
                  {content.teamSizeOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {content.monthlySpend}
                </label>
                <select
                  value={formData.monthlySpend}
                  onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">{lang === 'zh' ? '请选择' : 'Select'}</option>
                  {content.spendOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {content.message}
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-slate-50/50 focus:bg-white resize-none"
                placeholder={content.messagePlaceholder}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all mt-6"
            >
              {content.submit}
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

const TrustBadges = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '受到全球领先企业的信赖',
    stats: [
      { value: '500+', label: '企业客户' },
      { value: '99.9%', label: '服务可用性' },
      { value: '24h', label: '响应时间' },
    ]
  } : {
    title: 'Trusted by Leading Companies Worldwide',
    stats: [
      { value: '500+', label: 'Enterprise Clients' },
      { value: '99.9%', label: 'Service Uptime' },
      { value: '24h', label: 'Response Time' },
    ]
  };

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{content.title}</p>
        <div className="grid grid-cols-3 gap-8">
          {content.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-black text-emerald-600 mb-2">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
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
    productItems: ['功能特性', '定价方案', '更新日志', '路线图'],
    resources: '资源',
    resourcesItems: ['文档中心', 'API 参考', '最佳实践', '博客'],
    company: '公司',
    companyItems: ['关于我们', '联系我们', '加入我们', '新闻动态'],
    legal: '法律',
    legalItems: ['隐私政策', '服务条款', 'Cookie 政策'],
    copyright: '© 2026 AnyTokn. All rights reserved.',
  } : {
    tagline: 'AnyTokn helps enterprises reduce wasted token spend without compromising output quality.',
    product: 'Product',
    productItems: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    resources: 'Resources',
    resourcesItems: ['Documentation', 'API Reference', 'Best Practices', 'Blog'],
    company: 'Company',
    companyItems: ['About', 'Contact', 'Careers', 'News'],
    legal: 'Legal',
    legalItems: ['Privacy', 'Terms', 'Cookies'],
    copyright: '© 2026 AnyTokn. All rights reserved.',
  };

  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">AnyTokn</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">{content.tagline}</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">{content.product}</h4>
            <ul className="space-y-2">
              {content.productItems.map((item, i) => (
                <li key={i}><a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">{content.resources}</h4>
            <ul className="space-y-2">
              {content.resourcesItems.map((item, i) => (
                <li key={i}><a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">{content.company}</h4>
            <ul className="space-y-2">
              {content.companyItems.map((item, i) => (
                <li key={i}><a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">{content.copyright}</p>
          <div className="flex gap-6">
            {content.legalItems.map((item, i) => (
              <a key={i} href="#" className="text-sm text-slate-400 hover:text-emerald-600 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <ContactForm />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
}
