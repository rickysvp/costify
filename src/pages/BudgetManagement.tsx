import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  DollarSign,
  Percent,
  Bell,
  Settings,
  ArrowRight,
  Edit3,
  RefreshCw,
  PieChart as PieChartIcon,
  Target,
  Shield,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const API_BASE = 'http://localhost:3001/api';

interface BudgetData {
  org_budget: OrgBudget;
  project_budgets: ProjectBudget[];
  budget_history: BudgetHistory[];
  budget_alerts: BudgetAlert[];
  savings_stats: SavingsStats;
}

interface OrgBudget {
  monthly_budget: number;
  used_amount: number;
  remaining: number;
  used_percentage: number;
  alert_threshold: number;
  alert_enabled: boolean;
}

interface ProjectBudget {
  id: number;
  name: string;
  monthly_budget: number;
  used_amount: number;
  remaining: number;
  used_percentage: number;
  alert_threshold: number;
  status: 'normal' | 'warning' | 'exceeded';
}

interface BudgetHistory {
  month: string;
  budget: number;
  actual: number;
  savings: number;
}

interface BudgetAlert {
  id: number;
  type: 'budget_threshold' | 'budget_exceeded' | 'project_threshold';
  message: string;
  project_name?: string;
  threshold: number;
  actual: number;
  created_at: string;
  status: 'unread' | 'read';
}

interface SavingsStats {
  total_savings: number;
  routing_savings: number;
  cache_savings: number;
  model_downgrade_savings: number;
  savings_rate: number;
}

