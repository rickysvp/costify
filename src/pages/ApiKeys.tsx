import { useState, useEffect, useCallback } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  X,
  AlertTriangle,
  Search,
  Loader2,
  BarChart3,
  Pause,
  Play,
  Trash2,
  CheckSquare,
  Square,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  RefreshCw,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001/api';

// ---------- Types ----------
interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
}

interface ApiKeyItem {
  id: number;
  name: string;
  type: 'project' | 'user';
  project_id: number | null;
  project?: string;
  user_id: number | null;
  owner?: string;
  status: 'active' | 'paused' | 'revoked';
  created_at: string;
  key_prefix?: string;
  monthly_budget?: number;
  monthly_spend?: number;
  total_requests?: number;
  total_tokens?: number;
  last_used?: string;
  total_cost?: number;
  request_count?: number;
  budget_usage?: number;
}

interface KeyAnalytics {
  summary: {
    total_cost: number;
    total_tokens: number;
    total_savings: number;
    request_count: number;
    avg_latency: number;
    cache_hit_rate: number;
  };
  trend: Array<{
    period: string;
    cost: number;
    tokens: number;
    requests: number;
    avg_latency: number;
  }>;
  by_model: Array<{
    model: string;
    cost: number;
    tokens: number;
    requests: number;
    avg_latency: number;
  }>;
  by_project: Array<{
    project_id: number;
    project_name: string;
    cost: number;
    requests: number;
  }>;
  recent_usage: Array<{
    id: string;
    timestamp: string;
    project: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    cost: number;
    latency: number;
    cache_hit: boolean;
  }>;
  anomalies: Array<{
    id: string;
    timestamp: string;
    project: string;
    model: string;
    cost: number;
    latency: number;
    reason: string;
  }>;
}

interface CreateKeyForm {
  project_id: number | null;
  type: 'project' | 'user';
  name: string;
  user_id: number | null;
  monthly_budget?: number;
}

