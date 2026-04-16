import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Shield,
  DollarSign,
  Activity,
  CheckCheck,
  Check,
  Filter,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001/api';

// ---------- 类型定义 ----------
interface Alert {
  id: number;
  type: 'balance' | 'budget' | 'usage' | 'security';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  project?: string;
  created_at: string;
  read: boolean;
}

// ---------- 辅助函数 ----------
function getToken(): string | null {
  return localStorage.getItem('costio_token');
}

function formatTime(iso: string, t: any): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return t.alerts?.justNow || '刚刚';
  if (diffMin < 60) return t.alerts?.minutesAgo?.replace('{count}', diffMin.toString()) || `${diffMin} 分钟前`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return t.alerts?.hoursAgo?.replace('{count}', diffH.toString()) || `${diffH} 小时前`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return t.alerts?.daysAgo?.replace('{count}', diffD.toString()) || `${diffD} 天前`;
  return d.toLocaleDateString('zh-CN');
}

// ---------- 组件 ----------
export default function Alerts() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | Alert['type']>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | Alert['severity']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [markingId, setMarkingId] = useState<number | null>(null);

  // 获取告警列表
  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`请求失败: ${res.status}`);
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || '获取告警失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // 标记单个已读
  const markRead = async (id: number) => {
    setMarkingId(id);
    try {
      const token = getToken();
      await fetch(`${API_BASE}/alerts/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
    } catch {
      // ignore
    } finally {
      setMarkingId(null);
    }
  };

  // 筛选
  const filtered = alerts.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.message.toLowerCase().includes(q) ||
        (a.project && a.project.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  // 获取类型图标
  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'balance': return DollarSign;
      case 'budget': return AlertTriangle;
      case 'usage': return Activity;
      case 'security': return Shield;
      default: return Bell;
    }
  };

  // 获取类型标签
  const getTypeLabel = (type: Alert['type']) => {
    const labels: Record<string, string> = {
      balance: t.alerts?.typeBalance || '余额',
      budget: t.alerts?.typeBudget || '预算',
      usage: t.alerts?.typeUsage || '用量',
      security: t.alerts?.typeSecurity || '安全',
    };
    return labels[type] || type;
  };

  // 获取严重程度样式
  const getSeverityStyle = (severity: Alert['severity']) => {
    switch (severity) {
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  // 获取严重程度边框
  const getSeverityBorder = (severity: Alert['severity']) => {
    switch (severity) {
      case 'info': return 'border-l-blue-500';
      case 'warning': return 'border-l-amber-500';
      case 'critical': return 'border-l-red-500';
      default: return 'border-l-surface-300';
    }
  };

  // 获取严重程度标签
  const getSeverityLabel = (severity: Alert['severity']) => {
    const labels: Record<string, string> = {
      info: t.alerts?.severityInfo || '信息',
      warning: t.alerts?.severityWarning || '警告',
      critical: t.alerts?.severityCritical || '严重',
    };
    return labels[severity] || severity;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.alerts?.title || '消息通知'}</h1>
          <p className="text-sm text-surface-500 mt-1">
            {(t.alerts?.totalAlerts?.replace('{count}', alerts.length.toString()) || `共 ${alerts.length} 条告警`)}
            ，
            {(t.alerts?.unreadAlerts?.replace('{count}', unreadCount.toString()) || `${unreadCount} 条未读`)}
          </p>
        </div>
        <button
          className="btn-secondary text-xs flex items-center gap-1.5"
          onClick={fetchAlerts}
          disabled={isLoading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {t.dashboard?.refresh || '刷新'}
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Filter className="w-3.5 h-3.5" />
            <span>{t.alerts?.filter || '筛选'}</span>
          </div>

          {/* 类型筛选 */}
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
              }`}
              onClick={() => setTypeFilter('all')}
            >
              {t.alerts?.allTypes || '全部类型'}
            </button>
            {(['balance', 'budget', 'usage', 'security'] as const).map(type => {
              const Icon = getTypeIcon(type);
              return (
                <button
                  key={type}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    typeFilter === type ? 'bg-brand-100 text-brand-700' : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
                  }`}
                  onClick={() => setTypeFilter(type)}
                >
                  <Icon className="w-3 h-3" />
                  {getTypeLabel(type)}
                </button>
              );
            })}
          </div>

          <div className="w-px h-5 bg-surface-200" />

          {/* 严重程度筛选 */}
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                severityFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
              }`}
              onClick={() => setSeverityFilter('all')}
            >
              {t.alerts?.allSeverities || '全部级别'}
            </button>
            {(['info', 'warning', 'critical'] as const).map(s => (
              <button
                key={s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  severityFilter === s ? getSeverityStyle(s) : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
                }`}
                onClick={() => setSeverityFilter(s)}
              >
                <span className={`w-2 h-2 rounded-full ${
                  s === 'info' ? 'bg-blue-500' : s === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                {getSeverityLabel(s)}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-surface-200" />

          {/* 搜索 */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="text"
              placeholder={t.alerts?.searchPlaceholder || '搜索告警消息或项目...'}
              className="w-full text-xs border border-surface-200 rounded-lg pl-8 pr-8 py-1.5 bg-white text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-2 top-2" onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5 text-surface-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
          <span className="ml-3 text-sm text-surface-600">{t.common?.loading || '加载中...'}</span>
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-base font-medium text-surface-800">{t.alerts?.noAlerts || '暂无告警，一切正常'}</p>
          <p className="text-sm text-surface-400 mt-1">
            {alerts.length > 0 
              ? (t.alerts?.noAlertsFiltered || '当前筛选条件下没有匹配的告警')
              : (t.alerts?.systemNormal || '系统运行良好，没有需要关注的告警')
            }
          </p>
        </div>
      )}

      {/* 告警列表 */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(alert => {
            const TypeIcon = getTypeIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`card border-l-4 ${getSeverityBorder(alert.severity)} ${
                  alert.read ? 'opacity-70' : ''
                }`}
              >
                <div className="px-5 py-4 flex items-start gap-4">
                  {/* 类型图标 */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStyle(alert.severity)}`}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-[10px] ${getSeverityStyle(alert.severity)}`}>
                        {getSeverityLabel(alert.severity)}
                      </span>
                      <span className="badge-gray text-[10px]">
                        {getTypeLabel(alert.type)}
                      </span>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-surface-800 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                      {alert.project && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                          {alert.project}
                        </span>
                      )}
                      <span>{formatTime(alert.created_at, t)}</span>
                    </div>
                  </div>

                  {/* 操作 */}
                  {!alert.read && (
                    <button
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-surface-50 transition-colors"
                      onClick={() => markRead(alert.id)}
                      disabled={markingId === alert.id}
                      title={t.alerts?.markAsRead || '标记已读'}
                    >
                      {markingId === alert.id ? (
                        <div className="w-4 h-4 border-2 border-surface-300 border-t-brand-600 rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-surface-400 hover:text-brand-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部统计 */}
      {!isLoading && !error && alerts.length > 0 && (
        <div className="flex items-center justify-between text-xs text-surface-400">
          <span>
            {t.alerts?.showingAlerts
              ?.replace('{filtered}', filtered.length.toString())
              ?.replace('{total}', alerts.length.toString()) 
              || `显示 ${filtered.length} 条，共 ${alerts.length} 条告警`
            }
          </span>
          <span>
            {alerts.filter(a => a.severity === 'critical').length} {t.alerts?.statsCritical || '严重'} /{' '}
            {alerts.filter(a => a.severity === 'warning').length} {t.alerts?.statsWarning || '警告'} /{' '}
            {alerts.filter(a => a.severity === 'info').length} {t.alerts?.statsInfo || '信息'}
          </span>
        </div>
      )}
    </div>
  );
}
