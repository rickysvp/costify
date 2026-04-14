import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (!res.ok) throw new Error(data.error || '操作失败');
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Costify</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">企业 AI 成本管理系统</h2>
          <p className="text-white/80 text-lg mb-8">统一采购、智能路由、精细管理。让每一分 AI 投入都有据可查。</p>
          <div className="space-y-4">
            {['统一采购与结算', '多模型智能路由', 'Token 成本优化', '预算与告警闭环'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/10 rounded-xl">
            <p className="text-sm text-white/70 mb-2">演示账号</p>
            <p className="text-sm">管理员: admin@costify.io / admin123</p>
            <p className="text-sm">成员: alice@costify.io / member123</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-surface-900">Costify</h1>
          </div>

          <h2 className="text-xl font-bold text-surface-900 mb-1">{isLogin ? '登录' : '注册'}</h2>
          <p className="text-sm text-surface-500 mb-6">{isLogin ? '登录到您的企业控制台' : '创建您的账号'}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">姓名</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">邮箱</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">密码</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-surface-500">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button className="text-brand-600 font-medium ml-1" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? '注册' : '登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
