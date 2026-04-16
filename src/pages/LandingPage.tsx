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
  Building2,
  Check,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Lock,
  Users,
  ArrowUpRight,
  Wallet,
  LineChart,
  Target,
  BadgeCheck,
  ChevronRight,
  Play,
} from 'lucide-react';
import { getTranslation, type Language } from '../i18n';

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

// Pricing Card Component
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
      icon: <Zap className="w-7 h-7" />,
      title: lang === 'zh' ? '智能模型路由' : 'Intelligent Model Routing',
      description: lang === 'zh'
        ? '基于质量、成本、延迟三维评估的智能路由，在保证输出质量的前提下，自动选择最优模型，实现 Token 成本最优化。'
        : 'Quality-cost-latency based intelligent routing. Automatically selects optimal models while ensuring output quality, achieving Token cost optimization.',
      metric: lang === 'zh' ? '成本降低 30-50%' : '30-50% cost reduction',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: lang === 'zh' ? '语义缓存优化' : 'Semantic Caching',
      description: lang === 'zh'
        ? '智能识别语义相似请求，复用历史结果。在不影响输出质量的情况下，显著减少重复 API 调用，降低 Token 消耗。'
        : 'Intelligently identifies semantically similar requests and reuses historical results. Significantly reduces duplicate API calls without affecting output quality.',
      metric: lang === 'zh' ? '缓存命中率 35%+' : '35%+ cache hit rate',
    },
    {
      icon: <PieChart className="w-7 h-7" />,
      title: lang === 'zh' ? 'Token 级成本分析' : 'Token-Level Cost Analysis',
      description: lang === 'zh'
        ? '精细化到单次请求、每个 Token 的成本追踪。识别高成本低效调用，提供优化建议，确保每一分钱都花在刀刃上。'
        : 'Granular cost tracking down to single requests and each Token. Identifies high-cost inefficient calls and provides optimization recommendations.',
      metric: lang === 'zh' ? '成本透明度 100%' : '100% cost transparency',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: lang === 'zh' ? '质量监控保障' : 'Quality Monitoring',
      description: lang === 'zh'
        ? '实时监控模型输出质量，自动检测异常和降级。确保成本优化不以牺牲服务质量为代价，维持用户体验一致性。'
        : 'Real-time monitoring of model output quality, automatic detection of anomalies and degradation. Ensures cost optimization never compromises service quality.',
      metric: lang === 'zh' ? '质量保持率 99%+' : '99%+ quality retention',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: lang === 'zh' ? '企业级预算管控' : 'Enterprise Budget Control',
      description: lang === 'zh'
        ? '多级预算分配与实时预警，项目级、团队级、个人级精细管控。防止预算超支，确保 AI 投入产出比最大化。'
        : 'Multi-level budget allocation with real-time alerts. Project, team, and individual-level granular control to maximize AI ROI.',
      metric: lang === 'zh' ? '预算偏差 < 5%' : '< 5% budget variance',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: lang === 'zh' ? '团队协作管理' : 'Team Collaboration',
      description: lang === 'zh'
        ? '多租户架构，RBAC 权限管理，SSO 单点登录。支持 LDAP、SAML、OIDC，满足大型企业复杂组织架构需求。'
        : 'Multi-tenant architecture, RBAC permission management, SSO. Supports LDAP, SAML, OIDC for complex enterprise organizational structures.',
      metric: lang === 'zh' ? '支持 1000+ 成员' : '1000+ members supported',
    },
  ];

  const testimonials = [
    {
      quote: lang === 'zh'
        ? 'AnyTokn 帮助我们在3个月内将 AI 成本降低了 42%，同时保持了服务质量。ROI 非常显著。'
        : 'AnyTokn helped us reduce AI costs by 42% in 3 months while maintaining service quality. The ROI is remarkable.',
      author: lang === 'zh' ? '张明' : 'Michael Zhang',
      role: 'CTO',
      company: 'TechFlow AI',
      metric: '-42%',
    },
    {
      quote: lang === 'zh'
        ? '预算管控功能非常强大，我们现在可以精确控制每个团队的 AI 支出，再也不会出现意外账单。'
        : 'The budget control is incredibly powerful. We can now precisely control AI spending per team with no surprise bills.',
      author: lang === 'zh' ? '李华' : 'Sarah Li',
      role: 'VP Engineering',
      company: 'DataMind',
      metric: '-38%',
    },
    {
      quote: lang === 'zh'
        ? '智能路由让我们的响应速度提升了 50%，同时成本降低了 30%。这是我们用过最好的 AI 成本管理工具。'
        : 'Smart routing improved our response time by 50% while reducing costs by 30%. Best AI cost management tool we have used.',
      author: lang === 'zh' ? '王芳' : 'David Wang',
      role: 'Tech Lead',
      company: 'CloudScale',
      metric: '-30%',
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
                {lang === 'zh' ? '免费试用 14 天' : 'Start 14-Day Free Trial'}
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
            {lang === 'zh' ? '准备好降低 AI 成本了吗？' : 'Ready to Reduce AI Costs?'}
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            {lang === 'zh'
              ? '加入 500+ 企业，使用 AnyTokn 智能管理 AI 资源，平均降低 35% 成本。'
              : 'Join 500+ enterprises using AnyTokn to intelligently manage AI resources, reducing costs by an average of 35%.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {lang === 'zh' ? '免费试用 14 天' : 'Start 14-Day Free Trial'}
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {lang === 'zh' ? '联系销售' : 'Contact Sales'}
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
