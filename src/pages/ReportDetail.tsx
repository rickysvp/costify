import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Sparkles,
  Download,
  RefreshCw,
  Building2,
  Key,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

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
  content: string;
  ai_insights: string;
  data_snapshot: string;
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

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('获取报告失败');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError('获取报告失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${id}/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('生成报告失败');
      fetchReport();
    } catch (err) {
      alert('生成报告失败');
    }
  };

  const handleDownload = () => {
    if (!report?.content) return;
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error || '报告不存在'}
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[report.status];
  const typeConfig = TYPE_CONFIG[report.type];
  const StatusIcon = statusConfig.icon;

  let aiInsights = null;
  let dataSnapshot = null;
  try {
    aiInsights = report.ai_insights ? JSON.parse(report.ai_insights) : null;
    dataSnapshot = report.data_snapshot ? JSON.parse(report.data_snapshot) : null;
  } catch (e) {
    console.error('解析数据失败:', e);
  }

  return (
    <div className="p-6 space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center gap-2 text-sm text-surface-600 hover:text-surface-800"
      >
        <ArrowLeft className="w-4 h-4" />
        返回报告列表
      </button>

      {/* 报告头部 */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-surface-900">{report.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-surface-600 mb-4">{report.description || '暂无描述'}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {report.User?.name || '未知'}
              </span>
              {report.date_range_start && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.date_range_start).toLocaleDateString()} - {new Date(report.date_range_end).toLocaleDateString()}
                </span>
              )}
              <span>创建于 {new Date(report.created_at).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {report.status === 'draft' && (
              <button
                onClick={handleGenerate}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                生成报告
              </button>
            )}
            {report.status === 'ready' && (
              <>
                <button
                  onClick={handleGenerate}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新生成
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-ghost flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 权限信息 */}
      {report.ReportPermissions && report.ReportPermissions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-surface-700 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            数据权限范围
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.ReportPermissions.map((p) => (
              <span
                key={`${p.permission_type}-${p.permission_id}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-surface-100 text-surface-600"
              >
                {p.permission_type === 'project' && <Building2 className="w-3 h-3" />}
                {p.permission_type === 'api_key' && <Key className="w-3 h-3" />}
                {p.permission_type === 'user' && <Users className="w-3 h-3" />}
                {p.permission_type} #{p.permission_id}
                <span className="text-surface-400">({p.access_level})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 报告内容 */}
      {report.status === 'ready' && report.content ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI 洞察 */}
          {aiInsights && (
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-4 bg-gradient-to-br from-violet-50 to-blue-50 border-violet-100">
                <h3 className="text-sm font-semibold text-violet-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI 洞察
                </h3>
                <p className="text-sm text-surface-700 mb-4">{aiInsights.summary}</p>
                
                {aiInsights.recommendations && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-surface-500">建议</h4>
                    <ul className="space-y-1">
                      {aiInsights.recommendations.map((r: string, i: number) => (
                        <li key={i} className="text-xs text-surface-600 flex items-start gap-1">
                          <span className="text-violet-500 mt-0.5">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 数据概览 */}
              {dataSnapshot?.summary && (
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-surface-800 mb-3">数据概览</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">总花费</span>
                      <span className="text-sm font-medium">
                        ${parseFloat(dataSnapshot.summary.total_cost || 0).toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">总 Token</span>
                      <span className="text-sm font-medium">
                        {parseInt(dataSnapshot.summary.total_tokens || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">请求数</span>
                      <span className="text-sm font-medium">
                        {parseInt(dataSnapshot.summary.request_count || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">节省金额</span>
                      <span className="text-sm font-medium text-emerald-600">
                        ${parseFloat(dataSnapshot.summary.total_savings || 0).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 项目排行 */}
              {dataSnapshot?.by_project && dataSnapshot.by_project.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-surface-800 mb-3">项目消耗排行</h3>
                  <div className="space-y-2">
                    {dataSnapshot.by_project.slice(0, 5).map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 truncate flex-1">{p.name}</span>
                        <span className="text-sm font-medium">${p.cost.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 报告正文 */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-surface-800 mb-4">报告详情</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-surface-700 leading-relaxed">
                  {report.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : report.status === 'generating' ? (
        <div className="card p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-surface-700 mb-2">报告生成中</h3>
          <p className="text-sm text-surface-500">AI 正在分析数据并生成报告，请稍候...</p>
        </div>
      ) : report.status === 'error' ? (
        <div className="card p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-surface-700 mb-2">报告生成失败</h3>
          <p className="text-sm text-surface-500 mb-4">生成报告时发生错误，请重试</p>
          <button onClick={handleGenerate} className="btn-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新生成
          </button>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-medium text-surface-700 mb-2">报告尚未生成</h3>
          <p className="text-sm text-surface-500 mb-4">点击"生成报告"按钮开始生成 AI 报告</p>
          <button onClick={handleGenerate} className="btn-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            生成报告
          </button>
        </div>
      )}
    </div>
  );
}
