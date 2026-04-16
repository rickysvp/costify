import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex">
      {/* 左侧品牌区域 - 黑白色系 */}
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AnyTokn</h1>
              <p className="text-white/60 text-sm">AI Token Management</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">统一 AI 资源<br/>管理平台</h2>
          <p className="text-white/70 text-lg mb-10">聚合多模型 API，智能路由，成本优化。让 AI 资源管理更简单、更高效。</p>
          
          <div className="space-y-4 mb-12">
            {['多模型统一接入', '智能成本优化', '实时使用监控', '团队权限管理'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</div>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-white/50 mb-3 uppercase tracking-wider">演示账号</p>
            <p className="text-sm text-white/80">管理员: admin@anytokn.io / admin123</p>
            <p className="text-sm text-white/80">成员: alice@anytokn.io / member123</p>
          </div>
        </div>
      </div>

      {/* 右侧登录区域 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-sm">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">AnyTokn</h1>
              <p className="text-xs text-neutral-500">AI Token Management</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-2xl font-bold text-black mb-2">{isLogin ? '欢迎回来' : '创建账号'}</h2>
            <p className="text-sm text-neutral-500 mb-6">{isLogin ? '登录到您的 AnyTokn 控制台' : '开始管理您的 AI 资源'}</p>

            {error && (
              <div className="bg-neutral-100 border border-neutral-200 text-neutral-700 p-3 rounded-lg text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">姓名</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="请输入您的姓名"
                    required 
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">邮箱</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  placeholder="name@company.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">密码</label>
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
                    {isLogin ? '登录' : '创建账号'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button 
                className="text-black font-medium ml-1 hover:underline" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? '立即注册' : '直接登录'}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
}
