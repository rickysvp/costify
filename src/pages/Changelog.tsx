import { useState } from 'react';
import {
  GitCommit,
  Calendar,
  Tag,
  CheckCircle,
  Circle,
  Clock,
  Filter,
  Search,
  FileText,
  Zap,
  Bug,
  Sparkles,
  Shield,
  BarChart3,
  GitBranch,
  User,
  Hash,
  Target,
  Lightbulb,
  TrendingUp,
  Package,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Layers,
  ListTodo,
  Rocket,
} from 'lucide-react';

// ---------- 类型定义 ----------
type RequirementStatus = 'backlog' | 'planned' | 'in-progress' | 'completed' | 'cancelled';
type RequirementPriority = 'p0' | 'p1' | 'p2' | 'p3';
type RequirementType = 'feature' | 'improvement' | 'bugfix' | 'tech-debt' | 'docs';

interface Requirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: RequirementPriority;
  version?: string;
  sprint?: string;
  author: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
  estimatedDays?: number;
  actualDays?: number;
}

interface Version {
  version: string;
  codename: string;
  status: 'planning' | 'developing' | 'testing' | 'released';
  startDate?: string;
  releaseDate?: string;
  goals: string[];
  requirements: string[];
  docLink?: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  goals: string[];
  requirements: string[];
}

// ---------- 数据存储 ----------
// 初始为空数组，后续根据定稿需求手动更新
const VERSIONS: Version[] = [
  {
    version: 'v2.0.1',
    codename: 'Stability',
    status: 'released',
    startDate: '2026-04-23',
    releaseDate: '2026-04-23',
    goals: [
      '重新设计消息通知系统',
      '补充消息文案类型（73种）',
      '支持中英文国际化',
      '完善消息通知文档',
    ],
    requirements: ['req-001', 'req-002'],
    docLink: 'https://github.com/rickysvp/costify/blob/main/docs/notification-messages.md',
  },
  {
    version: 'v2.0.0',
    codename: 'Foundation',
    status: 'released',
    startDate: '2026-04-01',
    releaseDate: '2026-04-20',
    goals: [
      '全新架构升级',
      '企业级功能支持',
      '多租户架构',
    ],
    requirements: [],
  },
];

const SPRINTS: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - 消息通知优化',
    startDate: '2026-04-23',
    endDate: '2026-04-30',
    status: 'active',
    goals: ['重新设计消息通知系统', '补充73种消息文案类型', '完善文档'],
    requirements: ['req-001', 'req-002'],
  },
];

const REQUIREMENTS: Requirement[] = [
  {
    id: 'req-001',
    title: '重新设计消息通知系统',
    description: '重构消息通知中心，支持分类筛选、严重程度筛选，整合整站国际化(i18n)系统，支持中英文切换',
    type: 'feature',
    status: 'completed',
    priority: 'p0',
    version: 'v2.0.1',
    sprint: 'sprint-1',
    author: '产品经理',
    createdAt: '2026-04-23',
    completedAt: '2026-04-23',
    tags: ['消息通知', '重构', '国际化'],
    estimatedDays: 2,
    actualDays: 2,
  },
  {
    id: 'req-002',
    title: '补充消息文案类型',
    description: '补充完整的消息通知文案类型，覆盖10大分类共73种通知场景，每种类型包含中英文标题和内容',
    type: 'feature',
    status: 'completed',
    priority: 'p0',
    version: 'v2.0.1',
    sprint: 'sprint-1',
    author: '产品经理',
    createdAt: '2026-04-23',
    completedAt: '2026-04-23',
    tags: ['消息通知', '文案', '文档'],
    estimatedDays: 2,
    actualDays: 2,
  },
];

// ---------- 辅助函数 ----------
const getStatusIcon = (status: RequirementStatus) => {
  const icons = {
    backlog: Circle,
    planned: Calendar,
    'in-progress': Rocket,
    completed: CheckCircle,
    cancelled: FileText,
  };
  return icons[status];
};

const getStatusLabel = (status: RequirementStatus) => {
  const labels = {
    backlog: '需求池',
    planned: '已规划',
    'in-progress': '进行中',
    completed: '已完成',
    cancelled: '已取消',
  };
  return labels[status];
};

const getStatusStyle = (status: RequirementStatus) => {
  const styles = {
    backlog: 'text-surface-400',
    planned: 'text-blue-600',
    'in-progress': 'text-amber-600',
    completed: 'text-emerald-600',
    cancelled: 'text-red-400',
  };
  return styles[status];
};

