import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingDown,
  PieChart,
  ArrowDownRight,
  Bot,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Check,
  ArrowRight,
  Star,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

// 价格方案数据
const pricingPlans = [
  {
    name: '免费版',
    price: '¥0',
    description: '适合个人开发者和小型团队',
    features: [
      '最多 3 个项目',
      '每月 1000 次 API 调用',
      '基本成本监控',
      '邮件支持',
    ],
    buttonText: '开始免费使用',
    buttonClass: 'border border-brand-600 text-brand-600 hover:bg-brand-50',
    isPopular: false,
  },
  {
    name: '专业版',
    price: '¥999',
    description: '适合中型企业和专业团队',
    features: [
      '最多 20 个项目',
      '每月 50000 次 API 调用',
      '高级成本监控',
      '预算警报和通知',
      '优先邮件支持',
      'API 访问',
    ],
    buttonText: '立即购买',
    buttonClass: 'bg-brand-600 text-white hover:bg-brand-700',
    isPopular: true,
  },
  {
    name: '企业版',
    price: '¥2999',
    description: '适合大型企业和机构',
    features: [
      '无限项目',
      '无限 API 调用',
      '企业级成本监控',
      '高级预算管理',
      '24/7 专属支持',
      'API 访问',
      '自定义集成',
      '审计日志',
    ],
    buttonText: '联系销售',
    buttonClass: 'border border-brand-600 text-brand-600 hover:bg-brand-50',
    isPopular: false,
  },
];

// 客户案例数据
const testimonials = [
  {
    name: '张总监',
    company: '科技公司 CTO',
    quote: 'Costify 帮助我们将 AI 成本降低了 30%，同时提供了清晰的成本分析和预算控制。这是我们一直在寻找的解决方案。',
    rating: 5,
  },
  {
    name: '李经理',
    company: '电商平台 技术总监',
    quote: '使用 Costify 后，我们能够精确追踪每个项目的 AI 使用成本，避免了预算超支的情况。界面直观，功能强大。',
    rating: 5,
  },
  {
    name: '王工程师',
    company: 'AI 创业公司 创始人',
    quote: '作为一家 AI 创业公司，成本控制至关重要。Costify 不仅帮助我们节省了成本，还提供了有价值的分析数据，指导我们的业务决策。',
    rating: 4,
  },
];

