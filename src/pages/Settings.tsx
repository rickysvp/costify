import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  User,
  Lock,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

import { API_BASE } from '../config';

// ---------- 类型定义 ----------
interface OrgInfo {
  id: number;
  name: string;
  balance_threshold: number;
  created_at: string;
}

interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  org_id: number;
  created_at: string;
}

// ---------- 辅助函数 ----------
function getToken(): string | null {
  return localStorage.getItem('costio_token');
}

// ---------- 主组件 ----------
export default function Settings() {
  const { t } = useLanguage();
  // 组织信息
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [orgName, setOrgName] = useState('');
  const [balanceThreshold, setBalanceThreshold] = useState(0);
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);

  // 当前用户
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  // 修改密码
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // 通用状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'org' | 'profile' | 'password'>('org');

  // 获取组织信息
  const fetchOrg = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/org`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`请求失败: ${res.status}`);
      const data = await res.json();
      const orgData: OrgInfo = data.org ?? data;
      setOrg(orgData);
      setOrgName(orgData.name);
      setBalanceThreshold(orgData.balance_threshold);

      // 同时获取用户信息（从 localStorage 或 API）
      const storedUser = localStorage.getItem('costio_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (err: any) {
      setError(err.message || '获取组织信息失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);

  // 保存组织信息
  const saveOrg = async () => {
    setOrgSaving(true);
    setOrgSaved(false);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/org`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: orgName,
          balance_threshold: balanceThreshold,
        }),
      });
      if (!res.ok) throw new Error('保存失败');
      const data = await res.json();
      const updated = data.org ?? data;
      setOrg(updated);
      setOrgSaved(true);
      setTimeout(() => setOrgSaved(false), 3000);
    } catch {
      // 乐观展示
    } finally {
      setOrgSaving(false);
    }
  };

  // 修改密码（前端展示）
  const handleChangePassword = async () => {
    setPwdError('');
    setPwdSuccess(false);

    if (!oldPassword) {
      setPwdError('请输入当前密码');
      return;
    }
    if (!newPassword) {
      setPwdError('请输入新密码');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('新密码至少 8 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('两次输入的密码不一致');
      return;
    }

    setPwdSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) throw new Error('密码修改失败');
      setPwdSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: any) {
      setPwdError(err.message || '密码修改失败');
    } finally {
      setPwdSaving(false);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        <span className="ml-3 text-sm text-surface-600">加载中...</span>
      </div>
    );
  }

  // 错误状态
  if (error && !org) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            className="mt-3 text-xs font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
            onClick={fetchOrg}
          >
            <RefreshCw className="w-3 h-3" /> 重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">{t.layout.settings}</h1>
        <p className="text-sm text-surface-500 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* 标签切换 */}
      <div className="flex items-center gap-2">
        <button
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'org' ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          onClick={() => setActiveTab('org')}
        >
          <Building2 className="w-3.5 h-3.5" />
          {t.settings.orgSettings}
        </button>
        <button
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-3.5 h-3.5" />
          {t.settings.profileSettings}
        </button>
        <button
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'password' ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
          onClick={() => setActiveTab('password')}
        >
          <Lock className="w-3.5 h-3.5" />
          {t.settings.passwordSettings}
        </button>
      </div>

      {/* 组织设置 */}
      {activeTab === 'org' && org && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-surface-800">{t.settings.orgSettings}</h3>
            </div>
            <button
              className="btn-primary text-xs flex items-center gap-1.5"
              onClick={saveOrg}
              disabled={orgSaving}
            >
              {orgSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {t.common.loading}
                </>
              ) : orgSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {t.common.success}
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  {t.common.save}
                </>
              )}
            </button>
          </div>
          <div className="p-5 space-y-5">
            {/* 组织名称 */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.settings.orgName}</label>
              <input
                type="text"
                className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder={t.settings.orgName}
              />
            </div>

            {/* 余额阈值 */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.settings.balanceThreshold} (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-surface-400">$</span>
                <input
                  type="number"
                  className="w-full text-sm border border-surface-200 rounded-lg pl-7 pr-3 py-2 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  value={balanceThreshold}
                  onChange={e => setBalanceThreshold(Number(e.target.value))}
                  min={0}
                  step={10}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-surface-400 mt-1">
                当账户余额低于此值时，系统将自动发送告警通知
              </p>
            </div>

            {/* 只读信息 */}
            <div className="border-t border-surface-100 pt-5">
              <h4 className="text-xs font-medium text-surface-500 mb-3">组织详情（只读）</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">组织 ID</p>
                  <p className="text-sm font-medium text-surface-800 font-mono mt-0.5">{org.id}</p>
                </div>
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">创建时间</p>
                  <p className="text-sm font-medium text-surface-800 mt-0.5">
                    {new Date(org.created_at).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 个人信息 */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* 用户卡片 */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-surface-800">当前用户</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-700">
                  {currentUser?.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-base font-semibold text-surface-900">
                    {currentUser?.name || '未知用户'}
                  </p>
                  <p className="text-sm text-surface-500">{currentUser?.email || '-'}</p>
                  <span className={`badge text-[10px] mt-1 ${
                    currentUser?.role === 'org_admin' || currentUser?.role === 'platform_admin'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {currentUser?.role === 'org_admin'
                      ? '组织管理员'
                      : currentUser?.role === 'platform_admin'
                      ? '平台管理员'
                      : '成员'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">用户 ID</p>
                  <p className="text-sm font-medium text-surface-800 font-mono mt-0.5">
                    {currentUser?.id || '-'}
                  </p>
                </div>
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">邮箱</p>
                  <p className="text-sm font-medium text-surface-800 mt-0.5">
                    {currentUser?.email || '-'}
                  </p>
                </div>
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">角色</p>
                  <p className="text-sm font-medium text-surface-800 mt-0.5">
                    {currentUser?.role === 'org_admin'
                      ? '组织管理员'
                      : currentUser?.role === 'platform_admin'
                      ? '平台管理员'
                      : '成员'}
                  </p>
                </div>
                <div className="bg-surface-50 rounded-lg p-3">
                  <p className="text-[10px] text-surface-400 uppercase tracking-wider">组织 ID</p>
                  <p className="text-sm font-medium text-surface-800 font-mono mt-0.5">
                    {currentUser?.org_id || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改密码 */}
      {activeTab === 'password' && (
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-surface-800">修改密码</h3>
          </div>
          <div className="p-5 space-y-5 max-w-md">
            {/* 成功提示 */}
            {pwdSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">密码修改成功</span>
              </div>
            )}

            {/* 错误提示 */}
            {pwdError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{pwdError}</span>
              </div>
            )}

            {/* 当前密码 */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">当前密码</label>
              <div className="relative">
                <input
                  type={showOldPwd ? 'text' : 'password'}
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 pr-10 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  value={oldPassword}
                  onChange={e => {
                    setOldPassword(e.target.value);
                    setPwdError('');
                  }}
                  placeholder="输入当前密码"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-600"
                  onClick={() => setShowOldPwd(!showOldPwd)}
                >
                  {showOldPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 新密码 */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">新密码</label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 pr-10 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  value={newPassword}
                  onChange={e => {
                    setNewPassword(e.target.value);
                    setPwdError('');
                  }}
                  placeholder="输入新密码（至少 8 位）"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-600"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && newPassword.length < 8 && (
                <p className="text-xs text-amber-600 mt-1">密码长度不足 8 位</p>
              )}
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5">确认新密码</label>
              <div className="relative">
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  className={`w-full text-sm border rounded-lg px-3 py-2 pr-10 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-surface-200 focus:border-brand-500'
                  }`}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setPwdError('');
                  }}
                  placeholder="再次输入新密码"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-600"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                >
                  {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600 mt-1">两次输入的密码不一致</p>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="pt-2">
              <button
                className="btn-primary text-xs flex items-center gap-1.5"
                onClick={handleChangePassword}
                disabled={pwdSaving || !oldPassword || !newPassword || !confirmPassword}
              >
                {pwdSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    修改中...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    修改密码
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
