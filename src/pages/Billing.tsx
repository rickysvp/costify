import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  Plus,
  X,
  CheckCircle,
  RefreshCw,
  Wallet,
  History,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3001/api';

// ---------- 类型定义 ----------
interface BalanceInfo {
  balance: number;
  threshold: number;
  currency: string;
}

interface RechargeRecord {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  status: 'success' | 'pending' | 'failed';
  transaction_id: string;
  note: string;
}

// ---------- 工具函数 ----------
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('costio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(v: number): string {
  return `$${v.toFixed(2)}`;
}

const PAYMENT_METHODS = [
  { key: 'credit_card', label: '信用卡/借记卡', icon: CreditCard },
  { key: 'alipay', label: '支付宝', icon: null, badge: '支付宝' },
  { key: 'wechat', label: '微信支付', icon: null, badge: '微信' },
];

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  success: { label: '成功', className: 'bg-emerald-100 text-emerald-700' },
  pending: { label: '处理中', className: 'bg-amber-100 text-amber-700' },
  failed: { label: '失败', className: 'bg-red-100 text-red-700' },
};

// ---------- 组件 ----------
export default function Billing() {
  const { isAdmin } = useAuth();

  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 充值弹窗
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeMethod, setRechargeMethod] = useState('credit_card');
  const [rechargeNote, setRechargeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ---------- 数据获取 ----------
  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/org/balance`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBalanceInfo({
        balance: data.balance ?? 0,
        threshold: data.threshold ?? 0,
        currency: data.currency ?? 'USD',
      });
    } catch (err) {
      console.error('获取余额失败:', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/recharge/history`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRechargeHistory(Array.isArray(data) ? data : data.items ?? []);
    } catch (err) {
      console.error('获取充值记录失败:', err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (err) {
      setError('加载数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance, fetchHistory]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ---------- 充值提交 ----------
  const handleRechargeSubmit = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      setSubmitError('请输入有效的充值金额');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/recharge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          amount,
          payment_method: rechargeMethod,
          note: rechargeNote,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      // 刷新数据
      await loadAll();

      // 关闭弹窗并重置
      setShowRechargeModal(false);
      setRechargeAmount('');
      setRechargeNote('');
      setRechargeMethod('credit_card');
    } catch (err: any) {
      setSubmitError(err.message || '充值失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 余额不足判断
  const isLowBalance =
    balanceInfo &&
    balanceInfo.threshold > 0 &&
    balanceInfo.balance <= balanceInfo.threshold;

  // ---------- 渲染 ----------
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">充值管理</h1>
          <p className="text-sm text-surface-500 mt-1">管理账户余额与充值记录</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-xs flex items-center gap-1.5" onClick={loadAll}>
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          {isAdmin && (
            <button
              className="btn-primary text-xs flex items-center gap-1.5"
              onClick={() => setShowRechargeModal(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              充值
            </button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          <span className="ml-3 text-sm text-surface-600">加载中...</span>
        </div>
      ) : (
        <>
          {/* 余额卡片 */}
          <div className="card bg-gradient-to-br from-brand-50 to-blue-50 border-brand-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-semibold text-surface-800">当前余额</span>
                </div>
                <p className="text-4xl font-bold text-surface-900">
                  {formatCurrency(balanceInfo?.balance ?? 0)}
                </p>
                {balanceInfo && balanceInfo.threshold > 0 && (
                  <p className="text-xs text-surface-500 mt-2">
                    低余额阈值: {formatCurrency(balanceInfo.threshold)}
                  </p>
                )}
              </div>

              {/* 余额不足警告 */}
              {isLowBalance && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">余额不足</p>
                    <p className="text-xs text-amber-600">
                      当前余额已低于阈值 {formatCurrency(balanceInfo.threshold)}，请及时充值
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 充值历史表格 */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-surface-800">充值历史</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">
                      时间
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">
                      金额
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">
                      支付方式
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-surface-500">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">
                      交易号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">
                      备注
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <History className="w-12 h-12 text-surface-300 mb-3" />
                          <p className="text-sm text-surface-500">暂无充值记录</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rechargeHistory.map((record) => {
                      const statusInfo = STATUS_MAP[record.status] ?? STATUS_MAP.failed;
                      return (
                        <tr key={record.id} className="border-b border-surface-100">
                          <td className="px-4 py-3 text-sm text-surface-600 whitespace-nowrap">
                            {new Date(record.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-surface-800 text-right">
                            {formatCurrency(record.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-700">
                            {record.payment_method === 'credit_card'
                              ? '信用卡/借记卡'
                              : record.payment_method === 'alipay'
                                ? '支付宝'
                                : record.payment_method === 'wechat'
                                  ? '微信支付'
                                  : record.payment_method}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`badge text-[10px] ${statusInfo.className}`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-500 font-mono">
                            {record.transaction_id || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-600">
                            {record.note || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 充值弹窗 */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => {
              if (!isSubmitting) setShowRechargeModal(false);
            }}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
            {/* 头部 */}
            <div className="p-6 border-b border-surface-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-900">账户充值</h3>
                <button
                  onClick={() => {
                    if (!isSubmitting) setShowRechargeModal(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-surface-100"
                >
                  <X className="w-4 h-4 text-surface-500" />
                </button>
              </div>
              <p className="text-xs text-surface-500 mt-1">为组织账户充值余额</p>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-5">
              {/* 金额输入 */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">
                  充值金额
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-surface-200 rounded-lg text-sm bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    placeholder="输入充值金额"
                    min="1"
                    step="1"
                  />
                </div>
                {/* 快捷金额 */}
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map((v) => (
                    <button
                      key={v}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        rechargeAmount === String(v)
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-surface-200 text-surface-600 hover:border-brand-400'
                      }`}
                      onClick={() => setRechargeAmount(String(v))}
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              {/* 支付方式选择 */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">
                  支付方式
                </label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.key}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          rechargeMethod === method.key
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-surface-200 hover:border-brand-400'
                        }`}
                        onClick={() => setRechargeMethod(method.key)}
                      >
                        {Icon ? (
                          <Icon className="w-5 h-5 text-surface-600" />
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span
                              className={`text-xs font-bold ${method.key === 'alipay' ? 'text-blue-600' : 'text-green-600'}`}
                            >
                              {method.badge?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-surface-800 flex-1">
                          {method.label}
                        </span>
                        {rechargeMethod === method.key && (
                          <CheckCircle className="w-5 h-5 text-brand-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">
                  备注（可选）
                </label>
                <input
                  type="text"
                  value={rechargeNote}
                  onChange={(e) => setRechargeNote(e.target.value)}
                  className="w-full px-3 py-2.5 border border-surface-200 rounded-lg text-sm bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  placeholder="输入备注信息"
                />
              </div>

              {/* 提交错误 */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
                  <span className="text-xs font-medium">{submitError}</span>
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="p-6 border-t border-surface-100 flex items-center gap-3">
              <button
                className="btn-secondary text-xs flex-1"
                onClick={() => setShowRechargeModal(false)}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                className="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5"
                onClick={handleRechargeSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    处理中...
                  </>
                ) : (
                  <>
                    确认充值
                    <DollarSign className="w-3.5 h-3.5" />
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
