import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon,
  Globe,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Layers,
  Database,
  Lock,
  Check,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  Server,
} from 'lucide-react';
import { getTranslation, type Language } from '../i18n';

// Logo Cloud Component
const LogoCloud = () => {
  const logos = [
    { name: 'OpenAI', color: '#10A37F' },
    { name: 'Anthropic', color: '#D4A574' },
    { name: 'Google', color: '#4285F4' },
    { name: 'Meta', color: '#0668E1' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Amazon', color: '#FF9900' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="text-lg md:text-xl font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
          style={{ color: logo.color }}
        >
          {logo.name}
        </div>
      ))}
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <div
    className="group relative p-6 md:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
    <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
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
  isYearly: boolean;
}

const PricingCard = ({ name, price, period, description, features, cta, popular, isYearly }: PricingCardProps) => (
  <div className={`relative p-6 md:p-8 rounded-2xl border ${popular ? 'border-black shadow-xl' : 'border-neutral-200'} bg-white`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
          Most Popular
        </span>
      </div>
    )}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-black mb-1">{name}</h3>
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
    <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
      popular
        ? 'bg-black text-white hover:bg-neutral-800'
        : 'border border-neutral-200 text-black hover:bg-neutral-50'
    }`}>
      {cta}
    </button>
  </div>
);

// Testimonial Card Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCard = ({ quote, author, role, company }: TestimonialCardProps) => (
  <div className="p-6 md:p-8 rounded-2xl bg-neutral-50 border border-neutral-100">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Sparkles key={i} className="w-4 h-4 text-black fill-black" />
      ))}
    </div>
    <p className="text-neutral-700 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-black">
        {author[0]}
      </div>
      <div>
        <p className="font-medium text-black text-sm">{author}</p>
        <p className="text-xs text-neutral-500">{role} · {company}</p>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('zh');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const t = getTranslation(lang);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
    },
  ];

  const testimonials = [
    {
      quote: lang === 'zh'
        ? 'AnyTokn 帮助我们将 AI 成本降低了 35%，同时提供了清晰的成本分析和预算控制。'
        : 'AnyTokn helped us reduce AI costs by 35% while providing clear cost analysis and budget control.',
      author: lang === 'zh' ? '张明' : 'John Smith',
      role: 'CTO',
      company: 'TechFlow AI',
    },
    {
      quote: lang === 'zh'
        ? '统一 API 网关让我们的开发效率提升了 50%，不再需要维护多个模型的接口。'
        : 'The unified API gateway improved our development efficiency by 50%, no need to maintain multiple model interfaces.',
      author: lang === 'zh' ? '李华' : 'Sarah Chen',
      role: 'VP Engineering',
      company: 'DataMind',
    },
    {
      quote: lang === 'zh'
        ? '语义缓存功能非常强大，我们的重复请求减少了 60%，节省了大量成本。'
        : 'The semantic caching is incredibly powerful, reducing our duplicate requests by 60% and saving significant costs.',
      author: lang === 'zh' ? '王芳' : 'Michael Wang',
      role: 'Tech Lead',
      company: 'CloudScale',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-black">AnyTokn</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#docs" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                {t.nav.docs}
              </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'zh' ? 'EN' : '中文'}</span>
              </button>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                  {t.nav.login}
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {t.nav.signup}
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-neutral-100">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-medium text-neutral-600">{t.nav.features}</a>
                <a href="#pricing" className="text-sm font-medium text-neutral-600">{t.nav.pricing}</a>
                <a href="#docs" className="text-sm font-medium text-neutral-600">{t.nav.docs}</a>
                <Link to="/login" className="text-sm font-medium text-neutral-600">{t.nav.login}</Link>
                <Link to="/login" className="text-sm font-medium text-black">{t.nav.signup}</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-8">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-neutral-700">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
              {t.hero.title}
              <br />
              <span className="text-neutral-400">{t.hero.titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#docs"
                className="w-full sm:w-auto px-8 py-4 border border-neutral-200 text-black font-medium rounded-xl hover:bg-neutral-50 transition-colors"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-black">500+</div>
                <div className="text-sm text-neutral-500">{t.hero.stats.companies}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-black">99.9%</div>
                <div className="text-sm text-neutral-500">{t.hero.stats.uptime}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-black">50+</div>
                <div className="text-sm text-neutral-500">{t.hero.stats.models}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-12 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-neutral-400 mb-8">
            {lang === 'zh' ? '被全球领先的 AI 公司信赖' : 'Trusted by leading AI companies worldwide'}
          </p>
          <LogoCloud />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-neutral-100 text-sm font-medium text-neutral-700 mb-4">
              {t.features.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 md:py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {t.socialProof.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.socialProof.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-neutral-100 text-sm font-medium text-neutral-700 mb-4">
              {t.pricing.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              {t.pricing.description}
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isYearly ? 'text-black' : 'text-neutral-500'}`}>
                {t.pricing.toggle.monthly}
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-7 rounded-full bg-neutral-200 transition-colors"
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-black transition-all ${
                  isYearly ? 'left-8' : 'left-1'
                }`} />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-black' : 'text-neutral-500'}`}>
                {t.pricing.toggle.yearly}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {t.pricing.toggle.save}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.pricing.plans.map((plan, i) => (
              <PricingCard
                key={i}
                name={plan.name}
                price={isYearly && plan.price !== (lang === 'zh' ? '定制' : 'Custom')
                  ? (lang === 'zh' ? '¥' : '$') + Math.round(parseInt(plan.price.replace(/[^0-9]/g, '')) * 0.8)
                  : plan.price
                }
                period={plan.period}
                description={plan.description}
                features={plan.features}
                cta={plan.cta}
                popular={plan.popular}
                isYearly={isYearly}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            {t.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-medium rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {t.cta.primary}
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 border border-neutral-700 text-white font-medium rounded-xl hover:bg-neutral-900 transition-colors"
            >
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-black mb-4">{t.footer.product}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-neutral-600 hover:text-black">{t.nav.features}</a></li>
                <li><a href="#pricing" className="text-sm text-neutral-600 hover:text-black">{t.nav.pricing}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2">
                <li><a href="#docs" className="text-sm text-neutral-600 hover:text-black">{t.nav.docs}</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Blog</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">About</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Careers</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Privacy</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Terms</a></li>
                <li><a href="#" className="text-sm text-neutral-600 hover:text-black">Security</a></li>
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
            <p className="text-sm text-neutral-500">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
