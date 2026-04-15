import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DollarSign,
  TrendingDown,
  Hash,
  Activity,
  Database,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Clock,
  Server,
  PieChart as PieChartIcon,
  Calendar,
  Users,
  Key,
  Building2,
  Download,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';


const API_BASE = 'http://localhost:3001/api';

// ---------- 类型定义 ----------
type GroupByType = 'date' | 'week' | 'month' | 'project' | 'user' | 'api_key' | 'model';
type TimeRange = '7d' | '30d' | '90d' | 'custom';

interface StatItem {
  name: string;
  cost: number;
  tokens: number;
  requests: number;
  percentage?: number;
  savings?: number;
  email?: string;
  key_preview?: string;
  date?: string;
}

interface UsageRecord {
  id: string;
  timestamp: string;
  project: string;
  user: string;
  user_email: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost: number;
  cached: boolean;
}

interface SummaryData {
  total_cost: number;
  total_savings: number;
  total_tokens: number;
  request_count: number;
  cache_hit_rate: number | string;
}

// ---------- 工具函数 ----------
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('costio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(v: number): string {
  if (v === undefined || v === null || isNaN(v)) return '$0.00';
  return `$${v.toFixed(4)}`;
}

function formatCurrencyCompact(v: number): string {
  if (v === undefined || v === null || isNaN(v)) return '$0';
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(4)}`;
}

function formatNumber(v: number): string {
  if (v === undefined || v === null || isNaN(v)) return '0';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

function formatPercentage(v: number | string): string {
  if (v === undefined || v === null) return '0.0%';
  const num = typeof v === 'string' ? parseFloat(v) : v;
  if (isNaN(num)) return '0.0%';
  return `${num.toFixed(1)}%`;
}

function getDateRange(range: TimeRange): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  
  switch (range) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// 颜色配置
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

// ---------- 组件 ----------
export default function UsagePage() {

  // 筛选状态
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByType>('date');
  const [filterProject, setFilterProject] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterModel, setFilterModel] = useState('');

  // 数据状态
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [recentRecords, setRecentRecords] = useState<UsageRecord[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  // UI 状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'detail'>('overview');

  // 计算日期范围
  const dateRange = useMemo(() => {
    if (timeRange === 'custom' && customStart && customEnd) {
      return { start: customStart, end: customEnd };
    }
    return getDateRange(timeRange);
  }, [timeRange, customStart, customEnd]);

  // ---------- 数据获取 ----------
  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('start_date', dateRange.start);
      params.set('end_date', dateRange.end);
      if (filterProject) params.set('project', filterProject);
      if (filterUser) params.set('user', filterUser);
      if (filterModel) params.set('model', filterModel);
      
      const res = await fetch(`${API_BASE}/usage/summary?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('获取汇总失败:', err);
    }
  }, [dateRange, filterProject, filterUser, filterModel]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('group_by', groupBy === 'week' || groupBy === 'month' ? 'time' : groupBy);
      if (groupBy === 'week') params.set('period', 'week');
      if (groupBy === 'month') params.set('period', 'month');
      params.set('start_date', dateRange.start);
      params.set('end_date', dateRange.end);
      if (filterProject) params.set('project', filterProject);
      if (filterUser) params.set('user', filterUser);
      if (filterModel) params.set('model', filterModel);
      
      const res = await fetch(`${API_BASE}/usage?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  }, [groupBy, dateRange, filterProject, filterUser, filterModel]);

  const fetchRecent = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('group_by', 'recent');
      params.set('limit', '50');
      params.set('start_date', dateRange.start);
      params.set('end_date', dateRange.end);
      if (filterProject) params.set('project', filterProject);
      if (filterUser) params.set('user', filterUser);
      if (filterModel) params.set('model', filterModel);
      
      const res = await fetch(`${API_BASE}/usage?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecentRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('获取最近记录失败:', err);
    }
  }, [dateRange, filterProject, filterUser, filterModel]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      // 获取项目列表
      const projectsRes = await fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() });
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => p.name) || []);
      }
      
      // 获取模型列表（从统计数据中提取）
      const modelsRes = await fetch(`${API_BASE}/usage?group_by=model`, { headers: getAuthHeaders() });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        setModels(modelsData.map((m: any) => m.name) || []);
      }
      
      // 获取用户列表
      const usersRes = await fetch(`${API_BASE}/members`, { headers: getAuthHeaders() });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.map((u: any) => u.name) || []);
      }
    } catch (err) {
      console.error('获取筛选选项失败:', err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSummary(),
        fetchStats(),
        fetchRecent(),
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      setError('加载数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchStats, fetchRecent]);

  useEffect(() => {
    loadAll();
    fetchFilterOptions();
  }, [loadAll, fetchFilterOptions]);

  // 导出数据
  const handleExport = () => {
    const csvContent = [
      ['名称', '花费', 'Token数', '请求数', '占比'].join(','),
      ...statsData.map(item => [
        item.name,
        item.cost.toFixed(4),
        item.tokens,
        item.requests,
        (item.percentage || 0).toFixed(2) + '%'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usage_stats_${groupBy}_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
  };

  // 图表数据
  const chartData = useMemo(() => {
    return statsData.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));
  }, [statsData]);

  // 获取分组标签
  const getGroupByLabel = (type: GroupByType) => {
    const labels: Record<GroupByType, string> = {
      date: '按日',
      week: '按周',
      month: '按月',
      project: '按项目',
      user: '按人员',
      api_key: '按API Key',
      model: '按模型',
    };
    return labels[type];
  };

  // ---------- 渲染 ----------
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">使用统计</h1>
          <p className="text-sm text-surface-500 mt-1">多维度分析 AI 调用成本与使用情况</p>
          {lastUpdated && (
            <p className="text-xs text-surface-400 mt-1">
              最后更新: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost text-xs flex items-center gap-1.5"
            onClick={handleExport}
          >
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
          <button
            className="btn-ghost text-xs flex items-center gap-1.5"
            onClick={loadAll}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 时间范围 */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-1.5">时间范围</label>
            <select
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          
          {/* 自定义日期 */}
          {timeRange === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">开始日期</label>
                <input
                  type="date"
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1.5">结束日期</label>
                <input
                  type="date"
                  className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </div>
            </>
          )}
          
          {/* 分组方式 */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-1.5">分析维度</label>
            <select
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByType)}
            >
              <option value="date">按日</option>
              <option value="week">按周</option>
              <option value="month">按月</option>
              <option value="project">按项目</option>
              <option value="user">按人员</option>
              <option value="api_key">按API Key</option>
              <option value="model">按模型</option>
            </select>
          </div>
          
          {/* 项目筛选 */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-1.5">项目</label>
            <select
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">全部项目</option>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          {/* 人员筛选 */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-1.5">人员</label>
            <select
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="">全部人员</option>
              {users.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          
          {/* 模型筛选 */}
          <div>
            <label className="block text-xs font-medium text-surface-700 mb-1.5">模型</label>
            <select
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white"
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
            >
              <option value="">全部模型</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="btn-secondary text-xs"
            onClick={() => {
              setTimeRange('30d');
              setCustomStart('');
              setCustomEnd('');
              setGroupBy('date');
              setFilterProject('');
              setFilterUser('');
              setFilterModel('');
            }}
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={loadAll} className="ml-auto text-sm underline hover:no-underline">
            重试
          </button>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          <span className="ml-3 text-sm text-surface-600">加载中...</span>
        </div>
      ) : (
        <>
          {/* 汇总卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">总花费</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatCurrencyCompact(summary?.total_cost ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{dateRange.start} 至 {dateRange.end}</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">总节省</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrencyCompact(summary?.total_savings ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">通过优化策略节省</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">总 Token</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatNumber(summary?.total_tokens ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">输入 + 输出 Token</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">请求数</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatNumber(summary?.request_count ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">API 调用次数</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <Database className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">缓存命中率</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatPercentage(summary?.cache_hit_rate ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">重复请求缓存比例</p>
            </div>
          </div>

          {/* 标签页切换 */}
          <div className="flex items-center gap-2 border-b border-surface-200">
            {[
              { key: 'overview', label: '数据概览', icon: Layers },
              { key: 'trend', label: '趋势分析', icon: BarChart3 },
              { key: 'detail', label: '详细记录', icon: Clock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* 数据概览标签 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 统计表格 */}
              <div className="card lg:col-span-2">
                <div className="card-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {groupBy === 'project' && <Building2 className="w-4 h-4 text-blue-600" />}
                    {groupBy === 'user' && <Users className="w-4 h-4 text-violet-600" />}
                    {groupBy === 'api_key' && <Key className="w-4 h-4 text-amber-600" />}
                    {groupBy === 'model' && <Server className="w-4 h-4 text-emerald-600" />}
                    {(groupBy === 'date' || groupBy === 'week' || groupBy === 'month') && <Calendar className="w-4 h-4 text-cyan-600" />}
                    <h3 className="text-sm font-semibold text-surface-800">
                      {getGroupByLabel(groupBy)}统计
                    </h3>
                  </div>
                  <span className="text-xs text-surface-400">共 {statsData.length} 条记录</span>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-surface-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">排名</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">
                          {groupBy === 'project' ? '项目' : 
                           groupBy === 'user' ? '人员' : 
                           groupBy === 'api_key' ? 'API Key' : 
                           groupBy === 'model' ? '模型' : '日期'}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">花费</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Token</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">请求数</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-surface-400">
                            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            暂无数据
                          </td>
                        </tr>
                      ) : (
                        statsData.map((item, index) => (
                          <tr key={item.name || index} className="border-b border-surface-100 hover:bg-surface-50">
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                                index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-surface-100 text-surface-500'
                              }`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-surface-800">{item.name}</p>
                                {item.email && <p className="text-xs text-surface-400">{item.email}</p>}
                                {item.key_preview && <p className="text-xs text-surface-400 font-mono">{item.key_preview}</p>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-800 text-right font-medium">
                              {formatCurrency(item.cost)}
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-600 text-right">
                              {formatNumber(item.tokens)}
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-600 text-right">
                              {formatNumber(item.requests)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-surface-800">
                                  {formatPercentage(item.percentage || 0)}
                                </span>
                                <div className="w-16 h-2 bg-surface-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-brand-500"
                                    style={{ width: `${Math.min(item.percentage || 0, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 饼图分布 */}
              {groupBy !== 'date' && groupBy !== 'week' && groupBy !== 'month' && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-surface-800">分布占比</h3>
                  </div>
                  <div className="p-4">
                    <div className="h-80">
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData.slice(0, 10)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="cost"
                              nameKey="name"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend 
                              verticalAlign="bottom" 
                              height={80}
                              formatter={(value: string) => (
                                <span className="text-xs text-surface-600 truncate max-w-[100px] inline-block">{value}</span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-surface-400">
                          <PieChartIcon className="w-12 h-12 mb-2 opacity-30" />
                          <p className="text-sm">暂无数据</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 柱状图对比 */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-surface-800">花费对比</h3>
                </div>
                <div className="p-4">
                  <div className="h-80">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.slice(0, 15)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}`} />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            width={100}
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v: string) => v.length > 12 ? v.substring(0, 12) + '...' : v}
                          />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-surface-400">
                        <BarChart3 className="w-12 h-12 mb-2 opacity-30" />
                        <p className="text-sm">暂无数据</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 趋势分析标签 */}
          {activeTab === 'trend' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-semibold text-surface-800">
                  {groupBy === 'month' ? '月度' : groupBy === 'week' ? '周度' : '每日'}趋势
                </h3>
              </div>
              <div className="p-4">
                <div className="h-96">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: string) => {
                            if (groupBy === 'month' && v.length === 7) {
                              return v.substring(5) + '月';
                            }
                            return v;
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                        />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          name="花费"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="tokens"
                          name="Token数"
                          stroke="#10b981"
                          strokeWidth={2}
                          yAxisId={1}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-surface-400">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-30" />
                      <p className="text-sm">暂无趋势数据</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 详细记录标签 */}
          {activeTab === 'detail' && (
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-800">使用明细</h3>
                <span className="text-xs text-surface-400">最近 50 条记录</span>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-surface-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">时间</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">项目</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">人员</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">模型</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Prompt</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Completion</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">花费</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-surface-500">缓存</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-surface-400">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          暂无记录
                        </td>
                      </tr>
                    ) : (
                      recentRecords.map((r) => (
                        <tr key={r.id} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="px-4 py-3 text-sm text-surface-600 whitespace-nowrap">
                            {r.timestamp ? new Date(r.timestamp).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-surface-800">
                            {r.project || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-surface-800">{r.user || '-'}</p>
                              <p className="text-xs text-surface-400">{r.user_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-700">{r.model || '-'}</td>
                          <td className="px-4 py-3 text-sm text-surface-600 text-right">
                            {formatNumber(r.prompt_tokens ?? 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-600 text-right">
                            {formatNumber(r.completion_tokens ?? 0)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-surface-800 text-right">
                            {formatCurrency(r.cost ?? 0)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                r.cached 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : 'bg-surface-100 text-surface-500'
                              }`}
                            >
                              {r.cached ? '命中' : '未命中'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
