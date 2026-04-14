import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BarChart3, Settings,
  ChevronDown, Bell, CreditCard, Menu,
  LogOut, User, Users, Key, AlertTriangle, Zap, BookOpen,
  FileText, Store, PieChart, Wallet, Shield, Globe
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
        { path: '/api-market', label: 'API 市场', icon: Store },
        { path: '/api-keys', label: 'API Keys', icon: Key, adminOnly: true },
      ]
    },
    {
      title: '成本中心',
      items: [
        { path: '/projects', label: '项目管理', icon: Building2 },
        { path: '/members', label: '成员管理', icon: Users, adminOnly: true },
        { path: '/budget', label: '预算管理', icon: Wallet, adminOnly: true },
        { path: '/routing', label: '路由优化', icon: Zap, adminOnly: true },
        { path: '/billing', label: '充值管理', icon: CreditCard, adminOnly: true },
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
    <div className="flex h-screen bg-surface-50">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar w-60 bg-white border-r border-surface-200 flex flex-col flex-shrink-0 ${sidebarOpen ? 'open' : ''}`}>
        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-surface-900 tracking-tight">Costify</h1>
              <p className="text-[10px] text-surface-400">AI 成本管理</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-4 overflow-y-auto">
          {navGroups.map((group) => {
            // 过滤该组中用户有权限访问的项目
            const filteredItems = group.items.filter(item => !item.adminOnly || isAdmin);
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title}>
                <h3 className="px-3 py-1 text-[10px] font-semibold text-surface-400 uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-0.5 mt-1">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.path} to={item.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                        {item.path === '/alerts' && unreadAlerts > 0 && (
                          <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{unreadAlerts}</span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-surface-100">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-400">{user?.role === 'org_admin' ? '企业管理员' : '成员'}</p>
            </div>
            <button onClick={handleLogout} className="p-1 rounded hover:bg-surface-100" title="退出登录">
              <LogOut className="w-3.5 h-3.5 text-surface-400" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 bg-white border-b border-surface-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-surface-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5 text-surface-700" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg hover:bg-surface-100" onClick={() => navigate('/alerts')}>
              <Bell className="w-4 h-4 text-surface-500" />
              {unreadAlerts > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <div className="w-px h-5 bg-surface-200"></div>
            <div className="relative">
              <button className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-surface-100" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-semibold text-brand-700">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-surface-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-surface-100">
                    <p className="text-sm font-medium text-surface-800">{user?.name}</p>
                    <p className="text-xs text-surface-500">{user?.email}</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>
                    <User className="w-4 h-4" /> 个人设置
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> 退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
