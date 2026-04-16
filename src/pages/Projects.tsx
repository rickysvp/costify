import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, Check, AlertTriangle, Building2,
  ChevronDown, Key, Copy, RefreshCw, Zap, Shield, Gauge
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3001/api';

// ==================== 类型定义 ====================

interface Project {
  id: number;
  name: string;
  description: string;
  monthly_budget: number | null;
  routing_profile: string;
  max_tokens_per_request: number;
  default_model: string;
  status: string;
  month_spend: number;
  month_savings: number;
  budget_percentage: number;
  key_count: number;
  member_count: number;
}

interface ProjectFormData {
  name: string;
  description: string;
  monthly_budget: string;
  routing_profile: string;
  max_tokens_per_request: string;
  default_model: string;
  models: string[];
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', description: '最强大的模型，适合复杂任务', price: '$5/1M input' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '性价比高，适合日常任务', price: '$0.15/1M input' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，适合简单任务', price: '$1/1M input' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Anthropic 最强模型', price: '$15/1M input' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: '平衡性能与成本', price: '$3/1M input' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: '快速且经济', price: '$0.25/1M input' },
];

const ROUTING_PROFILES = [
  {
    id: 'cost_saver',
    name: '成本优先',
    description: '优先使用最经济的模型，仅在必要时升级',
    icon: Zap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 'balanced',
    name: '平衡模式',
    description: '根据请求复杂度智能选择模型',
    icon: Gauge,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 'quality',
    name: '质量优先',
    description: '始终使用最强大的模型，确保最佳输出',
    icon: Shield,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
];

const ROUTING_LABELS: Record<string, string> = {
  cost_saver: '成本优先',
  balanced: '平衡模式',
  quality: '质量优先',
};

const ROUTING_BADGE: Record<string, string> = {
  cost_saver: 'bg-emerald-50 text-emerald-700',
  balanced: 'bg-blue-50 text-blue-700',
  quality: 'bg-violet-50 text-violet-700',
};

// ==================== 组件 ====================

export default function Projects() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 创建/编辑模态框
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    monthly_budget: '',
    routing_profile: 'balanced',
    max_tokens_per_request: '4096',
    default_model: 'gpt-4o-mini',
    models: ['gpt-4o-mini'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 删除确认
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // API Key 展示模态框
  const [apiKeyModal, setApiKeyModal] = useState<{
    open: boolean;
    projectName: string;
    apiKey: string;
    projectId: number | null;
  }>({
    open: false,
    projectName: '',
    apiKey: '',
    projectId: null,
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ==================== 数据获取 ====================

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('costio_token');
      const response = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '获取项目列表失败');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取项目列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==================== 模态框操作 ====================

  const openCreateModal = () => {
    setModalMode('create');
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      monthly_budget: '',
      routing_profile: 'balanced',
      max_tokens_per_request: '4096',
      default_model: 'gpt-4o-mini',
      models: ['gpt-4o-mini'],
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setModalMode('edit');
    setEditingProject(project);
    const projectModels = (project as any).models
      ? (project as any).models.split(',').filter(Boolean)
      : [project.default_model || 'gpt-4o-mini'];
    setFormData({
      name: project.name,
      description: project.description || '',
      monthly_budget: project.monthly_budget ? project.monthly_budget.toString() : '',
      routing_profile: project.routing_profile || 'balanced',
      max_tokens_per_request: (project.max_tokens_per_request || 4096).toString(),
      default_model: project.default_model || 'gpt-4o-mini',
      models: projectModels,
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setSubmitError(null);
  };

  // ==================== 提交表单 ====================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('costio_token');
      const payload = {
        name: formData.name,
        description: formData.description,
        monthly_budget: formData.monthly_budget ? parseFloat(formData.monthly_budget) : null,
        routing_profile: formData.routing_profile,
        max_tokens_per_request: parseInt(formData.max_tokens_per_request) || 4096,
        default_model: formData.default_model,
        models: formData.models,
      };

      let response: Response;
      let projectId: number | undefined;

      if (modalMode === 'create') {
        response = await fetch(`${API_BASE}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || '创建项目失败');
        }

        const project = await response.json();
        projectId = project.id;

        // 自动生成 API Key
        try {
          const apiKeyResponse = await fetch(`${API_BASE}/api-keys`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: projectId }),
          });

          if (apiKeyResponse.ok) {
            const apiKeyData = await apiKeyResponse.json();
            // 显示 API Key 模态框
            setApiKeyModal({
              open: true,
              projectName: project.name,
              apiKey: apiKeyData.key,
              projectId: project.id,
            });
          }
        } catch {
          // API Key 生成失败不影响项目创建
        }

        showToast('项目创建成功');
      } else if (editingProject) {
        response = await fetch(`${API_BASE}/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || '更新项目失败');
        }

        showToast('项目更新成功');
      }

      closeModal();
      fetchProjects();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '操作失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== 删除项目 ====================

  const handleDelete = async () => {
    if (!deleteConfirm.project) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('costio_token');
      const response = await fetch(`${API_BASE}/projects/${deleteConfirm.project.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || '删除失败');
      }

      showToast('项目已删除');
      setDeleteConfirm({ open: false, project: null });
      fetchProjects();
    } catch (err) {
      showToast(err instanceof Error ? err.message : '删除失败', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // ==================== 工具函数 ====================

  const getModelName = (modelId: string) => {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
    return model ? model.name : modelId;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
      showToast('API Key 已复制到剪贴板');
    } catch {
      // fallback
    }
  };

  // 预算进度条颜色
  const getBudgetColor = (pct: number) => {
    if (pct < 80) return 'bg-emerald-500';
    if (pct < 100) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getBudgetTextColor = (pct: number) => {
    if (pct < 80) return 'text-surface-800';
    if (pct < 100) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBudgetBadge = (pct: number) => {
    if (pct < 80) return 'bg-emerald-100 text-emerald-700';
    if (pct < 100) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getBudgetLabel = (pct: number) => {
    if (pct < 80) return '正常';
    if (pct < 100) return '接近预算';
    return '超出预算';
  };

  // ==================== 渲染 ====================

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">项目</h1>
          <p className="text-sm text-surface-500">管理您的 AI 项目和预算</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost inline-flex items-center gap-1.5"
            onClick={fetchProjects}
            title="刷新"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button
              className="btn-primary inline-flex items-center gap-2"
              onClick={openCreateModal}
            >
              <Plus className="w-4 h-4" />
              创建项目
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
            <button
              className="ml-auto text-xs text-red-500 hover:text-red-700 underline"
              onClick={fetchProjects}
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 项目列表 */}
      <div className="card">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
            <span className="ml-3 text-sm text-surface-600">加载中...</span>
          </div>
        ) : projects.length === 0 ? (
          /* 空状态引导 */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-800 mb-1">暂无项目</h3>
            <p className="text-sm text-surface-500 mb-6">
              {isAdmin
                ? '点击 "创建项目" 按钮开始管理您的 AI 成本'
                : '您还没有被分配到任何项目，请联系管理员'}
            </p>
            {isAdmin && (
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">创建项目</p>
                    <p className="text-xs text-surface-500">设置项目名称、预算和路由策略</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">邀请成员</p>
                    <p className="text-xs text-surface-500">添加团队成员到项目中</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">生成 API Key</p>
                    <p className="text-xs text-surface-500">获取密钥并集成到您的应用</p>
                  </div>
                </div>
                <button
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                  onClick={openCreateModal}
                >
                  <Plus className="w-4 h-4" />
                  创建第一个项目
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 项目表格 */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">项目名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">路由策略</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">支持模型</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">本月花费</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">预算使用率</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">Key 数</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">成员数</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">操作</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const pct = project.budget_percentage || 0;
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-sm font-medium text-brand-600 hover:underline"
                        >
                          {project.name}
                        </Link>
                        {project.description && (
                          <p className="text-xs text-surface-400 mt-0.5 max-w-xs truncate">
                            {project.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            ROUTING_BADGE[project.routing_profile] || ROUTING_BADGE.balanced
                          }`}
                        >
                          {ROUTING_LABELS[project.routing_profile] || project.routing_profile}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(project as any).models
                            ? (project as any).models.split(',').filter(Boolean).map((m: string) => (
                                <span key={m} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  m === project.default_model ? 'bg-brand-50 text-brand-700' : 'bg-surface-100 text-surface-600'
                                }`}>
                                  {getModelName(m)}
                                </span>
                              ))
                            : <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-100 text-xs font-medium text-surface-700">{getModelName(project.default_model || 'gpt-4o-mini')}</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-800 text-right">
                        ${project.month_spend.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getBudgetTextColor(pct)}`}>
                              {project.monthly_budget ? `${pct.toFixed(1)}%` : '-'}
                            </span>
                            {project.monthly_budget ? (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getBudgetBadge(pct)}`}>
                                {getBudgetLabel(pct)}
                              </span>
                            ) : null}
                          </div>
                          {project.monthly_budget ? (
                            <div className="w-24 h-2 bg-surface-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getBudgetColor(pct)}`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-surface-400">未设置预算</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-600 text-right">
                        {project.key_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-600 text-right">
                        {project.member_count}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-brand-600"
                              onClick={() => openEditModal(project)}
                              title="编辑项目"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-surface-500 hover:text-red-600"
                              onClick={() => setDeleteConfirm({ open: true, project })}
                              title="删除项目"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== 创建/编辑模态框 ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-surface-900">
                {modalMode === 'create' ? '创建项目' : '编辑项目'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{submitError}</span>
                  </div>
                )}

                {/* 项目名称 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    项目名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    placeholder="输入项目名称"
                    required
                  />
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    rows={3}
                    placeholder="输入项目描述（可选）"
                  />
                </div>

                {/* 路由策略 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    路由策略 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {ROUTING_PROFILES.map((profile) => {
                      const Icon = profile.icon;
                      const isSelected = formData.routing_profile === profile.id;
                      return (
                        <label
                          key={profile.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? `${profile.border} ${profile.bg}`
                              : 'border-surface-200 hover:border-surface-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="routing_profile"
                            value={profile.id}
                            checked={isSelected}
                            onChange={() => setFormData({ ...formData, routing_profile: profile.id })}
                            className="sr-only"
                          />
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? profile.bg : 'bg-surface-100'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? profile.color : 'text-surface-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isSelected ? profile.color : 'text-surface-800'}`}>
                              {profile.name}
                            </p>
                            <p className="text-xs text-surface-500">{profile.description}</p>
                          </div>
                          {isSelected && (
                            <Check className={`w-4 h-4 flex-shrink-0 ${profile.color}`} />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 支持的模型 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    支持的模型 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-surface-500 mb-2">选择项目可以使用的模型，路由策略只会在启用的模型间选择</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_MODELS.map((model) => {
                      const isSelected = formData.models.includes(model.id);
                      return (
                        <label key={model.id}
                          className={`flex items-start gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-brand-300 bg-brand-50' : 'border-surface-200 hover:border-surface-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              let newModels: string[];
                              if (e.target.checked) {
                                newModels = [...formData.models, model.id];
                              } else {
                                newModels = formData.models.filter((m: string) => m !== model.id);
                              }
                              const newDefault = newModels.includes(formData.default_model)
                                ? formData.default_model
                                : newModels[0] || 'gpt-4o-mini';
                              setFormData({ ...formData, models: newModels, default_model: newDefault });
                            }}
                            className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-surface-800">{model.name}</div>
                            <div className="text-xs text-surface-500">{model.description}</div>
                            <div className="text-xs text-brand-600 mt-0.5">{model.price}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {formData.models.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">请至少选择一个模型</p>
                  )}
                </div>

                {/* 默认模型 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">默认模型</label>
                  <div className="relative">
                    <select
                      value={formData.default_model}
                      onChange={(e) => setFormData({ ...formData, default_model: e.target.value })}
                      className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 appearance-none bg-white"
                    >
                      {formData.models.map((modelId: string) => {
                        const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
                        return model ? (
                          <option key={modelId} value={modelId}>
                            {model.name} - {model.price}
                          </option>
                        ) : null;
                      })}
                    </select>
                    <ChevronDown className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 月度预算 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">月度预算（可选）</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">$</span>
                    <input
                      type="number"
                      value={formData.monthly_budget}
                      onChange={(e) => setFormData({ ...formData, monthly_budget: e.target.value })}
                      className="w-full text-sm border border-surface-200 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>


              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-200 bg-surface-50 rounded-b-xl sticky bottom-0">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                  {isSubmitting ? '处理中...' : modalMode === 'create' ? '创建' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 删除确认模态框 ==================== */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">确认删除</h3>
                  <p className="text-sm text-surface-500">此操作无法撤销</p>
                </div>
              </div>

              <p className="text-sm text-surface-600 mb-6">
                您确定要删除项目{' '}
                <span className="font-medium text-surface-900">
                  &ldquo;{deleteConfirm.project?.name}&rdquo;
                </span>{' '}
                吗？删除后，该项目下的所有 API Key 和使用记录都将被删除。
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                  onClick={() => setDeleteConfirm({ open: false, project: null })}
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                  {isDeleting ? '删除中...' : '确认删除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== API Key 展示模态框 ==================== */}
      {apiKeyModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
              <h2 className="text-lg font-semibold text-surface-900">API Key 已生成</h2>
              <button
                onClick={() => {
                  setApiKeyModal({ ...apiKeyModal, open: false });
                  // 跳转到项目详情页
                  if (apiKeyModal.projectId) {
                    navigate(`/projects/${apiKeyModal.projectId}`);
                  }
                }}
                className="p-1 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Key className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-900">
                    项目：{apiKeyModal.projectName}
                  </h3>
                  <p className="text-xs text-surface-500">请妥善保管您的 API Key</p>
                </div>
              </div>

              <div className="bg-surface-50 border border-surface-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-surface-800 select-all break-all">
                    {apiKeyModal.apiKey}
                  </span>
                  <button
                    onClick={() => copyToClipboard(apiKeyModal.apiKey)}
                    className="p-1.5 rounded hover:bg-surface-200 transition-colors text-surface-500 hover:text-brand-600 flex-shrink-0 ml-2"
                  >
                    {copiedKey === apiKeyModal.apiKey ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-surface-600 mb-6">
                这是您项目的 API Key，用于调用 AI
                模型。请将其添加到您的应用中，所有请求都将通过 AnyTokn
                进行路由和监控。
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                  onClick={() => {
                    setApiKeyModal({ ...apiKeyModal, open: false });
                    if (apiKeyModal.projectId) {
                      navigate(`/projects/${apiKeyModal.projectId}`);
                    }
                  }}
                >
                  关闭
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                  onClick={() => {
                    copyToClipboard(apiKeyModal.apiKey);
                    setApiKeyModal({ ...apiKeyModal, open: false });
                    if (apiKeyModal.projectId) {
                      navigate(`/projects/${apiKeyModal.projectId}`);
                    }
                  }}
                >
                  复制并跳转详情
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
