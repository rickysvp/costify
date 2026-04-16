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
  Clock,
  Mail,
  TrendingUp,
  PieChart,
  BarChart3,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001/api';

// 报告类型定义
interface Report {
  id: number;
  name: string;
  description: string;
  type: ReportType;
  subtype: ReportSubtype;
  status: 'draft' | 'generating' | 'ready' | 'error';
  created_by: number;
  date_range_start: string;
  date_range_end: string;
  created_at: string;
  updated_at: string;
  generated_at?: string;
  schedule?: ScheduleConfig;
  metrics?: string[];
  User?: { name: string };
  ReportPermissions?: ReportPermission[];
}

type ReportType = 'cost' | 'usage' | 'roi' | 'budget' | 'anomaly' | 'comparison' | 'custom';
type ReportSubtype = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'realtime' | 'custom';

interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6, 周日到周六
  dayOfMonth?: number; // 1-31
  time: string; // HH:mm
  emailRecipients: string[];
  exportFormats: ('pdf' | 'excel' | 'markdown')[];
}

interface ReportPermission {
  id: number;
  permission_type: 'user' | 'project' | 'api_key';
  permission_id: number;
  access_level: 'view' | 'edit' | 'admin';
}

// 状态配置
const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-600', icon: FileText },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  ready: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  error: { label: '错误', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

// 报告类型配置
const REPORT_TYPE_CONFIG: Record<string, { label: string; color: string; icon: any; description: string }> = {
  // 新类型
  cost: { label: '成本分析', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp, description: '成本构成、趋势、异常检测' },
  usage: { label: '使用分析', color: 'bg-blue-100 text-blue-700', icon: BarChart3, description: 'Token使用、模型分布、效率分析' },
  roi: { label: 'ROI分析', color: 'bg-violet-100 text-violet-700', icon: PieChart, description: '投入产出比、价值评估' },
  budget: { label: '预算执行', color: 'bg-amber-100 text-amber-700', icon: Clock, description: '预算vs实际、预警分析' },
  anomaly: { label: '异常诊断', color: 'bg-rose-100 text-rose-700', icon: AlertCircle, description: '异常使用、成本突增分析' },
  comparison: { label: '对比分析', color: 'bg-cyan-100 text-cyan-700', icon: Filter, description: '项目对比、成员对比、周期对比' },
  custom: { label: '自定义', color: 'bg-slate-100 text-slate-700', icon: Sparkles, description: '自定义指标和维度' },
  // 兼容旧类型
  weekly: { label: '周报', color: 'bg-blue-100 text-blue-700', icon: BarChart3, description: '每周使用报告' },
  monthly: { label: '月报', color: 'bg-emerald-100 text-emerald-700', icon: BarChart3, description: '每月使用报告' },
  quarterly: { label: '季报', color: 'bg-amber-100 text-amber-700', icon: BarChart3, description: '每季度使用报告' },
};

// 报告周期配置
const SUBTYPE_CONFIG: Record<string, { label: string; badge: string }> = {
  daily: { label: '日报', badge: 'bg-slate-100 text-slate-600' },
  weekly: { label: '周报', badge: 'bg-blue-100 text-blue-600' },
  monthly: { label: '月报', badge: 'bg-emerald-100 text-emerald-600' },
  quarterly: { label: '季报', badge: 'bg-amber-100 text-amber-600' },
  realtime: { label: '实时', badge: 'bg-rose-100 text-rose-600' },
  custom: { label: '自定义', badge: 'bg-violet-100 text-violet-600' },
};

// 可选指标
const AVAILABLE_METRICS = {
  cost: [
    { id: 'total_cost', label: '总成本', unit: '$' },
    { id: 'avg_daily_cost', label: '日均成本', unit: '$' },
    { id: 'cost_per_request', label: '单次请求成本', unit: '$' },
    { id: 'cost_trend', label: '成本趋势', unit: '' },
    { id: 'cost_forecast', label: '成本预测', unit: '$' },
    { id: 'cost_by_project', label: '项目成本分布', unit: '' },
    { id: 'cost_by_model', label: '模型成本分布', unit: '' },
    { id: 'cost_by_member', label: '成员成本分布', unit: '' },
  ],
  usage: [
    { id: 'total_tokens', label: '总Token数', unit: '' },
    { id: 'total_requests', label: '总请求数', unit: '' },
    { id: 'avg_response_time', label: '平均响应时间', unit: 'ms' },
    { id: 'model_distribution', label: '模型使用分布', unit: '' },
    { id: 'token_efficiency', label: 'Token效率', unit: '' },
    { id: 'usage_trend', label: '使用趋势', unit: '' },
  ],
  efficiency: [
    { id: 'cache_hit_rate', label: '缓存命中率', unit: '%' },
    { id: 'routing_savings', label: '路由节省金额', unit: '$' },
    { id: 'budget_execution', label: '预算执行率', unit: '%' },
    { id: 'cost_per_1k_tokens', label: '每千Token成本', unit: '$' },
  ],
};