// 常见问题数据
const faqs = [
  {
    question: 'Costify 如何帮助我控制 AI 成本？',
    answer: 'Costify 通过提供实时的成本监控、预算设置和警报系统，帮助您精确追踪和控制 AI 使用成本。您可以为每个项目设置预算，并在接近或超出预算时收到通知。',
  },
  {
    question: 'Costify 支持哪些 AI 模型？',
    answer: 'Costify 支持所有主流的 AI 模型，包括 GPT-4o、GPT-4o-mini、GPT-3.5-turbo 等。我们会持续添加对新模型的支持。',
  },
  {
    question: '我可以在多个项目中使用 Costify 吗？',
    answer: '是的，Costify 支持多个项目管理。根据您选择的套餐，您可以创建不同数量的项目，并为每个项目设置独立的预算和 API Key。',
  },
  {
    question: 'Costify 提供 API 访问吗？',
    answer: '是的，专业版和企业版用户可以通过 API 访问 Costify 的功能，方便与其他系统集成。',
  },
  {
    question: '如何开始使用 Costify？',
    answer: '您可以注册一个免费账户，开始使用 Costify 的基本功能。如果您需要更多高级功能，可以升级到专业版或企业版。',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切换 FAQ 展开/收起
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">Costify</span>
            </div>

            {/* 桌面导航 */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">
                产品特点
              </a>
              <a href="#pricing" className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">
                价格方案
              </a>
              <a href="#testimonials" className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">
                客户案例
              </a>
              <a href="#faq" className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">
                常见问题
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden md:block text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">
                登录
              </Link>
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                注册
              </Link>
              {/* 移动端菜单按钮 */}
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-surface-700" /> : <Menu className="w-5 h-5 text-surface-700" />}
              </button>
            </div>
          </div>

          {/* 移动端导航菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-surface-100">
              <nav className="flex flex-col gap-4">
                <a 
                  href="#features" 
                  className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  产品特点
                </a>
                <a 
                  href="#pricing" 
                  className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  价格方案
                </a>
                <a 
                  href="#testimonials" 
                  className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  客户案例
                </a>
                <a 
                  href="#faq" 
                  className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  常见问题
                </a>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  登录
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* 英雄区 */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-brand-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 leading-tight mb-6">
                  AI 成本管理<br />
                  <span className="text-brand-600">智能解决方案</span>
                </h1>
                <p className="text-lg text-surface-600 mb-8 max-w-xl">
                  Costify 帮助企业精确控制 AI 使用成本，提供实时监控、预算管理和智能分析，让您的 AI 投资更高效。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/register" 
                    className="px-8 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors text-center"
                  >
                    开始免费试用
                  </a>
                  <a 
                    href="#features" 
                    className="px-8 py-3 rounded-lg border border-surface-200 text-surface-700 font-medium hover:bg-surface-50 transition-colors text-center"
                  >
                    了解更多
                  </a>
                </div>
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-medium text-surface-700">{i}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-surface-600">来自 500+ 企业的信任</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-100 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-surface-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-surface-900">AI 成本概览</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">节省 30%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-surface-50 rounded-lg p-4">
                        <p className="text-xs text-surface-500 mb-1">本月花费</p>
                        <p className="text-xl font-bold text-surface-900">¥12,500</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowDownRight className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">较上月 -15%</span>
                        </div>
                      </div>
                      <div className="bg-surface-50 rounded-lg p-4">
                        <p className="text-xs text-surface-500 mb-1">预算使用</p>
                        <p className="text-xl font-bold text-surface-900">62%</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-amber-600">较上月 +5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['产品开发', '市场营销', '客户支持'].map((project, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-surface-700">{project}</span>
                            <span className="text-sm font-medium text-surface-700">¥{Math.floor(Math.random() * 5000) + 1000}</span>
                          </div>
                          <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 产品特点 */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">强大的 AI 成本管理功能</h2>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                Costify 提供全面的功能，帮助您精确控制和优化 AI 使用成本
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 功能 1 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">实时成本监控</h3>
                <p className="text-surface-600 mb-4">
                  实时追踪所有 AI 模型的使用成本，提供详细的使用报告和趋势分析。
                </p>
                <ul className="space-y-2">
                  {['实时成本更新', '详细使用报告', '趋势分析图表', '多维度数据视图'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 功能 2 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">智能预算管理</h3>
                <p className="text-surface-600 mb-4">
                  为每个项目设置预算，自动监控使用情况，当接近或超出预算时收到警报。
                </p>
                <ul className="space-y-2">
                  {['项目级预算设置', '自动预算监控', '多级别警报', '预算使用预测'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 功能 3 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">成本优化建议</h3>
                <p className="text-surface-600 mb-4">
                  基于使用数据，提供智能成本优化建议，帮助您降低 AI 使用成本。
                </p>
                <ul className="space-y-2">
                  {['智能模型推荐', '使用模式分析', '成本优化建议', '节省效果跟踪'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 功能 4 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">API Key 管理</h3>
                <p className="text-surface-600 mb-4">
                  为每个项目生成和管理 API Key，控制访问权限，确保安全使用。
                </p>
                <ul className="space-y-2">
                  {['项目级 API Key', '访问权限控制', 'Key 吊销功能', '使用记录跟踪'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 功能 5 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">安全与合规</h3>
                <p className="text-surface-600 mb-4">
                  提供企业级安全保障，确保数据安全和合规性，满足企业级需求。
                </p>
                <ul className="space-y-2">
                  {['企业级安全', '数据加密', '合规性报告', '审计日志'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 功能 6 */}
              <div className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-3">智能警报系统</h3>
                <p className="text-surface-600 mb-4">
                  当成本异常或预算接近上限时，自动发送警报，帮助您及时采取行动。
                </p>
                <ul className="space-y-2">
                  {['多渠道通知', '自定义警报规则', '异常检测', '实时提醒'].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-surface-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 价格方案 */}
        <section id="pricing" className="py-20 bg-surface-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">选择适合您的方案</h2>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                无论您是个人开发者还是大型企业，Costify 都有适合您的方案
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl border transition-all duration-300 ${plan.isPopular ? 'border-brand-600 shadow-lg relative' : 'border-surface-200 hover:shadow-md'}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        推荐
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-surface-900 mb-2">{plan.name}</h3>
                    <p className="text-surface-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-surface-900">{plan.price}</span>
                      {plan.price !== '¥0' && <span className="text-surface-500 ml-2">/月</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-surface-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="/register" 
                      className={`w-full block text-center py-3 rounded-lg font-medium transition-colors ${plan.buttonClass}`}
                    >
                      {plan.buttonText}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-surface-600 mb-4">需要更灵活的方案？</p>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline"
              >
                联系我们获取自定义方案 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 客户案例 */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">客户的成功故事</h2>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                看看其他企业如何使用 Costify 优化 AI 成本
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-surface-50 rounded-xl p-6 border border-surface-200">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-surface-300" />
                    ))}
                  </div>
                  <p className="text-surface-700 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand-600">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{testimonial.name}</p>
                      <p className="text-xs text-surface-500">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section id="faq" className="py-20 bg-surface-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">常见问题</h2>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                解答您关于 Costify 的疑问
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-surface-200 rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-surface-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-surface-900">{faq.question}</span>
                    <ChevronRight 
                      className={`w-5 h-5 text-surface-500 transition-transform ${activeFaq === index ? 'transform rotate-90' : ''}`}
                    />
                  </button>
                  {activeFaq === index && (
                    <div className="p-4 bg-white border-t border-surface-100">
                      <p className="text-surface-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 行动号召 */}
        <section className="py-20 bg-brand-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开始优化您的 AI 成本了吗？</h2>
              <p className="text-lg mb-8 text-brand-100">
                加入 500+ 企业，使用 Costify 智能管理 AI 成本，提高投资回报率。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/register" 
                  className="px-8 py-3 rounded-lg bg-white text-brand-600 font-medium hover:bg-surface-100 transition-colors text-center"
                >
                  开始免费试用
                </a>
                <a 
                  href="#contact" 
                  className="px-8 py-3 rounded-lg border border-white text-white font-medium hover:bg-white/10 transition-colors text-center"
                >
                  联系销售
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-surface-900 text-surface-400 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4.5 h-4.5 text-brand-600" />
                </div>
                <span className="text-lg font-bold text-white">Costify</span>
              </div>
              <p className="text-sm mb-4">
                智能 AI 成本管理解决方案，帮助企业精确控制和优化 AI 使用成本。
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">产品</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">功能</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">价格</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API 文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">集成</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">资源</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">博客</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">客户案例</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">常见问题</a></li>
              </ul>
            </div>

            <div id="contact">
              <h3 className="text-white font-medium mb-4">联系我们</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@costio.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>400-123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>北京市朝阳区科技园区</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              © 2024 Costify. 保留所有权利。
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">Cookie 政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
