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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';


import { API_BASE } from '../config';

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

// ---------- 模拟数据生成 ----------
const MOCK_PROJECTS = ['Production API', 'Staging Test', 'Dev Environment', 'Customer Support', 'Internal Tools', 'Marketing AI'];
const MOCK_USERS = ['Alice Chen', 'Bob Wang', 'Carol Li', 'David Zhang', 'Emma Liu', 'Frank Zhao'];
const MOCK_MODELS = ['GPT-5.5', 'Claude 4.7', 'DeepSeek V4', 'Kimi 2.6', 'GLM 5.1', 'GPT-5.5-mini'];
const MOCK_EMAILS = ['alice@company.com', 'bob@company.com', 'carol@company.com', 'david@company.com', 'emma@company.com', 'frank@company.com'];

function generateMockSummary(): SummaryData {
  return {
    total_cost: 2847.56,
    total_savings: 423.18,
    total_tokens: 156_789_432,
    request_count: 45_230,
    cache_hit_rate: 34.5,
  };
}

function generateMockStats(groupBy: GroupByType): StatItem[] {
  const data: StatItem[] = [];
  
  if (groupBy === 'date') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      // 确保没有重复日期
      if (!data.find(d => d.name === dateStr)) {
        data.push({
          name: dateStr,
          cost: Math.round((Math.random() * 130 + 20) * 100) / 100,
          tokens: Math.round(Math.random() * 7_000_000 + 1_000_000),
          requests: Math.round(Math.random() * 1700 + 300),
          percentage: 0,
        });
      }
    }
  } else if (groupBy === 'week') {
    for (let i = 11; i >= 0; i--) {
      data.push({
        name: `Week ${12 - i}`,
        cost: Math.random() * 800 + 200,
        tokens: Math.random() * 40_000_000 + 10_000_000,
        requests: Math.random() * 8000 + 2000,
        percentage: Math.random() * 10,
      });
    }
  } else if (groupBy === 'month') {
    const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04'];
    months.forEach(m => {
      data.push({
        name: m,
        cost: Math.random() * 3000 + 800,
        tokens: Math.random() * 150_000_000 + 50_000_000,
        requests: Math.random() * 15_000 + 5000,
        percentage: Math.random() * 20,
      });
    });
  } else if (groupBy === 'project') {
    MOCK_PROJECTS.forEach((p) => {
      data.push({
        name: p,
        cost: Math.random() * 1200 + 100,
        tokens: Math.random() * 60_000_000 + 5_000_000,
        requests: Math.random() * 12_000 + 1000,
        percentage: Math.random() * 25,
      });
    });
  } else if (groupBy === 'user') {
    MOCK_USERS.forEach((u, i) => {
      data.push({
        name: u,
        email: MOCK_EMAILS[i],
        cost: Math.random() * 800 + 50,
        tokens: Math.random() * 40_000_000 + 2_000_000,
        requests: Math.random() * 8000 + 500,
        percentage: Math.random() * 20,
      });
    });
  } else if (groupBy === 'api_key') {
    for (let i = 0; i < 8; i++) {
      data.push({
        name: `API Key ${i + 1}`,
        key_preview: `sk-${Math.random().toString(36).substring(2, 8)}...`,
        cost: Math.random() * 600 + 30,
        tokens: Math.random() * 30_000_000 + 1_000_000,
        requests: Math.random() * 6000 + 300,
        percentage: Math.random() * 15,
      });
    }
  } else if (groupBy === 'model') {
    MOCK_MODELS.forEach((m) => {
      data.push({
        name: m,
        cost: Math.random() * 1000 + 80,
        tokens: Math.random() * 50_000_000 + 3_000_000,
        requests: Math.random() * 10_000 + 800,
        percentage: Math.random() * 25,
      });
    });
  }
  
  // 计算百分比
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);
  return data.map(d => ({
    ...d,
    percentage: parseFloat(((d.cost / totalCost) * 100).toFixed(1)),
  }));
}

function generateMockRecentRecords(): UsageRecord[] {
  const records: UsageRecord[] = [];
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15);
    records.push({
      id: `req_${Date.now()}_${i}`,
      timestamp: date.toISOString(),
      project: MOCK_PROJECTS[Math.floor(Math.random() * MOCK_PROJECTS.length)],
      user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
      user_email: MOCK_EMAILS[Math.floor(Math.random() * MOCK_EMAILS.length)],
      model: MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)],
      prompt_tokens: Math.floor(Math.random() * 5000 + 100),
      completion_tokens: Math.floor(Math.random() * 3000 + 50),
      cost: parseFloat((Math.random() * 0.5 + 0.01).toFixed(4)),
      cached: Math.random() > 0.65,
    });
  }
  return records;
}

