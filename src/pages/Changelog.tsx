import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Layout } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ---------- 类型定义 ----------
type RequirementStatus = 'planned' | 'in-progress' | 'completed';
type RequirementPriority = 'p0' | 'p1' | 'p2';

interface Requirement {
  id: string;
  title: string;
  titleEn: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  version: string;
  docLink?: string;
  prototypeLink?: string;
}

interface Version {
  version: string;
  status: 'planned' | 'in-progress' | 'completed';
  releaseDate?: string;
  requirements: Requirement[];
}

// ---------- 数据 ----------
const VERSIONS: Version[] = [
  {
    version: 'v1.0.1',
    status: 'in-progress',
    releaseDate: '2026-04-25',
    requirements: [
      {
        id: 'REQ-001',
        title: '重新设计消息通知系统',
        titleEn: 'Redesign notification system',
        status: 'completed',
        priority: 'p0',
        version: 'v1.0.1',
        docLink: 'https://github.com/rickysvp/costify/blob/main/docs/notification-messages.md',
        prototypeLink: '/alerts',
      },
      {
        id: 'REQ-002',
        title: '重新设计 Onboarding 接入流程',
        titleEn: 'Redesign onboarding flow',
        status: 'completed',
        priority: 'p0',
        version: 'v1.0.1',
        docLink: 'https://github.com/rickysvp/costify/blob/main/docs/onboarding-flow.md',
        prototypeLink: '/docs',
      },
      {
        id: 'REQ-003',
        title: '注册流程优化 - 邀请成员业务链条',
        titleEn: 'Registration flow optimization - Member invitation chain',
        status: 'planned',
        priority: 'p0',
        version: 'v1.0.1',
        docLink: 'https://github.com/rickysvp/costify/blob/main/docs/registration-flow-optimization.md',
        prototypeLink: '/members',
      },
    ],
  },
  {
    version: 'v1.0.0',
    status: 'completed',
    releaseDate: '2026-04-20',
    requirements: [
      {
        id: 'REQ-000',
        title: '产品基础功能',
        titleEn: 'Basic product features',
        status: 'completed',
        priority: 'p0',
        version: 'v1.0.0',
      },
    ],
  },
];

// ---------- 辅助函数 ----------
const getStatusBadge = (status: RequirementStatus, isEn: boolean) => {
  const styles = {
    planned: 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };
  const labels = {
    planned: isEn ? 'Planned' : '计划中',
    'in-progress': isEn ? 'In Progress' : '进行中',
    completed: isEn ? 'Completed' : '已完成',
  };
  return { style: styles[status], label: labels[status] };
};

const getPriorityBadge = (priority: RequirementPriority) => {
  const styles = {
    p0: 'bg-red-100 text-red-700',
    p1: 'bg-amber-100 text-amber-700',
    p2: 'bg-blue-100 text-blue-700',
  };
  const labels = {
    p0: 'P0',
    p1: 'P1',
    p2: 'P2',
  };
  return { style: styles[priority], label: labels[priority] };
};

// ---------- 组件 ----------
export default function Changelog() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['v1.0.1']));

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEn ? 'Version History' : '版本迭代记录'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEn ? 'Track product updates and feature releases' : '追踪产品更新和功能发布'}
          </p>
        </div>

        {/* 版本列表 */}
        <div className="space-y-4">
          {VERSIONS.map(version => {
            const isExpanded = expandedVersions.has(version.version);
            const completedCount = version.requirements.filter(r => r.status === 'completed').length;
            const totalCount = version.requirements.length;

            return (
              <div key={version.version} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* 版本头部 */}
                <button
                  onClick={() => toggleVersion(version.version)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      version.status === 'completed' ? 'bg-emerald-500' :
                      version.status === 'in-progress' ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`} />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{version.version}</h3>
                      {version.releaseDate && (
                        <p className="text-xs text-slate-500">
                          {isEn ? 'Released' : '发布于'} {version.releaseDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                      {completedCount}/{totalCount} {isEn ? 'completed' : '已完成'}
                    </span>
                    <span className="text-slate-400">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </button>

                {/* 需求表格 */}
                {isExpanded && (
                  <div className="border-t border-slate-200">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            {isEn ? 'ID' : '编号'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            {isEn ? 'Requirement' : '需求'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            {isEn ? 'Priority' : '优先级'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            {isEn ? 'Status' : '状态'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            {isEn ? 'Links' : '链接'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {version.requirements.map(req => {
                          const statusBadge = getStatusBadge(req.status, isEn);
                          const priorityBadge = getPriorityBadge(req.priority);

                          return (
                            <tr key={req.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                {req.id}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-medium text-slate-900">
                                  {isEn ? req.titleEn : req.title}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${priorityBadge.style}`}>
                                  {priorityBadge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${statusBadge.style}`}>
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {req.docLink && (
                                    <a
                                      href={req.docLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                      title={isEn ? 'Requirement Doc' : '需求文档'}
                                    >
                                      <FileText className="w-3 h-3" />
                                      {isEn ? 'Doc' : '文档'}
                                    </a>
                                  )}
                                  {req.prototypeLink && (
                                    <button
                                      onClick={() => navigate(req.prototypeLink!)}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                                      title={isEn ? 'Prototype' : '原型'}
                                    >
                                      <Layout className="w-3 h-3" />
                                      {isEn ? 'Prototype' : '原型'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部说明 */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>AnyTokn {isEn ? 'Product Version Management' : '产品版本管理'}</p>
        </div>
      </div>
    </div>
  );
}
