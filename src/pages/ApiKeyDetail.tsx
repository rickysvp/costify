import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Key,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Calendar,
  Building2,
  User,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const API_BASE = 'http://localhost:3001/api';

interface ApiKeyDetail {
  id: number;
  name: string;
  key_preview: string;
  project_id: number;
  project_name: string;
  user_id: number | null;
  user_name: string | null;
  spend: number;
  tokens: number;
  requests: number;
  created_at: string;
  last_used_at: string | null;
  status: string;
  daily_usage: DailyUsage[];
  model_distribution: ModelDistribution[];
}

interface DailyUsage {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

interface ModelDistribution {
  model: string;
  cost: number;
  count: number;
}

const MODEL_DISPLAY: Record<string, string> = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'claude-3-opus': 'Claude 3 Opus',
  'claude-3-sonnet': 'Claude 3 Sonnet',
  'claude-3-haiku': 'Claude 3 Haiku',
};

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

export default function ApiKeyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ApiKeyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/api-keys/${id}/detail`, {
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
    fetchDetail();
  }, [id]);

  const copyKey = () => {
    if (data?.key_preview) {
      navigator.clipboard.writeText(data.key_preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const fmtNum = (n: number) => n.toLocaleString();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-32 skeleton" />
        </div>
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

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-surface-900">API Key 详情</h1>
        </div>
        <div className="card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || '加载失败'}</p>
          <button onClick={fetchDetail} className="btn-primary mt-4">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-surface-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{data.name}</h1>
            <p className="text-sm text-surface-500">API Key 详情</p>
          </div>
        </div>
        <button
          onClick={fetchDetail}
          className="btn-ghost inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
      </div>

      {/* Key 信息卡片 */}
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-mono bg-surface-100 px-2 py-0.5 rounded">
                  {data.key_preview}
                </code>
                <button
                  onClick={copyKey}
                  className="p-1 hover:bg-surface-100 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-surface-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-surface-500">
                <span
                  className="flex items-center gap-1 cursor-pointer hover:text-brand-600 transition-colors"
                  onClick={() => navigate(`/projects/${data.project_id}`)}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {data.project_name}
                </span>
                {data.user_id && data.user_name && (
                  <span
                    className="flex items-center gap-1 cursor-pointer hover:text-brand-600 transition-colors"
                    onClick={() => navigate(`/users/${data.user_id}`)}
                  >
                    <User className="w-3.5 h-3.5" />
                    {data.user_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  创建于 {new Date(data.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              data.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {data.status === 'active' ? '正常' : '已禁用'}
          </span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-medium text-surface-500">总花费</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmt(data.spend)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-surface-500">Token 数</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmtNum(data.tokens)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-medium text-surface-500">请求数</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{fmtNum(data.requests)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-surface-500">最后使用</span>
          </div>
          <p className="text-lg font-bold text-surface-900">
            {data.last_used_at
              ? new Date(data.last_used_at).toLocaleDateString('zh-CN')
              : '从未'}
          </p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 每日使用趋势 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-surface-800">30 天使用趋势</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              {data.daily_usage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily_usage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.split('-').slice(1).join('/')}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '花费']}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-surface-400">
                  暂无使用数据
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 模型分布 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-surface-800">模型使用分布</h3>
          </div>
          <div className="p-4">
            {data.model_distribution.length > 0 ? (
              <div className="space-y-3">
                {data.model_distribution.map((model, index) => (
                  <div key={model.model} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-800">
                          {MODEL_DISPLAY[model.model] || model.model}
                        </span>
                        <span className="text-sm text-surface-600">{fmt(model.cost)}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(model.cost / data.spend) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-surface-400 w-12 text-right">
                      {model.count} 次
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-surface-400">
                暂无模型使用数据
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
