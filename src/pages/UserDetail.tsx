import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  AlertCircle,
  DollarSign,
  BarChart3,
  Activity,
  Calendar,
  Building2,
  Key,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { API_BASE } from '../config';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  spend: number;
  tokens: number;
  requests: number;
  created_at: string;
  last_active_at: string | null;
  projects: UserProject[];
  api_keys: UserApiKey[];
  daily_usage: DailyUsage[];
  model_distribution: ModelDistribution[];
  recent_usage: UsageRecord[];
}

interface UsageRecord {
  id: number;
  created_at: string;
  model: string;
  cost: number;
  total_tokens: number;
  project_name: string;
  api_key_name: string;
}

interface UserProject {
  id: number;
  name: string;
  spend: number;
  role: string;
}

interface UserApiKey {
  id: number;
  name: string;
  key_preview: string;
  spend: number;
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

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/users/${id}/detail`, {
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

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const fmtNum = (n: number) => n.toLocaleString();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'org_admin':
        return '企业管理员';
      case 'project_admin':
        return '项目管理员';
      case 'member':
        return '成员';
      default:
        return role;
    }
  };

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
          <h1 className="text-xl font-bold text-surface-900">成员详情</h1>
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-brand-700">{data.name?.[0] || '?'}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">{data.name}</h1>
              <p className="text-sm text-surface-500">{getRoleLabel(data.role)}</p>
            </div>
          </div>
        </div>
        <button onClick={fetchDetail} className="btn-ghost inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
      </div>

      {/* 用户信息卡片 */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-700">{data.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-500">
                参与 {data.projects.length} 个项目
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-500">
                加入于 {new Date(data.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            {data.last_active_at && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-surface-400" />
                <span className="text-sm text-surface-500">
                  最后活跃 {new Date(data.last_active_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>
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
            <Key className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-surface-500">API Keys</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{data.api_keys.length}</p>
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
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, '花费']}
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
                    <span className="text-xs text-surface-400 w-12 text-right">{model.count} 次</span>
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

      {/* 项目和 API Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 参与的项目 */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">参与的项目</h3>
            <span className="text-xs text-surface-400">{data.projects.length} 个</span>
          </div>
          {data.projects.length > 0 ? (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-surface-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">项目</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">角色</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">花费</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-surface-400" />
                          <span className="text-sm font-medium text-surface-800">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                          {project.role === 'admin' ? '管理员' : '成员'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-surface-800 text-right">{fmt(project.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-surface-400">暂无项目数据</div>
          )}
        </div>

        {/* API Keys */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">API Keys</h3>
            <span className="text-xs text-surface-400">{data.api_keys.length} 个</span>
          </div>
          {data.api_keys.length > 0 ? (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-surface-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">名称</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">Key</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">花费</th>
                  </tr>
                </thead>
                <tbody>
                  {data.api_keys.map((key) => (
                    <tr
                      key={key.id}
                      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/api-keys/${key.id}`)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-surface-400" />
                          <span className="text-sm font-medium text-surface-800">{key.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <code className="text-[10px] font-mono text-surface-400">{key.key_preview}</code>
                      </td>
                      <td className="px-3 py-2 text-sm text-surface-800 text-right">{fmt(key.spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-surface-400">暂无 API Key 数据</div>
          )}
        </div>
      </div>

      {/* 最近 API 使用记录 */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-sm font-semibold text-surface-800">最近 API 使用记录</h3>
          <span className="text-xs text-surface-400">最近 50 条</span>
        </div>
        {data.recent_usage && data.recent_usage.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-surface-200">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">时间</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">模型</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">项目</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-surface-500">API Key</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">Tokens</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-surface-500">花费</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_usage.map((usage) => (
                  <tr key={usage.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-3 py-2 text-xs text-surface-600">
                      {new Date(usage.created_at).toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                        {MODEL_DISPLAY[usage.model] || usage.model}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-surface-800">{usage.project_name}</td>
                    <td className="px-3 py-2 text-xs text-surface-500">{usage.api_key_name}</td>
                    <td className="px-3 py-2 text-sm text-surface-800 text-right">
                      {usage.total_tokens.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-surface-800 text-right">
                      {fmt(usage.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-surface-400">暂无使用记录</div>
        )}
      </div>
    </div>
  );
}
