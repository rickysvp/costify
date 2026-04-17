import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, Check, AlertTriangle, Building2,
  ChevronDown, Key, Copy, RefreshCw, Zap, Shield, Gauge
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import { API_BASE } from '../config';

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

// This might need context-aware translation, but for now we'll keep names and prices static 
// and handle descriptions in the UI if needed, or translate them here.
const AVAILABLE_MODELS = (t: any) => [
  { id: 'gpt-4o', name: 'GPT-4o', description: t.apiMarket.models['gpt-4o'].description, price: '$5/1M input' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: t.apiMarket.models['gpt-4o-mini'].description, price: '$0.15/1M input' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: t.apiMarket.models['gpt-3.5-turbo'].description, price: '$1/1M input' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: t.apiMarket.models['claude-3-opus'].description, price: '$15/1M input' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: t.apiMarket.models['claude-3.5-sonnet'].description, price: '$3/1M input' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: t.apiMarket.models['claude-3-haiku'].description, price: '$0.25/1M input' },
];

const ROUTING_PROFILES = (t: any) => [
  {
    id: 'cost_saver',
    name: t.projects.costSaver,
    description: t.projects.costSaverDesc,
    icon: Zap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    id: 'balanced',
    name: t.projects.balanced,
    description: t.projects.balancedDesc,
    icon: Gauge,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 'quality',
    name: t.projects.quality,
    description: t.projects.qualityDesc,
    icon: Shield,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
];

const ROUTING_LABELS: Record<string, string> = {
  cost_saver: 'costSaver',
  balanced: 'balanced',
  quality: 'quality',
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
  const { t } = useLanguage();

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
  const currentModels = AVAILABLE_MODELS(t);
  const currentRoutingProfiles = ROUTING_PROFILES(t);
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
        throw new Error(errData.error || t.projects.fetchError);
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projects.fetchError);
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

        showToast(t.projects.createSuccess);
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
          throw new Error(errorData?.error || t.projects.updateError);
        }

        showToast(t.projects.updateSuccess);
      }

      closeModal();
      fetchProjects();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.projects.updateError);
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

      showToast(t.projects.deleteSuccess);
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
    const model = currentModels.find((m) => m.id === modelId);
    return model ? model.name : modelId;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
      showToast(t.projects.copySuccess);
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
    if (pct < 80) return t.projects.budgetNormal;
    if (pct < 100) return t.projects.budgetNear;
    return t.projects.budgetOver;
  };

  // ==================== 渲染 ====================

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{t.layout.projects}</h1>
          <p className="text-sm text-surface-500">{t.projects.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost inline-flex items-center gap-1.5"
            onClick={fetchProjects}
            title={t.dashboard.refresh}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button
              className="btn-primary inline-flex items-center gap-2"
              onClick={openCreateModal}
            >
              <Plus className="w-4 h-4" />
              {t.projects.createProject}
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
              {t.dashboard.reload}
            </button>
          </div>
        </div>
      )}

      {/* 项目列表 */}
      <div className="card">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
            <span className="ml-3 text-sm text-surface-600">{t.common.loading}</span>
          </div>
        ) : projects.length === 0 ? (
          /* 空状态引导 */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium text-surface-800 mb-1">{t.projects.noProjects}</h3>
            <p className="text-sm text-surface-500 mb-6">
              {isAdmin
                ? t.dashboard.welcomeDesc
                : t.projects.notAssigned}
            </p>
            {isAdmin && (
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">{t.dashboard.step1Title}</p>
                    <p className="text-xs text-surface-500">{t.dashboard.step1Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">{t.dashboard.step2Title}</p>
                    <p className="text-xs text-surface-500">{t.dashboard.step2Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg text-left">
                  <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">{t.dashboard.step3Title}</p>
                    <p className="text-xs text-surface-500">{t.dashboard.step3Desc}</p>
                  </div>
                </div>
                <button
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                  onClick={openCreateModal}
                >
                  <Plus className="w-4 h-4" />
                  {t.projects.createFirst}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.projects.projectName}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.projects.routingPolicy}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500">{t.projects.availableModels}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.projects.monthSpend}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.projects.budgetUsage}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.projects.keyCount}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.projects.memberCount}</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500">{t.projects.actions}</th>
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
                          {t.projects[ROUTING_LABELS[project.routing_profile] as keyof typeof t.projects] || project.routing_profile}
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
                        ${(project.month_spend || 0).toFixed(2)}
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
                            <span className="text-[10px] text-surface-400">{t.projects.budgetNotSet}</span>
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
                              title={t.projects.editProject}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-surface-500 hover:text-red-600"
                              onClick={() => setDeleteConfirm({ open: true, project })}
                              title={t.projects.deleteProject}
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
                {modalMode === 'create' ? t.projects.createProject : t.projects.editProject}
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
                    {t.projects.projectName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    placeholder={t.projects.projectNamePlaceholder}
                    required
                  />
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">{t.projects.projectDesc}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                    rows={3}
                    placeholder={t.projects.projectDescPlaceholder || 'Enter project description (optional)'}
                  />
                </div>

                {/* 路由策略 */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t.projects.routingPolicy} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {currentRoutingProfiles.map((profile) => {
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
                    {t.projects.availableModels} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-surface-500 mb-2">{t.projects.availableModelsDesc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentModels.map((model) => {
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
                  <label className="block text-sm font-medium text-surface-700 mb-1">{t.projects.defaultModel}</label>
                  <div className="relative">
                    <select
                      value={formData.default_model}
                      onChange={(e) => setFormData({ ...formData, default_model: e.target.value })}
                      className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 appearance-none bg-white"
                    >
                      {formData.models.map((modelId: string) => {
                        const model = currentModels.find((m) => m.id === modelId);
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
                  <label className="block text-sm font-medium text-surface-700 mb-1">{t.projects.monthlyBudget} ({t.common?.optional || 'Optional'})</label>
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
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                  {isSubmitting ? t.common.loading : modalMode === 'create' ? t.common.create : t.common.save}
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
                  <h3 className="text-lg font-semibold text-surface-900">{t.projects.deleteProject}</h3>
                  <p className="text-sm text-surface-500">{t.projects.deleteWarning || 'This action cannot be undone'}</p>
                </div>
              </div>

              <p className="text-sm text-surface-600 mb-6">
                {t.projects.deleteConfirmMessagePre || 'Are you sure you want to delete project'} {' '}
                <span className="font-medium text-surface-900">
                  &ldquo;{deleteConfirm.project?.name}&rdquo;
                </span>{' '}
                {t.projects.deleteConfirmMessagePost || '? All API keys and usage records under this project will be deleted.'}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                  onClick={() => setDeleteConfirm({ open: false, project: null })}
                  disabled={isDeleting}
                >
                  {t.common.cancel}
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                  {isDeleting ? t.common.loading : t.common.confirm}
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
                    {t.projects.projectLabel || 'Project'}: {apiKeyModal.projectName}
                  </h3>
                  <p className="text-xs text-surface-500">{t.apiKeys.createSuccessDesc}</p>
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
                {t.apiKeys.keyNotice || 'This is your project\'s API Key for calling AI models. Please add it to your application; all requests will be routed and monitored by AnyTokn.'}
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
                  {t.common.close}
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
                  {t.projects.copyAndGoDetail || 'Copy and View Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
