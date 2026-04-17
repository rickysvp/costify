import { useState, useEffect, useCallback } from 'react';
import {
  TrendingDown,
  Zap,
  Route,
  Database,
  RefreshCw,
  Info,
  Shield,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';


import { API_BASE } from '../config';

// ---------- 类型定义 ----------
interface SavingsSummary {
  total_savings_amount: number;
  total_savings_tokens: number;
  routing_savings: number;
  cache_savings: number;
  cache_hit_rate: number;
  cache_hit_count: number;
  cache_miss_count: number;
}

interface DailySavings {
  date: string;
  routing_savings: number;
  cache_savings: number;
  total_savings: number;
}

// ---------- 工具函数 ----------
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('costio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(v: number): string {
  return `$${v.toFixed(2)}`;
}

function formatNumber(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

// ---------- 路由策略说明 ----------
const ROUTING_STRATEGIES = [
  {
    key: 'cost_saver',
    name: 'Cost Saver',
    icon: TrendingDown,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: '优先选择成本最低的模型，最大化节省开支。',
    detail:
      '将简单任务（如格式化、短文本生成）路由到低成本模型（如 GPT-4o-mini），仅在复杂任务时使用高端模型。适合对成本敏感、可容忍轻微质量下降的场景。',
  },
  {
    key: 'balanced',
    name: 'Balanced',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: '在成本与质量之间取得平衡。',
    detail:
      '根据任务复杂度智能选择模型：中等复杂度任务使用中端模型（如 Claude 3.5 Sonnet），简单任务降级，复杂任务升级。适合大多数通用场景。',
  },
  {
    key: 'quality',
    name: 'Quality',
    icon: Sparkles,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    description: '优先保证输出质量，仅在明显冗余时节省。',
    detail:
      '默认使用高端模型（如 GPT-4o、Claude 3.5 Sonnet），仅对完全重复的请求启用缓存。适合对输出质量要求极高的场景，如法律文档生成、医疗咨询。',
  },
];

const PIE_COLORS = ['#3b82f6', '#10b981'];

// ---------- 组件 ----------
export default function Routing() {

  const [summary, setSummary] = useState<SavingsSummary | null>(null);
  const [dailySavings, setDailySavings] = useState<DailySavings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- 数据获取 ----------
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/savings`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // 汇总
      setSummary({
        total_savings_amount: data.total_savings_amount ?? 0,
        total_savings_tokens: data.total_savings_tokens ?? 0,
        routing_savings: data.routing_savings ?? 0,
        cache_savings: data.cache_savings ?? 0,
        cache_hit_rate: data.cache_hit_rate ?? 0,
        cache_hit_count: data.cache_hit_count ?? 0,
        cache_miss_count: data.cache_miss_count ?? 0,
      });

      // 每日趋势
      const items: DailySavings[] = Array.isArray(data.daily)
        ? data.daily
        : data.daily_savings ?? [];
      setDailySavings(items);
    } catch (err) {
      console.error('获取节省数据失败:', err);
      setError('加载数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 饼图数据
  const pieData =
    summary && (summary.routing_savings > 0 || summary.cache_savings > 0)
      ? [
          { name: '路由节省', value: summary.routing_savings },
          { name: '缓存节省', value: summary.cache_savings },
        ]
      : [];

  // ---------- 渲染 ----------
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">路由优化</h1>
          <p className="text-sm text-surface-500 mt-1">智能路由与缓存策略带来的成本节省分析</p>
        </div>
        <button className="btn-ghost text-xs flex items-center gap-1.5" onClick={fetchData}>
          <RefreshCw className="w-3.5 h-3.5" />
          刷新
        </button>
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
          {/* 节省汇总卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-semibold text-surface-800">总节省金额</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-700">
                {formatCurrency(summary?.total_savings_amount ?? 0)}
              </p>
              <p className="text-xs text-surface-600 mt-2">
                通过智能路由与缓存策略节省
              </p>
            </div>
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-surface-800">总节省 Token</h3>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                {formatNumber(summary?.total_savings_tokens ?? 0)}
              </p>
              <p className="text-xs text-surface-600 mt-2">
                减少不必要的 Token 消耗
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 按类型分布 */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-semibold text-surface-800">节省类型分布</h3>
                </div>
              </div>
              <div className="p-4">
                {pieData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(Number(value)), '金额']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-sm text-surface-400">
                    暂无数据
                  </div>
                )}
              </div>
            </div>

            {/* 缓存命中率统计 */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-semibold text-surface-800">缓存命中率统计</h3>
                </div>
              </div>
              <div className="p-5 space-y-5">
                {/* 命中率圆环 */}
                <div className="flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(summary?.cache_hit_rate ?? 0) * 314} 314`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-surface-900">
                        {((summary?.cache_hit_rate ?? 0) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-surface-500">命中率</span>
                    </div>
                  </div>
                </div>

                {/* 命中/未命中统计 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-emerald-700">
                      {formatNumber(summary?.cache_hit_count ?? 0)}
                    </p>
                    <p className="text-xs text-surface-600">缓存命中</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-red-700">
                      {formatNumber(summary?.cache_miss_count ?? 0)}
                    </p>
                    <p className="text-xs text-surface-600">缓存未命中</p>
                  </div>
                </div>

                <p className="text-xs text-surface-500 text-center">
                  缓存命中可节省约 90% 的 Token 消耗
                </p>
              </div>
            </div>
          </div>

          {/* 每日节省趋势图 */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-surface-800">每日节省趋势</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="h-72">
                {dailySavings.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailySavings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: string) => v.split('-').slice(1).join('/')}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === 'routing_savings'
                            ? '路由节省'
                            : name === 'cache_savings'
                              ? '缓存节省'
                              : '总节省',
                        ]}
                        labelFormatter={(label) =>
                          new Date(String(label)).toLocaleDateString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="routing_savings"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        name="路由节省"
                      />
                      <Area
                        type="monotone"
                        dataKey="cache_savings"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        name="缓存节省"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-surface-400">
                    暂无数据
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 路由策略说明卡片 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-surface-800">路由策略说明</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROUTING_STRATEGIES.map((strategy) => {
                const Icon = strategy.icon;
                return (
                  <div
                    key={strategy.key}
                    className={`card p-5 border ${strategy.border}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${strategy.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${strategy.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-surface-800">
                          {strategy.name}
                        </h4>
                        <p className="text-xs text-surface-500">{strategy.key}</p>
                      </div>
                    </div>
                    <p className="text-sm text-surface-700 mb-3">
                      {strategy.description}
                    </p>
                    <div className="bg-surface-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-surface-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-surface-600">{strategy.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