const getPriorityStyle = (priority: RequirementPriority) => {
  const styles = {
    p0: 'bg-red-50 text-red-700 border-red-200',
    p1: 'bg-amber-50 text-amber-700 border-amber-200',
    p2: 'bg-blue-50 text-blue-700 border-blue-200',
    p3: 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return styles[priority];
};

const getPriorityLabel = (priority: RequirementPriority) => {
  const labels = {
    p0: 'P0-紧急',
    p1: 'P1-高优',
    p2: 'P2-中优',
    p3: 'P3-低优',
  };
  return labels[priority];
};

const getTypeIcon = (type: RequirementType) => {
  const icons = {
    feature: Sparkles,
    improvement: TrendingUp,
    bugfix: Bug,
    'tech-debt': GitCommit,
    docs: FileText,
  };
  return icons[type];
};

const getTypeLabel = (type: RequirementType) => {
  const labels = {
    feature: '新功能',
    improvement: '优化',
    bugfix: 'Bug修复',
    'tech-debt': '技术债',
    docs: '文档',
  };
  return labels[type];
};

const getTypeStyle = (type: RequirementType) => {
  const styles = {
    feature: 'bg-purple-50 text-purple-700 border-purple-200',
    improvement: 'bg-blue-50 text-blue-700 border-blue-200',
    bugfix: 'bg-red-50 text-red-700 border-red-200',
    'tech-debt': 'bg-gray-50 text-gray-700 border-gray-200',
    docs: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return styles[type];
};

// ---------- 组件 ----------
export default function Changelog() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'backlog' | 'versions'>('roadmap');
  const [filterStatus, setFilterStatus] = useState<RequirementStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<RequirementPriority | 'all'>('all');
  const [filterType, setFilterType] = useState<RequirementType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['v2.1.0', 'v2.0.1']));

  // 筛选需求
  const filteredRequirements = REQUIREMENTS.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterPriority !== 'all' && req.priority !== filterPriority) return false;
    if (filterType !== 'all' && req.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // 需求池（未分配版本）
  const backlogRequirements = REQUIREMENTS.filter(r => r.status === 'backlog');

  // 统计
  const stats = {
    total: REQUIREMENTS.length,
    completed: REQUIREMENTS.filter(r => r.status === 'completed').length,
    inProgress: REQUIREMENTS.filter(r => r.status === 'in-progress').length,
    backlog: REQUIREMENTS.filter(r => r.status === 'backlog').length,
    p0: REQUIREMENTS.filter(r => r.priority === 'p0').length,
    p1: REQUIREMENTS.filter(r => r.priority === 'p1').length,
  };

  // 切换版本展开
  const toggleVersion = (version: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">产品需求管理</h1>
          <p className="text-sm text-surface-500 mt-1">
            AnyTokn v2.0 产品规划 · {stats.total} 个需求 · {stats.completed} 已完成
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-brand-100 text-brand-700">v2.0.0 Foundation</span>
          <span className="text-xs text-surface-400">当前版本</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-surface-900">{stats.total}</p>
          <p className="text-xs text-surface-500">总需求</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-surface-500">已完成</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-amber-600">{stats.inProgress}</p>
          <p className="text-xs text-surface-500">进行中</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-surface-600">{stats.backlog}</p>
          <p className="text-xs text-surface-500">需求池</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-red-600">{stats.p0}</p>
          <p className="text-xs text-surface-500">P0紧急</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{stats.p1}</p>
          <p className="text-xs text-surface-500">P1高优</p>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex items-center gap-1 border-b border-surface-200">
        {[
          { key: 'roadmap', label: '产品路线图', icon: Target },
          { key: 'backlog', label: '需求池', icon: ListTodo },
          { key: 'versions', label: '版本管理', icon: Package },
        ].map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-600 hover:text-surface-900'
            }`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Filter className="w-3.5 h-3.5" />
            <span>筛选</span>
          </div>

          {/* 状态筛选 */}
          <select
            className="text-xs border rounded px-2 py-1 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RequirementStatus | 'all')}
          >
            <option value="all">全部状态</option>
            <option value="backlog">需求池</option>
            <option value="planned">已规划</option>
            <option value="in-progress">进行中</option>
            <option value="completed">已完成</option>
          </select>

          {/* 优先级筛选 */}
          <select
            className="text-xs border rounded px-2 py-1 bg-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as RequirementPriority | 'all')}
          >
            <option value="all">全部优先级</option>
            <option value="p0">P0-紧急</option>
            <option value="p1">P1-高优</option>
            <option value="p2">P2-中优</option>
            <option value="p3">P3-低优</option>
          </select>

          {/* 类型筛选 */}
          <select
            className="text-xs border rounded px-2 py-1 bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RequirementType | 'all')}
          >
            <option value="all">全部类型</option>
            <option value="feature">新功能</option>
            <option value="improvement">优化</option>
            <option value="bugfix">Bug修复</option>
            <option value="tech-debt">技术债</option>
          </select>

          {/* 搜索 */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="text"
              placeholder="搜索需求标题、描述、标签..."
              className="w-full text-xs border border-surface-200 rounded-lg pl-8 pr-8 py-1.5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-2 top-2" onClick={() => setSearchQuery('')}>
                <span className="text-surface-400">×</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 产品路线图 */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {VERSIONS.map(version => {
            const versionReqs = REQUIREMENTS.filter(r => r.version === version.version);
            const isExpanded = expandedVersions.has(version.version);

            return (
              <div key={version.version} className="card">
                {/* 版本标题 */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-50 transition-colors"
                  onClick={() => toggleVersion(version.version)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      version.status === 'released' ? 'bg-emerald-50 text-emerald-600' :
                      version.status === 'developing' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      <Rocket className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-surface-900">{version.version}</h3>
                        <span className="text-sm text-surface-500">{version.codename}</span>
                        <span className={`badge text-[10px] ${
                          version.status === 'released' ? 'bg-emerald-50 text-emerald-700' :
                          version.status === 'developing' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {version.status === 'released' ? '已发布' :
                           version.status === 'developing' ? '开发中' : '规划中'}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500">
                        {versionReqs.length} 个需求 · {versionReqs.filter(r => r.status === 'completed').length} 已完成
                        {version.releaseDate && ` · 预计发布 ${version.releaseDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <span className="text-surface-400">▼</span>
                    ) : (
                      <span className="text-surface-400">▶</span>
                    )}
                  </div>
                </button>

                {/* 版本详情 */}
                {isExpanded && (
                  <div className="border-t border-surface-100 px-5 py-4">
                    {/* 版本目标 */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-surface-700 mb-2">版本目标</h4>
                      <ul className="space-y-1">
                        {version.goals.map((goal, idx) => (
                          <li key={idx} className="text-sm text-surface-600 flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-brand-500" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 需求列表 */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-surface-700">需求列表</h4>
                      {versionReqs.map(req => {
                        const StatusIcon = getStatusIcon(req.status);
                        const TypeIcon = getTypeIcon(req.type);

                        return (
                          <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyle(req.type)}`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-surface-400">{req.id}</span>
                                <span className={`badge text-[10px] ${getPriorityStyle(req.priority)}`}>
                                  {getPriorityLabel(req.priority)}
                                </span>
                                <span className={`text-[10px] flex items-center gap-1 ${getStatusStyle(req.status)}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {getStatusLabel(req.status)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-surface-800">{req.title}</p>
                              <p className="text-xs text-surface-600 mt-0.5">{req.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                                <span>负责人: {req.author}</span>
                                {req.estimatedDays && <span>预计: {req.estimatedDays}天</span>}
                                {req.actualDays && <span>实际: {req.actualDays}天</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 需求池 */}
      {activeTab === 'backlog' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-surface-700">
              需求池 ({backlogRequirements.length} 个未规划需求)
            </h3>
          </div>

          {backlogRequirements.map(req => {
            const TypeIcon = getTypeIcon(req.type);

            return (
              <div key={req.id} className="card p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyle(req.type)}`}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-surface-400">{req.id}</span>
                    <span className={`badge text-[10px] ${getPriorityStyle(req.priority)}`}>
                      {getPriorityLabel(req.priority)}
                    </span>
                    <span className={`badge text-[10px] ${getTypeStyle(req.type)}`}>
                      {getTypeLabel(req.type)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-surface-800">{req.title}</p>
                  <p className="text-sm text-surface-600 mt-1">{req.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {req.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-surface-400">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                    <span>负责人: {req.author}</span>
                    <span>创建: {req.createdAt}</span>
                    {req.estimatedDays && <span>预计工时: {req.estimatedDays}天</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 版本管理 */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VERSIONS.map(version => (
              <div key={version.version} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-surface-900">{version.version}</h3>
                    <p className="text-sm text-surface-500">{version.codename}</p>
                  </div>
                  <span className={`badge text-[10px] ${
                    version.status === 'released' ? 'bg-emerald-50 text-emerald-700' :
                    version.status === 'developing' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {version.status === 'released' ? '已发布' :
                     version.status === 'developing' ? '开发中' : '规划中'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">开始日期</span>
                    <span className="text-surface-700">{version.startDate || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">发布日期</span>
                    <span className="text-surface-700">{version.releaseDate || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">需求数量</span>
                    <span className="text-surface-700">{version.requirements.length}</span>
                  </div>
                  {version.docLink && (
                    <div className="pt-2 mt-2 border-t border-surface-100">
                      <a 
                        href={version.docLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        查看文档
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sprint列表 */}
          <div className="card">
            <div className="px-5 py-4 border-b border-surface-100">
              <h3 className="text-base font-semibold text-surface-900">Sprint 迭代</h3>
            </div>
            <div className="divide-y divide-surface-100">
              {SPRINTS.map(sprint => (
                <div key={sprint.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-surface-800">{sprint.name}</h4>
                      <span className={`badge text-[10px] ${
                        sprint.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        sprint.status === 'active' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {sprint.status === 'completed' ? '已完成' :
                         sprint.status === 'active' ? '进行中' : '规划中'}
                      </span>
                    </div>
                    <span className="text-xs text-surface-400">
                      {sprint.startDate} ~ {sprint.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-surface-500">
                    <span>{sprint.requirements.length} 个需求</span>
                    <span>{sprint.goals.length} 个目标</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="text-center text-xs text-surface-400">
        <p>AnyTokn 产品需求管理系统 v2.0</p>
        <p className="mt-1">需求编号规则：REQ-XXX | 版本号规则：v主版本.次版本.修订号</p>
      </div>
    </div>
  );
}
