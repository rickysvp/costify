import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon,
  Globe,
  ArrowRight,
  Shield,
  TrendingDown,
  PieChart,
  Zap,
  Check,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Lock,
  Users,
  ArrowUpRight,
  Target,
  BadgeCheck,
  Play,
} from 'lucide-react';
import { type Language } from '../i18n';

// Enterprise Badge Component
const EnterpriseBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
    <BadgeCheck className="w-4 h-4 text-emerald-600" />
    <span className="text-sm font-medium text-emerald-700">Enterprise-Grade</span>
  </div>
);

// Stats Card Component
const StatsCard = ({ value, label, trend }: { value: string; label: string; trend?: string }) => (
  <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
    <div className="text-3xl md:text-4xl font-bold text-black mb-1">{value}</div>
    <div className="text-sm text-neutral-500 mb-2">{label}</div>
    {trend && (
      <div className="flex items-center gap-1 text-sm text-emerald-600">
        <TrendingDown className="w-4 h-4" />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
}

const FeatureCard = ({ icon, title, description, metric }: FeatureCardProps) => (
  <div className="group relative p-8 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
    <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
    <p className="text-neutral-600 leading-relaxed mb-4">{description}</p>
    {metric && (
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
        <ArrowUpRight className="w-4 h-4" />
        <span>{metric}</span>
      </div>
    )}
  </div>
);

// Trust Badge Component
const TrustBadge = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-neutral-600">
    <Check className="w-4 h-4 text-emerald-500" />
    <span>{text}</span>
  </div>
);

// Pricing Card Component - Currently not used
/*
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PricingCard = ({ name, price, period, description, features, cta, popular }: PricingCardProps) => (
  <div className={`relative p-8 rounded-2xl border ${popular ? 'border-black shadow-2xl' : 'border-neutral-200'} bg-white`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <span className="bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          最受欢迎
        </span>
      </div>
    )}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-black mb-2">{name}</h3>
      <p className="text-sm text-neutral-500">{description}</p>
    </div>
    <div className="mb-6">
      <span className="text-4xl font-bold text-black">{price}</span>
      {period && <span className="text-neutral-500 ml-1">{period}</span>}
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
          <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-3.5 rounded-xl font-semibold transition-colors ${
      popular
        ? 'bg-black text-white hover:bg-neutral-800'
        : 'border border-neutral-200 text-black hover:bg-neutral-50'
    }`}>
      {cta}
    </button>
  </div>
);
*/

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role, company, metric }: { quote: string; author: string; role: string; company: string; metric: string }) => (
  <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Sparkles key={i} className="w-4 h-4 text-black fill-black" />
      ))}
    </div>
    <p className="text-lg text-neutral-700 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-black">
          {author[0]}
        </div>
        <div>
          <p className="font-semibold text-black">{author}</p>
          <p className="text-sm text-neutral-500">{role} · {company}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-emerald-600">{metric}</p>
        <p className="text-xs text-neutral-500">成本节省</p>
      </div>
    </div>
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

  const features = [
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: lang === 'zh' ? '智能质量评估系统' : 'Intelligent Quality Assessment',
      description: lang === 'zh'
        ? '基于多维度质量评分模型，实时监控输出质量。确保在任何成本优化策略下，服务质量始终保持在企业级标准之上。'
        : 'Multi-dimensional quality scoring model for real-time output monitoring. Ensures service quality always exceeds enterprise standards under any cost optimization strategy.',
      metric: lang === 'zh' ? '质量评分 98%+' : '98%+ quality score',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: lang === 'zh' ? '质量优先模型路由' : 'Quality-First Model Routing',
      description: lang === 'zh'
        ? '以满足质量阈值为前提，智能选择成本最优模型。质量不达标时自动升级模型，确保用户体验不受影响的前提下实现成本优化。'
        : 'Intelligently selects cost-optimal models while meeting quality thresholds. Automatically upgrades models when quality is substandard, ensuring cost optimization without compromising user experience.',
      metric: lang === 'zh' ? '质量达标率 99.9%' : '99.9% quality compliance',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: lang === 'zh' ? '高质量语义缓存' : 'High-Quality Semantic Caching',
      description: lang === 'zh'
        ? '仅缓存高质量历史结果，通过语义相似度匹配复用。在确保输出质量一致性的前提下，显著降低重复请求成本。'
        : 'Only caches high-quality historical results for semantic similarity matching. Significantly reduces duplicate request costs while ensuring output quality consistency.',
      metric: lang === 'zh' ? '质量一致性 100%' : '100% quality consistency',
    },
    {
      icon: <PieChart className="w-7 h-7" />,
      title: lang === 'zh' ? '质量成本平衡分析' : 'Quality-Cost Balance Analysis',
      description: lang === 'zh'
        ? '追踪每次请求的质量评分与成本关系，识别高性价比调用模式。帮助企业在保证质量的前提下，找到最优成本结构。'
        : 'Tracks quality scores and cost relationships per request to identify high-value calling patterns. Helps enterprises find optimal cost structure while ensuring quality.',
      metric: lang === 'zh' ? '性价比提升 40%+' : '40%+ value improvement',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: lang === 'zh' ? '质量保障预算管控' : 'Quality-Assured Budget Control',
      description: lang === 'zh'
        ? '设置质量红线预算，当成本优化可能影响质量时自动预警。确保预算控制不以牺牲服务质量为代价。'
        : 'Sets quality baseline budgets with automatic alerts when cost optimization may affect quality. Ensures budget control never compromises service quality.',
      metric: lang === 'zh' ? '质量零妥协' : 'Zero quality compromise',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: lang === 'zh' ? '团队质量协同' : 'Team Quality Collaboration',
      description: lang === 'zh'
        ? '团队级质量指标监控，确保组织内所有成员的 AI 调用都符合质量标准。统一质量评估体系，保障企业级服务一致性。'
        : 'Team-level quality metrics monitoring ensures all members\' AI calls meet quality standards. Unified quality assessment system guarantees enterprise service consistency.',
      metric: lang === 'zh' ? '团队质量达标率 100%' : '100% team quality compliance',
    },
  ];

  const testimonials = [
    {
      quote: lang === 'zh'
        ? '在确保输出质量不打折的前提下，AnyTokn 帮助我们将 AI 成本降低了 42%。质量评分始终保持在 98% 以上，ROI 非常显著。'
        : 'While ensuring no compromise in output quality, AnyTokn helped us reduce AI costs by 42%. Quality scores consistently remain above 98%, with remarkable ROI.',
      author: lang === 'zh' ? '张明' : 'Michael Zhang',
      role: 'CTO',
      company: 'TechFlow AI',
      metric: lang === 'zh' ? '质量 98%+' : 'Quality 98%+',
    },
    {
      quote: lang === 'zh'
        ? '最重要的是我们的服务质量完全没有下降。客户满意度反而提升了 15%，同时成本降低了 38%，这是真正的降本增效。'
        : 'Most importantly, our service quality remained intact. Customer satisfaction actually improved by 15% while costs dropped 38% - true efficiency gains.',
      author: lang === 'zh' ? '李华' : 'Sarah Li',
      role: 'VP Engineering',
      company: 'DataMind',
      metric: lang === 'zh' ? '满意度 +15%' : 'Satisfaction +15%',
    },
    {
      quote: lang === 'zh'
        ? '质量优先的路由策略让我们在降低成本 35% 的同时，响应质量指标反而提升了。终于找到了质量与成本的最佳平衡点。'
        : 'Quality-first routing strategy allowed us to reduce costs by 35% while improving response quality metrics. Finally found the optimal balance between quality and cost.',
      author: lang === 'zh' ? '王芳' : 'David Wang',
      role: 'Tech Lead',
      company: 'CloudScale',
      metric: lang === 'zh' ? '质量提升' : 'Quality Up',
    },
  ];

  const enterpriseFeatures = [
    'SOC 2 Type II 认证',
    'GDPR 合规',
    'ISO 27001 认证',
    '99.99% SLA 保障',
    '专属客户成功经理',
    '7x24 技术支持',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-black">AnyTokn</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {lang === 'zh' ? '核心功能' : 'Features'}
              </a>
              <a href="#enterprise" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {lang === 'zh' ? '企业级' : 'Enterprise'}
              </a>
              <a href="#pricing" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {lang === 'zh' ? '价格' : 'Pricing'}
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'zh' ? 'EN' : '中文'}</span>
              </button>

              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                  {lang === 'zh' ? '登录' : 'Login'}
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {lang === 'zh' ? '免费试用' : 'Start Free'}
                </Link>
              </div>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-neutral-100">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-medium text-neutral-600">{lang === 'zh' ? '核心功能' : 'Features'}</a>
                <a href="#enterprise" className="text-sm font-medium text-neutral-600">{lang === 'zh' ? '企业级' : 'Enterprise'}</a>
                <a href="#pricing" className="text-sm font-medium text-neutral-600">{lang === 'zh' ? '价格' : 'Pricing'}</a>
                <Link to="/login" className="text-sm font-medium text-neutral-600">{lang === 'zh' ? '登录' : 'Login'}</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 bg-gradient-to-b from-neutral-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <EnterpriseBadge />
            
            <h1 className="mt-8 text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
              {lang === 'zh' ? '企业级 Token' : 'Enterprise Token'}
              <br />
              <span className="text-emerald-600">{lang === 'zh' ? '高质量成本优化引擎' : 'Quality Cost Optimization Engine'}</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-10">
              {lang === 'zh'
                ? '在确保高质量输出的前提下，通过AI驱动的高精度智能优化引擎，及全链路数据洞察，结合客户业务场景实现让每个Token支出都转化为最大业务价值。'
                : 'While ensuring high-quality output, through AI-driven high-precision intelligent optimization engine and full-link data insights, combined with customer business scenarios, transform every Token expenditure into maximum business value.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                {lang === 'zh' ? '立即降本增效' : 'Reduce Costs Now'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 border border-neutral-200 text-black font-semibold rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {lang === 'zh' ? '观看演示' : 'Watch Demo'}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
              <TrustBadge text={lang === 'zh' ? '无需信用卡' : 'No credit card required'} />
              <TrustBadge text={lang === 'zh' ? '免费技术支持' : 'Free technical support'} />
              <TrustBadge text={lang === 'zh' ? '随时取消' : 'Cancel anytime'} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <StatsCard value="35%" label={lang === 'zh' ? '平均成本降低' : 'Avg Cost Reduction'} trend={lang === 'zh' ? '最高达 50%' : 'Up to 50%'} />
            <StatsCard value="500+" label={lang === 'zh' ? '企业客户' : 'Enterprise Clients'} />
            <StatsCard value="$50M+" label={lang === 'zh' ? '为客户节省' : 'Saved for Clients'} />
            <StatsCard value="99.99%" label={lang === 'zh' ? 'SLA 保障' : 'SLA Uptime'} />
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-12 border-y border-neutral-100 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-neutral-500 mb-8">
            {lang === 'zh' ? '被全球领先企业信赖' : 'Trusted by leading enterprises worldwide'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {['Fortune 500', '独角兽企业', '上市公司', '政府机构', '金融机构', '科技公司'].map((name) => (
              <div key={name} className="text-lg font-semibold text-neutral-400">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 mb-4">
              {lang === 'zh' ? '核心能力' : 'Core Capabilities'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              {lang === 'zh' ? '全方位 AI 成本管理' : 'Comprehensive AI Cost Management'}
            </h2>
            <p className="text-lg text-neutral-600">
              {lang === 'zh'
                ? '从成本分析到自动优化，为企业提供端到端的 AI 资源管理解决方案'
                : 'From cost analysis to automatic optimization, providing end-to-end AI resource management solutions for enterprises'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 md:py-32 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm font-semibold text-white/80 mb-6">
                {lang === 'zh' ? '企业级安全与合规' : 'Enterprise Security & Compliance'}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {lang === 'zh' ? '为大型企业' : 'Built for'}
                <br />
                <span className="text-emerald-400">{lang === 'zh' ? '安全而生' : 'Enterprise Security'}</span>
              </h2>
              <p className="text-lg text-white/70 mb-8">
                {lang === 'zh'
                  ? 'SOC 2 Type II、GDPR、ISO 27001 认证。端到端加密，细粒度权限控制，完整审计日志。'
                  : 'SOC 2 Type II, GDPR, ISO 27001 certified. End-to-end encryption, granular access control, complete audit logs.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {enterpriseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
              >
                {lang === 'zh' ? '联系销售' : 'Contact Sales'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{lang === 'zh' ? '安全认证' : 'Security Certifications'}</p>
                    <p className="text-sm text-white/50">{lang === 'zh' ? '已通过全部认证' : 'All certifications passed'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA'].map((cert) => (
                    <div key={cert} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <span className="text-white/80">{cert}</span>
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {lang === 'zh' ? '客户成功案例' : 'Customer Success Stories'}
            </h2>
            <p className="text-lg text-neutral-600">
              {lang === 'zh' ? '看看其他企业如何使用 AnyTokn 优化 AI 成本' : 'See how other enterprises use AnyTokn to optimize AI costs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {lang === 'zh' ? '质量与成本兼得' : 'Quality & Cost Together'}
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            {lang === 'zh'
              ? '加入 500+ 企业，在确保输出质量的前提下，实现 AI 成本优化。质量零妥协，成本更优。'
              : 'Join 500+ enterprises in optimizing AI costs while ensuring output quality. Zero quality compromise, better costs.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {lang === 'zh' ? '立即降本增效' : 'Reduce Costs Now'}
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {lang === 'zh' ? '预约演示' : 'Book Demo'}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-black mb-4">{lang === 'zh' ? '产品' : 'Product'}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '功能' : 'Features'}</a></li>
                <li><a href="#pricing" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '价格' : 'Pricing'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{lang === 'zh' ? '资源' : 'Resources'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '文档' : 'Docs'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Blog</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{lang === 'zh' ? '公司' : 'Company'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '关于' : 'About'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '招聘' : 'Careers'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '联系' : 'Contact'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{lang === 'zh' ? '法律' : 'Legal'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '隐私' : 'Privacy'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '条款' : 'Terms'}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">{lang === 'zh' ? '安全' : 'Security'}</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                <Hexagon className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-black">AnyTokn</span>
            </div>
            <p className="text-sm text-neutral-500">
              {lang === 'zh' ? '© 2024 AnyTokn. 保留所有权利。' : '© 2024 AnyTokn. All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
