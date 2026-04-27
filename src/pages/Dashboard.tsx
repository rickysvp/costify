import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Activity,
  Zap, ArrowRight, Plus, Building2, AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';


import { API_BASE } from '../config';

// ==================== 类型定义 ====================

interface DashboardData {
  balance: number;
  balance_threshold: number;
  month_cost: number;
  last_month_cost: number;
  cost_change_pct: number | string;
  month_savings: number;
  month_budget: number;
  month_budget_used_pct: number;
  month_tokens: number;
  request_count: number;
  cache_hit_rate: number | string;
  project_count: number;
  member_count: number;
  active_keys: number;
  unread_alerts: number;
  top_projects: TopProject[];
  top_api_keys: TopApiKey[];
  top_users: TopUser[];
  daily_spend: DailySpend[];
  daily_savings: DailySavings[];
  model_distribution: ModelDistribution[];
}

interface DailySavings {
  date: string;
  savings: number;
  routing_savings: number;
  cache_savings: number;
}

interface TopProject {
  id: number;
  name: string;
  spend: number;
  budget: number;
  tokens: number;
}

interface TopApiKey {
  id: number;
  name: string;
  key_preview: string;
  spend: number;
  tokens: number;
  requests: number;
}

interface TopUser {
  id: number;
  name: string;
  email: string;
  spend: number;
  tokens: number;
  requests: number;
}

interface DailySpend {
  date: string;
  cost: number;
  savings: number;
}

interface ModelDistribution {
  model: string;
  cost: number;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    payload?: {
      count?: number;
    };
  }>;
  label?: string;
}

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

const MODEL_DISPLAY: Record<string, string> = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'claude-3-opus': 'Claude 3 Opus',
  'claude-3-sonnet': 'Claude 3 Sonnet',
  'claude-3-haiku': 'Claude 3 Haiku',
};

