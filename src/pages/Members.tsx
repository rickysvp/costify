import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Search,
  Copy,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import { API_BASE } from '../config';

// ---------- Types ----------
interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: 'org_admin' | 'member';
  projects: Project[];
  monthly_spend: number;
}

interface InviteForm {
  email: string;
  name: string;
  role: 'org_admin' | 'member';
  project_ids: number[];
}

// ---------- Component ----------
export default function Members() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: '',
    name: '',
    role: 'member',
    project_ids: [],
  });
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Temp password display
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copiedPwd, setCopiedPwd] = useState(false);

  // Change role
  const [changingRoleMember, setChangingRoleMember] = useState<Member | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Remove member confirm
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

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
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/members`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(t.members.inviteError);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : data.members ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.members.inviteError);
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
      // silent — projects are optional for invite
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchProjects();
  }, [fetchMembers, fetchProjects]);

  // ---------- Handlers ----------
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`${API_BASE}/members/invite`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(inviteForm),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '邀请失败');
      }
      const data = await res.json();
      setTempPassword(data.temporary_password ?? data.temp_password ?? null);
      showToast(t.members.inviteSuccess);
      fetchMembers();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : t.members.inviteError);
    } finally {
      setIsInviting(false);
    }
  };

  const handleChangeRole = async () => {
    if (!changingRoleMember) return;
    setIsChangingRole(true);
    try {
      const newRole = changingRoleMember.role === 'org_admin' ? 'member' : 'org_admin';
      const res = await fetch(`${API_BASE}/members/${changingRoleMember.id}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || t.members.roleChangeSuccess);
      }
      showToast(
        t.members.changeRoleDesc
          .replace('{name}', changingRoleMember.name)
          .replace('{oldRole}', changingRoleMember.role === 'org_admin' ? t.layout.admin : t.layout.member)
          .replace('{newRole}', newRole === 'org_admin' ? t.layout.admin : t.layout.member)
      );
      setChangingRoleMember(null);
      fetchMembers();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.members.roleChangeSuccess, 'error');
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      const res = await fetch(`${API_BASE}/members/${removeTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || t.members.removeSuccess);
      }
      showToast(t.members.removeSuccess + ': ' + removeTarget.name);
      setRemoveTarget(null);
      fetchMembers();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.members.removeSuccess, 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPwd(true);
      setTimeout(() => setCopiedPwd(false), 2000);
      showToast(t.members.copySuccess);
    } catch {
      showToast(t.members.copyError, 'error');
    }
  };

  const toggleProjectId = (pid: number) => {
    setInviteForm((prev) => ({
      ...prev,
      project_ids: prev.project_ids.includes(pid)
        ? prev.project_ids.filter((id) => id !== pid)
        : [...prev.project_ids, pid],
    }));
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setInviteForm({ email: '', name: '', role: 'member', project_ids: [] });
    setInviteError(null);
    setTempPassword(null);
    setCopiedPwd(false);
  };

  // ---------- Filtering ----------
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------- Guard ----------
  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-surface-700">{t.members.noAccess}</h2>
          <p className="text-sm text-surface-500 mt-1">{t.members.noAccessDesc}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-surface-900">{t.layout.members}</h1>
          <p className="text-sm text-surface-500 mt-1">{t.members.subtitle}</p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-1.5 self-start" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="w-3.5 h-3.5" /> {t.members.inviteMember}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Table card */}
      <div className="card">
        {/* Search bar */}
        <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold text-surface-800">{t.members.title}</h3>
          <div className="relative">
            <input
              type="text"
              placeholder={t.common.search + "..."}
              className="text-xs border border-surface-200 rounded-lg pl-8 pr-3 py-1.5 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full sm:w-56"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-surface-400" />
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
            <span className="ml-3 text-sm text-surface-600">{t.common.loading}</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-10 h-10 text-surface-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-surface-700">{t.members.noMembers}</h3>
            <p className="text-xs text-surface-500 mt-1">{t.members.subtitle}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-surface-200">
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500">{t.members.memberName}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500">{t.members.memberEmail}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500">{t.common.role}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500">{t.members.projects}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500 text-right">{t.members.monthlySpend}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-surface-500 text-right">{t.common.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-surface-800">{member.name}</td>
                    <td className="px-5 py-3 text-xs text-surface-600">{member.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] px-2 py-1 rounded ${
                          member.role === 'org_admin'
                            ? 'bg-brand-50 text-brand-700'
                            : 'bg-surface-100 text-surface-600'
                        }`}
                      >
                        {member.role === 'org_admin' ? (
                          <span className="inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {t.layout.admin}
                          </span>
                        ) : (
                          t.layout.member
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {member.projects && member.projects.length > 0 ? (
                          member.projects.map((p) => (
                            <span key={p.id} className="text-[10px] px-2 py-0.5 rounded bg-surface-100 text-surface-600">
                              {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-surface-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-surface-800 text-right">
                      ${typeof member.monthly_spend === 'number' ? member.monthly_spend.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-brand-600"
                          title={t.members.changeRole}
                          onClick={() => setChangingRoleMember(member)}
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-surface-500 hover:text-red-600"
                          title={t.members.removeMember}
                          onClick={() => setRemoveTarget(member)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Invite Modal ===== */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeInviteModal} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-surface-900">{t.members.inviteModalTitle}</h3>
              <button onClick={closeInviteModal} className="p-1.5 rounded-lg hover:bg-surface-100">
                <X className="w-4 h-4 text-surface-500" />
              </button>
            </div>

            {/* Temp password display */}
            {tempPassword ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-900">{t.members.inviteSent}</h4>
                    <p className="text-xs text-surface-500">{t.members.inviteSentDesc}</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700 mb-2 font-medium">{t.members.tempPassword}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-white border border-amber-200 rounded px-3 py-2 select-all text-surface-800">
                      {tempPassword}
                    </code>
                    <button
                      className="p-2 rounded-lg hover:bg-amber-100 transition-colors text-amber-700"
                      onClick={() => copyToClipboard(tempPassword)}
                    >
                      {copiedPwd ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button className="btn-primary text-xs w-full" onClick={closeInviteModal}>
                  {t.members.closeAndSaved}
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="flex flex-col overflow-hidden">
                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                  {inviteError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{inviteError}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.members.memberEmail} *</label>
                    <input
                      type="email"
                      required
                      className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder={t.members.emailPlaceholder}
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.members.memberName} *</label>
                    <input
                      type="text"
                      required
                      className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      placeholder={t.members.namePlaceholder}
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.members.role}</label>
                    <div className="relative">
                      <select
                        className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none"
                        value={inviteForm.role}
                        onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as 'org_admin' | 'member' })}
                      >
                        <option value="member">{t.layout.member}</option>
                        <option value="org_admin">{t.layout.admin}</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1.5">{t.members.assignProjects}</label>
                    {projects.length === 0 ? (
                      <p className="text-xs text-surface-400">{t.members.noAvailableProjects}</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-surface-200 rounded-lg p-3">
                        {projects.map((project) => (
                          <label key={project.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                              checked={inviteForm.project_ids.includes(project.id)}
                              onChange={() => toggleProjectId(project.id)}
                            />
                            <span className="text-xs text-surface-700">{project.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5 border-t border-surface-100 flex items-center gap-3 flex-shrink-0">
                  <button type="button" className="btn-secondary text-xs flex-1" onClick={closeInviteModal} disabled={isInviting}>
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
                    disabled={isInviting}
                  >
                    {isInviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isInviting ? t.members.sendingInvite : t.members.sendInvite}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== Change Role Confirm ===== */}
      {changingRoleMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setChangingRoleMember(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">{t.members.changeRole}</h3>
                  <p className="text-xs text-surface-500">
                    {t.members.changeRoleDesc
                      .replace('{name}', changingRoleMember.name)
                      .replace('{oldRole}', changingRoleMember.role === 'org_admin' ? t.layout.admin : t.layout.member)
                      .replace('{newRole}', changingRoleMember.role === 'org_admin' ? t.layout.member : t.layout.admin)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  className="btn-secondary text-xs"
                  onClick={() => setChangingRoleMember(null)}
                  disabled={isChangingRole}
                >
                  {t.common.cancel}
                </button>
                <button
                  className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
                  onClick={handleChangeRole}
                  disabled={isChangingRole}
                >
                  {isChangingRole && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {t.members.confirmChange}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Remove Member Confirm ===== */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setRemoveTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">{t.members.confirmRemove}</h3>
                  <p className="text-xs text-surface-500">{t.members.removeWarning}</p>
                </div>
              </div>
              <p className="text-sm text-surface-600 mb-5">
                {t.members.removeConfirmDesc.replace('{name}', removeTarget.name)}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  className="btn-secondary text-xs"
                  onClick={() => setRemoveTarget(null)}
                  disabled={isRemoving}
                >
                  {t.common.cancel}
                </button>
                <button
                  className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  {isRemoving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isRemoving ? t.members.removing : t.members.confirmRemoveAction}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
