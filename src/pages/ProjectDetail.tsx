import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Copy, Key, Users, AlertTriangle, Check, X, Pause, Play, RotateCw, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3001/api';

const ROUTING_LABELS: Record<string, string> = { cost_saver: '成本优先', balanced: '平衡模式', quality: '质量优先' };
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: '活跃', color: 'bg-emerald-100 text-emerald-700' },
  paused: { label: '已暂停', color: 'bg-amber-100 text-amber-700' },
  revoked: { label: '已吊销', color: 'bg-red-100 text-red-700' }
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [newKeyModal, setNewKeyModal] = useState<{ open: boolean; key: string }>({ open: false, key: '' });
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [keyStats, setKeyStats] = useState<any>(null);
  const [keyStatsModal, setKeyStatsModal] = useState(false);
  const [budgetModal, setBudgetModal] = useState<{ open: boolean; keyId: number; budget: string }>({ open: false, keyId: 0, budget: '' });
  const [resetConfirm, setResetConfirm] = useState<{ open: boolean; keyId: number; keyName: string }>({ open: false, keyId: 0, keyName: '' });
  const [revokeConfirm, setRevokeConfirm] = useState<{ open: boolean; keyId: number; keyName: string }>({ open: false, keyId: 0, keyName: '' });
  const [pauseConfirm, setPauseConfirm] = useState<{ open: boolean; keyId: number; keyName: string }>({ open: false, keyId: 0, keyName: '' });
  const [newKeyAfterReset, setNewKeyAfterReset] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    if (!id || !token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('项目不存在');
      const data = await res.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('更新失败');
      showToast('项目已更新');
      setEditModal(false);
      fetchData();
    } catch (err) {
      showToast('更新失败', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('删除失败');
      showToast('项目已删除');
      navigate('/projects');
    } catch (err) {
      showToast('删除失败', 'error');
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await fetch(`${API_BASE}/api-keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(id!), name: `key-${Date.now()}`, key_type: 'project' })
      });
      if (!res.ok) throw new Error('生成失败');
      const data = await res.json();
      setNewKeyModal({ open: true, key: data.key });
      showToast('API Key 已生成');
      fetchData();
    } catch (err) {
      showToast('生成失败', 'error');
    }
  };

  const handlePauseKey = async () => {
    if (!pauseConfirm.keyId) return;
    try {
      const res = await fetch(`${API_BASE}/api-keys/${pauseConfirm.keyId}/pause`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('暂停失败');
      showToast('API Key 已暂停');
      setPauseConfirm({ open: false, keyId: 0, keyName: '' });
      fetchData();
    } catch (err) {
      showToast('暂停失败', 'error');
    }
  };

  const handleActivateKey = async (keyId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api-keys/${keyId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('启用失败');
      showToast('API Key 已启用');
      fetchData();
    } catch (err) {
      showToast('启用失败', 'error');
    }
  };

  const handleRevokeKey = async () => {
    if (!revokeConfirm.keyId) return;
    try {
      const res = await fetch(`${API_BASE}/api-keys/${revokeConfirm.keyId}/revoke`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('吊销失败');
      showToast('API Key 已吊销');
      setRevokeConfirm({ open: false, keyId: 0, keyName: '' });
      fetchData();
    } catch (err) {
      showToast('吊销失败', 'error');
    }
  };

  const handleResetKey = async () => {
    if (!resetConfirm.keyId) return;
    try {
      const res = await fetch(`${API_BASE}/api-keys/${resetConfirm.keyId}/reset`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('重置失败');
      const data = await res.json();
      setNewKeyAfterReset(data.key);
      showToast('API Key 已重置');
      setResetConfirm({ open: false, keyId: 0, keyName: '' });
      fetchData();
    } catch (err) {
      showToast('重置失败', 'error');
    }
  };

  const handleUpdateBudget = async () => {
    if (!budgetModal.keyId) return;
    try {
      const res = await fetch(`${API_BASE}/api-keys/${budgetModal.keyId}/budget`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_budget: budgetModal.budget ? parseFloat(budgetModal.budget) : null })
      });
      if (!res.ok) throw new Error('更新失败');
      showToast('预算已更新');
      setBudgetModal({ open: false, keyId: 0, budget: '' });
      fetchData();
    } catch (err) {
      showToast('更新失败', 'error');
    }
  };

  const fetchKeyStats = async (key: any) => {
    try {
      setSelectedKey(key);
      setKeyStatsModal(true);
      const res = await fetch(`${API_BASE}/api-keys/${key.id}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('获取统计失败');
      const data = await res.json();
      setKeyStats(data);
    } catch (err) {
      showToast('获取统计失败', 'error');
      setKeyStatsModal(false);
      setSelectedKey(null);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}/members`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(selectedUserId) })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      showToast('成员已添加');
      setAddMemberModal(false);
      setSelectedUserId('');
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : '添加失败', 'error');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await fetch(`${API_BASE}/projects/${id}/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('成员已移除');
      fetchData();
    } catch (err) {
      showToast('移除失败', 'error');
    }
  };

  const openAddMember = async () => {
    try {
      const res = await fetch(`${API_BASE}/members`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAllMembers(data);
      setAddMemberModal(true);
    } catch (err) { /* ignore */ }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(''), 2000);
    showToast('已复制');
  };

  if (isLoading) return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;
  if (error || !project) return <div className="p-6 text-center"><p className="text-red-500">{error}</p><button onClick={() => navigate('/projects')} className="mt-4 text-brand-600">返回项目列表</button></div>;

  return (
    <div className="p-6">
      {toast.show && <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>{toast.message}</div>}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/projects')} className="p-2 rounded-lg hover:bg-surface-100"><ArrowLeft className="w-5 h-5 text-surface-600" /></button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-surface-900">{project.name}</h1>
          <p className="text-sm text-surface-500">{project.description || '暂无描述'}</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button onClick={() => { setFormData({ name: project.name, description: project.description, monthly_budget: project.monthly_budget, routing_profile: project.routing_profile, max_tokens_per_request: project.max_tokens_per_request, default_model: project.default_model, models: project.models ? project.models.split(',').filter(Boolean) : [project.default_model || 'gpt-4o-mini'] }); setEditModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-surface-200 rounded-lg text-sm hover:bg-surface-50"><Edit className="w-3.5 h-3.5" /> 编辑</button>
            <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> 删除</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="card p-3"><p className="text-xs text-surface-500 mb-1">路由策略</p><p className="text-sm font-semibold text-surface-900">{ROUTING_LABELS[project.routing_profile] || project.routing_profile}</p></div>
        <div className="card p-3">
          <p className="text-xs text-surface-500 mb-1">支持模型</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {project.models ? project.models.split(',').filter(Boolean).map((m: string) => (
              <span key={m} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${m === project.default_model ? 'bg-brand-50 text-brand-700' : 'bg-surface-100 text-surface-600'}`}>{m}</span>
            )) : <span className="text-sm">{project.default_model}</span>}
          </div>
        </div>
        <div className="card p-3"><p className="text-xs text-surface-500 mb-1">默认模型</p><p className="text-sm font-semibold text-surface-900">{project.default_model}</p></div>
        <div className="card p-3"><p className="text-xs text-surface-500 mb-1">本月花费</p><p className="text-sm font-semibold text-surface-900">${project.month_spend?.toFixed(2)}</p></div>
        <div className="card p-3">
          <p className="text-xs text-surface-500 mb-1">预算使用</p>
          {project.monthly_budget ? (
            <div>
              <div className="flex items-center gap-1"><span className="text-sm font-semibold">{project.budget_percentage?.toFixed(1)}%</span><span className="text-xs text-surface-400">/ ${parseFloat(project.monthly_budget).toFixed(0)}</span></div>
              <div className="mt-1 h-1.5 bg-surface-100 rounded-full"><div className={`h-full rounded-full ${project.budget_percentage < 80 ? 'bg-emerald-500' : project.budget_percentage < 100 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(project.budget_percentage, 100)}%` }}></div></div>
            </div>
          ) : <p className="text-sm text-surface-400">未设置</p>}
        </div>
      </div>

      {/* API Keys 详细管理 */}
      <div className="card mb-6">
        <div className="flex items-center justify-between card-header">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-surface-500" />
            <h3 className="text-sm font-semibold text-surface-800">API Keys</h3>
            <span className="text-xs text-surface-400">({project.api_keys?.length || 0})</span>
          </div>
          {isAdmin && <button onClick={handleGenerateKey} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700"><Plus className="w-3.5 h-3.5" /> 生成 Key</button>}
        </div>
        {project.api_keys?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-surface-500">名称</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-surface-500">归属者</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-surface-500">本月花费</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-surface-500">预算</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-surface-500">请求数</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-surface-500">状态</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-surface-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {project.api_keys.map((k: any) => (
                  <tr key={k.id} className="border-b border-surface-100 hover:bg-surface-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-surface-400" />
                        <div>
                          <p className="text-xs font-medium text-surface-800">{k.name || '未命名'}</p>
                          <p className="text-[10px] font-mono text-surface-400">{k.key?.substring(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {k.User ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-semibold text-brand-700">{k.User.name?.[0]}</div>
                          <span className="text-xs text-surface-600">{k.User.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400">项目级</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className="text-xs font-medium">${(k.monthly_spend || 0).toFixed(4)}</span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {k.monthly_budget ? (
                        <div>
                          <span className="text-xs">${parseFloat(k.monthly_budget).toFixed(0)}</span>
                          <div className="w-16 h-1 bg-surface-100 rounded-full ml-auto mt-0.5">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.min((k.monthly_spend / parseFloat(k.monthly_budget)) * 100, 100)}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className="text-xs">{(k.total_requests || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[k.status]?.color || 'bg-surface-100 text-surface-500'}`}>
                        {STATUS_LABELS[k.status]?.label || k.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => fetchKeyStats(k)} className="p-1 rounded hover:bg-surface-100" title="查看统计">
                          <BarChart3 className="w-3.5 h-3.5 text-surface-500" />
                        </button>
                        {k.status === 'active' && (
                          <button onClick={() => setPauseConfirm({ open: true, keyId: k.id, keyName: k.name || '未命名' })} className="p-1 rounded hover:bg-amber-50" title="暂停">
                            <Pause className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                        )}
                        {k.status === 'paused' && (
                          <button onClick={() => handleActivateKey(k.id)} className="p-1 rounded hover:bg-emerald-50" title="启用">
                            <Play className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        )}
                        <button onClick={() => setResetConfirm({ open: true, keyId: k.id, keyName: k.name || '未命名' })} className="p-1 rounded hover:bg-blue-50" title="重置 Key">
                          <RotateCw className="w-3.5 h-3.5 text-blue-500" />
                        </button>
                        <button onClick={() => setBudgetModal({ open: true, keyId: k.id, budget: k.monthly_budget ? k.monthly_budget.toString() : '' })} className="p-1 rounded hover:bg-purple-50" title="设置预算">
                          <DollarSign className="w-3.5 h-3.5 text-purple-500" />
                        </button>
                        {k.status !== 'revoked' && (
                          <button onClick={() => setRevokeConfirm({ open: true, keyId: k.id, keyName: k.name || '未命名' })} className="p-1 rounded hover:bg-red-50" title="吊销">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-surface-400 text-center py-8">暂无 API Key</p>}
      </div>

      {/* 项目成员 */}
      <div className="card mb-6">
        <div className="flex items-center justify-between card-header">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-surface-500" />
            <h3 className="text-sm font-semibold text-surface-800">项目成员</h3>
            <span className="text-xs text-surface-400">({project.members?.length || 0})</span>
          </div>
          {isAdmin && <button onClick={openAddMember} className="flex items-center gap-1 px-2 py-1 text-xs text-brand-600 hover:bg-brand-50 rounded"><Plus className="w-3 h-3" /> 添加</button>}
        </div>
        <div className="p-3">
          {project.members?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {project.members.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 bg-surface-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">{m.User?.name?.[0] || '?'}</div>
                    <div>
                      <p className="text-xs font-medium text-surface-800">{m.User?.name}</p>
                      <p className="text-[10px] text-surface-500">{m.User?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-200 text-surface-600">{m.role === 'admin' ? '管理员' : '成员'}</span>
                    {isAdmin && m.role !== 'admin' && (
                      <button onClick={() => handleRemoveMember(m.user_id)} className="text-[10px] text-red-500 hover:text-red-700">移除</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-surface-400 text-center py-4">暂无成员</p>}
        </div>
      </div>

      {/* 项目配置 */}
      <div className="card">
        <div className="card-header"><h3 className="text-sm font-semibold text-surface-800">项目配置</h3></div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-xs text-surface-500">Max Tokens / 请求</p><p className="font-medium">{project.max_tokens_per_request?.toLocaleString()}</p></div>
          <div><p className="text-xs text-surface-500">路由策略</p><p className="font-medium">{ROUTING_LABELS[project.routing_profile]}</p></div>
          <div><p className="text-xs text-surface-500">状态</p><p className="font-medium">{project.status === 'active' ? '活跃' : '已禁用'}</p></div>
          <div><p className="text-xs text-surface-500">本月节省</p><p className="font-medium text-emerald-600">${project.month_savings?.toFixed(2)}</p></div>
          <div><p className="text-xs text-surface-500">总请求数</p><p className="font-medium">{(project.api_keys?.reduce((sum: number, k: any) => sum + (k.total_requests || 0), 0) || 0).toLocaleString()}</p></div>
          <div><p className="text-xs text-surface-500">总 Token</p><p className="font-medium">{(project.api_keys?.reduce((sum: number, k: any) => sum + (k.total_tokens || 0), 0) || 0).toLocaleString()}</p></div>
          <div><p className="text-xs text-surface-500">API Key 数</p><p className="font-medium">{project.api_keys?.length || 0}</p></div>
          <div><p className="text-xs text-surface-500">成员数</p><p className="font-medium">{project.members?.length || 0}</p></div>
        </div>
      </div>

      {/* 编辑项目模态框 */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b"><h2 className="text-base font-semibold">编辑项目</h2><button onClick={() => setEditModal(false)}><X className="w-4 h-4 text-surface-400" /></button></div>
            <form onSubmit={handleUpdate} className="p-5 space-y-3">
              <div><label className="block text-xs font-medium text-surface-700 mb-1">名称</label><input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2" required /></div>
              <div><label className="block text-xs font-medium text-surface-700 mb-1">描述</label><textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2" rows={2} /></div>
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1">支持的模型</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'gpt-4o', name: 'GPT-4o' },
                    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
                    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
                    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
                    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
                    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
                  ].map(m => {
                    const checked = (formData.models || []).includes(m.id);
                    return (
                      <label key={m.id} className={`flex items-center gap-1.5 p-2 border rounded text-xs cursor-pointer ${checked ? 'border-brand-300 bg-brand-50' : 'border-surface-200'}`}>
                        <input type="checkbox" checked={checked} onChange={e => {
                          let newModels = e.target.checked ? [...(formData.models || []), m.id] : (formData.models || []).filter((x: string) => x !== m.id);
                          const newDefault = newModels.includes(formData.default_model) ? formData.default_model : newModels[0] || 'gpt-4o-mini';
                          setFormData({ ...formData, models: newModels, default_model: newDefault });
                        }} className="w-3.5 h-3.5 rounded" />
                        {m.name}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-surface-700 mb-1">默认模型</label>
                  <select value={formData.default_model} onChange={e => setFormData({ ...formData, default_model: e.target.value })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2">
                    {(formData.models || []).map((m: string) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-surface-700 mb-1">路由策略</label>
                  <select value={formData.routing_profile} onChange={e => setFormData({ ...formData, routing_profile: e.target.value })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2">
                    <option value="cost_saver">成本优先</option><option value="balanced">平衡模式</option><option value="quality">质量优先</option>
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-surface-700 mb-1">Max Tokens</label><input type="number" value={formData.max_tokens_per_request || 4096} onChange={e => setFormData({ ...formData, max_tokens_per_request: parseInt(e.target.value) })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-xs font-medium text-surface-700 mb-1">月度预算 ($)</label><input type="number" value={formData.monthly_budget || ''} onChange={e => setFormData({ ...formData, monthly_budget: e.target.value })} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 rounded-lg">取消</button>
                <button type="submit" className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div><div><h3 className="text-base font-semibold">确认删除</h3><p className="text-xs text-surface-500">此操作无法撤销</p></div></div>
            <p className="text-sm text-surface-600 mb-4">删除项目 "{project.name}" 及其所有 API Key、使用记录？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* 新 Key 展示 */}
      {newKeyModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b"><h2 className="text-base font-semibold">API Key 已生成</h2><button onClick={() => setNewKeyModal({ open: false, key: '' })}><X className="w-4 h-4 text-surface-400" /></button></div>
            <div className="p-5">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3"><p className="text-xs text-red-700 font-medium mb-2">请立即复制，关闭后无法再次查看</p>
                <div className="flex items-center gap-2"><code className="flex-1 text-xs font-mono bg-white border border-red-200 rounded px-2 py-1.5 select-all break-all">{newKeyModal.key}</code>
                  <button onClick={() => copyToClipboard(newKeyModal.key)} className="p-1.5 rounded hover:bg-red-100">{copiedKey === newKeyModal.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-red-500" />}</button>
                </div>
              </div>
              <button onClick={() => { copyToClipboard(newKeyModal.key); setNewKeyModal({ open: false, key: '' }); }} className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">复制并关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* 重置后新 Key 展示 */}
      {newKeyAfterReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b"><h2 className="text-base font-semibold">API Key 已重置</h2><button onClick={() => setNewKeyAfterReset('')}><X className="w-4 h-4 text-surface-400" /></button></div>
            <div className="p-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3"><p className="text-xs text-blue-700 font-medium mb-2">新的 API Key（旧 Key 已失效）</p>
                <div className="flex items-center gap-2"><code className="flex-1 text-xs font-mono bg-white border border-blue-200 rounded px-2 py-1.5 select-all break-all">{newKeyAfterReset}</code>
                  <button onClick={() => copyToClipboard(newKeyAfterReset)} className="p-1.5 rounded hover:bg-blue-100">{copiedKey === newKeyAfterReset ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-blue-500" />}</button>
                </div>
              </div>
              <button onClick={() => setNewKeyAfterReset('')} className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Key 统计详情 */}
      {keyStatsModal && selectedKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-base font-semibold">{selectedKey.name || '未命名'} - 使用统计</h2>
                <p className="text-xs text-surface-500">{selectedKey.key?.substring(0, 20)}...</p>
              </div>
              <button onClick={() => { setKeyStatsModal(false); setKeyStats(null); }}><X className="w-4 h-4 text-surface-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {!keyStats ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
              ) : (
                <>
                  {/* 汇总卡片 */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-surface-50 rounded-lg p-3">
                      <p className="text-xs text-surface-500">本月花费</p>
                      <p className="text-lg font-semibold">${keyStats.month_stats?.spend?.toFixed(4) || '0.0000'}</p>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-3">
                      <p className="text-xs text-surface-500">本月请求</p>
                      <p className="text-lg font-semibold">{(keyStats.month_stats?.requests || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-3">
                      <p className="text-xs text-surface-500">本月 Token</p>
                      <p className="text-lg font-semibold">{(keyStats.month_stats?.tokens || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-3">
                      <p className="text-xs text-surface-500">预算使用</p>
                      <p className="text-lg font-semibold">{(keyStats.month_stats?.budget_percentage || 0).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* 每日趋势 */}
                  {keyStats.daily_usage?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">每日使用趋势</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={keyStats.daily_usage}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip formatter={(v: any) => [`$${parseFloat(v).toFixed(4)}`, '花费']} />
                            <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* 模型分布 */}
                  {keyStats.by_model?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">模型使用分布</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={keyStats.by_model} dataKey="cost" nameKey="model" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                                {keyStats.by_model.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                              </Pie>
                              <Tooltip formatter={(v: any) => `$${parseFloat(v).toFixed(4)}`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-1">
                          {keyStats.by_model.map((m: any, i: number) => (
                            <div key={m.model} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span>{m.model}</span>
                              </div>
                              <span className="font-medium">${parseFloat(m.cost).toFixed(4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 预算设置 */}
      {budgetModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
            <h3 className="text-base font-semibold mb-3">设置月度预算</h3>
            <p className="text-xs text-surface-500 mb-3">设置此 API Key 的月度花费上限，超出后将自动暂停</p>
            <input
              type="number"
              value={budgetModal.budget}
              onChange={e => setBudgetModal({ ...budgetModal, budget: e.target.value })}
              placeholder="不设置预算"
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setBudgetModal({ open: false, keyId: 0, budget: '' })} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handleUpdateBudget} className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 重置确认 */}
      {resetConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><RotateCw className="w-5 h-5 text-blue-600" /></div><div><h3 className="text-base font-semibold">重置 API Key</h3><p className="text-xs text-surface-500">生成新的 Key</p></div></div>
            <p className="text-sm text-surface-600 mb-4">重置 "{resetConfirm.keyName}" 后，旧 Key 将立即失效，所有使用旧 Key 的调用都会失败。请确保已更新您的应用配置。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setResetConfirm({ open: false, keyId: 0, keyName: '' })} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handleResetKey} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认重置</button>
            </div>
          </div>
        </div>
      )}

      {/* 暂停确认 */}
      {pauseConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><Pause className="w-5 h-5 text-amber-600" /></div><div><h3 className="text-base font-semibold">暂停 API Key</h3><p className="text-xs text-surface-500">临时停用</p></div></div>
            <p className="text-sm text-surface-600 mb-4">暂停 "{pauseConfirm.keyName}" 后，该 Key 将无法用于 API 调用，但可以随时重新启用。确定要暂停吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPauseConfirm({ open: false, keyId: 0, keyName: '' })} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handlePauseKey} className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">确认暂停</button>
            </div>
          </div>
        </div>
      )}

      {/* 吊销确认 */}
      {revokeConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-600" /></div><div><h3 className="text-base font-semibold">吊销 API Key</h3><p className="text-xs text-surface-500">永久删除</p></div></div>
            <p className="text-sm text-surface-600 mb-4">吊销 "{revokeConfirm.keyName}" 后，该 Key 将永久失效且无法恢复。所有使用该 Key 的应用将立即停止工作。此操作不可撤销，确定要吊销吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRevokeConfirm({ open: false, keyId: 0, keyName: '' })} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={handleRevokeKey} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">确认吊销</button>
            </div>
          </div>
        </div>
      )}

      {/* 添加成员 */}
      {addMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b"><h2 className="text-base font-semibold">添加成员</h2><button onClick={() => setAddMemberModal(false)}><X className="w-4 h-4 text-surface-400" /></button></div>
            <div className="p-5">
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 mb-3">
                <option value="">选择成员</option>
                {allMembers.filter((m: any) => !project.members?.some((pm: any) => pm.user_id === m.id)).map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setAddMemberModal(false)} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
                <button onClick={handleAddMember} disabled={!selectedUserId} className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50">添加</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
