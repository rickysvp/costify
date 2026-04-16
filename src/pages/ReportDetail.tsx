import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Calendar, User, Sparkles, Download, RefreshCw,
  Building2, Users, CheckCircle, AlertCircle, Loader2,
  TrendingUp, TrendingDown, DollarSign, Activity,
  AlertTriangle, Wallet, Hash, Clock, Target,
  ChevronRight, PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

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

interface DataSnapshot {
  summary: {
    total_cost: number;
    total_tokens: number;
    request_count: number;
    total_savings: number;
    avg_response_time: number;
    cache_hit_rate: number;
  };
  by_project: ProjectData[];
  by_member: MemberData[];
  by_model: ModelData[];
  by_day: DayData[];
  anomalies: AnomalyData[];
}

interface ProjectData {
  id: number;
  name: string;
  cost: number;
  tokens: number;
  requests: number;
  members: number;
  trend: number;
}

interface MemberData {
  id: number;
  name: string;
  cost: number;
  tokens: number;
  requests: number;
  efficiency: number;
  projects: number;
}

interface ModelData {
  name: string;
  cost: number;
  tokens: number;
  requests: number;
  avg_cost_per_1k: number;
}

interface DayData {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

interface AnomalyData {
  type: 'cost_spike' | 'usage_spike' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number;
  expected: number;
  date: string;
}

const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-600', icon: FileText },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  ready: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  error: { label: '错误', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  cost: { label: '成本分析', color: 'bg-emerald-100 text-emerald-700' },
  usage: { label: '使用分析', color: 'bg-blue-100 text-blue-700' },
  roi: { label: 'ROI分析', color: 'bg-violet-100 text-violet-700' },
  budget: { label: '预算执行', color: 'bg-amber-100 text-amber-700' },
  anomaly: { label: '异常诊断', color: 'bg-rose-100 text-rose-700' },
  comparison: { label: '对比分析', color: 'bg-cyan-100 text-cyan-700' },
  custom: { label: '自定义', color: 'bg-violet-100 text-violet-700' },
  weekly: { label: '周报', color: 'bg-blue-100 text-blue-700' },
  monthly: { label: '月报', color: 'bg-emerald-100 text-emerald-700' },
  quarterly: { label: '季报', color: 'bg-amber-100 text-amber-700' },
};

