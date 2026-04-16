import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  ShieldAlert,
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

// ---------- 映射表 ----------
const typeIcons: Record<Alert['type'], typeof Bell> = {
  balance: DollarSign,
  budget: AlertTriangle,
  usage: Activity,
  security: ShieldAlert,
};

const typeLabels: Record<Alert['type'], string> = {
  balance: '余额',
  budget: '预算',
  usage: '用量',
  security: '安全',
};

const severityColors: Record<Alert['severity'], string> = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

const severityDotColors: Record<Alert['severity'], string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
};

const severityLabels: Record<Alert['severity'], string> = {
  info: '信息',
  warning: '警告',
  critical: '严重',
};

const severityBorderColors: Record<Alert['severity'], string> = {
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
  critical: 'border-l-red-500',
};

// ---------- 辅助函数 ----------
function getToken(): string | null {
  return localStorage.getItem('costio_token');
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin} 分钟前`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} 小时前`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} 天前`;
  return d.toLocaleDateString('zh-CN');
}

// ---------- 组件 ----------
export default function Alerts() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<Alert['type'] | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<Alert['severity'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

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
      setAlerts(Array.isArray(data) ? data : data.alerts ?? []);
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
      const res = await fetch(`${API_BASE}/alerts/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('标记失败');
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
    } catch {
      // 乐观更新回滚不做了，简单提示
    } finally {
      setMarkingId(null);
    }
  };

  // 全部标记已读
  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/alerts/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('标记失败');
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
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

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">消息通知</h1>
          <p className="text-sm text-surface-500 mt-1">
            共 {alerts.length} 条告警，{unreadCount} 条未读
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary text-xs flex items-center gap-1.5"
            onClick={fetchAlerts}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <button
            className="btn-primary text-xs flex items-center gap-1.5"
            onClick={markAllRead}
            disabled={markingAll || unreadCount === 0}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {markingAll ? '标记中...' : '全部已读'}
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Filter className="w-3.5 h-3.5" />
            <span>筛选</span>
          </div>

          {/* 类型筛选 */}
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
              }`}
              onClick={() => setTypeFilter('all')}
            >
              全部类型
            </button>
            {(['balance', 'budget', 'usage', 'security'] as const).map(type => {
              const Icon = typeIcons[type];
              return (
                <button
                  key={type}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    typeFilter === type ? 'bg-brand-100 text-brand-700' : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
                  }`}
                  onClick={() => setTypeFilter(type)}
                >
                  <Icon className="w-3 h-3" />
                  {typeLabels[type]}
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
              全部级别
            </button>
            {(['info', 'warning', 'critical'] as const).map(s => (
              <button
                key={s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  severityFilter === s ? severityColors[s] : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
                }`}
                onClick={() => setSeverityFilter(s)}
              >
                <span className={`w-2 h-2 rounded-full ${severityDotColors[s]}`} />
                {severityLabels[s]}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-surface-200" />

          {/* 搜索 */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="text"
              placeholder="搜索告警消息或项目..."
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
          <span className="ml-3 text-sm text-surface-600">加载中...</span>
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-base font-medium text-surface-800">暂无告警，一切正常</p>
          <p className="text-sm text-surface-400 mt-1">
            {alerts.length > 0 ? '当前筛选条件下没有匹配的告警' : '系统运行良好，没有需要关注的告警'}
          </p>
        </div>
      )}

      {/* 告警列表 */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(alert => {
            const TypeIcon = typeIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={`card border-l-4 ${severityBorderColors[alert.severity]} ${
                  alert.read ? 'opacity-70' : ''
                }`}
              >
                <div className="px-5 py-4 flex items-start gap-4">
                  {/* 类型图标 */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${severityColors[alert.severity]}`}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`badge text-[10px] ${severityColors[alert.severity]}`}
                      >
                        {severityLabels[alert.severity]}
                      </span>
                      <span className="badge-gray text-[10px]">
                        {typeLabels[alert.type]}
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
                      <span>{formatTime(alert.created_at)}</span>
                    </div>
                  </div>

                  {/* 操作 */}
                  {!alert.read && (
                    <button
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-surface-50 transition-colors"
                      onClick={() => markRead(alert.id)}
                      disabled={markingId === alert.id}
                      title="标记已读"
                    >
                      {markingId === alert.id ? (
                        <div className="loading-spinner w-4 h-4" />
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
            显示 {filtered.length} 条，共 {alerts.length} 条告警
          </span>
          <span>
            {alerts.filter(a => a.severity === 'critical').length} 严重 /{' '}
            {alerts.filter(a => a.severity === 'warning').length} 警告 /{' '}
            {alerts.filter(a => a.severity === 'info').length} 信息
          </span>
        </div>
      )}
    </div>
  );
}