// ---------- Component ----------
export default function ApiKeys() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'requests' | 'last_used' | 'created'>('cost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection for batch operations
  const [selectedKeys, setSelectedKeys] = useState<Set<number>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);

  // Analytics modal
  const [analyticsKey, setAnalyticsKey] = useState<ApiKeyItem | null>(null);
  const [analyticsData, setAnalyticsData] = useState<KeyAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Create key modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateKeyForm>({
    project_id: null,
    type: 'project',
    name: '',
    user_id: null,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newKeyDisplay, setNewKeyDisplay] = useState<string | null>(null);
  const [copiedNewKey, setCopiedNewKey] = useState(false);

  // Edit modals
  const [editBudgetKey, setEditBudgetKey] = useState<ApiKeyItem | null>(null);
  const [budgetValue, setBudgetValue] = useState('');
  const [resetKeyModal, setResetKeyModal] = useState<ApiKeyItem | null>(null);
  const [resetKeyResult, setResetKeyResult] = useState<string | null>(null);
  const [copiedResetKey, setCopiedResetKey] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('costio_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ---------- Data fetching ----------
  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api-keys`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('获取 API Key 列表失败');
      const data = await res.json();
      setApiKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取 API Key 列表失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      /* silent */
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/members`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : data.members ?? []);
    } catch {
      /* silent */
    }
  }, []);

  const fetchAnalytics = async (keyId: number) => {
    setIsLoadingAnalytics(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.set('start_date', dateRange.start);
      if (dateRange.end) params.set('end_date', dateRange.end);
      params.set('group_by', groupBy);
      
      const res = await fetch(`${API_BASE}/api-keys/${keyId}/analytics?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('获取分析数据失败');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      showToast('获取分析数据失败', 'error');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    fetchProjects();
    fetchMembers();
  }, [fetchApiKeys, fetchProjects, fetchMembers]);

  // ---------- Handlers ----------
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);
    try {
      const payload: Record<string, unknown> = {
        name: createForm.name,
        key_type: createForm.type,
        project_id: createForm.project_id,
        monthly_budget: createForm.monthly_budget,
      };
      if (createForm.type === 'user' && createForm.user_id) {
        payload.user_id = createForm.user_id;
      }
      const res = await fetch(`${API_BASE}/api-keys`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '创建 API Key 失败');
      }
      const data = await res.json();
      setNewKeyDisplay(data.key ?? null);
      showToast('API Key 创建成功');
      fetchApiKeys();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : '创建 API Key 失败');
    } finally {
      setIsCreating(false);
    }
  };

  const handleBatchAction = async (action: string, settings?: Record<string, unknown>) => {
    if (selectedKeys.size === 0) return;
    
    try {
      const res = await fetch(`${API_BASE}/api-keys/batch`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action,
          key_ids: Array.from(selectedKeys),
          settings,
        }),
      });
      if (!res.ok) throw new Error('批量操作失败');
      const data = await res.json();
      showToast(`批量操作完成：${data.results.success.length} 成功`);
      setSelectedKeys(new Set());
      setShowBatchActions(false);
      fetchApiKeys();
    } catch (err) {
      showToast('批量操作失败', 'error');
    }
  };

  const handleSingleAction = async (keyId: number, action: string) => {
    try {
      let endpoint = '';
      let method = 'PUT';
      
      switch (action) {
        case 'pause':
          endpoint = `/api-keys/${keyId}/pause`;
          break;
        case 'activate':
          endpoint = `/api-keys/${keyId}/activate`;
          break;
        case 'revoke':
          endpoint = `/api-keys/${keyId}/revoke`;
          break;
        case 'reset':
          endpoint = `/api-keys/${keyId}/reset`;
          method = 'POST';
          break;
        default:
          return;
      }
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) throw new Error('操作失败');
      const data = await res.json();
      
      if (action === 'reset') {
        setResetKeyResult(data.key);
        showToast('API Key 已重置');
      } else {
        showToast(action === 'pause' ? '已暂停' : action === 'activate' ? '已启用' : '已吊销');
      }
      fetchApiKeys();
    } catch (err) {
      showToast('操作失败', 'error');
    }
  };

  const handleUpdateBudget = async () => {
    if (!editBudgetKey) return;
    try {
      const res = await fetch(`${API_BASE}/api-keys/${editBudgetKey.id}/budget`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ monthly_budget: parseFloat(budgetValue) || null }),
      });
      if (!res.ok) throw new Error('更新预算失败');
      showToast('预算更新成功');
      setEditBudgetKey(null);
      fetchApiKeys();
    } catch (err) {
      showToast('更新预算失败', 'error');
    }
  };

  const toggleKeySelection = (keyId: number) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(keyId)) {
      newSelected.delete(keyId);
    } else {
      newSelected.add(keyId);
    }
    setSelectedKeys(newSelected);
    setShowBatchActions(newSelected.size > 0);
  };

  const selectAllKeys = () => {
    if (selectedKeys.size === filteredKeys.length) {
      setSelectedKeys(new Set());
      setShowBatchActions(false);
    } else {
      setSelectedKeys(new Set(filteredKeys.map(k => k.id)));
      setShowBatchActions(true);
    }
  };

  const copyToClipboard = async (text: string, type: 'new' | 'reset' = 'new') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'new') {
        setCopiedNewKey(true);
        setTimeout(() => setCopiedNewKey(false), 2000);
      } else {
        setCopiedResetKey(true);
        setTimeout(() => setCopiedResetKey(false), 2000);
      }
      showToast('已复制到剪贴板');
    } catch {
      showToast('复制失败', 'error');
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({ project_id: null, type: 'project', name: '', user_id: null });
    setCreateError(null);
    setNewKeyDisplay(null);
    setCopiedNewKey(false);
  };

  const closeResetModal = () => {
    setResetKeyModal(null);
    setResetKeyResult(null);
    setCopiedResetKey(false);
  };

  const openAnalytics = (key: ApiKeyItem) => {
    setAnalyticsKey(key);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
    fetchAnalytics(key.id);
  };

  const formatCurrency = (value: number) => {
    return `$${(value || 0).toFixed(4)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value?.toString() || '0';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '从未使用';
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>活跃</span>;
      case 'paused':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></span>已暂停</span>;
      case 'revoked':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>已吊销</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-surface-100 text-surface-600">{status}</span>;
    }
  };

  // ---------- Filtering & Sorting ----------
  const filteredKeys = apiKeys.filter((k) => {
    const matchSearch =
      k.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.project ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.owner ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchProject = filterProject === 'all' || k.project_id === filterProject;
    const matchStatus = filterStatus === 'all' || k.status === filterStatus;
    const matchType = filterType === 'all' || k.type === filterType;
    return matchSearch && matchProject && matchStatus && matchType;
  }).sort((a, b) => {
    let aVal: number | string = '';
    let bVal: number | string = '';
    switch (sortBy) {
      case 'name':
        aVal = a.name || '';
        bVal = b.name || '';
        break;
      case 'cost':
        aVal = a.total_cost || 0;
        bVal = b.total_cost || 0;
        break;
      case 'requests':
        aVal = a.request_count || 0;
        bVal = b.request_count || 0;
        break;
      case 'last_used':
        aVal = a.last_used || '';
        bVal = b.last_used || '';
        break;
      case 'created':
        aVal = a.created_at || '';
        bVal = b.created_at || '';
        break;
    }
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Calculate summary stats
  const summaryStats = {
    total: apiKeys.length,
    active: apiKeys.filter(k => k.status === 'active').length,
    paused: apiKeys.filter(k => k.status === 'paused').length,
    revoked: apiKeys.filter(k => k.status === 'revoked').length,
    totalCost: apiKeys.reduce((sum, k) => sum + (k.total_cost || 0), 0),
    totalRequests: apiKeys.reduce((sum, k) => sum + (k.request_count || 0), 0),
  };

  // ---------- Render ----------
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.layout.apiKeys}</h1>
          <p className="text-sm text-surface-500 mt-1">{t.apiKeys.subtitle}</p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-1.5 self-start" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-3.5 h-3.5" /> {t.apiKeys.createKey}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-surface-500">{t.layout.apiKeys}</span>
          </div>
          <p className="text-2xl font-bold">{summaryStats.total}</p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-emerald-600">{summaryStats.active} {t.common.active}</span>
            <span className="text-surface-300">|</span>
            <span className="text-amber-600">{summaryStats.paused} {t.common.paused}</span>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-surface-500">总花费</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalCost)}</p>
          <p className="text-xs text-surface-400 mt-1">所有 Keys 累计</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-surface-500">总请求</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(summaryStats.totalRequests)}</p>
          <p className="text-xs text-surface-400 mt-1">所有 Keys 累计</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-surface-500">已吊销</span>
          </div>
          <p className="text-2xl font-bold">{summaryStats.revoked}</p>
          <p className="text-xs text-surface-400 mt-1">不可恢复</p>
        </div>
      </div>

      {/* Batch Actions Bar */}
      {showBatchActions && (
        <div className="card p-3 bg-blue-50 border-blue-200 flex items-center justify-between">
          <span className="text-sm text-blue-800">已选择 {selectedKeys.size} 个 API Key</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBatchAction('pause')} className="btn-secondary text-xs flex items-center gap-1">
              <Pause className="w-3.5 h-3.5" /> 暂停
            </button>
            <button onClick={() => handleBatchAction('activate')} className="btn-secondary text-xs flex items-center gap-1">
              <Play className="w-3.5 h-3.5" /> 启用
            </button>
            <button onClick={() => handleBatchAction('revoke')} className="btn-secondary text-xs flex items-center gap-1 text-red-600 hover:text-red-700">
              <Trash2 className="w-3.5 h-3.5" /> 吊销
            </button>
            <button onClick={() => setSelectedKeys(new Set())} className="text-xs text-surface-500 hover:text-surface-700">
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="搜索 API Key 名称、项目、归属者..."
                className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="text-sm border border-surface-200 rounded-lg px-3 py-2"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">全部项目</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            className="text-sm border border-surface-200 rounded-lg px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="paused">已暂停</option>
            <option value="revoked">已吊销</option>
          </select>
          <select
            className="text-sm border border-surface-200 rounded-lg px-3 py-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">全部类型</option>
            <option value="project">项目 Key</option>
            <option value="user">个人 Key</option>
          </select>
          <select
            className="text-sm border border-surface-200 rounded-lg px-3 py-2"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
          >
            <option value="cost-desc">按花费排序 (高→低)</option>
            <option value="cost-asc">按花费排序 (低→高)</option>
            <option value="requests-desc">按请求数排序</option>
            <option value="last_used-desc">按最近使用排序</option>
            <option value="created-desc">按创建时间排序</option>
            <option value="name-asc">按名称排序</option>
          </select>
        </div>
      </div>

      {/* API Keys Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : error ? (
        <div className="card p-8 text-center text-red-500">{error}</div>
      ) : filteredKeys.length === 0 ? (
        <div className="card p-12 text-center">
          <Key className="w-12 h-12 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-medium text-surface-600 mb-2">暂无 API Key</h3>
          <p className="text-sm text-surface-400 mb-4">创建您的第一个 API Key 开始使用</p>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            创建 Key
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={selectAllKeys} className="flex items-center gap-1 text-xs font-medium text-surface-600 hover:text-surface-800">
                    {selectedKeys.size === filteredKeys.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-600">API Key</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-600">项目/归属</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-surface-600">花费</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-surface-600">请求数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-surface-600">预算使用</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-600">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-600">最后使用</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-surface-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((key) => (
                <tr key={key.id} className="border-b border-surface-100 hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleKeySelection(key.id)} className="text-surface-400 hover:text-brand-600">
                      {selectedKeys.has(key.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-surface-800">{key.name}</p>
                      <p className="text-xs text-surface-400 font-mono">{key.key_prefix}...</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-surface-600">{key.project || '-'}</div>
                    <div className="text-xs text-surface-400">{key.owner || '-'}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-surface-800">{formatCurrency(key.total_cost || 0)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-surface-600">{formatNumber(key.request_count || 0)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {key.monthly_budget ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-sm ${(key.budget_usage || 0) > 90 ? 'text-red-600' : (key.budget_usage || 0) > 70 ? 'text-amber-600' : 'text-surface-600'}`}>
                          {(key.budget_usage || 0).toFixed(1)}%
                        </span>
                        <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(key.budget_usage || 0) > 90 ? 'bg-red-500' : (key.budget_usage || 0) > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(key.budget_usage || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-surface-400">未设置</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(key.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-500">
                    {formatDate(key.last_used || '')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openAnalytics(key)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="查看统计">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditBudgetKey(key); setBudgetValue(key.monthly_budget?.toString() || ''); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600" title="设置预算">
                        <DollarSign className="w-4 h-4" />
                      </button>
                      {key.status === 'active' ? (
                        <button onClick={() => handleSingleAction(key.id, 'pause')} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600" title="暂停">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : key.status === 'paused' ? (
                        <button onClick={() => handleSingleAction(key.id, 'activate')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600" title="启用">
                          <Play className="w-4 h-4" />
                        </button>
                      ) : null}
                      <button onClick={() => setResetKeyModal(key)} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600" title="重置">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      {key.status !== 'revoked' && (
                        <button onClick={() => handleSingleAction(key.id, 'revoke')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="吊销">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">创建 API Key</h2>
              <button onClick={closeCreateModal}><X className="w-5 h-5 text-surface-400" /></button>
            </div>
            
            {newKeyDisplay ? (
              <div className="p-6 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <Check className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                  <h3 className="text-lg font-semibold text-emerald-800 mb-1">创建成功</h3>
                  <p className="text-sm text-emerald-600 mb-4">请立即复制您的 API Key，此密钥仅显示一次</p>
                </div>
                <div className="bg-surface-100 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-sm font-mono text-surface-700 break-all">{newKeyDisplay}</code>
                  <button onClick={() => copyToClipboard(newKeyDisplay!)} className="ml-2 p-2 rounded-lg hover:bg-surface-200 text-surface-500">
                    {copiedNewKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button onClick={closeCreateModal} className="w-full btn-primary">完成</button>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="p-6 space-y-4">
                {createError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{createError}</div>}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">名称 *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="例如：生产环境 Key"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">类型</label>
                  <select
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as 'project' | 'user' })}
                  >
                    <option value="project">项目 Key</option>
                    <option value="user">个人 Key</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">项目 *</label>
                  <select
                    required
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={createForm.project_id || ''}
                    onChange={(e) => setCreateForm({ ...createForm, project_id: parseInt(e.target.value) })}
                  >
                    <option value="">选择项目</option>
                    {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>
                {createForm.type === 'user' && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">归属成员</label>
                    <select
                      className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      value={createForm.user_id || ''}
                      onChange={(e) => setCreateForm({ ...createForm, user_id: parseInt(e.target.value) || null })}
                    >
                      <option value="">选择成员</option>
                      {members.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">月度预算（可选）</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="例如：100"
                    value={createForm.monthly_budget || ''}
                    onChange={(e) => setCreateForm({ ...createForm, monthly_budget: parseFloat(e.target.value) || undefined })}
                  />
                  <p className="text-xs text-surface-400 mt-1">达到预算上限后将自动暂停该 Key</p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
                  <button type="submit" disabled={isCreating} className="btn-primary disabled:opacity-50">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : '创建'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editBudgetKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4">设置月度预算</h2>
            <p className="text-sm text-surface-600 mb-4">{editBudgetKey.name}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 mb-1">预算金额（USD）</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="0.00"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
              />
              <p className="text-xs text-surface-400 mt-1">留空表示不限制</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditBudgetKey(null)} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handleUpdateBudget} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Key Modal */}
      {resetKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
            {!resetKeyResult ? (
              <>
                <h2 className="text-lg font-semibold mb-2">重置 API Key</h2>
                <p className="text-sm text-surface-600 mb-4">{resetKeyModal.name}</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">警告</p>
                      <p className="text-sm text-amber-700">重置后旧 Key 将立即失效，所有使用旧 Key 的请求都会失败。请确保您已准备好更新相关配置。</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setResetKeyModal(null)} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
                  <button 
                    onClick={() => handleSingleAction(resetKeyModal.id, 'reset')} 
                    className="btn-primary bg-red-600 hover:bg-red-700"
                  >
                    确认重置
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center mb-4">
                  <Check className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                  <h3 className="text-lg font-semibold text-emerald-800 mb-1">重置成功</h3>
                  <p className="text-sm text-emerald-600">请立即复制新的 API Key</p>
                </div>
                <div className="bg-surface-100 rounded-lg p-3 flex items-center justify-between mb-4">
                  <code className="text-sm font-mono text-surface-700 break-all">{resetKeyResult}</code>
                  <button onClick={() => copyToClipboard(resetKeyResult, 'reset')} className="ml-2 p-2 rounded-lg hover:bg-surface-200 text-surface-500">
                    {copiedResetKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button onClick={closeResetModal} className="w-full btn-primary">完成</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold">{analyticsKey.name} - 使用统计</h2>
                <p className="text-sm text-surface-500">详细的使用分析和成本统计</p>
              </div>
              <button onClick={() => setAnalyticsKey(null)}><X className="w-5 h-5 text-surface-400" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Date Range */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-surface-400" />
                  <input
                    type="date"
                    className="border border-surface-200 rounded-lg px-3 py-1.5 text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <span className="text-surface-400">至</span>
                  <input
                    type="date"
                    className="border border-surface-200 rounded-lg px-3 py-1.5 text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
                <select
                  className="border border-surface-200 rounded-lg px-3 py-1.5 text-sm"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                >
                  <option value="day">按天</option>
                  <option value="week">按周</option>
                  <option value="month">按月</option>
                </select>
                <button onClick={() => fetchAnalytics(analyticsKey.id)} className="btn-secondary text-xs flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  刷新
                </button>
              </div>

              {isLoadingAnalytics ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                </div>
              ) : analyticsData ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-surface-500">总花费</span>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(analyticsData.summary.total_cost)}</p>
                      {analyticsData.summary.total_savings > 0 && (
                        <p className="text-xs text-emerald-600 mt-1">节省 {formatCurrency(analyticsData.summary.total_savings)}</p>
                      )}
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-violet-600" />
                        <span className="text-xs text-surface-500">请求数</span>
                      </div>
                      <p className="text-xl font-bold">{formatNumber(analyticsData.summary.request_count)}</p>
                      <p className="text-xs text-surface-400 mt-1">{formatNumber(analyticsData.summary.total_tokens)} tokens</p>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-surface-500">平均延迟</span>
                      </div>
                      <p className="text-xl font-bold">{(analyticsData.summary.avg_latency / 1000).toFixed(2)}s</p>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-surface-500">缓存命中率</span>
                      </div>
                      <p className="text-xl font-bold">{analyticsData.summary.cache_hit_rate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Trend Chart Placeholder */}
                  {analyticsData.trend.length > 0 && (
                    <div className="card p-4">
                      <h3 className="text-sm font-semibold mb-4">使用趋势</h3>
                      <div className="h-48 flex items-end gap-1">
                        {analyticsData.trend.slice(-30).map((item, idx) => {
                          const maxCost = Math.max(...analyticsData.trend.map(t => t.cost)) || 1;
                          const height = (item.cost / maxCost) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                className="w-full bg-brand-500 rounded-t" 
                                style={{ height: `${Math.max(height, 2)}%` }}
                                title={`${item.period}: ${formatCurrency(item.cost)}`}
                              />
                              {idx % 5 === 0 && (
                                <span className="text-[10px] text-surface-400 rotate-45 origin-left">{item.period.slice(5)}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Model Distribution */}
                  {analyticsData.by_model.length > 0 && (
                    <div className="card p-4">
                      <h3 className="text-sm font-semibold mb-4">模型使用分布</h3>
                      <div className="space-y-3">
                        {analyticsData.by_model.map((model) => (
                          <div key={model.model} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{model.model}</span>
                                <span className="text-sm text-surface-500">{formatCurrency(model.cost)}</span>
                              </div>
                              <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${Math.min((model.cost / (analyticsData.summary.total_cost || 1)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="ml-4 text-right min-w-[80px]">
                              <p className="text-xs text-surface-500">{formatNumber(model.requests)} 请求</p>
                              <p className="text-xs text-surface-400">{(model.avg_latency / 1000).toFixed(2)}s 平均</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Usage */}
                  {analyticsData.recent_usage.length > 0 && (
                    <div className="card p-4">
                      <h3 className="text-sm font-semibold mb-4">最近使用记录</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-surface-500 border-b">
                            <tr>
                              <th className="text-left py-2">时间</th>
                              <th className="text-left py-2">项目</th>
                              <th className="text-left py-2">模型</th>
                              <th className="text-right py-2">Token</th>
                              <th className="text-right py-2">花费</th>
                              <th className="text-right py-2">延迟</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.recent_usage.slice(0, 10).map((usage) => (
                              <tr key={usage.id} className="border-b border-surface-50">
                                <td className="py-2 text-surface-600">{new Date(usage.timestamp).toLocaleString()}</td>
                                <td className="py-2">{usage.project}</td>
                                <td className="py-2">{usage.model}</td>
                                <td className="py-2 text-right">{formatNumber(usage.prompt_tokens + usage.completion_tokens)}</td>
                                <td className="py-2 text-right">{formatCurrency(usage.cost)}</td>
                                <td className="py-2 text-right">{(usage.latency / 1000).toFixed(2)}s</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Anomalies */}
                  {analyticsData.anomalies.length > 0 && (
                    <div className="card p-4 bg-red-50 border-red-100">
                      <h3 className="text-sm font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        异常检测 ({analyticsData.anomalies.length})
                      </h3>
                      <div className="space-y-2">
                        {analyticsData.anomalies.slice(0, 5).map((anomaly) => (
                          <div key={anomaly.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-red-700">{anomaly.reason === 'high_latency' ? '高延迟' : '高成本'}</span>
                              <span className="text-surface-500 ml-2">{anomaly.model}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-red-600">{formatCurrency(anomaly.cost)}</p>
                              <p className="text-xs text-surface-400">{(anomaly.latency / 1000).toFixed(2)}s</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-surface-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                  <p>暂无数据</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