const COLORS = ['#0D9488', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'];
const CHART_COLORS = {
  primary: '#0D9488',
  secondary: '#3B82F6',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#10B981',
};

const formatCurrency = (value: number) => `$${value.toFixed(4)}`;
const formatNumber = (value: number) => value.toLocaleString();
const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const SEVERITY_MAP: Record<string, { label: string; color: string; icon: any }> = {
  high: { label: '高风险', color: 'text-rose-700 bg-rose-50 border-rose-200', icon: AlertTriangle },
  medium: { label: '中风险', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertCircle },
  low: { label: '低风险', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: InfoIcon },
};

function InfoIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  );
}

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('executive');

  useEffect(() => { fetchReport(); }, [id]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('获取报告失败');
      setReport(await res.json());
    } catch (err) {
      setError('获取报告失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('costio_token');
      const res = await fetch(`${API_BASE}/reports/${id}/generate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('生成报告失败');
      fetchReport();
    } catch (err) { alert('生成报告失败'); }
  };

  const { aiInsights, dataSnapshot } = useMemo(() => {
    if (!report) return { aiInsights: null, dataSnapshot: null };
    try {
      return {
        aiInsights: report.ai_insights ? JSON.parse(report.ai_insights) : null,
        dataSnapshot: report.data_snapshot ? JSON.parse(report.data_snapshot) as DataSnapshot : null,
      };
    } catch (e) { return { aiInsights: null, dataSnapshot: null }; }
  }, [report]);

  const stats = useMemo(() => {
    if (!dataSnapshot) return null;
    const s = dataSnapshot.summary;
    return {
      totalCost: s.total_cost || 0,
      totalTokens: s.total_tokens || 0,
      totalRequests: s.request_count || 0,
      totalSavings: s.total_savings || 0,
      avgCostPerRequest: s.request_count > 0 ? s.total_cost / s.request_count : 0,
      avgCostPer1kTokens: s.total_tokens > 0 ? (s.total_cost / s.total_tokens) * 1000 : 0,
      cacheHitRate: s.cache_hit_rate || 0,
      avgResponseTime: s.avg_response_time || 0,
      projectCount: dataSnapshot.by_project?.length || 0,
      memberCount: dataSnapshot.by_member?.length || 0,
      modelCount: dataSnapshot.by_model?.length || 0,
      dayCount: dataSnapshot.by_day?.length || 0,
      anomalyCount: dataSnapshot.anomalies?.length || 0,
      highAnomalyCount: dataSnapshot.anomalies?.filter(a => a.severity === 'high').length || 0,
    };
  }, [dataSnapshot]);

  if (isLoading) return <div className="p-6 flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  if (error || !report) return <div className="p-6"><div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error || '报告不存在'}</div></div>;

  const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.draft;
  const typeConfig = TYPE_CONFIG[report.type] || { label: '未知', color: 'bg-slate-100 text-slate-600' };
  const StatusIcon = statusConfig.icon;

  const sections = [
    { key: 'executive', label: '执行摘要', icon: Target },
    { key: 'cost', label: '成本分析', icon: DollarSign },
    { key: 'projects', label: '项目洞察', icon: Building2 },
    { key: 'members', label: '成员洞察', icon: Users },
    { key: 'models', label: '模型洞察', icon: PieChartIcon },
    { key: 'trends', label: '趋势分析', icon: TrendingUp },
    { key: 'anomalies', label: '异常检测', icon: AlertTriangle },
    { key: 'recommendations', label: '优化建议', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 报告头部 - 专业报告封面风格 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <button onClick={() => navigate('/reports')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回报告列表
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{report.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />{statusConfig.label}
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-2xl">{report.description || 'AI 驱动的深度分析报告'}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{report.User?.name || '系统'}</span>
                {report.date_range_start && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(report.date_range_start).toLocaleDateString()} — {new Date(report.date_range_end).toLocaleDateString()}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(report.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {report.status === 'draft' && <button onClick={handleGenerate} className="btn-primary flex items-center gap-2"><Sparkles className="w-4 h-4" />生成报告</button>}
              {report.status === 'ready' && (
                <>
                  <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" />重新生成</button>
                  <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4" />导出 PDF</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      {report.status === 'ready' && dataSnapshot && stats ? (
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* 左侧导航 - 报告目录 */}
            <nav className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-6 space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">报告目录</p>
                {sections.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === key ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {key === 'anomalies' && stats.anomalyCount > 0 && (
                      <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">{stats.anomalyCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* 右侧内容 */}
            <main className="flex-1 min-w-0 space-y-8">
              {/* 移动端导航 */}
              <div className="lg:hidden flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 overflow-x-auto">
                {sections.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setActiveSection(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${activeSection === key ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-500'}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>

              {activeSection === 'executive' && <ExecutiveSummary stats={stats} dataSnapshot={dataSnapshot} aiInsights={aiInsights} />}
              {activeSection === 'cost' && <CostAnalysis stats={stats} dataSnapshot={dataSnapshot} />}
              {activeSection === 'projects' && <ProjectInsight data={dataSnapshot.by_project} totalCost={stats.totalCost} />}
              {activeSection === 'members' && <MemberInsight data={dataSnapshot.by_member} totalCost={stats.totalCost} />}
              {activeSection === 'models' && <ModelInsight data={dataSnapshot.by_model} />}
              {activeSection === 'trends' && <TrendInsight data={dataSnapshot.by_day} />}
              {activeSection === 'anomalies' && <AnomalyInsight data={dataSnapshot.anomalies || []} />}
              {activeSection === 'recommendations' && <Recommendations aiInsights={aiInsights} stats={stats} />}
            </main>
          </div>
        </div>
      ) : report.status === 'generating' ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">报告生成中</h3>
          <p className="text-sm text-slate-500">AI 正在深度分析数据，预计需要 10-30 秒</p>
        </div>
      ) : report.status === 'error' ? (
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">生成失败</h3>
          <p className="text-sm text-slate-500 mb-4">请重试或联系管理员</p>
          <button onClick={handleGenerate} className="btn-primary"><RefreshCw className="w-4 h-4 mr-2" />重新生成</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">报告尚未生成</h3>
          <p className="text-sm text-slate-500 mb-4">点击按钮开始生成 AI 深度分析报告</p>
          <button onClick={handleGenerate} className="btn-primary"><Sparkles className="w-4 h-4 mr-2" />生成报告</button>
        </div>
      )}
    </div>
  );
}

/* ==================== 执行摘要 ==================== */
function ExecutiveSummary({ stats, dataSnapshot, aiInsights }: { stats: any; dataSnapshot: DataSnapshot; aiInsights: any }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="执行摘要" subtitle="报告周期内的核心指标概览" icon={Target} />

      {/* 核心指标 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="总成本" value={formatCurrency(stats.totalCost)} icon={DollarSign} color="emerald" subtitle={`日均 ${formatCurrency(stats.totalCost / (stats.dayCount || 1))}`} />
        <KpiCard title="总 Token 消耗" value={formatNumber(stats.totalTokens)} icon={Hash} color="blue" subtitle={`均次 ${formatNumber(Math.round(stats.totalTokens / (stats.totalRequests || 1)))}`} />
        <KpiCard title="API 请求数" value={formatNumber(stats.totalRequests)} icon={Activity} color="violet" subtitle={`日均 ${formatNumber(Math.round(stats.totalRequests / (stats.dayCount || 1)))}`} />
        <KpiCard title="节省金额" value={formatCurrency(stats.totalSavings)} icon={Wallet} color="amber" subtitle={`节省率 ${formatPercent(stats.totalSavings / (stats.totalCost || 1) * 100)}`} />
      </div>

      {/* 效率指标 */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">效率指标</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <EfficiencyMetric label="单次请求成本" value={formatCurrency(stats.avgCostPerRequest)} max={0.05} current={stats.avgCostPerRequest} unit="$" />
          <EfficiencyMetric label="每千 Token 成本" value={formatCurrency(stats.avgCostPer1kTokens)} max={0.1} current={stats.avgCostPer1kTokens} unit="$" />
          <EfficiencyMetric label="缓存命中率" value={formatPercent(stats.cacheHitRate)} max={100} current={stats.cacheHitRate} unit="%" invert />
          <EfficiencyMetric label="平均响应时间" value={`${stats.avgResponseTime}ms`} max={1000} current={stats.avgResponseTime} unit="ms" />
        </div>
      </div>

      {/* AI 洞察 */}
      {aiInsights && (
        <div className="card p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI 智能洞察</h3>
          </div>
          <p className="text-slate-700 leading-relaxed mb-5">{aiInsights.summary}</p>
          {aiInsights.recommendations && (
            <div className="space-y-3">
              {aiInsights.recommendations.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-700">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 快速概览图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">成本走势</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSnapshot.by_day}>
                <defs><linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} /><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), '成本']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
                <Area type="monotone" dataKey="cost" stroke={CHART_COLORS.primary} fill="url(#gCost)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">项目成本占比</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataSnapshot.by_project.slice(0, 6)} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="cost" nameKey="name">
                  {dataSnapshot.by_project.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== 成本分析 ==================== */
function CostAnalysis({ stats, dataSnapshot }: { stats: any; dataSnapshot: DataSnapshot }) {
  const costByDay = dataSnapshot.by_day;
  const avgDailyCost = stats.totalCost / (stats.dayCount || 1);
  const maxDayCost = Math.max(...costByDay.map((d: DayData) => d.cost), 0);
  const minDayCost = Math.min(...costByDay.map((d: DayData) => d.cost), 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="成本分析" subtitle="深入分析成本构成与变化趋势" icon={DollarSign} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="总成本" value={formatCurrency(stats.totalCost)} icon={DollarSign} color="emerald" />
        <KpiCard title="日均成本" value={formatCurrency(avgDailyCost)} icon={TrendingUp} color="blue" />
        <KpiCard title="峰值成本" value={formatCurrency(maxDayCost)} icon={ArrowUpIcon} color="amber" />
        <KpiCard title="谷值成本" value={formatCurrency(minDayCost)} icon={ArrowDownIcon} color="violet" />
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">每日成本明细</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), '成本']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Bar dataKey="cost" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 成本构成 */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">成本构成分析</h3>
        <div className="space-y-4">
          {dataSnapshot.by_project.slice(0, 5).map((p, i) => {
            const pct = (p.cost / stats.totalCost) * 100;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-medium text-slate-700">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{formatPercent(pct)}</span>
                    <span className="text-sm font-semibold">{formatCurrency(p.cost)}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==================== 项目洞察 ==================== */
function ProjectInsight({ data, totalCost }: { data: ProjectData[]; totalCost: number }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="项目洞察" subtitle="各项目的成本、使用量与效率分析" icon={Building2} />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">项目</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">成本</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">占比</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">请求数</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">成员</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">趋势</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.sort((a, b) => b.cost - a.cost).map((p, i) => {
                const pct = totalCost > 0 ? (p.cost / totalCost) * 100 : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700">{i + 1}</div>
                        <span className="font-medium text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(p.cost)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                        <span className="text-sm text-slate-600 w-12 text-right">{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(p.tokens)}</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(p.requests)}</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{p.members}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.trend > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {p.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(p.trend).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">项目成本排行</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v.toFixed(0)}`} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), '成本']} />
              <Bar dataKey="cost" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ==================== 成员洞察 ==================== */