export default function BudgetManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'alerts' | 'settings'>('overview');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '获取数据失败');
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-100 text-emerald-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'exceeded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-surface-100 text-surface-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '警告';
      case 'exceeded':
        return '超支';
      default:
        return '未知';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-40 skeleton mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-4 w-20 skeleton mb-2" />
              <div className="h-8 w-24 skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !data.org_budget) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-surface-900 mb-6">预算管理</h1>
        <div className="card p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || '加载失败'}</p>
          <button onClick={fetchData} className="btn-primary mt-4">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">预算管理</h1>
          <p className="text-sm text-surface-500 mt-1">监控和管理您的 AI 成本预算</p>
        </div>
        <button onClick={fetchData} className="btn-ghost inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-surface-200">
        {[
          { id: 'overview', label: '总览', icon: PieChartIcon },
          { id: 'projects', label: '项目预算', icon: Building2 },
          { id: 'alerts', label: '预算告警', icon: Bell },
          { id: 'settings', label: '预算设置', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 总览标签 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 企业预算概览 */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-800">企业月度预算</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.org_budget.used_percentage > 90
                    ? 'bg-red-100 text-red-700'
                    : data.org_budget.used_percentage > 70
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {data.org_budget.used_percentage > 100 ? '已超支' : '正常'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-surface-500 mb-1">月度预算</p>
                <p className="text-2xl font-bold text-surface-900">{fmt(data.org_budget.monthly_budget)}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">已使用</p>
                <p className="text-2xl font-bold text-surface-900">{fmt(data.org_budget.used_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">剩余</p>
                <p className="text-2xl font-bold text-surface-900">{fmt(data.org_budget.remaining)}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">使用率</p>
                <p className="text-2xl font-bold text-surface-900">{fmtPct(data.org_budget.used_percentage)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    data.org_budget.used_percentage > 90
                      ? 'bg-red-500'
                      : data.org_budget.used_percentage > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(data.org_budget.used_percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-surface-400 mt-2">
                告警阈值: {data.org_budget.alert_threshold}% | 
                告警状态: {data.org_budget.alert_enabled ? '已启用' : '已禁用'}
              </p>
            </div>
          </div>

          {/* 节省统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-surface-500">总节省</span>
              </div>
              <p className="text-xl font-bold text-surface-900">{fmt(data.savings_stats.total_savings)}</p>
              <p className="text-[11px] text-surface-400 mt-1">节省率 {fmtPct(data.savings_stats.savings_rate)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-medium text-surface-500">路由节省</span>
              </div>
              <p className="text-xl font-bold text-surface-900">{fmt(data.savings_stats.routing_savings)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-medium text-surface-500">缓存节省</span>
              </div>
              <p className="text-xl font-bold text-surface-900">{fmt(data.savings_stats.cache_savings)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-surface-500">降级节省</span>
              </div>
              <p className="text-xl font-bold text-surface-900">{fmt(data.savings_stats.model_downgrade_savings)}</p>
            </div>
          </div>

          {/* 预算历史趋势 */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-surface-800">预算执行历史</h3>
            </div>
            <div className="p-4">
              <div className="h-64">
                {data.budget_history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.budget_history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}
                        formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
                      />
                      <Bar dataKey="budget" fill="#3b82f6" name="预算" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="#ef4444" name="实际" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="savings" fill="#10b981" name="节省" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-surface-400">
                    暂无历史数据
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 项目预算标签 */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">项目预算列表</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              管理项目 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {data.project_budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.project_budgets.map((project) => (
                <div key={project.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-surface-800">{project.name}</h4>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        // TODO: 实现编辑预算功能
                      }}
                      className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-surface-400">预算</p>
                      <p className="text-sm font-semibold text-surface-800">{fmt(project.monthly_budget)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-400">已用</p>
                      <p className="text-sm font-semibold text-surface-800">{fmt(project.used_amount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-400">剩余</p>
                      <p className="text-sm font-semibold text-surface-800">{fmt(project.remaining)}</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        project.used_percentage > 90
                          ? 'bg-red-500'
                          : project.used_percentage > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(project.used_percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-surface-400 mt-1">
                    使用率 {fmtPct(project.used_percentage)} | 告警阈值 {project.alert_threshold}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Building2 className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <p className="text-sm text-surface-500">暂无项目预算数据</p>
            </div>
          )}
        </div>
      )}

      {/* 预算告警标签 */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">预算告警记录</h3>
            <span className="text-xs text-surface-400">
              {data.budget_alerts.filter((a) => a.status === 'unread').length} 条未读
            </span>
          </div>
          {data.budget_alerts.length > 0 ? (
            <div className="space-y-2">
              {data.budget_alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`card p-4 flex items-start gap-3 ${
                    alert.status === 'unread' ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'budget_exceeded'
                        ? 'bg-red-100'
                        : alert.type === 'budget_threshold'
                        ? 'bg-amber-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.type === 'budget_exceeded'
                          ? 'text-red-600'
                          : alert.type === 'budget_threshold'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-surface-800">{alert.message}</p>
                      {alert.status === 'unread' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </div>
                    {alert.project_name && (
                      <p className="text-xs text-surface-500 mt-0.5">项目: {alert.project_name}</p>
                    )}
                    <p className="text-xs text-surface-400 mt-1">
                      阈值: {alert.threshold}% | 实际: {alert.actual}% |{' '}
                      {new Date(alert.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-sm text-surface-500">暂无预算告警</p>
            </div>
          )}
        </div>
      )}

      {/* 预算设置标签 */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-800 mb-4">企业预算设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">月度预算金额</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-surface-400" />
                  <input
                    type="number"
                    defaultValue={data.org_budget.monthly_budget}
                    className="flex-1 px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    placeholder="输入月度预算"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">告警阈值 (%)</label>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-surface-400" />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={data.org_budget.alert_threshold}
                    className="flex-1 px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    placeholder="输入告警阈值"
                  />
                </div>
                <p className="text-[11px] text-surface-400 mt-1">当预算使用率达到此阈值时发送告警</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alertEnabled"
                  defaultChecked={data.org_budget.alert_enabled}
                  className="w-4 h-4 text-brand-600 border-surface-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="alertEnabled" className="text-sm text-surface-700">
                  启用预算告警
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn-secondary">取消</button>
              <button className="btn-primary">保存设置</button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-800 mb-4">预算管理措施</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-surface-800">自动路由优化</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    系统自动选择性价比最高的模型，降低 20-40% 成本
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                <Target className="w-5 h-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-surface-800">智能缓存机制</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    缓存相似请求，避免重复计算，降低 10-30% 成本
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                <Bell className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-surface-800">多级告警机制</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    70% 警告、90% 严重警告、100% 超支告警，及时提醒
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
