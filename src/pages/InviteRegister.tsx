import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, ArrowRight, Mail, Building2, CheckCircle, Loader2 } from 'lucide-react';

export default function InviteRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const token = searchParams.get('token') || 'demo123';
  const email = searchParams.get('email') || 'newuser@example.com';
  const orgName = searchParams.get('org') || (isEn ? 'Tech Team' : '技术研发部');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(isEn ? 'Passwords do not match' : '两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError(isEn ? 'Password must be at least 6 characters' : '密码至少需要6个字符');
      return;
    }

    setIsLoading(true);

    // 模拟注册过程
    await new Promise((r) => setTimeout(r, 1500));

    setIsLoading(false);
    setIsSuccess(true);

    // 3秒后跳转到 dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  // 成功状态
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {isEn ? 'Welcome to AnyTokn!' : '欢迎加入 AnyTokn！'}
          </h2>
          <p className="text-neutral-500 mb-2">
            {isEn ? `You have successfully joined "${orgName}"` : `您已成功加入「${orgName}」`}
          </p>
          <p className="text-sm text-neutral-400 mb-6">
            {isEn ? 'Redirecting to Dashboard...' : '正在跳转到 Dashboard...'}
          </p>
          <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[loading_3s_ease-in-out]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/anytokn.png" alt="AnyTokn" className="w-14 h-14 rounded-xl mx-auto mb-3" />
          <h1 className="text-xl font-bold text-black">AnyTokn</h1>
        </div>

        {/* 邀请信息 */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">
              {isEn ? 'You are invited to join' : '您被邀请加入'}
            </span>
          </div>
          <p className="text-lg font-semibold text-emerald-900">{orgName}</p>
          <p className="text-xs text-emerald-600 mt-1">
            {isEn ? 'Complete registration to automatically join' : '完成注册后将自动加入该组织'}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          {isEn ? 'Create Your Account' : '创建你的账户'}
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          {isEn ? 'Fill in your information to complete registration' : '填写信息完成注册'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱 - 锁定 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {isEn ? 'Email' : '邮箱'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled
                className="w-full text-sm bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3 pr-10 text-neutral-500 cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Mail className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {isEn ? 'Email is locked from invitation' : '邮箱由邀请锁定，不可修改'}
            </p>
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {isEn ? 'Full Name' : '姓名'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              placeholder={isEn ? 'Enter your full name' : '请输入您的姓名'}
              required
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {isEn ? 'Password' : '密码'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                placeholder={isEn ? 'At least 6 characters' : '至少6个字符'}
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

          {/* 确认密码 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {isEn ? 'Confirm Password' : '确认密码'}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              placeholder={isEn ? 'Enter password again' : '再次输入密码'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEn ? 'Creating Account...' : '正在创建账户...'}
              </>
            ) : (
              <>
                {isEn ? 'Create Account & Join' : '创建账户并加入'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {isEn ? 'Already have an account?' : '已有账户？'}
          <button
            className="text-black font-medium ml-1 hover:underline"
            onClick={() => navigate(`/login?invite=${token}&email=${encodeURIComponent(email)}`)}
          >
            {isEn ? 'Login' : '直接登录'}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-neutral-400">
          {isEn
            ? 'By registering, you agree to our Terms of Service and Privacy Policy'
            : '注册即表示您同意我们的服务条款和隐私政策'}
        </p>
      </div>
    </div>
  );
}