// ==================== 组件 ====================

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        // Token 过期或无效，清除登录状态并跳转到登录页
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('costio_token');
          localStorage.removeItem('costio_user');
          navigate('/login');
          return;
        }
        throw new Error(errData.error || '获取数据失败');
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 格式化金额
  const fmt = (n: number | undefined | null) => {
    if (n === undefined || n === null) return '$0.00';
    return `$${n.toFixed(2)}`;
  };
  const fmtNum = (n: number | undefined | null) => {
    if (n === undefined || n === null) return '0';
    return n.toLocaleString();
  };

  // 环比变化
  const changePct = typeof data?.cost_change_pct === 'string'
    ? parseFloat(data.cost_change_pct)
    : data?.cost_change_pct ?? 0;
  const isUp = changePct >= 0;

  // 缓存命中率
  const cacheRate = typeof data?.cache_hit_rate === 'string'
    ? parseFloat(data.cache_hit_rate)
    : data?.cache_hit_rate ?? 0;

  // 模型分布饼图数据
  const pieData = (data?.model_distribution ?? []).map((m) => ({
    name: MODEL_DISPLAY[m.model] || m.model,
    value: parseFloat(String(m.cost)),
    count: parseInt(String(m.count)),
  }));

  // 自定义 Tooltip
  const SpendTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    const costItem = payload.find(p => p.name === t.dashboard.spend);
    const savingsItem = payload.find(p => p.name === t.dashboard.savings);
    return (
      <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-surface-800 mb-1">{label}</p>
        {costItem && <p className="text-blue-600">{t.dashboard.spend}: ${costItem.value?.toFixed(2)}</p>}
        {savingsItem && <p className="text-emerald-600">{t.dashboard.savings}: ${savingsItem.value?.toFixed(2)}</p>}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div className="bg-white border border-surface-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-surface-800">{item.name}</p>
        <p className="text-blue-600">{t.dashboard.spend}: ${item.value?.toFixed(2)}</p>
        <p className="text-surface-500">{t.dashboard.requests}: {item.payload?.count?.toLocaleString()}</p>
      </div>
    );
  };

  // ==================== 加载状态 ====================
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-24 skeleton mb-2" />
            <div className="h-4 w-40 skeleton" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-3 w-16 skeleton mb-2" />
              <div className="h-7 w-20 skeleton mb-1" />
              <div className="h-3 w-24 skeleton" />
            </div>
          ))}
        </div>
        <div className="card mb-6">
          <div className="card-header"><div className="h-4 w-32 skeleton" /></div>
          <div className="p-4 h-64 skeleton" />
        </div>
      </div>
    );
  }

  // ==================== 错误状态 ====================
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{t.dashboard.title}</h1>
            <p className="text-sm text-surface-500">{t.dashboard.subtitle}</p>
          </div>
        </div>
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-surface-800 mb-2">{t.dashboard.loadFailed}</h3>
          <p className="text-sm text-surface-500 mb-4">{error}</p>
          <button
            className="btn-primary inline-flex items-center gap-2"
            onClick={fetchDashboard}
          >
            <RefreshCw className="w-4 h-4" />
            {t.dashboard.reload}
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{t.dashboard.title}</h1>
            <p className="text-sm text-surface-500">{t.dashboard.subtitle}</p>
          </div>
        </div>
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-surface-400" />
          </div>
          <h3 className="text-lg font-medium text-surface-800 mb-2">{t.dashboard.loadFailed}</h3>
          <p className="text-sm text-surface-500 mb-4">{t.dashboard.noData}</p>
          <button
            className="btn-primary inline-flex items-center gap-2"
            onClick={fetchDashboard}
          >
            <RefreshCw className="w-4 h-4" />
            {t.dashboard.reload}
          </button>
        </div>
      </div>
    );
  }

  // ==================== 空状态 Onboarding ====================
  if (data.project_count === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{t.dashboard.title}</h1>
            <p className="text-sm text-surface-500">{t.dashboard.subtitle}</p>
          </div>
        </div>
        <div className="card p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">{t.dashboard.welcomeTitle}</h2>
          <p className="text-sm text-surface-500 mb-6">
            {t.dashboard.welcomeDesc}
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-lg">
              <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="text-sm font-medium text-surface-800">{t.dashboard.step1Title}</h4>
                <p className="text-xs text-surface-500 mt-0.5">{t.dashboard.step1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-lg">
              <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="text-sm font-medium text-surface-800">{t.dashboard.step2Title}</h4>
                <p className="text-xs text-surface-500 mt-0.5">{t.dashboard.step2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-lg">
              <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="text-sm font-medium text-surface-800">{t.dashboard.step3Title}</h4>
                <p className="text-xs text-surface-500 mt-0.5">{t.dashboard.step3Desc}</p>
              </div>
            </div>
          </div>
          <button
            className="btn-primary mt-6 inline-flex items-center gap-2"
            onClick={() => navigate('/projects')}
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.createFirstProject}
          </button>
        </div>
      </div>
    );
  }

  // ==================== 正常内容 ====================
  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{t.dashboard.title}</h1>
          <p className="text-sm text-surface-500">{t.dashboard.subtitle}</p>
        </div>
        <button
          className="btn-ghost inline-flex items-center gap-1.5"
          onClick={fetchDashboard}
          title={t.dashboard.refreshData}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">{t.dashboard.refresh}</span>
        </button>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* 余额 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.balance}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmt(data.balance)}</p>
          <p className="text-[11px] text-surface-400 mt-1">
            {t.dashboard.balanceThreshold} {fmt(data.balance_threshold)}
          </p>
        </div>

        {/* 本月预算 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.monthBudget}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmt(data.month_budget)}</p>
          <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                data.month_budget_used_pct > 90 ? 'bg-red-500' :
                data.month_budget_used_pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(data.month_budget_used_pct, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-surface-400 mt-1">
            {t.dashboard.budgetUsed} {((data.month_budget_used_pct ?? 0)).toFixed(1)}%
          </p>
        </div>

        {/* 本月花费 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.monthCost}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmt(data.month_cost)}</p>
          <div className="flex items-center gap-1 mt-1">
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-500" />
            )}
            <span className={`text-[11px] font-medium ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
              {t.dashboard.lastMonth} {isUp ? '+' : ''}{changePct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 本月节省 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.monthSavings}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmt(data.month_savings)}</p>
          <p className="text-[11px] text-surface-400 mt-1">{t.dashboard.savingsDesc}</p>
        </div>

        {/* 请求数 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.requestCount}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmtNum(data.request_count)}</p>
          <p className="text-[11px] text-surface-400 mt-1">
            {fmtNum(data.month_tokens)} {t.dashboard.tokens}
          </p>
        </div>

        {/* 缓存命中率 */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-surface-500">{t.dashboard.cacheHitRate}</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{cacheRate.toFixed(1)}%</p>
          <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(cacheRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* 30 天花费与节省趋势 */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">{t.dashboard.costTrend}</h3>
            <span className="text-xs text-surface-400">
              {t.dashboard.thisMonthTotal} {fmt(data.month_cost)}
            </span>
          </div>
          <div className="p-4">
            <div className="h-64">
              {(data.daily_spend ?? []).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily_spend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.split('-').slice(1).join('/')}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} />
                    <Tooltip content={<SpendTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      name={t.dashboard.spend}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      name={t.dashboard.savings}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-surface-400">
                  {t.dashboard.noSpendData}
                </div>
              )}
            </div>
            {/* 图例 */}
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[11px] text-surface-600">{t.dashboard.spend}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-surface-600">{t.dashboard.savings}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 模型分布饼图 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-surface-800">{t.dashboard.modelDistribution}</h3>
          </div>
          <div className="p-4">
            <div className="h-52">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-surface-400">
                  {t.dashboard.noModelData}
                </div>
              )}
            </div>
            {/* 图例 */}
            {pieData.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-[11px] text-surface-600">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 10 排行榜区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 10 项目花费 */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">{t.dashboard.topProjects}</h3>
            <button
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              onClick={() => navigate('/projects')}
            >
              {t.dashboard.viewAll} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {(data.top_projects ?? []).length > 0 ? (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-surface-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.rank}</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.project}</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">{t.dashboard.spend}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_projects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <td className="px-3 py-2">
                        <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                          index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-surface-800 truncate max-w-[120px]">{project.name}</td>
                      <td className="px-3 py-2 text-sm text-surface-800 text-right">{fmt(project.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-surface-400">
              {t.dashboard.noProjectData}
            </div>
          )}
        </div>

        {/* Top 10 API Key */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">{t.dashboard.topApiKeys}</h3>
            <button
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              onClick={() => navigate('/api-keys')}
            >
              {t.dashboard.viewAll} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {data.top_api_keys?.length > 0 ? (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-surface-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.rank}</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.apiKey}</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">{t.dashboard.spend}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_api_keys.map((key, index) => (
                    <tr
                      key={key.id}
                      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/api-keys/${key.id}`)}
                    >
                      <td className="px-3 py-2">
                        <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                          index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-surface-800 truncate max-w-[100px]">{key.name}</p>
                          <p className="text-[10px] text-surface-400 font-mono">{key.key_preview}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-surface-800 text-right">{fmt(key.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-surface-400">
              {t.dashboard.noApiKeyData}
            </div>
          )}
        </div>

        {/* Top 10 人员 */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">{t.dashboard.topUsers}</h3>
            <button
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              onClick={() => navigate('/members')}
            >
              {t.dashboard.viewAll} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {data.top_users?.length > 0 ? (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-surface-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.rank}</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">{t.dashboard.member}</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">{t.dashboard.spend}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <td className="px-3 py-2">
                        <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                          index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                            {user.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-800">{user.name}</p>
                            <p className="text-[10px] text-surface-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-surface-800 text-right">{fmt(user.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-surface-400">
              {t.dashboard.noUserData}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

