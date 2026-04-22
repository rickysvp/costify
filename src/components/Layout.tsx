import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BarChart3, Settings,
  ChevronDown, Bell, Menu,
  LogOut, User, Users, Key, AlertTriangle, Zap, BookOpen,
  FileText, Store, Wallet, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import { API_BASE } from '../config';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, isAdmin, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  // 导航分组配置
  const navGroups = [
    {
      title: t.layout.overview,
      items: [
        { path: '/dashboard', label: t.layout.dashboard, icon: LayoutDashboard },
      ]
    },
    {
      title: t.layout.apiManagement,
      items: [
        { path: '/api-keys', label: t.layout.apiKeys, icon: Key, adminOnly: true },
        { path: '/api-market', label: t.layout.apiMarket, icon: Store },
        { path: '/billing', label: t.layout.billing, icon: Wallet, adminOnly: true },
      ]
    },
    {
      title: t.layout.dataAnalysis,
      items: [
        { path: '/usage', label: t.layout.usage, icon: BarChart3 },
        { path: '/reports', label: t.layout.reports, icon: FileText },
        { path: '/alerts', label: t.layout.alerts, icon: AlertTriangle },
      ]
    },
    {
      title: t.layout.costCenter,
      items: [
        { path: '/projects', label: t.layout.projects, icon: Building2 },
        { path: '/members', label: t.layout.members, icon: Users, adminOnly: true },
        { path: '/budget', label: t.layout.budget, icon: Wallet, adminOnly: true },
        { path: '/routing', label: t.layout.routing, icon: Zap, adminOnly: true },
      ]
    },
    {
      title: t.layout.support,
      items: [
        { path: '/docs', label: t.layout.docs, icon: BookOpen },
        { path: '/settings', label: t.layout.settings, icon: Settings },
      ]
    },
  ];

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/alerts`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setUnreadAlerts(d.unread_count || 0))
        .catch(() => {});
    }
  }, [token, location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar w-60 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0 ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-neutral-100">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src="/anytokn.png" alt="AnyTokn" className="h-10 w-auto rounded-xl shadow-sm" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title}>
                <h3 className="px-3 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1 mt-2">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-neutral-100 text-black'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                        {item.path === '/alerts' && unreadAlerts > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-black text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadAlerts}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-3 py-3 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm font-semibold text-black">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">{user?.name}</p>
              <p className="text-xs text-neutral-500">{user?.role === 'org_admin' ? t.layout.admin : t.layout.member}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors" title={t.layout.logout}>
              <LogOut className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Globe className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-600">{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
            <button
              className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => navigate('/alerts')}
            >
              <Bell className="w-5 h-5 text-neutral-500" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
              )}
            </button>
            <div className="w-px h-6 bg-neutral-200"></div>
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-semibold text-black">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-md border border-neutral-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-medium text-black">{user?.name}</p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                  >
                    <User className="w-4 h-4" /> {t.layout.settings}
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> {t.layout.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
