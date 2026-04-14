import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Eye,
  Sparkles,
  Calendar,
  Users,
  Building2,
  Key,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001/api';

interface Report {
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'generating' | 'ready' | 'error';
  created_by: number;
  date_range_start: string;
  date_range_end: string;
  created_at: string;
  updated_at: string;
  User?: { name: string };
  ReportPermissions?: ReportPermission[];
}

interface ReportPermission {
  id: number;
  permission_type: 'user' | 'project' | 'api_key';
  permission_id: number;
  access_level: 'view' | 'edit' | 'admin';
}

const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'bg-surface-100 text-surface-600', icon: FileText },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  ready: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  error: { label: '错误', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const TYPE_CONFIG = {
  custom: { label: '自定义', color: 'bg-violet-100 text-violet-700' },
  weekly: { label: '周报', color: 'bg-blue-100 text-blue-700' },
  monthly: { label: '月报', color: 'bg-emerald-100 text-emerald-700' },
  quarterly: { label: '季报', color: 'bg-amber-100 text-amber-700' },
  roi: { label: 'ROI分析', color: 'bg-rose-100 text-rose-700' },
};

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    type: 'custom',
    date_range_start: '',
    date_range_end: '',
    permissions: [] as { type: string; id: number; name: string; level: string }[],
  });
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [apiKeys, setApiKeys] = useState<{ id: number; name: string }[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`${API_BASE}/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('获取报告列表失败');
      setReports(await res.json());
    } catch (err) {
      console.error('获取报告失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterStatus]);

  const fetchResources = useCallback(async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const [projectsRes, keysRes, membersRes] = await Promise.all([
        fetch(`${API_BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api-keys`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/members`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (keysRes.ok) setApiKeys(await keysRes.json());
      if (membersRes.ok) setMembers(await membersRes.json());
    } catch (err) {
      console.error('获取资源失败:', err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchResources();
  }, [fetchReports, fetchResources]);

  const handleCreateReport = async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newReport.name,
          description: newReport.description,
          type: newReport.type,
          date_range_start: newReport.date_range_start,
          date_range_end: newReport.date_range_end,
          permissions: newReport.permissions.map(p => ({ type: p.type, id: p.id, level: p.level })),
        }),
      });
      if (!res.ok) throw new Error('创建报告失败');
      setShowCreateModal(false);
      setNewReport({ name: '', description: '', type: 'custom', date_range_start: '', date_range_end: '', permissions: [] });
      fetchReports();
    } catch (err) {
      console.error('创建报告失败:', err);
      alert('创建报告失败');
    }
  };

  const handleGenerateReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${reportId}/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('生成报告失败');
      fetchReports();
    } catch (err) {
      console.error('生成报告失败:', err);
      alert('生成报告失败');
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('删除报告失败');
      setShowDeleteConfirm(null);
      fetchReports();
    } catch (err) {
      console.error('删除报告失败:', err);
      alert('删除报告失败');
    }
  };

  const filteredReports = reports.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPermission = (type: 'user' | 'project' | 'api_key', id: number, name: string, level: string = 'view') => {
    if (newReport.permissions.some(p => p.type === type && p.id === id)) return;
    setNewReport({ ...newReport, permissions: [...newReport.permissions, { type, id, name, level }] });
  };

  const removePermission = (type: string, id: number) => {
    setNewReport({ ...newReport, permissions: newReport.permissions.filter(p => !(p.type === type && p.id === id)) });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">分析报告</h1>
          <p className="text-sm text-surface-500 mt-1">智能分析使用数据，生成洞察报告</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          创建报告
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="搜索报告..."
                className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select className="text-sm border border-surface-200 rounded-lg px-3 py-2" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">全部类型</option>
            <option value="custom">自定义</option>
            <option value="weekly">周报</option>
            <option value="monthly">月报</option>
            <option value="quarterly">季报</option>
            <option value="roi">ROI分析</option>
          </select>
          <select className="text-sm border border-surface-200 rounded-lg px-3 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="generating">生成中</option>
            <option value="ready">已完成</option>
            <option value="error">错误</option>
          </select>
          <button onClick={() => fetchReports()} className="btn-ghost flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-medium text-surface-600 mb-2">暂无报告</h3>
          <p className="text-sm text-surface-400 mb-4">创建您的第一份 AI 驱动报告</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            创建报告
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const statusConfig = STATUS_CONFIG[report.status];
            const typeConfig = TYPE_CONFIG[report.type];
            const StatusIcon = statusConfig.icon;
            return (
              <div key={report.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/reports/${report.id}`)}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-surface-800 truncate">{report.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeConfig.color}`}>{typeConfig.label}</span>
                      </div>
                      <p className="text-xs text-surface-500 line-clamp-2">{report.description || '暂无描述'}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </div>
                  </div>
                  {report.date_range_start && (
                    <div className="flex items-center gap-2 text-xs text-surface-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.date_range_start).toLocaleDateString()} - {new Date(report.date_range_end).toLocaleDateString()}
                    </div>
                  )}
                  {report.ReportPermissions && report.ReportPermissions.length > 0 && (
                    <div className="flex items-center gap-3 mb-3 text-xs text-surface-500">
                      {report.ReportPermissions.some(p => p.permission_type === 'project') && (
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{report.ReportPermissions.filter(p => p.permission_type === 'project').length}</span>
                      )}
                      {report.ReportPermissions.some(p => p.permission_type === 'api_key') && (
                        <span className="flex items-center gap-1"><Key className="w-3 h-3" />{report.ReportPermissions.filter(p => p.permission_type === 'api_key').length}</span>
                      )}
                      {report.ReportPermissions.some(p => p.permission_type === 'user') && (
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{report.ReportPermissions.filter(p => p.permission_type === 'user').length}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                    <span className="text-xs text-surface-400">{report.User?.name || '未知'}</span>
                    <div className="flex items-center gap-1">
                      {report.status === 'draft' && (
                        <button onClick={(e) => { e.stopPropagation(); handleGenerateReport(report.id); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="生成报告">
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                      {report.status === 'ready' && (
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600" title="查看报告">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(report.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">创建新报告</h2>
              <button onClick={() => setShowCreateModal(false)}><X className="w-5 h-5 text-surface-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-surface-700 flex items-center gap-2"><FileText className="w-4 h-4" />基本信息</h3>
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">报告名称 *</label>
                  <input type="text" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" placeholder="例如：4月份使用报告" value={newReport.name} onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">描述</label>
                  <textarea className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" placeholder="报告描述..." rows={2} value={newReport.description} onChange={(e) => setNewReport({ ...newReport, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">报告类型</label>
                  <select className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" value={newReport.type} onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}>
                    <option value="custom">自定义报告</option>
                    <option value="weekly">周报</option>
                    <option value="monthly">月报</option>
                    <option value="quarterly">季报</option>
                    <option value="roi">ROI 分析报告</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-surface-700 flex items-center gap-2"><Calendar className="w-4 h-4" />数据范围</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">开始日期</label>
                    <input type="date" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" value={newReport.date_range_start} onChange={(e) => setNewReport({ ...newReport, date_range_start: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">结束日期</label>
                    <input type="date" className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" value={newReport.date_range_end} onChange={(e) => setNewReport({ ...newReport, date_range_end: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-surface-700 flex items-center gap-2"><Lock className="w-4 h-4" />数据权限<span className="text-xs text-surface-400 font-normal">（控制报告可访问的数据范围）</span></h3>
                {newReport.permissions.length > 0 && (
                  <div className="space-y-2">
                    {newReport.permissions.map((p) => (
                      <div key={`${p.type}-${p.id}`} className="flex items-center justify-between bg-surface-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          {p.type === 'project' && <Building2 className="w-4 h-4 text-blue-600" />}
                          {p.type === 'api_key' && <Key className="w-4 h-4 text-amber-600" />}
                          {p.type === 'user' && <Users className="w-4 h-4 text-violet-600" />}
                          <span className="text-sm">{p.name}</span>
                          <select className="text-xs border border-surface-200 rounded px-2 py-1" value={p.level} onChange={(e) => setNewReport({ ...newReport, permissions: newReport.permissions.map(pp => pp.type === p.type && pp.id === p.id ? { ...pp, level: e.target.value } : pp) })}>
                            <option value="view">查看</option>
                            <option value="edit">编辑</option>
                            <option value="admin">管理</option>
                          </select>
                        </div>
                        <button onClick={() => removePermission(p.type, p.id)} className="text-surface-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">添加项目</label>
                    <select className="w-full border border-surface-200 rounded-lg px-2 py-1.5 text-xs" onChange={(e) => { const project = projects.find(p => p.id === parseInt(e.target.value)); if (project) { addPermission('project', project.id, project.name); e.target.value = ''; } }}>
                      <option value="">选择项目...</option>
                      {projects.filter(p => !newReport.permissions.some(pp => pp.type === 'project' && pp.id === p.id)).map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">添加 API Key</label>
                    <select className="w-full border border-surface-200 rounded-lg px-2 py-1.5 text-xs" onChange={(e) => { const key = apiKeys.find(k => k.id === parseInt(e.target.value)); if (key) { addPermission('api_key', key.id, key.name); e.target.value = ''; } }}>
                      <option value="">选择 Key...</option>
                      {apiKeys.filter(k => !newReport.permissions.some(pp => pp.type === 'api_key' && pp.id === k.id)).map(k => (<option key={k.id} value={k.id}>{k.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">添加成员</label>
                    <select className="w-full border border-surface-200 rounded-lg px-2 py-1.5 text-xs" onChange={(e) => { const member = members.find(m => m.id === parseInt(e.target.value)); if (member) { addPermission('user', member.id, member.name); e.target.value = ''; } }}>
                      <option value="">选择成员...</option>
                      {members.filter(m => !newReport.permissions.some(pp => pp.type === 'user' && pp.id === m.id)).map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-surface-50">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm hover:bg-surface-200 rounded-lg">取消</button>
              <button onClick={handleCreateReport} disabled={!newReport.name} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                <Sparkles className="w-4 h-4 mr-2" />创建报告
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div>
              <div><h3 className="text-lg font-semibold">确认删除</h3><p className="text-sm text-surface-500">此操作不可撤销</p></div>
            </div>
            <p className="text-sm text-surface-600 mb-6">确定要删除这份报告吗？报告相关的所有数据都将被永久删除。</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm hover:bg-surface-100 rounded-lg">取消</button>
              <button onClick={() => handleDeleteReport(showDeleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}