export default function Reports() {
  const navigate = useNavigate();
  // const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ReportType | ''>('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSchedule, setFilterSchedule] = useState<'all' | 'scheduled' | 'manual'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  
  // 新建报告表单
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    type: 'cost' as ReportType,
    subtype: 'weekly' as ReportSubtype,
    date_range_start: '',
    date_range_end: '',
    metrics: [] as string[],
    permissions: [] as { type: string; id: number; name: string; level: string }[],
    schedule: {
      enabled: false,
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00',
      emailRecipients: [] as string[],
      exportFormats: ['pdf'] as ('pdf' | 'excel' | 'markdown')[],
    },
  });
  
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [apiKeys, setApiKeys] = useState<{ id: number; name: string }[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [newEmail, setNewEmail] = useState('');

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      if (filterStatus) params.set('status', filterStatus);
      if (filterSchedule !== 'all') params.set('scheduled', filterSchedule === 'scheduled' ? 'true' : 'false');
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
  }, [filterType, filterStatus, filterSchedule]);

  const fetchResources = useCallback(async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const [projectsRes, keysRes, membersRes] = await Promise.all([
        fetch(`${API_BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api-keys`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/members`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      }
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(Array.isArray(keysData) ? keysData : []);
      }
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(Array.isArray(membersData) ? membersData : []);
      }
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
          subtype: newReport.subtype,
          date_range_start: newReport.date_range_start,
          date_range_end: newReport.date_range_end,
          metrics: newReport.metrics,
          permissions: newReport.permissions.map(p => ({ type: p.type, id: p.id, level: p.level })),
          schedule: newReport.schedule.enabled ? newReport.schedule : null,
        }),
      });
      if (!res.ok) throw new Error('创建报告失败');
      setShowCreateModal(false);
      resetForm();
      fetchReports();
    } catch (err) {
      console.error('创建报告失败:', err);
      alert('创建报告失败');
    }
  };

  const resetForm = () => {
    setActiveStep(1);
    setNewReport({
      name: '',
      description: '',
      type: 'cost',
      subtype: 'weekly',
      date_range_start: '',
      date_range_end: '',
      metrics: [],
      permissions: [],
      schedule: {
        enabled: false,
        frequency: 'weekly',
        dayOfWeek: 1,
        dayOfMonth: 1,
        time: '09:00',
        emailRecipients: [],
        exportFormats: ['pdf'],
      },
    });
    setNewEmail('');
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

  const toggleMetric = (metricId: string) => {
    setNewReport(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(m => m !== metricId)
        : [...prev.metrics, metricId],
    }));
  };

  const addEmail = () => {
    if (!newEmail || !newEmail.includes('@')) return;
    if (newReport.schedule.emailRecipients.includes(newEmail)) return;
    setNewReport(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        emailRecipients: [...prev.schedule.emailRecipients, newEmail],
      },
    }));
    setNewEmail('');
  };

  const removeEmail = (email: string) => {
    setNewReport(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        emailRecipients: prev.schedule.emailRecipients.filter(e => e !== email),
      },
    }));
  };

  const toggleExportFormat = (format: 'pdf' | 'excel' | 'markdown') => {
    setNewReport(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        exportFormats: prev.schedule.exportFormats.includes(format)
          ? prev.schedule.exportFormats.filter(f => f !== format)
          : [...prev.schedule.exportFormats, format],
      },
    }));
  };

  const filteredReports = reports.filter(r =>
    (r.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (r.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const addPermission = (type: 'user' | 'project' | 'api_key', id: number, name: string, level: string = 'view') => {
    if (newReport.permissions.some(p => p.type === type && p.id === id)) return;
    setNewReport({ ...newReport, permissions: [...newReport.permissions, { type, id, name, level }] });
  };

  const removePermission = (type: string, id: number) => {
    setNewReport({ ...newReport, permissions: newReport.permissions.filter(p => !(p.type === type && p.id === id)) });
  };

  const canProceed = () => {
    if (activeStep === 1) return newReport.name && newReport.type;
    if (activeStep === 2) return newReport.date_range_start && newReport.date_range_end;
    return true;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">分析报告</h1>
          <p className="text-sm text-slate-500 mt-1">智能分析使用数据，生成专业洞察报告</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          创建报告
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">总报告数</p>
              <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">定时报告</p>
              <p className="text-2xl font-bold text-slate-900">
                {reports.filter(r => r.schedule?.enabled).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">本月生成</p>
              <p className="text-2xl font-bold text-slate-900">
                {reports.filter(r => r.generated_at && new Date(r.generated_at).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">待生成</p>
              <p className="text-2xl font-bold text-slate-900">
                {reports.filter(r => r.status === 'draft').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索报告..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select 
            className="text-sm border border-slate-200 rounded-lg px-3 py-2" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as ReportType | '')}
          >
            <option value="">全部类型</option>
            <option value="cost">成本分析</option>
            <option value="usage">使用分析</option>
            <option value="roi">ROI分析</option>
            <option value="budget">预算执行</option>
            <option value="anomaly">异常诊断</option>
            <option value="comparison">对比分析</option>
            <option value="custom">自定义</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="generating">生成中</option>
            <option value="ready">已完成</option>
            <option value="error">错误</option>
          </select>
          <select 
            className="text-sm border border-slate-200 rounded-lg px-3 py-2" 
            value={filterSchedule} 
            onChange={(e) => setFilterSchedule(e.target.value as 'all' | 'scheduled' | 'manual')}
          >
            <option value="all">全部</option>
            <option value="scheduled">定时报告</option>
            <option value="manual">手动报告</option>
          </select>
          <button onClick={() => fetchReports()} className="btn-ghost flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>
      </div>

      {/* 报告列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">暂无报告</h3>
          <p className="text-sm text-slate-400 mb-4">创建您的第一份 AI 驱动分析报告</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            创建报告
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            // 安全获取配置，提供默认值防止白屏
            const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.draft;
            const typeConfig = REPORT_TYPE_CONFIG[report.type] || { 
              label: '未知', 
              color: 'bg-slate-100 text-slate-600', 
              icon: FileText, 
              description: '' 
            };
            const subtypeConfig = SUBTYPE_CONFIG[report.subtype] || { 
              label: '未知', 
              badge: 'bg-slate-100 text-slate-600' 
            };
            const StatusIcon = statusConfig.icon;
            const TypeIcon = typeConfig.icon;
            return (
              <div key={report.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/reports/${report.id}`)}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon className="w-4 h-4 text-slate-400" />
                        <h3 className="font-semibold text-slate-800 truncate">{report.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeConfig.color}`}>{typeConfig.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${subtypeConfig.badge}`}>{subtypeConfig.label}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{report.description || typeConfig.description}</p>
                  
                  {report.schedule?.enabled && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 mb-3 bg-emerald-50 rounded-lg px-2 py-1">
                      <Clock className="w-3 h-3" />
                      定时: {report.schedule.frequency === 'daily' ? '每天' : report.schedule.frequency === 'weekly' ? '每周' : report.schedule.frequency === 'monthly' ? '每月' : '每季度'} {report.schedule.time}
                    </div>
                  )}
                  
                  {report.date_range_start && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.date_range_start).toLocaleDateString()} - {new Date(report.date_range_end).toLocaleDateString()}
                    </div>
                  )}
                  
                  {report.ReportPermissions && report.ReportPermissions.length > 0 && (
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
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
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{report.User?.name || '未知'}</span>
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

      {/* 创建报告模态框 - 步骤式 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-semibold">创建新报告</h2>
                <p className="text-xs text-slate-500">步骤 {activeStep}/4</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {/* 步骤指示器 */}
            <div className="flex items-center px-6 py-4 border-b bg-slate-50">
              {[
                { step: 1, label: '基本信息' },
                { step: 2, label: '数据范围' },
                { step: 3, label: '指标选择' },
                { step: 4, label: '定时设置' },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    activeStep >= s.step ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {s.step}
                  </div>
                  <span className={`ml-2 text-sm ${activeStep >= s.step ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                  {i < 3 && <div className="w-8 h-px bg-slate-300 mx-2" />}
                </div>
              ))}
            </div>

            <div className="p-6">
              {/* 步骤 1: 基本信息 */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">报告名称 *</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="例如：4月份成本分析报告" 
                      value={newReport.name} 
                      onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
                    <textarea 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="报告描述..." 
                      rows={2} 
                      value={newReport.description} 
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">报告类型</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(REPORT_TYPE_CONFIG).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => setNewReport({ ...newReport, type: key as ReportType })}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              newReport.type === key 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-slate-200 hover:border-primary-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${newReport.type === key ? 'text-primary-600' : 'text-slate-400'}`} />
                            <div className="text-sm font-medium">{config.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{config.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">报告周期</label>
                    <div className="flex gap-2">
                      {Object.entries(SUBTYPE_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setNewReport({ ...newReport, subtype: key as ReportSubtype })}
                          className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                            newReport.subtype === key 
                              ? 'border-primary-500 bg-primary-50 text-primary-700' 
                              : 'border-slate-200 hover:border-primary-300'
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 步骤 2: 数据范围 */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">开始日期</label>
                      <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                        value={newReport.date_range_start} 
                        onChange={(e) => setNewReport({ ...newReport, date_range_start: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">结束日期</label>
                      <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                        value={newReport.date_range_end} 
                        onChange={(e) => setNewReport({ ...newReport, date_range_end: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      数据权限范围
                      <span className="text-xs text-slate-400 font-normal">（控制报告可访问的数据范围）</span>
                    </label>
                    {newReport.permissions.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {newReport.permissions.map((p) => (
                          <div key={`${p.type}-${p.id}`} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              {p.type === 'project' && <Building2 className="w-4 h-4 text-blue-600" />}
                              {p.type === 'api_key' && <Key className="w-4 h-4 text-amber-600" />}
                              {p.type === 'user' && <Users className="w-4 h-4 text-violet-600" />}
                              <span className="text-sm">{p.name}</span>
                              <select 
                                className="text-xs border border-slate-200 rounded px-2 py-1" 
                                value={p.level} 
                                onChange={(e) => setNewReport({ 
                                  ...newReport, 
                                  permissions: newReport.permissions.map(pp => pp.type === p.type && pp.id === p.id ? { ...pp, level: e.target.value } : pp) 
                                })}
                              >
                                <option value="view">查看</option>
                                <option value="edit">编辑</option>
                                <option value="admin">管理</option>
                              </select>
                            </div>
                            <button onClick={() => removePermission(p.type, p.id)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">添加项目</label>
                        <select 
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" 
                          onChange={(e) => { const project = projects.find(p => p.id === parseInt(e.target.value)); if (project) { addPermission('project', project.id, project.name); e.target.value = ''; } }}
                        >
                          <option value="">选择项目...</option>
                          {projects.filter(p => !newReport.permissions.some(pp => pp.type === 'project' && pp.id === p.id)).map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">添加 API Key</label>
                        <select 
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" 
                          onChange={(e) => { const key = apiKeys.find(k => k.id === parseInt(e.target.value)); if (key) { addPermission('api_key', key.id, key.name); e.target.value = ''; } }}
                        >
                          <option value="">选择 Key...</option>
                          {apiKeys.filter(k => !newReport.permissions.some(pp => pp.type === 'api_key' && pp.id === k.id)).map(k => (<option key={k.id} value={k.id}>{k.name}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">添加成员</label>
                        <select 
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs" 
                          onChange={(e) => { const member = members.find(m => m.id === parseInt(e.target.value)); if (member) { addPermission('user', member.id, member.name); e.target.value = ''; } }}
                        >
                          <option value="">选择成员...</option>
                          {members.filter(m => !newReport.permissions.some(pp => pp.type === 'user' && pp.id === m.id)).map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 步骤 3: 指标选择 */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">选择分析指标</label>
                    <p className="text-xs text-slate-500 mb-4">选择您希望在报告中包含的指标</p>
                    <div className="space-y-4">
                      {Object.entries(AVAILABLE_METRICS).map(([category, metrics]) => (
                        <div key={category}>
                          <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">
                            {category === 'cost' ? '成本指标' : category === 'usage' ? '使用指标' : '效率指标'}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {metrics.map((metric) => (
                              <button
                                key={metric.id}
                                onClick={() => toggleMetric(metric.id)}
                                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                                  newReport.metrics.includes(metric.id)
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-slate-200 hover:border-primary-300'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  newReport.metrics.includes(metric.id) ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                                }`}>
                                  {newReport.metrics.includes(metric.id) && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{metric.label}</div>
                                  {metric.unit && <div className="text-xs text-slate-500">单位: {metric.unit}</div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 步骤 4: 定时设置 */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="scheduleEnabled"
                      checked={newReport.schedule.enabled}
                      onChange={(e) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, enabled: e.target.checked } })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <label htmlFor="scheduleEnabled" className="flex-1">
                      <div className="font-medium text-sm">启用定时报告</div>
                      <div className="text-xs text-slate-500">系统将按设定时间自动生成并推送报告</div>
                    </label>
                  </div>

                  {newReport.schedule.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">生成频率</label>
                        <div className="flex gap-2">
                          {['daily', 'weekly', 'monthly', 'quarterly'].map((freq) => (
                            <button
                              key={freq}
                              onClick={() => setNewReport({ ...newReport, schedule: { ...newReport.schedule, frequency: freq as any } })}
                              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                                newReport.schedule.frequency === freq 
                                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                                  : 'border-slate-200 hover:border-primary-300'
                              }`}
                            >
                              {freq === 'daily' ? '每天' : freq === 'weekly' ? '每周' : freq === 'monthly' ? '每月' : '每季度'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {newReport.schedule.frequency === 'weekly' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">选择星期</label>
                          <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            value={newReport.schedule.dayOfWeek}
                            onChange={(e) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, dayOfWeek: parseInt(e.target.value) } })}
                          >
                            <option value={0}>周日</option>
                            <option value={1}>周一</option>
                            <option value={2}>周二</option>
                            <option value={3}>周三</option>
                            <option value={4}>周四</option>
                            <option value={5}>周五</option>
                            <option value={6}>周六</option>
                          </select>
                        </div>
                      )}

                      {newReport.schedule.frequency === 'monthly' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">选择日期 (1-28)</label>
                          <input
                            type="number"
                            min={1}
                            max={28}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            value={newReport.schedule.dayOfMonth}
                            onChange={(e) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, dayOfMonth: parseInt(e.target.value) } })}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">生成时间</label>
                        <input
                          type="time"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                          value={newReport.schedule.time}
                          onChange={(e) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, time: e.target.value } })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">导出格式</label>
                        <div className="flex gap-2">
                          {['pdf', 'excel', 'markdown'].map((format) => (
                            <button
                              key={format}
                              onClick={() => toggleExportFormat(format as any)}
                              className={`px-4 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 ${
                                newReport.schedule.exportFormats.includes(format as any)
                                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                                  : 'border-slate-200 hover:border-primary-300'
                              }`}
                            >
                              {format === 'pdf' && <FileText className="w-4 h-4" />}
                              {format === 'excel' && <BarChart3 className="w-4 h-4" />}
                              {format === 'markdown' && <FileText className="w-4 h-4" />}
                              {format === 'pdf' ? 'PDF' : format === 'excel' ? 'Excel' : 'Markdown'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          邮件推送
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="email"
                            placeholder="输入邮箱地址"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                          />
                          <button onClick={addEmail} className="btn-secondary">添加</button>
                        </div>
                        {newReport.schedule.emailRecipients.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newReport.schedule.emailRecipients.map((email) => (
                              <span key={email} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs">
                                {email}
                                <button onClick={() => removeEmail(email)} className="text-slate-400 hover:text-red-500">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-between px-6 py-4 border-t bg-slate-50">
              <button 
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))} 
                disabled={activeStep === 1}
                className="px-4 py-2 text-sm hover:bg-slate-200 rounded-lg disabled:opacity-50"
              >
                上一步
              </button>
              <div className="flex gap-3">
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm hover:bg-slate-200 rounded-lg">
                  取消
                </button>
                {activeStep < 4 ? (
                  <button 
                    onClick={() => setActiveStep(activeStep + 1)} 
                    disabled={!canProceed()}
                    className="btn-primary disabled:opacity-50"
                  >
                    下一步
                  </button>
                ) : (
                  <button onClick={handleCreateReport} disabled={!canProceed()} className="btn-primary disabled:opacity-50">
                    <Sparkles className="w-4 h-4 mr-2" />创建报告
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div>
              <div><h3 className="text-lg font-semibold">确认删除</h3><p className="text-sm text-slate-500">此操作不可撤销</p></div>
            </div>
            <p className="text-sm text-slate-600 mb-6">确定要删除这份报告吗？报告相关的所有数据都将被永久删除。</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={() => handleDeleteReport(showDeleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
