import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import {
  Home, FileText, PlusCircle, Megaphone, Bell, User, Settings,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Shield, Users, MapPin,
  BarChart3, Briefcase, Search, Lock, Plus, Moon, Sun, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VerificationModal } from './VerificationModal';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
  requiresVerification?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/overview', icon: <BarChart3 size={18} />, label: 'Overview', roles: ['admin'] },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Users', roles: ['admin'] },
];

// Ripple effect handler
function addRipple(e: React.MouseEvent<HTMLElement>) {
  const btn = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

export function Layout() {
  const { user, logout, notifications } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    setShowVerifModal(false);
  }, [location.pathname]);

  const toggleDark = useCallback(() => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setDarkMode(html.classList.contains('dark'));
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter(
    n => (!user || n.userId === user.id || n.userId === 'all') && !n.read
  ).length;

  const dynamicNav: NavItem[] = [
    { to: '/home', icon: <Home size={18} />, label: 'Home' },
    { to: '/issues', icon: <FileText size={18} />, label: 'Issues' },
    ...(user.role === 'resident' && !user.verified ? [
      { to: '/verification', icon: <Shield size={18} />, label: 'Get Verified' }
    ] : []),
    ...(user.role === 'resident' ? [
      {
        to: '/report-issue',
        icon: !user.verified ? <Lock size={18} /> : <PlusCircle size={18} />,
        label: !user.verified ? 'Report Issue' : 'Report Issue',
        requiresVerification: !user.verified,
      },
      { to: '/my-issues', icon: <Briefcase size={18} />, label: 'My Issues' },
    ] : []),
    { to: '/campaigns', icon: <Megaphone size={18} />, label: 'Campaigns' },
    { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
    ...(user.role === 'admin' ? ADMIN_NAV : []),
  ];

  const roleLabel: Record<string, string> = {
    resident: user.verified ? 'Verified Resident' : 'Unverified Resident',
    verification_officer: 'Verification Officer',
    field_officer: 'Field Officer',
    admin: 'Super Admin',
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.requiresVerification) {
      e.preventDefault();
      setShowVerifModal(true);
    }
  };

  const handleMobileCtaClick = () => {
    if (user.role === 'resident') {
      if (!user.verified) setShowVerifModal(true);
      else navigate('/report-issue');
    } else {
      navigate('/home');
    }
  };

  const NavItemRow = ({ item, onClick, forceShowLabel }: { item: NavItem; onClick?: (e: React.MouseEvent) => void; forceShowLabel?: boolean }) => {
    const showText = forceShowLabel || !collapsed;
    return (
      <NavLink
        to={item.to}
        onClick={onClick ?? ((e) => handleNavClick(e, item))}
        className={({ isActive }) =>
          `glass-nav-item ${isActive ? 'active' : ''} ${!showText ? 'justify-center px-2' : ''}`
        }
        title={!showText ? item.label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {showText && <span>{item.label}</span>}
        {showText && item.requiresVerification && (
          <span className="ml-auto glass-badge glass-badge-warning text-[10px] px-1.5 py-0.5">🔒</span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-glass-mesh flex">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glass-orb glass-orb-primary w-96 h-96 -top-24 -left-24" />
        <div className="glass-orb glass-orb-secondary w-80 h-80 bottom-24 right-8" />
        <div className="glass-orb glass-orb-accent w-64 h-64 top-1/2 left-1/2" style={{ animationDelay: '-4s' }} />
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col glass-sidebar sticky top-0 h-screen transition-all duration-300 shrink-0 z-20 ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-3 py-4 border-b border-[var(--glass-border)] ${collapsed ? 'justify-center' : ''}`}>
          <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-9 h-9 object-contain drop-shadow-md shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-base font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Karachi Civic Platform</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="glass-btn-icon ml-auto shrink-0 p-1.5 rounded-lg"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2.5 glass-subtle rounded-xl p-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
              >
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className={`text-[10px] truncate font-semibold ${user.verified ? 'text-green-500' : 'text-amber-500'}`}>
                  {roleLabel[user.role]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {dynamicNav.map(item => (
            <NavItemRow key={item.to} item={item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-[var(--glass-border)] space-y-0.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `glass-nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <User size={18} />
            {!collapsed && 'Profile'}
          </NavLink>
          <button
            onClick={(e) => { addRipple(e); logout(); navigate('/'); }}
            className={`glass-nav-item glass-btn w-full text-red-500 hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && 'Log Out'}
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="glass-overlay fixed inset-0 z-[90] md:hidden backdrop-blur-xl"
              style={{ background: 'rgba(7, 11, 20, 0.75)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-[100] flex flex-col glass-sidebar md:hidden shadow-2xl"
              style={{ background: 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(36px)' }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-9 h-9 object-contain drop-shadow-md shrink-0" />
                  <div>
                    <span className="text-base font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
                    <p className="text-[10px] text-muted-foreground">Karachi Civic Platform</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="glass-btn-icon p-1.5">
                  <X size={18} />
                </button>
              </div>

              <div className="px-3 py-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2.5 glass-subtle rounded-xl p-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
                  >
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className={`text-[10px] truncate font-semibold ${user.verified ? 'text-green-500' : 'text-amber-500'}`}>
                      {roleLabel[user.role]}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                {dynamicNav.map(item => (
                  <NavItemRow
                    key={item.to}
                    item={item}
                    forceShowLabel={true}
                    onClick={(e) => { setMobileOpen(false); handleNavClick(e, item); }}
                  />
                ))}
              </nav>

              <div className="px-2 py-3 border-t border-[var(--glass-border)] space-y-0.5">
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="glass-nav-item">
                  <User size={18} /> Profile
                </NavLink>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="glass-nav-item w-full text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Container ── */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10">

        {/* Top Header */}
        <header className="glass-nav px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden glass-btn-icon p-2"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-8 h-8 object-contain drop-shadow-md shrink-0" />
            <span className="font-bold text-foreground text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
          </div>

          {/* Desktop search */}
          <div className="flex-1 hidden md:flex items-center max-w-sm">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search issues, areas in Karachi..."
                className="glass-search w-full pl-8"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <NavLink to="/notifications" className="relative glass-btn-icon p-2">
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 animate-glow"
                  style={{ boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </NavLink>

            {/* Avatar */}
            <NavLink
              to="/profile"
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)', boxShadow: '0 0 12px rgba(37,99,235,0.40)' }}
            >
              {user.avatar}
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Mobile Bottom Navigation ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav px-2 py-2 md:hidden border-t border-[var(--glass-border)] flex items-center justify-around">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all text-xs font-medium ${isActive
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Home size={20} />
            <span className="text-[9px]">Home</span>
          </NavLink>

          <NavLink
            to="/issues"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all text-xs font-medium ${isActive
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <FileText size={20} />
            <span className="text-[9px]">Issues</span>
          </NavLink>

          {/* Center CTA Button */}
          <button
            onClick={(e) => { addRipple(e); handleMobileCtaClick(); }}
            className="glass-btn flex flex-col items-center justify-center w-13 h-13 rounded-2xl text-white -mt-5 border-2 border-white/20 shrink-0"
            style={{
              background: user.role === 'resident'
                ? user.verified
                  ? 'linear-gradient(135deg, #2563EB, #4F46E5)'
                  : 'linear-gradient(135deg, #F59E0B, #D97706)'
                : 'linear-gradient(135deg, #22C55E, #16a34a)',
              boxShadow: user.role === 'resident'
                ? user.verified
                  ? '0 6px 24px rgba(37,99,235,0.50), 0 0 0 2px rgba(37,99,235,0.20)'
                  : '0 6px 24px rgba(245,158,11,0.50)'
                : '0 6px 24px rgba(34,197,94,0.50)',
              padding: '0.65rem',
            }}
          >
            {user.role === 'resident'
              ? user.verified ? <Plus size={22} /> : <Lock size={18} />
              : <Shield size={18} />
            }
          </button>

          <NavLink
            to={user.role === 'resident' ? '/my-issues' : '/home'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all text-xs font-medium ${isActive
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Briefcase size={20} />
            <span className="text-[9px]">{user.role === 'resident' ? 'My Reports' : 'Portal'}</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all text-xs font-medium ${isActive
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <User size={20} />
            <span className="text-[9px]">Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Verification Modal */}
      <VerificationModal isOpen={showVerifModal} onClose={() => setShowVerifModal(false)} />
    </div>
  );
}