// ---------- 组件 ----------
export default function UsagePage() {
  const { t, lang } = useLanguage();

  // 筛选状态
  const [timeRange] = useState<TimeRange>('30d');
  const [customStart] = useState('');
  const [customEnd] = useState('');
  const [groupBy] = useState<GroupByType>('date');
  const [filterProject] = useState('');
  const [filterUser] = useState('');
  const [filterModel] = useState('');

  // 数据状态
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [recentRecords, setRecentRecords] = useState<UsageRecord[]>([]);
  const [, setProjects] = useState<string[]>([]);
  const [, setUsers] = useState<string[]>([]);
  const [, setModels] = useState<string[]>([]);

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
      if (!res.ok) {
        if (res.status === 404) {
          setSummary(generateMockSummary());
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('获取汇总失败:', err);
      setSummary(generateMockSummary());
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
      if (!res.ok) {
        if (res.status === 404) {
          setStatsData(generateMockStats(groupBy));
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setStatsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('获取统计数据失败:', err);
      setStatsData(generateMockStats(groupBy));
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
      if (!res.ok) {
        if (res.status === 404) {
          setRecentRecords(generateMockRecentRecords());
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setRecentRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('获取最近记录失败:', err);
      setRecentRecords(generateMockRecentRecords());
    }
  }, [dateRange, filterProject, filterUser, filterModel]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      // 获取项目列表
      const projectsRes = await fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() });
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => p.name) || []);
      } else if (projectsRes.status === 404) {
        setProjects(MOCK_PROJECTS);
      }
      
      // 获取模型列表（从统计数据中提取）
      const modelsRes = await fetch(`${API_BASE}/usage?group_by=model`, { headers: getAuthHeaders() });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        setModels(Array.isArray(modelsData) ? modelsData.map((m: any) => m.name || m.model || '') : []);
      } else if (modelsRes.status === 404) {
        setModels(MOCK_MODELS);
      }
      
      // 获取用户列表
      const usersRes = await fetch(`${API_BASE}/members`, { headers: getAuthHeaders() });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData.map((u: any) => u.name || u.email || '') : []);
      } else if (usersRes.status === 404) {
        setUsers(MOCK_USERS);
      }
    } catch (err) {
      console.error('获取筛选选项失败:', err);
      setProjects(MOCK_PROJECTS);
      setModels(MOCK_MODELS);
      setUsers(MOCK_USERS);
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
      setError(t.usage?.loadFailed || '加载数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchStats, fetchRecent, t]);

  useEffect(() => {
    loadAll();
    fetchFilterOptions();
  }, [loadAll, fetchFilterOptions]);

  // 导出数据
  const handleExport = () => {
    const headers = [t.usage?.name || '名称', t.usage?.cost || '花费', t.usage?.tokens || 'Token数', t.usage?.requests || '请求数', t.usage?.percentage || '占比'];
    const csvContent = [
      headers.join(','),
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
      date: t.usage?.byDay || 'By Day',
      week: t.usage?.byWeek || 'By Week',
      month: t.usage?.byMonth || 'By Month',
      project: t.usage?.byProject || 'By Project',
      user: t.usage?.byUser || 'By User',
      api_key: t.usage?.byApiKey || 'By API Key',
      model: t.usage?.byModel || 'By Model',
    };
    return labels[type];
  };

  // 获取表格列标题
  const getTableColumnLabel = () => {
    switch (groupBy) {
      case 'project': return t.usage?.project || '项目';
      case 'user': return t.usage?.user || '人员';
      case 'api_key': return t.usage?.apiKey || 'API Key';
      case 'model': return t.usage?.model || '模型';
      default: return t.usage?.date || '日期';
    }
  };

  // ---------- 渲染 ----------
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.layout.usage}</h1>
          <p className="text-sm text-surface-500 mt-1">{t.usage?.subtitle || 'Multi-dimensional analysis of AI usage and costs'}</p>
          {lastUpdated && (
            <p className="text-xs text-surface-400 mt-1">
              {t.usage?.lastUpdated || 'Last Updated'}: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost text-xs flex items-center gap-1.5"
            onClick={handleExport}
          >
            <Download className="w-3.5 h-3.5" />
            {t.usage?.export || 'Export'}
          </button>
          <button
            className="btn-ghost text-xs flex items-center gap-1.5"
            onClick={loadAll}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {t.dashboard.refresh}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={loadAll} className="ml-auto text-sm underline hover:no-underline">
            {t.usage?.retry || 'Retry'}
          </button>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          <span className="ml-3 text-sm text-surface-600">{t.common?.loading || 'Loading...'}</span>
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
                <span className="text-xs font-medium text-surface-500">{t.usage?.totalCost || 'Total Cost'}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatCurrencyCompact(summary?.total_cost ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{dateRange.start} {lang === 'zh' ? '至' : 'to'} {dateRange.end}</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">{t.usage?.totalSavings || 'Total Savings'}</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrencyCompact(summary?.total_savings ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{t.usage?.savingsDesc || 'Saved through optimization'}</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">{t.usage?.totalTokens || 'Total Tokens'}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatNumber(summary?.total_tokens ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{t.usage?.tokensDesc || 'Input + Output Tokens'}</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">{t.usage?.requestCount || 'Requests'}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatNumber(summary?.request_count ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{t.usage?.requestsDesc || 'API call count'}</p>
            </div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <Database className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-surface-500">{t.usage?.cacheHitRate || 'Cache Hit Rate'}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {formatPercentage(summary?.cache_hit_rate ?? 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">{t.usage?.cacheDesc || 'Cache hit ratio'}</p>
            </div>
          </div>

          {/* 标签页切换 */}
          <div className="flex items-center gap-2 border-b border-surface-200">
            {[
              { key: 'overview', label: t.usage?.dataOverview || 'Data Overview', icon: Layers },
              { key: 'trend', label: t.usage?.trendAnalysis || 'Trend Analysis', icon: BarChart3 },
              { key: 'detail', label: t.usage?.detailRecords || 'Detailed Records', icon: Clock },
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
                      {getGroupByLabel(groupBy)}{t.usage?.statsBy || ' Statistics'}
                    </h3>
                  </div>
                  <span className="text-xs text-surface-400">{t.usage?.recordsCount?.replace('{count}', statsData.length.toString()) || `${statsData.length} records`}</span>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-surface-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.usage?.rank || 'Rank'}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{getTableColumnLabel()}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.cost || 'Cost'}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.tokens || 'Tokens'}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.requests || 'Requests'}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.percentage || 'Percentage'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-surface-400">
                            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            {t.usage?.noData || 'No Data'}
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
                    <h3 className="text-sm font-semibold text-surface-800">{t.usage?.distribution || 'Distribution'}</h3>
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
                            <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
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
                          <p className="text-sm">{t.usage?.noData || 'No Data'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 折线图 - 花费趋势 */}
              <div className="card lg:col-span-2">
                <div className="card-header flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-surface-800">
                    {groupBy === 'month' ? (t.usage?.byMonth || 'Monthly') : groupBy === 'week' ? (t.usage?.byWeek || 'Weekly') : (t.usage?.byDay || 'Daily')} Cost Trend
                  </h3>
                  <span className="text-xs text-surface-400">{chartData.length} records</span>
                </div>
                <div className="p-4">
                  <div className="h-80">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 11 }}
                            tickFormatter={(v: string) => {
                              if (groupBy === 'month' && v.length === 7) {
                                return v.substring(5) + (lang === 'zh' ? '月' : '');
                              }
                              if (groupBy === 'date' && v.length === 10) {
                                return v.substring(5);
                              }
                              return v;
                            }}
                          />
                          <YAxis 
                            tick={{ fontSize: 11 }}
                            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                          />
                          <RechartsTooltip 
                            formatter={(value: any) => formatCurrency(Number(value))}
                            labelFormatter={(label: any) => `${label}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="cost"
                            name={t.usage?.cost || 'Cost'}
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 8, fill: '#1d4ed8' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-surface-400">
                        <BarChart3 className="w-12 h-12 mb-2 opacity-30" />
                        <p className="text-sm">{t.usage?.noData || 'No Data'}</p>
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
                  {groupBy === 'month' ? (t.usage?.byMonth || 'Monthly') : groupBy === 'week' ? (t.usage?.byWeek || 'Weekly') : (t.usage?.byDay || 'Daily')} {t.usage?.trend || 'Trend'}
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
                              return v.substring(5) + (lang === 'zh' ? '月' : '');
                            }
                            return v;
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                        />
                        <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          name={t.usage?.cost || 'Cost'}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="tokens"
                          name={t.usage?.tokens || 'Tokens'}
                          stroke="#10b981"
                          strokeWidth={2}
                          yAxisId={1}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-surface-400">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-30" />
                      <p className="text-sm">{t.usage?.noTrendData || 'No trend data'}</p>
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
                <h3 className="text-sm font-semibold text-surface-800">{t.usage?.detailRecords || 'Detailed Records'}</h3>
                <span className="text-xs text-surface-400">{t.usage?.recent50Records || 'Last 50 records'}</span>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-surface-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.usage?.time || 'Time'}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.usage?.project || 'Project'}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.usage?.user || 'User'}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.usage?.model || 'Model'}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.prompt || 'Prompt'}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.completion || 'Completion'}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.usage?.cost || 'Cost'}</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-surface-500">{t.usage?.cached || 'Cached'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-surface-400">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          {t.usage?.noRecords || 'No records'}
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
                              {r.cached ? (t.usage?.cacheHit || 'Hit') : (t.usage?.cacheMiss || 'Miss')}
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
