import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, ArrowRight, Globe, Mail, Building2 } from 'lucide-react';

import { API_BASE } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const isEn = lang === 'en';

  // 邀请相关参数
  const inviteToken = searchParams.get('invite');
  const inviteEmail = searchParams.get('email');

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果有邀请邮箱，预填且锁定
  useEffect(() => {
    if (inviteEmail) {
      setEmail(inviteEmail);
    }
  }, [inviteEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
      const body = isLogin ? { email, password } : { email, password, name, org_id: 1 };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.login.loginError);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  const features = lang === 'zh' 
    ? ['多模型统一接入', '智能成本优化', '实时使用监控', '团队权限管理']
    : ['Unified Multi-Model Access', 'Intelligent Cost Optimization', 'Real-time Usage Monitoring', 'Team Access Control'];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Brand Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/anytokn.png" alt="AnyTokn" className="w-16 h-16 rounded-xl" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AnyTokn</h1>
                <p className="text-white/60 text-sm">AI Token Management</p>
              </div>
            </div>
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80 hover:bg-white/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            {lang === 'zh' ? '企业级 Token' : 'Enterprise Token'}
            <br/>
            {lang === 'zh' ? '高质量成本优化引擎' : 'Quality Cost Optimization Engine'}
          </h2>
          <p className="text-white/70 text-lg mb-10">
            {lang === 'zh' 
              ? '在确保高质量输出的前提下，通过AI驱动的高精度智能优化引擎，让每个Token支出都转化为最大业务价值。'
              : 'Through AI-driven high-precision intelligent optimization engine, transform every Token expenditure into maximum business value while ensuring high-quality output.'}
          </p>
          
          <div className="space-y-4 mb-12">
            {features.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</div>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-white/50 mb-3 uppercase tracking-wider">{t.login.demoAccount}</p>
            <p className="text-sm text-white/80">{t.login.demoAdmin}: admin@anytokn.io / admin123</p>
            <p className="text-sm text-white/80">{t.login.demoMember}: alice@anytokn.io / member123</p>
          </div>
        </div>
      </div>

      {/* Right Login Area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <img src="/anytokn.png" alt="AnyTokn" className="w-12 h-12 rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-black">AnyTokn</h1>
                <p className="text-xs text-neutral-500">AI Token Management</p>
              </div>
            </div>
            {/* Mobile Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-300 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            {/* 邀请提示 */}
            {inviteToken && (
              <div className="bg-neutral-50 rounded-lg p-4 mb-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-black" />
                  <span className="text-sm font-medium text-black">
                    {isEn ? 'You are joining' : '您正在加入'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  {isEn
                    ? 'After login, you will automatically join the organization'
                    : '登录后将自动加入该组织'}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-black mb-2">
              {isLogin
                ? (inviteToken ? (isEn ? 'Welcome Back' : '欢迎回来') : t.login.title)
                : (isEn ? 'Create Account' : '创建账号')}
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              {isLogin
                ? (inviteToken
                  ? (isEn ? 'Login to join the organization' : '登录以加入组织')
                  : t.login.subtitle)
                : (isEn ? 'Start managing your AI resources' : '开始管理您的 AI 资源')}
            </p>

            {error && (
              <div className="bg-neutral-100 border border-neutral-200 text-neutral-700 p-3 rounded-lg text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">{isEn ? 'Name' : '姓名'}</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder={isEn ? 'Enter your name' : '请输入您的姓名'}
                    required 
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.login.email}</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    disabled={!!inviteEmail}
                    className={`w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all ${inviteEmail ? 'text-neutral-500 cursor-not-allowed' : ''}`}
                    placeholder="name@company.com"
                    required 
                  />
                  {inviteEmail && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-4 h-4 text-neutral-400" />
                    </div>
                  )}
                </div>
                {inviteEmail && (
                  <p className="text-xs text-neutral-400 mt-1">{isEn ? 'Email is locked from invitation' : '邮箱由邀请锁定，不可修改'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.login.password}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="••••••••"
                    required 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    {isLogin ? t.login.loginButton : (lang === 'zh' ? '创建账号' : 'Create Account')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              {isLogin ? t.login.noAccount : (lang === 'zh' ? '已有账号？' : 'Already have an account?')}
              <button 
                className="text-black font-medium ml-1 hover:underline" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? t.login.register : t.login.loginButton}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            {lang === 'zh' ? '登录即表示您同意我们的服务条款和隐私政策' : 'By signing in, you agree to our Terms of Service and Privacy Policy'}
          </p>
        </div>
      </div>
    </div>
  );
}
