import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BarChart3, Settings,
  ChevronDown, Bell, CreditCard, Menu,
  LogOut, User, Users, Key, AlertTriangle, Zap, BookOpen,
  FileText, Store, Wallet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3001/api';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  // 导航分组配置
  const navGroups = [
    {
      title: '概览',
      items: [
        { path: '/dashboard', label: '总览', icon: LayoutDashboard },
      ]
    },
    {
      title: 'API 管理',
      items: [
        { path: '/api-keys', label: 'API Keys', icon: Key, adminOnly: true },
        { path: '/api-market', label: 'API 市场', icon: Store },
        { path: '/billing', label: '充值管理', icon: CreditCard, adminOnly: true },
      ]
    },
    {
      title: '成本中心',
      items: [
        { path: '/projects', label: '项目管理', icon: Building2 },
        { path: '/members', label: '成员管理', icon: Users, adminOnly: true },
        { path: '/budget', label: '预算管理', icon: Wallet, adminOnly: true },
        { path: '/routing', label: '路由优化', icon: Zap, adminOnly: true },
      ]
    },
    {
      title: '数据分析',
      items: [
        { path: '/usage', label: '使用统计', icon: BarChart3 },
        { path: '/reports', label: '分析报告', icon: FileText },
        { path: '/alerts', label: '消息通知', icon: AlertTriangle },
      ]
    },
    {
      title: '支持',
      items: [
        { path: '/docs', label: '接入指南', icon: BookOpen },
        { path: '/settings', label: '系统设置', icon: Settings },
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
    <div className="flex h-screen bg-slate-50">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar w-60 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Costify</h1>
              <p className="text-xs text-slate-500">AI 成本管理</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title}>
                <h3 className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                        {item.path === '/alerts' && unreadAlerts > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
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
        <div className="px-3 py-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === 'org_admin' ? '企业管理员' : '成员'}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="退出登录">
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => navigate('/alerts')}
            >
              <Bell className="w-5 h-5 text-slate-500" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-700">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-md border border-slate-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                  >
                    <User className="w-4 h-4" /> 个人设置
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> 退出登录
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
