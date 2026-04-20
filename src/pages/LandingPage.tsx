import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon,
  Globe,
  ArrowRight,
  Shield,
  TrendingDown,
  Zap,
  Check,
  Menu,
  X,
  BarChart3,
  Lock,
  Users,
  Target,
  Code2,
  Layers,
  Sparkles,
  ChevronRight,
  Terminal,
  Cpu,
  LineChart,
  Wallet,
  Bell,
} from 'lucide-react';
import { type Language } from '../i18n';

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

// Code Block Component
const CodeBlock = () => (
  <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex gap-4 ml-4 text-xs text-slate-400">
        <span className="text-blue-400 border-b-2 border-blue-400 pb-3">TypeScript</span>
        <span>Python</span>
        <span>cURL</span>
      </div>
    </div>
    <div className="p-4 text-sm font-mono overflow-x-auto">
      <pre className="text-slate-300">
        <code>{`import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.anytokn.io/v1",
  apiKey: process.env.ANYTOKN_API_KEY
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }]
});`}</code>
      </pre>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role, company }: { quote: string; author: string; role: string; company: string }) => (
  <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
    <p className="text-slate-700 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
        {author[0]}
      </div>
      <div>
        <p className="font-semibold text-slate-900 text-sm">{author}</p>
        <p className="text-xs text-slate-500">{role} · {company}</p>
      </div>
    </div>
  </div>
);

// Logo Component
const Logo = ({ name }: { name: string }) => (
  <div className="text-slate-400 font-semibold text-sm hover:text-slate-600 transition-colors cursor-default">
    {name}
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
      icon: <BarChart3 className="w-6 h-6" />,
      title: lang === 'zh' ? '智能 LLM 路由' : 'Smart LLM Routing',
      description: lang === 'zh' 
        ? '基于成本和质量的智能路由，自动选择最优模型组合，在不影响输出质量的前提下降低成本。'
        : 'Intelligent routing based on cost and quality, automatically selecting the optimal model combination.',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: lang === 'zh' ? 'Agent 调试' : 'Agent Debugging',
      description: lang === 'zh'
        ? '完整的调用链路追踪，可视化时间线和错误日志，快速定位问题根源。'
        : 'Complete call chain tracing with visualized timelines and error logs for quick root cause analysis.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: lang === 'zh' ? '完整可观测性' : 'Complete Visibility',
      description: lang === 'zh'
        ? '全面的分析仪表板，实时监控成本、质量、延迟等关键指标。'
        : 'Comprehensive analytics dashboard for real-time monitoring of cost, quality, and latency metrics.',
    },
  ];

  const testimonials = [
    {
      quote: lang === 'zh'
        ? 'AnyTokn 帮助我们将 AI 成本降低了 40%，同时保持了高质量的输出。这是我们 codebase 中最具影响力的一行代码变更。'
        : 'AnyTokn helped us reduce AI costs by 40% while maintaining high-quality output. The most impactful one-line change to our codebase.',
      author: lang === 'zh' ? '张明' : 'Michael Zhang',
      role: 'CTO',
      company: 'TechFlow AI',
    },
    {
      quote: lang === 'zh'
        ? '路由优化功能让我们的响应速度提升了 30%，成本却降低了 35%。ROI 非常显著。'
        : 'The routing optimization improved our response time by 30% while reducing costs by 35%. Remarkable ROI.',
      author: lang === 'zh' ? '李华' : 'Sarah Li',
      role: 'VP Engineering',
      company: 'DataMind',
    },
  ];

  const logos = ['together.ai', 'GA WOLF', 'CLAY', 'Flevine', 'PadPitch', 'Suprin'];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">AnyTokn</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '功能' : 'Features'}
              </a>
              <a href="#docs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '文档' : 'Docs'}
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '价格' : 'Pricing'}
              </a>
              <a href="#resources" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {lang === 'zh' ? '资源' : 'Resources'}
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'zh' ? 'EN' : '中文'}</span>
              </button>

              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {lang === 'zh' ? '登录' : 'Log in'}
              </Link>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '功能' : 'Features'}</a>
                <a href="#docs" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '文档' : 'Docs'}</a>
                <a href="#pricing" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '价格' : 'Pricing'}</a>
                <Link to="/login" className="text-sm font-medium text-slate-600">{lang === 'zh' ? '登录' : 'Login'}</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            {lang === 'zh' ? '构建与扩展' : 'Build & Scale'}
            <br />
            {lang === 'zh' ? '可靠的 AI 应用' : 'Reliable AI Apps'}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            {lang === 'zh'
              ? 'AI 可观测性、管理和路由的基础平台。信任您的 AI 技术栈。'
              : 'The essential platform for AI observability, management, and routing. Trust your AI stack.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {lang === 'zh' ? '免费开始' : 'Start for free'}
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
            <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-xs text-slate-400">AnyTokn Dashboard</div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-slate-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-slate-600 mb-2">Cost Overview</div>
                  <div className="h-24 bg-white rounded border border-slate-200 flex items-end p-2 gap-1">
                    {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 45, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Requests</div>
                    <div className="text-xl font-bold text-slate-900">22.8K</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Tokens</div>
                    <div className="text-xl font-bold text-slate-900">6.35M</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Cost</div>
                    <div className="text-xl font-bold text-slate-900">$12.5K</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <CodeBlock />
          <div className="text-center mt-6">
            <button className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
              {lang === 'zh' ? '查看全部 100+ 模型' : 'View all 100+ models'}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-12 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((name) => (
              <Logo key={name} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0" />
              <div>
                <p className="text-lg md:text-xl text-slate-700 mb-4 leading-relaxed">
                  {lang === 'zh'
                    ? '对我们 codebase 来说，这是最具影响力的一行代码变更。'
                    : 'The most impactful one-line change I\'ve seen applied to our codebase.'}
                </p>
                <p className="font-semibold text-slate-900">Nishant Shukla</p>
                <p className="text-sm text-slate-500">Sr. Director of AI at QA Wolf</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value="9.5 Billion" label={lang === 'zh' ? '处理的请求' : 'requests processed'} />
            <StatCard value="2.3 Trillion" label={lang === 'zh' ? '每月 Token' : 'tokens a month'} />
            <StatCard value="60.7 Million" label={lang === 'zh' ? '追踪的用户' : 'users tracked'} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '集成' : 'Integrations'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '关于' : 'About'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '集成' : 'Integrations'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '联系' : 'Contact'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '博客' : 'Blogs'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Helicone Downtimes</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog AI Fire Koe</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Helicone Skateboards</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Term in Geometry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '资源' : 'Resources'}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '关于' : 'About'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '资源' : 'Resources'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '隐私政策' : 'Privacy Policy'}</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{lang === 'zh' ? '条款与条件' : 'Terms & Conditions'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{lang === 'zh' ? '联系' : 'Connect'}</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © Copyright 2024 AnyTokn
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Hexagon className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white">AnyTokn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
