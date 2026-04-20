import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  BarChart3,
  Shield,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

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
            <Link to="/contact" className="text-slate-600 hover:text-emerald-600 transition-colors">{t.nav.login}</Link>
            <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm shadow-emerald-100">{t.nav.bookPilot}</Link>
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
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="flex items-center gap-2 text-lg font-medium text-slate-900">
            <Globe className="w-5 h-5" />
            <span>{lang === 'zh' ? 'Switch to English' : '切换到中文'}</span>
          </button>
          <Link to="/contact" className="block w-full text-slate-900 py-2 font-medium text-center">{t.nav.login}</Link>
          <Link to="/login" className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-center">{t.nav.bookPilot}</Link>
        </div>
      )}
    </nav>
  );
};

const ContactPage = () => {
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
    title: '与我们的专家交流',
    subtitle: '了解 AnyTokn 如何帮助您的企业优化 AI 成本',
    badge: '免费专属演示',
    formTitle: '预约演示',
    formSubtitle: '填写信息，我们将在24小时内联系您',
    name: '姓名',
    email: '工作邮箱',
    company: '公司名称',
    title: '职位',
    teamSize: '团队规模',
    teamSizeOptions: ['1-10人', '11-50人', '51-200人', '201-500人', '500人以上'],
    monthlySpend: '月度AI支出',
    spendOptions: ['¥0-5,000', '¥5,000-20,000', '¥20,000-50,000', '¥50,000-100,000', '¥100,000以上'],
    message: '备注信息',
    submit: '预约演示',
    success: '预约成功',
    successDesc: '我们的专家将在24小时内与您联系',
    benefits: [
      { icon: <Calendar className="w-5 h-5" />, title: '30分钟专属演示', desc: '深入了解产品功能与最佳实践' },
      { icon: <BarChart3 className="w-5 h-5" />, title: '免费成本分析', desc: '获取您的AI支出优化建议报告' },
      { icon: <Shield className="w-5 h-5" />, title: '定制化方案', desc: '针对您业务场景的专属解决方案' },
    ],
    stats: [
      { value: '30min', label: '平均演示时长' },
      { value: '40%', label: '平均成本节省' },
      { value: '500+', label: '服务企业' },
    ],
    trust: '已有500+企业选择AnyTokn优化AI成本',
  } : {
    title: 'Talk to Our Experts',
    subtitle: 'Learn how AnyTokn can help optimize AI costs for your business',
    badge: 'Free Exclusive Demo',
    formTitle: 'Schedule a Demo',
    formSubtitle: 'Fill in your info, we will contact you within 24 hours',
    name: 'Full Name',
    email: 'Work Email',
    company: 'Company Name',
    title: 'Job Title',
    teamSize: 'Team Size',
    teamSizeOptions: ['1-10', '11-50', '51-200', '201-500', '500+'],
    monthlySpend: 'Monthly AI Spend',
    spendOptions: ['$0-1,000', '$1,000-5,000', '$5,000-10,000', '$10,000-25,000', '$25,000+'],
    message: 'Additional Notes',
    submit: 'Schedule Demo',
    success: 'Demo Scheduled',
    successDesc: 'Our expert will contact you within 24 hours',
    benefits: [
      { icon: <Calendar className="w-5 h-5" />, title: '30-min Exclusive Demo', desc: 'Deep dive into features and best practices' },
      { icon: <BarChart3 className="w-5 h-5" />, title: 'Free Cost Analysis', desc: 'Get AI spend optimization recommendations' },
      { icon: <Shield className="w-5 h-5" />, title: 'Customized Solution', desc: 'Tailored solution for your business scenario' },
    ],
    stats: [
      { value: '30min', label: 'Avg Demo Time' },
      { value: '40%', label: 'Avg Cost Savings' },
      { value: '500+', label: 'Companies Served' },
    ],
    trust: '500+ companies choose AnyTokn to optimize AI costs',
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
      <div className="min-h-screen bg-white pt-24 pb-12">
        <Navbar />
        <motion.div
          className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl border border-slate-100 shadow-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{content.success}</h3>
          <p className="text-slate-500">{content.successDesc}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {content.badge}
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {content.title}
            </motion.h1>
            <motion.p 
              className="text-lg text-slate-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {content.subtitle}
            </motion.p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Benefits */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Benefits Cards */}
              <div className="space-y-4">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-slate-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {content.stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-2xl font-black text-emerald-600">{stat.value}</p>
                    <p className="text-xs text-emerald-700 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{content.trust}</p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{content.formTitle}</h2>
                  <p className="text-sm text-slate-500">{content.formSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.name} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.email} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.company} *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.title}</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.teamSize}</label>
                      <select
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm bg-white"
                      >
                        <option value="">{lang === 'zh' ? '请选择' : 'Select'}</option>
                        {content.teamSizeOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.monthlySpend}</label>
                      <select
                        value={formData.monthlySpend}
                        onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm bg-white"
                      >
                        <option value="">{lang === 'zh' ? '请选择' : 'Select'}</option>
                        {content.spendOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{content.message}</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    {content.submit}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