function MemberInsight({ data, totalCost }: { data: MemberData[]; totalCost: number }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="成员洞察" subtitle="团队成员的使用情况与效率分析" icon={Users} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">成员成本分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="cost" nameKey="name">
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">成员效率排行</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sort((a, b) => b.efficiency - a.efficiency).slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="efficiency" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} name="效率指数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">成员</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">成本</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">占比</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">请求数</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">效率</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">项目</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.sort((a, b) => b.cost - a.cost).map((m) => {
                const pct = totalCost > 0 ? (m.cost / totalCost) * 100 : 0;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">{m.name[0]}</div>
                        <span className="font-medium text-slate-900">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(m.cost)}</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{pct.toFixed(1)}%</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(m.tokens)}</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(m.requests)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${m.efficiency >= 80 ? 'bg-emerald-100 text-emerald-700' : m.efficiency >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {m.efficiency}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{m.projects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==================== 模型洞察 ==================== */
function ModelInsight({ data }: { data: ModelData[] }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="模型洞察" subtitle="各模型的使用分布与成本效率" icon={PieChartIcon} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">模型成本占比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="cost" nameKey="name" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">模型请求量对比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="requests" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="请求数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">模型</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">成本</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">请求数</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">每千Token成本</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">{formatCurrency(m.cost)}</td>
                  <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(m.tokens)}</td>
                  <td className="px-5 py-4 text-right text-sm text-slate-600">{formatNumber(m.requests)}</td>
                  <td className="px-5 py-4 text-right text-sm">{formatCurrency(m.avg_cost_per_1k)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==================== 趋势分析 ==================== */
function TrendInsight({ data }: { data: DayData[] }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="趋势分析" subtitle="成本、Token 和请求量的时间序列分析" icon={TrendingUp} />

      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">成本趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs><linearGradient id="gTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} /><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), '成本']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Area type="monotone" dataKey="cost" stroke={CHART_COLORS.primary} fill="url(#gTrend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Token 使用趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(v) => [formatNumber(Number(v)), 'Token']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Line type="monotone" dataKey="tokens" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">请求量趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(v) => [formatNumber(Number(v)), '请求数']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Bar dataKey="requests" fill={CHART_COLORS.accent} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ==================== 异常检测 ==================== */
function AnomalyInsight({ data }: { data: AnomalyData[] }) {
  if (data.length === 0) return (
    <div className="space-y-6">
      <SectionHeader title="异常检测" subtitle="自动检测异常使用和成本突增" icon={AlertTriangle} />
      <div className="card p-16 text-center">
        <CheckCircle className="w-14 h-14 mx-auto text-emerald-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">一切正常</h3>
        <p className="text-sm text-slate-500">未检测到异常使用模式或成本突增</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="异常检测" subtitle={`检测到 ${data.length} 个异常事件`} icon={AlertTriangle} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="异常总数" value={String(data.length)} icon={AlertTriangle} color="rose" />
        <KpiCard title="高风险" value={String(data.filter(a => a.severity === 'high').length)} icon={AlertCircle} color="rose" />
        <KpiCard title="潜在浪费" value={formatCurrency(data.reduce((s, a) => s + (a.value - a.expected), 0))} icon={Wallet} color="amber" />
      </div>

      <div className="space-y-4">
        {data.map((a, i) => {
          const sev = SEVERITY_MAP[a.severity] || SEVERITY_MAP.low;
          const SevIcon = sev.icon;
          const typeLabel = { cost_spike: '成本突增', usage_spike: '使用突增', unusual_pattern: '异常模式' }[a.type] || a.type;
          const diff = a.expected > 0 ? ((a.value - a.expected) / a.expected * 100) : 0;
          return (
            <div key={i} className={`card p-5 border-l-4 ${a.severity === 'high' ? 'border-l-rose-500' : a.severity === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${sev.color}`}>{sev.label}</span>
                    <span className="text-sm text-slate-500">{typeLabel}</span>
                    <span className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">{a.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div><span className="text-slate-500">实际: </span><span className="font-semibold text-rose-600">{formatCurrency(a.value)}</span></div>
                    <div><span className="text-slate-500">预期: </span><span className="font-semibold">{formatCurrency(a.expected)}</span></div>
                    <div><span className="text-slate-500">偏差: </span><span className="font-semibold text-amber-600">+{diff.toFixed(1)}%</span></div>
                  </div>
                </div>
                <SevIcon className={`w-5 h-5 ${a.severity === 'high' ? 'text-rose-500' : a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================== 优化建议 ==================== */
function Recommendations({ aiInsights, stats }: { aiInsights: any; stats: any }) {
  const recommendations = [
    { title: '启用智能缓存', desc: '对重复请求启用缓存策略，预计可节省 15-25% 的 Token 消耗', impact: 'high', saving: `${formatCurrency(stats.totalCost * 0.2)}/月` },
    { title: '优化模型选择', desc: '对简单任务使用轻量模型，复杂任务使用高级模型，实现成本效益最大化', impact: 'medium', saving: `${formatCurrency(stats.totalCost * 0.1)}/月` },
    { title: '设置预算告警', desc: '为高消耗项目设置预算阈值，超出时自动告警', impact: 'medium', saving: '预防性' },
    { title: '定期审查成员权限', desc: '审查不活跃成员的 API Key 权限，减少不必要的消耗', impact: 'low', saving: `${formatCurrency(stats.totalCost * 0.05)}/月` },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="优化建议" subtitle="基于数据分析的可执行优化方案" icon={Sparkles} />

      <div className="space-y-4">
        {recommendations.map((r, i) => (
          <div key={i} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-700">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{r.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.impact === 'high' ? 'bg-rose-100 text-rose-700' : r.impact === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {r.impact === 'high' ? '高影响' : r.impact === 'medium' ? '中影响' : '低影响'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{r.desc}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">预计节省: {r.saving}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {aiInsights?.recommendations && (
        <div className="card p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI 个性化建议</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.recommendations.map((r: string, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700">{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== 通用组件 ==================== */
function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, subtitle }: { title: string; value: string; icon: any; color: string; subtitle?: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}

function EfficiencyMetric({ label, value, max, current, invert }: { label: string; value: string; max: number; current: number; unit?: string; invert?: boolean }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  const isGood = invert ? pct >= 50 : pct <= 50;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function ArrowUpIcon(props: any) { return <TrendingUp {...props} />; }
function ArrowDownIcon(props: any) { return <TrendingDown {...props} />; }
