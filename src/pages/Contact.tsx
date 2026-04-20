import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  ArrowRight,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Building2,
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
              to="/login"
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
          <Link to="/login" className="block w-full text-slate-900 py-2 font-medium text-center">
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
    title: '联系我们的团队',
    subtitle: '无论您有任何问题或需求，我们的专业团队随时准备为您提供帮助',
  } : {
    title: 'Contact Our Team',
    subtitle: 'Whether you have questions or needs, our professional team is always ready to help you',
  };

  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900"
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

const ContactInfo = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '联系方式',
    items: [
      { icon: <Mail className="w-6 h-6" />, label: '电子邮件', value: 'contact@anytokn.com', desc: '工作日 24 小时内回复' },
      { icon: <Phone className="w-6 h-6" />, label: '电话', value: '+86 400-888-8888', desc: '工作日 9:00-18:00' },
      { icon: <MapPin className="w-6 h-6" />, label: '地址', value: '北京市朝阳区科技园区', desc: '欢迎预约参观' },
      { icon: <Clock className="w-6 h-6" />, label: '工作时间', value: '周一至周五', desc: '9:00 - 18:00 (GMT+8)' },
    ]
  } : {
    title: 'Contact Information',
    items: [
      { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'contact@anytokn.com', desc: 'Reply within 24 hours on weekdays' },
      { icon: <Phone className="w-6 h-6" />, label: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9:00-18:00' },
      { icon: <MapPin className="w-6 h-6" />, label: 'Address', value: 'San Francisco, CA', desc: 'By appointment only' },
      { icon: <Clock className="w-6 h-6" />, label: 'Working Hours', value: 'Monday - Friday', desc: '9:00 - 18:00 (PST)' },
    ]
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              className="p-8 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</h3>
              <p className="text-lg font-bold text-slate-900 mb-2">{item.value}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
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
    phone: '',
    subject: '',
    message: '',
  });

  const content = lang === 'zh' ? {
    title: '发送消息',
    subtitle: '填写以下表单，我们会尽快与您联系',
    name: '姓名',
    email: '电子邮箱',
    company: '公司名称',
    phone: '联系电话',
    subject: '主题',
    message: '消息内容',
    submit: '发送消息',
    submitting: '发送中...',
    success: '消息已发送！',
    successDesc: '我们会尽快与您联系',
    subjects: ['产品咨询', '技术支持', '商务合作', '其他'],
  } : {
    title: 'Send Message',
    subtitle: 'Fill out the form below and we will contact you soon',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    submit: 'Send Message',
    submitting: 'Sending...',
    success: 'Message Sent!',
    successDesc: 'We will contact you soon',
    subjects: ['Product Inquiry', 'Technical Support', 'Business Partnership', 'Other'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  if (submitted) {
    return (
      <motion.div
        className="max-w-2xl mx-auto p-12 bg-white rounded-[32px] border border-slate-100 shadow-xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{content.success}</h3>
        <p className="text-slate-500">{content.successDesc}</p>
      </motion.div>
    );
  }

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.title}</h2>
          <p className="text-slate-500">{content.subtitle}</p>
        </div>
        
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 md:p-12 bg-white rounded-[32px] border border-slate-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{content.name} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder={content.name}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{content.email} *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder={content.email}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{content.company}</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder={content.company}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{content.phone}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder={content.phone}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">{content.subject} *</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
            >
              <option value="">{lang === 'zh' ? '请选择主题' : 'Select a subject'}</option>
              {content.subjects.map((subject, i) => (
                <option key={i} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">{content.message} *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
              placeholder={content.message}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-5 h-5" />
            {content.submit}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

const WhyContact = () => {
  const { lang } = useLanguage();

  const content = lang === 'zh' ? {
    title: '为什么选择联系我们',
    items: [
      { icon: <MessageSquare className="w-8 h-8" />, title: '专业咨询', desc: '我们的专家团队将为您提供个性化的解决方案建议' },
      { icon: <Users className="w-8 h-8" />, title: '专属服务', desc: '每个客户都将获得专属的客户成功经理支持' },
      { icon: <Building2 className="w-8 h-8" />, title: '企业定制', desc: '根据您的业务需求，提供定制化的企业级解决方案' },
    ]
  } : {
    title: 'Why Contact Us',
    items: [
      { icon: <MessageSquare className="w-8 h-8" />, title: 'Expert Consultation', desc: 'Our expert team will provide personalized solution recommendations' },
      { icon: <Users className="w-8 h-8" />, title: 'Dedicated Service', desc: 'Every client receives dedicated customer success manager support' },
      { icon: <Building2 className="w-8 h-8" />, title: 'Enterprise Customization', desc: 'Customized enterprise solutions based on your business needs' },
    ]
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              className="p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
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
          <div className="flex items-center gap-3 text-slate-900">
            <div className="p-1.5 bg-emerald-600 rounded-lg shadow-emerald-100 shadow-lg">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">AnyTokn</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs font-medium">{content.tagline}</p>
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

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ContactInfo />
        <ContactForm />
        <WhyContact />
      </main>
      <Footer />
    </div>
  );
}
