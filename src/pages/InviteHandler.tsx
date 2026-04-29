import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, CheckCircle, Mail, Building2 } from 'lucide-react';

interface InviteInfo {
  valid: boolean;
  email: string;
  organization: { id: number; name: string };
  inviter: { name: string; email: string };
  role: string;
  expires_at: string;
}

export default function InviteHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'accepted'>('loading');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setErrorMsg(isEn ? 'Invalid invitation link' : '邀请链接无效');
      return;
    }

    // 模拟验证 token（实际应调用 API）
    const mockValidate = async () => {
      await new Promise((r) => setTimeout(r, 1200));

      // 模拟数据
      const mockInfo: InviteInfo = {
        valid: true,
        email: 'newuser@example.com',
        organization: { id: 2, name: isEn ? 'Tech Team' : '技术研发部' },
        inviter: { name: isEn ? 'John Doe' : '张三', email: 'john@example.com' },
        role: 'member',
        expires_at: '2026-05-05T12:00:00Z',
      };

      setInviteInfo(mockInfo);
      setStatus('valid');
    };

    mockValidate();
  }, [token, isEn]);

  const handleAccept = () => {
    if (!inviteInfo) return;

    // 检查用户是否已登录（模拟）
    const isLoggedIn = localStorage.getItem('costio_token');

    if (isLoggedIn) {
      // 已登录：自动加入并跳转 Dashboard
      setStatus('accepted');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      // 未登录：跳转到登录/注册页
      navigate(`/login?invite=${token}&email=${encodeURIComponent(inviteInfo.email)}`);
    }
  };

  // 加载中
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-black animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-600">{isEn ? 'Verifying invitation...' : '正在验证邀请...'}</p>
        </div>
      </div>
    );
  }

  // 已接受
  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-center max-w-sm w-full mx-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-black mb-2">
            {isEn ? 'Successfully joined!' : '加入成功！'}
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            {isEn
              ? `You have joined "${inviteInfo?.organization.name}"`
              : `您已成功加入「${inviteInfo?.organization.name}」`}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            {isEn ? 'Go to Dashboard' : '进入 Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  // 无 token - 显示邀请功能说明页（原型展示）
  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 max-w-lg w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              {isEn ? 'Member Invitation' : '成员邀请'}
            </h1>
            <p className="text-neutral-500">
              {isEn ? 'Invite team members to join your organization' : '邀请团队成员加入你的组织'}
            </p>
          </div>

          {/* 邀请流程说明 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{isEn ? 'Send Invitation' : '发送邀请'}</h3>
                <p className="text-sm text-slate-500">{isEn ? 'Enter email and select role in Members page' : '在成员管理页输入邮箱并选择角色'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{isEn ? 'Receive Email' : '接收邮件'}</h3>
                <p className="text-sm text-slate-500">{isEn ? 'Invited member receives email with link' : '被邀请人收到包含链接的邀请邮件'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{isEn ? 'Join Organization' : '加入组织'}</h3>
                <p className="text-sm text-slate-500">{isEn ? 'Click link to login/register and auto-join' : '点击链接登录/注册后自动加入'}</p>
              </div>
            </div>
          </div>

          {/* 演示按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => {
                // 模拟带 token 的邀请链接
                navigate('/invite?token=demo123');
                window.location.reload();
              }}
              className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              {isEn ? 'Simulate: Open Invitation Link' : '演示：打开邀请链接'}
            </button>
            <button
              onClick={() => navigate('/members')}
              className="w-full py-3 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {isEn ? 'Go to Members Page' : '前往成员管理页'}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            {isEn ? 'This is a prototype demonstration' : '此为原型演示'}
          </p>
        </div>
      </div>
    );
  }

  // 有效邀请展示页
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/anytokn.png" alt="AnyTokn" className="w-14 h-14 rounded-xl mx-auto mb-3" />
          <h1 className="text-xl font-bold text-black">AnyTokn</h1>
        </div>

        {/* 邀请信息 */}
        <div className="text-center mb-6">
          <p className="text-sm text-neutral-500 mb-4">
            {isEn ? 'You are invited to join' : '您被邀请加入'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-black" />
            <span className="text-lg font-semibold text-black">{inviteInfo?.organization.name}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <span>{isEn ? 'Invited by' : '邀请人'}:</span>
            <span className="font-medium text-neutral-700">{inviteInfo?.inviter.name}</span>
            <span className="text-neutral-400">({inviteInfo?.inviter.email})</span>
          </div>
        </div>

        {/* 邮箱信息 */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">{isEn ? 'Invitation sent to' : '邀请发送至'}</p>
              <p className="text-sm font-medium text-black">{inviteInfo?.email}</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <button
          onClick={handleAccept}
          className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors mb-3"
        >
          {isEn ? 'Accept Invitation' : '接受邀请'}
        </button>

        <p className="text-center text-xs text-neutral-400">
          {isEn ? 'This link expires on' : '此链接有效期至'} {inviteInfo?.expires_at.split('T')[0]}
        </p>
      </div>
    </div>
  );
}
