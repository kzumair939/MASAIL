import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, UserPlus, Shield, CheckCircle, Search, Filter, Trash2, Edit2, Key,
  X, Check, Lock, MapPin, Mail, User, AlertTriangle, ArrowRight, ShieldCheck, HardHat
} from 'lucide-react';
import { MOCK_ACCOUNTS, AuthUser, UserRole } from '../../context/AuthContext';
import { KARACHI_AREAS } from '../../data/mockData';

interface SystemAccount extends AuthUser {
  password?: string;
  createdAt?: string;
}

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<SystemAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load all accounts from MOCK_ACCOUNTS + localStorage
  const getCombinedAccounts = (): SystemAccount[] => {
    const stored = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('masail_registered_users') || '{}' : '{}');
    const combinedMap: Record<string, SystemAccount> = { ...MOCK_ACCOUNTS, ...stored };
    return Object.values(combinedMap);
  };

  const [accounts, setAccounts] = useState<SystemAccount[]>(getCombinedAccounts);

  // Form State for Add / Edit Officer
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'field_officer' as UserRole,
    area: 'Gulshan-e-Iqbal',
    verified: true,
  });

  const saveUserToStorage = (userObj: SystemAccount) => {
    const stored = JSON.parse(localStorage.getItem('masail_registered_users') || '{}');
    const cleanEmail = userObj.email.trim().toLowerCase();
    stored[cleanEmail] = userObj;
    MOCK_ACCOUNTS[cleanEmail] = userObj;
    localStorage.setItem('masail_registered_users', JSON.stringify(stored));
    setAccounts(getCombinedAccounts());
  };

  const deleteUserFromStorage = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const stored = JSON.parse(localStorage.getItem('masail_registered_users') || '{}');
    delete stored[cleanEmail];
    delete MOCK_ACCOUNTS[cleanEmail];
    localStorage.setItem('masail_registered_users', JSON.stringify(stored));
    setAccounts(getCombinedAccounts());
  };

  const handleOpenAddModal = () => {
    setForm({
      id: `off_${Date.now()}`,
      name: '',
      email: '',
      password: '',
      role: 'field_officer',
      area: 'Gulshan-e-Iqbal',
      verified: true,
    });
    setEditingUser(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (acc: SystemAccount) => {
    setEditingUser(acc);
    setForm({
      id: acc.id,
      name: acc.name,
      email: acc.email,
      password: acc.password || 'masail123',
      role: acc.role,
      area: acc.area || 'Gulshan-e-Iqbal',
      verified: acc.verified,
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;

    const avatarInitials = form.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'OFF';

    const updatedAccount: SystemAccount = {
      id: form.id || `off_${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
      role: form.role,
      area: form.area,
      avatar: avatarInitials,
      verified: form.role === 'resident' ? form.verified : true,
    };

    saveUserToStorage(updatedAccount);
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    deleteUserFromStorage(deletingUser.email);
    setDeletingUser(null);
  };

  const copyCredentials = (acc: SystemAccount) => {
    const text = `MASAIL Officer Access Credentials:\nRole: ${acc.role.toUpperCase()}\nName: ${acc.name}\nEmail: ${acc.email}\nPassword: ${acc.password || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    if (roleFilter !== 'all' && acc.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        acc.name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        (acc.area && acc.area.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="glass-badge glass-badge-danger flex items-center gap-1"><Shield size={12} /> Super Admin</span>;
      case 'verification_officer':
        return <span className="glass-badge glass-badge-primary flex items-center gap-1"><ShieldCheck size={12} /> Verification Officer</span>;
      case 'field_officer':
        return <span className="glass-badge glass-badge-warning flex items-center gap-1"><HardHat size={12} /> Field Officer</span>;
      case 'resident':
        return <span className="glass-badge glass-badge-muted flex items-center gap-1"><User size={12} /> Resident</span>;
      default:
        return <span className="glass-badge glass-badge-muted">{role}</span>;
    }
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>User & Officer Governance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage platform access, appoint Field Officers, Verification Officers & Super Admins</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={handleOpenAddModal}
          className="glass-btn glass-btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
        >
          <UserPlus size={16} />
          <span>Appoint New Officer</span>
        </motion.button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Platform Accounts', value: accounts.length, color: 'text-blue-500', bg: 'rgba(37,99,235,0.12)' },
          { label: 'Field Officers (On Ground)', value: accounts.filter(a => a.role === 'field_officer').length, color: 'text-amber-500', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Verification Officers', value: accounts.filter(a => a.role === 'verification_officer').length, color: 'text-purple-500', bg: 'rgba(168,85,247,0.12)' },
          { label: 'Citizens & Residents', value: accounts.filter(a => a.role === 'resident').length, color: 'text-emerald-500', bg: 'rgba(34,197,94,0.12)' },
        ].map((s, i) => (
          <div key={i} className="glass-stat-card">
            <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or Karachi area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'field_officer', label: 'Field Officers' },
            { id: 'verification_officer', label: 'Verif. Officers' },
            { id: 'resident', label: 'Residents' },
            { id: 'admin', label: 'Admins' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                roleFilter === r.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'glass-subtle text-muted-foreground hover:text-foreground'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="glass-subtle border-b border-[var(--glass-border)]">
              <tr>
                {['User / Officer', 'Role', 'Assigned Area', 'Credentials', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border-subtle)]">
              {filteredAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-[var(--glass-bg-subtle)] transition-colors">
                  {/* User info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
                      >
                        {acc.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground leading-tight">{acc.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{acc.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    {getRoleBadge(acc.role)}
                  </td>

                  {/* Area */}
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={12} className="text-amber-500 shrink-0" />
                      {acc.area || 'Karachi Central'}
                    </span>
                  </td>

                  {/* Password & Credentials */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-slate-300">
                        {acc.password || 'user123'}
                      </span>
                      <button
                        onClick={() => copyCredentials(acc)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Copy credentials"
                      >
                        {copiedId === acc.id ? <Check size={14} className="text-green-400" /> : <Key size={14} />}
                      </button>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {acc.verified ? (
                      <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                        <CheckCircle size={13} /> Active & Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                        <AlertTriangle size={13} /> Unverified
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(acc)}
                        className="p-1.5 rounded-lg glass-subtle hover:bg-blue-500/20 text-blue-400 transition-colors"
                        title="Edit officer details"
                      >
                        <Edit2 size={14} />
                      </button>
                      {acc.email !== 'admin@masail.pk' && (
                        <button
                          onClick={() => setDeletingUser(acc)}
                          className="p-1.5 rounded-lg glass-subtle hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Officer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-10"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative max-w-md w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <UserPlus size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {editingUser ? 'Edit Officer Account' : 'Appoint New Officer'}
                    </h3>
                    <p className="text-xs text-slate-400">Set permissions and login credentials</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Role */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assign Role & Authority</label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                    className="glass-input w-full text-xs text-slate-200"
                  >
                    <option value="field_officer">Field Officer (On-Ground Inspection & Repair)</option>
                    <option value="verification_officer">Verification Officer (Resident Identity Approval)</option>
                    {editingUser && (
                      <>
                        <option value="admin">Super Admin (System Governance)</option>
                        <option value="resident">Resident Citizen</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Officer Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inspector Imran Raza"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="glass-input pl-9 w-full text-xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. field.gulshan@masail.pk"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="glass-input pl-9 w-full text-xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Access Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. field123"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="glass-input pl-9 w-full text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Area Jurisdiction */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Karachi Jurisdiction</label>
                  <select
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    className="glass-input w-full text-xs text-slate-200"
                  >
                    <option value="All Areas">All Areas (Karachi Wide)</option>
                    {KARACHI_AREAS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="glass-btn glass-btn-primary flex-1 py-3 text-xs font-semibold rounded-xl"
                  >
                    {editingUser ? 'Update Account' : 'Save & Grant Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 px-4 rounded-xl text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-10" onClick={() => setDeletingUser(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative max-w-sm w-full p-6 z-20 bg-[#0f172a]/95 border border-red-500/30 rounded-3xl shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Revoke Officer Access?</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Are you sure you want to revoke access for <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email})? They will no longer be able to log in.
              </p>
              <div className="flex gap-2">
                <button onClick={handleConfirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition-all">
                  Confirm Revoke
                </button>
                <button onClick={() => setDeletingUser(null)} className="py-3 px-4 text-xs text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
