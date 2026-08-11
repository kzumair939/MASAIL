import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Settings, Shield, MapPin, Mail, CheckCircle, Edit3, Bell, Phone } from 'lucide-react';
import { useState } from 'react';
import { KARACHI_AREAS } from '../../data/mockData';

const ROLE_LABEL: Record<string, string> = {
  resident: 'Verified Resident',
  verification_officer: 'Verification Officer',
  field_officer: 'Field Officer',
  admin: 'Super Admin',
};

const ROLE_GLASS_BADGE: Record<string, string> = {
  resident: 'glass-badge glass-badge-primary',
  verification_officer: 'glass-badge glass-badge-warning',
  field_officer: 'glass-badge glass-badge-secondary',
  admin: 'glass-badge glass-badge-success',
};

export function Profile() {
  const { user, logout, allIssues } = useAuth();
  const navigate = useNavigate();

  const [dismissedVerifyCard, setDismissedVerifyCard] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState<'notifications' | 'privacy' | 'location' | null>(null);

  // Edit profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState('0300-1234567');
  const [editArea, setEditArea] = useState(user?.area || 'Gulshan-e-Iqbal, Karachi');

  // Settings Toggles State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [anonymousReporting, setAnonymousReporting] = useState(false);

  if (!user) return null;

  const myIssues = allIssues.slice(0, 3);
  const resolved = allIssues.filter(i => i.status === 'resolved').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = editName;
    user.area = editArea;
    setShowEditModal(false);
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto text-left space-y-6 bg-glass-mesh min-h-screen">
      {/* ── Edit Profile Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={() => setShowEditModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-md w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="font-bold text-base text-white inline-flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-400 shrink-0" />
                  <span>Edit Profile Details</span>
                </h3>
                <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Karachi Residence Area</label>
                  <select
                    value={editArea.split(',')[0]}
                    onChange={e => setEditArea(`${e.target.value}, Karachi`)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {KARACHI_AREAS.map(a => <option key={a} value={a} className="bg-[#0f172a] text-white">{a}</option>)}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="glass-btn glass-btn-primary flex-1 py-3 text-xs rounded-xl font-bold"
                  >
                    Save Profile Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="glass-btn px-4 py-3 text-xs rounded-xl font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Settings Modals (Notifications / Privacy / Location) ────────── */}
      <AnimatePresence>
        {activeSettingsModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={() => setActiveSettingsModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-md w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="font-bold text-base text-white inline-flex items-center gap-2">
                  {activeSettingsModal === 'notifications' && <><Bell size={18} className="text-blue-400 shrink-0" /> <span>Notification Preferences</span></>}
                  {activeSettingsModal === 'privacy' && <><Shield size={18} className="text-emerald-400 shrink-0" /> <span>Privacy & Security Guard</span></>}
                  {activeSettingsModal === 'location' && <><MapPin size={18} className="text-purple-400 shrink-0" /> <span>Karachi Area Preferences</span></>}
                </h3>
                <button onClick={() => setActiveSettingsModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              {activeSettingsModal === 'notifications' && (
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                    <div>
                      <p className="font-bold text-white">Email Progress Notifications</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Receive emails when field officers update work progress</p>
                    </div>
                    <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="w-4 h-4 text-blue-500 rounded accent-blue-600" />
                  </label>
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                    <div>
                      <p className="font-bold text-white">SMS Verification Alerts</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Instant text alerts for identity approvals</p>
                    </div>
                    <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} className="w-4 h-4 text-blue-500 rounded accent-blue-600" />
                  </label>
                </div>
              )}

              {activeSettingsModal === 'privacy' && (
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                    <div>
                      <p className="font-bold text-white">Anonymous Issue Reporting</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Hide your full name from public report lists</p>
                    </div>
                    <input type="checkbox" checked={anonymousReporting} onChange={e => setAnonymousReporting(e.target.checked)} className="w-4 h-4 text-emerald-500 rounded accent-emerald-600" />
                  </label>
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <p className="font-bold text-white mb-1">Data Protection Guard</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Your CNIC and utility bill photos are encrypted and visible only to assigned Verification Officers.</p>
                  </div>
                </div>
              )}

              {activeSettingsModal === 'location' && (
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-white">Primary Resident Zone</p>
                  <p className="text-slate-300 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                    📍 {user.area} (District East, Karachi)
                  </p>
                </div>
              )}

              <button
                onClick={() => setActiveSettingsModal(null)}
                className="glass-btn glass-btn-primary w-full py-3 text-xs rounded-xl font-bold"
              >
                Close Settings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Header Card */}
      <div className="glass-strong rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-xl">
        {/* Banner Gradient */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 relative" />

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-wrap items-end justify-between gap-3 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-4 border-[var(--glass-bg)] shadow-xl bg-gradient-to-br from-blue-600 to-emerald-500 shrink-0">
              {user.avatar}
            </div>
            {user.role === 'resident' && (
              <button
                onClick={() => setShowEditModal(true)}
                className="glass-btn px-4 py-2 rounded-xl text-foreground font-bold text-xs inline-flex items-center gap-2 hover:bg-[var(--glass-bg-hover)] transition-all shadow-sm"
              >
                <Edit3 size={14} className="text-blue-400 shrink-0" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>{user.name}</h1>
              <span className={ROLE_GLASS_BADGE[user.role] || 'glass-badge glass-badge-primary'}>
                {ROLE_LABEL[user.role] || 'Resident'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground pt-3 border-t border-[var(--glass-border-subtle)]">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400 shrink-0" />
                <span className="truncate">{user.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                <span>{user.verified ? 'Identity Verified' : 'Pending Verification'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Reports Filed', value: myIssues.length, icon: '📋' },
          { label: 'Issues Resolved', value: resolved, icon: '✅' },
          { label: 'Campaigns Backed', value: 2, icon: '🎯' },
        ].map(s => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-stat-card text-center p-4 rounded-2xl"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-black text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Verification Status Card */}
      {user.role === 'resident' && !dismissedVerifyCard && (
        <div className="glass-card p-5 relative">
          <button
            onClick={() => setDismissedVerifyCard(true)}
            className="absolute top-4 right-4 glass-btn-icon p-1 text-xs font-bold"
          >
            ✕
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-6">
            <h2 className="font-bold text-sm text-foreground inline-flex items-center gap-2">
              <Shield size={16} className="text-amber-400 shrink-0" />
              <span>Identity & Residence Verification</span>
            </h2>
            {!user.verified && (
              <button
                onClick={() => navigate('/verification')}
                className="glass-btn glass-btn-primary px-3.5 py-1.5 text-xs rounded-xl"
              >
                Get Verified Now →
              </button>
            )}
          </div>
          {user.verified ? (
            <p className="text-xs text-green-400 font-bold inline-flex items-center gap-1.5">
              <CheckCircle size={14} className="shrink-0" />
              <span>Account Verified 100% — You are a verified Karachi resident with full civic reporting privileges.</span>
            </p>
          ) : (
            <p className="text-xs text-amber-400">
              ⚠️ Unverified accounts can view & support issues, but cannot report new complaints until identity is approved.
            </p>
          )}
        </div>
      )}

      {/* Settings Options */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--glass-border)]">
          <h2 className="font-bold text-sm text-foreground inline-flex items-center gap-2">
            <Settings size={16} className="text-muted-foreground shrink-0" />
            <span>Account Settings & Preferences</span>
          </h2>
        </div>
        <div className="divide-y divide-[var(--glass-border-subtle)]">
          <button
            onClick={() => setActiveSettingsModal('notifications')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--glass-bg-subtle)] transition-colors text-xs font-medium text-foreground"
          >
            <div className="flex items-center gap-3">
              <Bell size={15} className="text-blue-400 shrink-0" />
              <span>Notification Preferences (Email & SMS)</span>
            </div>
            <span className="text-muted-foreground font-bold">→</span>
          </button>

          <button
            onClick={() => setActiveSettingsModal('privacy')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--glass-bg-subtle)] transition-colors text-xs font-medium text-foreground"
          >
            <div className="flex items-center gap-3">
              <Shield size={15} className="text-emerald-400 shrink-0" />
              <span>Privacy & Security Guard</span>
            </div>
            <span className="text-muted-foreground font-bold">→</span>
          </button>

          <button
            onClick={() => setActiveSettingsModal('location')}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--glass-bg-subtle)] transition-colors text-xs font-medium text-foreground"
          >
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-purple-400 shrink-0" />
              <span>Karachi Area & Zone Preferences</span>
            </div>
            <span className="text-muted-foreground font-bold">→</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => { logout(); navigate('/'); }}
        className="glass-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-red-400 font-bold text-xs"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.25)' }}
      >
        <LogOut size={16} className="shrink-0" />
        <span>Log Out Account</span>
      </motion.button>
    </div>
  );
}
