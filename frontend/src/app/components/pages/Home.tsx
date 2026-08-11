import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

import {
  PlusCircle, FileText, Megaphone, TrendingUp, CheckCircle, Clock,
  AlertCircle, ArrowRight, MapPin, Inbox, Users, BarChart3, Briefcase, Lock, Shield
} from 'lucide-react';
import { ProcessTracker } from '../ProcessTracker';
import { StatusBadge, CategoryBadge } from '../StatusBadge';
import { ISSUE_CATEGORIES } from '../../data/mockData';
import { useState, useEffect } from 'react';
import { VerificationModal } from '../VerificationModal';
import { ImageFileUpload } from '../ImageFileUpload';


function StatCard({
  value, label, icon, color,
}: { value: string | number; label: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-stat-card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center glass-subtle ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Resident Dashboard ────────────────────────────────────────────── */
function ResidentHome() {
  const { user, myIssues } = useAuth();
  const navigate = useNavigate();
  const [showVerifModal, setShowVerifModal] = useState(false);

  if (!user) return null;

  const resolved = myIssues.filter(i => i.status === 'resolved').length;
  const pending = myIssues.filter(i => i.status !== 'resolved').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleReportClick = () => {
    if (!user.verified) {
      setShowVerifModal(true);
    } else {
      navigate('/report-issue');
    }
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto bg-glass-mesh min-h-full">
      {/* Verification Required Popup Modal */}
      <VerificationModal isOpen={showVerifModal} onClose={() => setShowVerifModal(false)} />

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {greeting}, {user.name.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={14} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{user.area}</p>
          </div>
        </div>

        {!user.verified && (
          <button
            onClick={() => navigate('/verification')}
            className="glass-btn flex items-center gap-2 px-4 py-2 text-amber-500 text-xs font-semibold rounded-xl"
            style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.30)' }}
          >
            <Shield size={14} />
            Get Verified to Report Issues 🔒
          </button>
        )}
      </motion.div>

      {/* Stats — driven by real user data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard value={myIssues.length} label="My Reports" icon={<FileText size={22} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard value={resolved} label="Issues Resolved" icon={<CheckCircle size={22} className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard value={pending} label="Pending Review" icon={<Clock size={22} className="text-amber-600" />} color="bg-amber-50" />
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={handleReportClick}
            className="glass-btn flex items-center gap-3 p-4 rounded-2xl text-white text-left"
            style={{ background: user.verified ? 'linear-gradient(135deg, #2563EB, #4F46E5)' : 'linear-gradient(135deg, #D97706, #B45309)', boxShadow: user.verified ? '0 8px 28px rgba(37,99,235,0.40)' : '0 8px 28px rgba(217,119,6,0.40)' }}
          >
            {user.verified ? <PlusCircle size={22} /> : <Lock size={22} />}
            <div>
              <p className="font-bold text-sm flex items-center gap-1.5">
                Report New Issue {!user.verified && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-normal">🔒 Locked</span>}
              </p>
              <p className="text-white/70 text-xs mt-0.5">{user.verified ? 'Street, drain, light, water…' : 'Verify identity to unlock'}</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={() => navigate('/my-issues')}
            className="glass-card flex items-center gap-3 p-4 rounded-2xl text-left"
          >
            <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <Briefcase size={18} className="text-green-500" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">My Issues</p>
              <p className="text-muted-foreground text-xs mt-0.5">{myIssues.length} issue{myIssues.length !== 1 ? 's' : ''} submitted</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={() => navigate('/issues')}
            className="glass-card flex items-center gap-3 p-4 rounded-2xl text-left"
          >
            <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.10)' }}>
              <FileText size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Browse Issues</p>
              <p className="text-muted-foreground text-xs mt-0.5">All reports in Karachi</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* My Recent Issues — Main section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">My Recent Issues</h2>
          {myIssues.length > 0 && (
            <button onClick={() => navigate('/my-issues')} className="glass-btn glass-btn-ghost text-xs text-blue-500 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg">
              See all <ArrowRight size={12} />
            </button>
          )}
        </div>

        {myIssues.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl glass-subtle flex items-center justify-center mb-4">
              <Inbox size={26} className="text-muted-foreground opacity-50" />
            </div>
            <p className="font-bold text-foreground text-sm">No issues reported yet</p>
            <p className="text-muted-foreground text-xs mt-1.5 max-w-xs">
              {user.verified
                ? 'Use "Report New Issue" above to submit your first civic complaint'
                : 'Complete identity verification to unlock issue reporting'}
            </p>
            <button
              onClick={handleReportClick}
              className="glass-btn glass-btn-primary mt-5 px-5 py-2 text-sm rounded-xl"
            >
              {user.verified ? 'Report Now' : 'Get Verified 🔒'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myIssues.slice(0, 4).map((issue, i) => {
              const cat = ISSUE_CATEGORIES.find(c => c.id === issue.category);
              return (
                <motion.button
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  className="glass-card w-full p-5 text-left cursor-pointer"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-foreground text-sm leading-snug line-clamp-1">{issue.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.area} · {issue.id}</p>
                    </div>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <ProcessTracker
                    label={`Progress`}
                    percentage={issue.progress}
                    size="sm"
                    state={issue.status === 'resolved' ? 'complete' : 'progress'}
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Verification Officer Dashboard ────────────────────────────────── */
function VerificationOfficerHome() {
  const { verifications, approveVerification, rejectVerification } = useAuth();
  const [selectedAppForInspect, setSelectedAppForInspect] = useState<any | null>(null);
  const [confirmModalApp, setConfirmModalApp] = useState<{ app: any; action: 'approve' | 'reject' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingList = verifications.filter(v => v.status === 'pending');
  const approvedList = verifications.filter(v => v.status === 'approved');

  const filteredPending = pendingList.filter(app =>
    !searchQuery ||
    app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.cnicNumber.includes(searchQuery) ||
    app.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (app: any, action: 'approve' | 'reject') => {
    setSelectedAppForInspect(null);
    setConfirmModalApp({ app, action });
  };

  const handleConfirmAction = () => {
    if (!confirmModalApp) return;
    if (confirmModalApp.action === 'approve') {
      approveVerification(confirmModalApp.app.id);
    } else {
      rejectVerification(confirmModalApp.app.id);
    }
    setConfirmModalApp(null);
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto space-y-6 text-left">

      {/* Reconfirmation Guard Modal */}
      <AnimatePresence>
        {confirmModalApp && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={() => setConfirmModalApp(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-md w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-3 text-white">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${confirmModalApp.action === 'approve' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {confirmModalApp.action === 'approve' ? '✅' : '⚠️'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Reconfirm Resident {confirmModalApp.action === 'approve' ? 'Approval' : 'Rejection'}
                  </h3>
                  <p className="text-xs text-slate-400">Sensitive Action Guard</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                Are you sure you want to{' '}
                {confirmModalApp.action === 'approve'
                  ? 'approve and grant full resident verification status to'
                  : 'reject the application for'}{' '}
                <strong className="text-white">"{confirmModalApp.app.userName}"</strong> (CNIC: {confirmModalApp.app.cnicNumber})?
              </p>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white text-xs shadow-md transition-colors ${
                    confirmModalApp.action === 'approve' ? 'glass-btn glass-btn-success' : 'glass-btn glass-btn-danger'
                  }`}
                >
                  Yes, {confirmModalApp.action === 'approve' ? 'Approve & Verify Resident' : 'Reject Application'}
                </button>
                <button
                  onClick={() => setConfirmModalApp(null)}
                  className="px-4 py-3 rounded-xl font-semibold border border-slate-700 text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Document Proof Inspection Lightbox Modal ─────────────────── */}
      <AnimatePresence>
        {selectedAppForInspect && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={() => setSelectedAppForInspect(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative max-w-3xl w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left my-6 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    🔍 Inspect Document Proofs & Form Data
                  </h3>
                  <p className="text-xs text-slate-400">{selectedAppForInspect.userName} · CNIC: {selectedAppForInspect.cnicNumber}</p>
                </div>
                <button onClick={() => setSelectedAppForInspect(null)} className="p-1 rounded-lg text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    🪪 Identity Form Data
                  </p>
                  <p><span className="text-slate-400">Applicant:</span> <strong className="text-white">{selectedAppForInspect.userName}</strong></p>
                  <p><span className="text-slate-400">CNIC:</span> <strong className="font-mono text-blue-400">{selectedAppForInspect.cnicNumber}</strong></p>
                  <p><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{selectedAppForInspect.phone}</span></p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                    📍 Karachi Residence & Bill
                  </p>
                  <p><span className="text-slate-400">Address:</span> <span className="text-slate-200">{selectedAppForInspect.street}, {selectedAppForInspect.society}, {selectedAppForInspect.area}</span></p>
                  <p><span className="text-slate-400">Bill No:</span> <strong className="font-mono text-emerald-400">{selectedAppForInspect.utilityBillNumber}</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-52 relative p-2 flex items-center justify-center">
                  <img
                    src={selectedAppForInspect.cnicFrontPhotoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'}
                    alt="CNIC Front"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700">
                    🪪 CNIC Front Proof
                  </span>
                </div>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-52 relative p-2 flex items-center justify-center">
                  <img
                    src={selectedAppForInspect.utilityBillPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'}
                    alt="Utility Bill"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700">
                    📄 Utility Bill Proof
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    const app = selectedAppForInspect;
                    setSelectedAppForInspect(null);
                    handleActionClick(app, 'approve');
                  }}
                  className="glass-btn glass-btn-success flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={16} /> Approve & Verify Resident
                </button>
                <button
                  onClick={() => {
                    const app = selectedAppForInspect;
                    setSelectedAppForInspect(null);
                    handleActionClick(app, 'reject');
                  }}
                  className="glass-btn glass-btn-danger px-5 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <AlertCircle size={16} /> Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Stat Bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-base" style={{ background: 'rgba(245,158,11,0.12)' }}>⏳</div>
          <div>
            <p className="text-xl font-black text-foreground">{pendingList.length}</p>
            <p className="text-xs text-muted-foreground font-medium">Pending Review Queue</p>
          </div>
        </div>
        <div className="glass-stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-base" style={{ background: 'rgba(34,197,94,0.12)' }}>✅</div>
          <div>
            <p className="text-xl font-black text-foreground">{approvedList.length}</p>
            <p className="text-xs text-muted-foreground font-medium">Verified Residents</p>
          </div>
        </div>
        <div className="glass-stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-base" style={{ background: 'rgba(37,99,235,0.12)' }}>🛡️</div>
          <div>
            <p className="text-xl font-black text-foreground">100%</p>
            <p className="text-xs text-muted-foreground font-medium">Verification Accuracy</p>
          </div>
        </div>
      </div>

      {/* ── Searchable Pending Table ──────────────────────────────────── */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border)]">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Pending Verification Applications ({pendingList.length})
            </h2>
            <p className="text-xs text-muted-foreground">Inspect attached document proofs and verify resident identity</p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, CNIC or area..."
            className="glass-input text-xs w-full sm:w-64"
          />
        </div>

        {filteredPending.length === 0 ? (
          <div className="text-center py-10 glass-subtle rounded-xl border border-dashed border-[var(--glass-border)]">
            <CheckCircle size={32} className="mx-auto mb-2 text-emerald-500 opacity-80" />
            <p className="font-bold text-foreground text-sm">No Pending Applications</p>
            <p className="text-muted-foreground text-xs mt-0.5">All resident verification requests have been reviewed!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="glass-subtle text-muted-foreground font-bold border-b border-[var(--glass-border)]">
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">CNIC Number</th>
                  <th className="py-2.5 px-3">Karachi Area</th>
                  <th className="py-2.5 px-3">Utility Bill No</th>
                  <th className="py-2.5 px-3 text-center">Document Proofs</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {filteredPending.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">
                      {app.userName}
                      <p className="text-[10px] text-muted-foreground font-normal">{app.userEmail}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">{app.cnicNumber}</td>
                    <td className="py-3 px-3 text-muted-foreground">{app.area}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{app.utilityBillNumber}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedAppForInspect(app)}
                        className="glass-btn glass-btn-secondary px-2.5 py-1 text-blue-400 font-bold text-[11px]"
                      >
                        🔍 Inspect Proofs
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleActionClick(app, 'approve')}
                          className="glass-btn glass-btn-success px-2.5 py-1 text-white font-bold text-[11px]"
                        >
                          Approve ✓
                        </button>
                        <button
                          onClick={() => handleActionClick(app, 'reject')}
                          className="glass-btn glass-btn-danger px-2 py-1 text-white font-semibold text-[11px]"
                        >
                          Reject
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

      {/* ── Verified Residents Compact List ──────────────────────────── */}
      {approvedList.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> Recently Verified Residents ({approvedList.length})
          </h3>
          <div className="divide-y divide-[var(--glass-border)]">
            {approvedList.map(app => (
              <div key={app.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-foreground">{app.userName} ({app.userEmail})</p>
                  <p className="text-muted-foreground">CNIC: {app.cnicNumber} · {app.area}</p>
                </div>
                <span className="glass-badge glass-badge-success px-2.5 py-0.5">
                  Verified ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function FieldOfficerResolutionModal({
  issue,
  isOpen,
  onClose,
  onUpdateProgress,
  onResolve,
}: {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgress: (issueId: string, progress: number, note?: string, photos?: string[]) => void;
  onResolve: (issueId: string, afterPhoto?: string, photos?: string[]) => void;
}) {
  const [progressVal, setProgressVal] = useState<number>(issue?.progress || 25);
  const [updateNote, setUpdateNote] = useState('');
  const [inProgressPhoto1, setInProgressPhoto1] = useState(issue?.inProgressPhotos?.[0] || issue?.inProgressPhotoUrl || 'https://images.unsplash.com/photo-1624812449802-99c34cb56654?w=1080&auto=format&fit=crop');
  const [inProgressPhoto2, setInProgressPhoto2] = useState(issue?.inProgressPhotos?.[1] || '');
  const [afterPhoto, setAfterPhoto] = useState(issue?.afterPhotoUrl || 'https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?w=1080&auto=format&fit=crop');
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  if (!isOpen || !issue) return null;

  const handleSavePartialProgress = () => {
    const photos = [inProgressPhoto1, inProgressPhoto2].filter(Boolean);
    onUpdateProgress(issue.id, progressVal, updateNote, photos);
    onClose();
  };

  const handleMarkResolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedCheck) return;
    const photos = [afterPhoto, inProgressPhoto1].filter(Boolean);
    onResolve(issue.id, afterPhoto, photos);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative max-w-lg w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl space-y-4 text-left my-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            🏗️ Update Field Work Progress & Site Photos
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={handleMarkResolved} className="space-y-4 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Project</p>
            <p className="font-bold text-white text-sm">{issue.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{issue.area} · {issue.street}</p>
          </div>

          {/* Progress Slider (1% to 100%) */}
          <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <label>📊 Set Physical Work Progress Figure (1 - 100%)</label>
              <span className="text-xs font-mono text-blue-400 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-700">
                {progressVal}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={progressVal}
              onChange={e => setProgressVal(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
              <span>1% (Initiating)</span>
              <span>50% (Excavation)</span>
              <span>100% (Completed)</span>
            </div>
          </div>

          {/* Progress Update Note */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              📝 Work Update Activity Log Note
            </label>
            <input
              type="text"
              value={updateNote}
              onChange={e => setUpdateNote(e.target.value)}
              placeholder="e.g. Excavation complete, asphalt laying crew on site"
              className="glass-input text-xs"
            />
          </div>

          {/* Multiple Site Photo Uploads */}
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <p className="font-bold text-slate-300">📷 Site Photos (Upload Multiple)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ImageFileUpload
                label="Site Photo 1 (In-Progress)"
                value={inProgressPhoto1}
                onChange={setInProgressPhoto1}
              />
              <ImageFileUpload
                label="Site Photo 2 (In-Progress)"
                value={inProgressPhoto2}
                onChange={setInProgressPhoto2}
              />
            </div>
            {progressVal >= 90 && (
              <ImageFileUpload
                label="✅ Final Resolution / After Photo"
                value={afterPhoto}
                onChange={setAfterPhoto}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleSavePartialProgress}
              className="glass-btn glass-btn-primary w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={15} /> Save Progress Update ({progressVal}%) & Log Activity
            </button>

            {/* Resolution Checkbox Guard */}
            {progressVal >= 90 && (
              <div className="bg-amber-500/10 rounded-2xl p-3.5 border border-amber-500/30 space-y-2">
                <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  ⚠️ Resolution Confirmation Guard
                </p>
                <label className="flex items-start gap-2 cursor-pointer text-xs text-amber-200 leading-snug">
                  <input
                    type="checkbox"
                    checked={confirmedCheck}
                    onChange={e => setConfirmedCheck(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>I verify that physical repair work is 100% completed and ready for public publishing.</span>
                </label>
                <button
                  type="submit"
                  disabled={!confirmedCheck}
                  className="glass-btn glass-btn-success w-full py-3 font-bold text-xs rounded-xl disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={16} /> Confirm & Mark 100% Resolved
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function FieldOfficerInspectionModal({
  issue,
  isOpen,
  onClose,
  onConfirm,
  onReject,
}: {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (issueId: string, budget: number, customBills?: any[]) => void;
  onReject: (issueId: string) => void;
}) {
  const cat = ISSUE_CATEGORIES.find(c => c.id === issue?.category);

  const [lineItems, setLineItems] = useState<{ id: string; category: string; description: string; amount: number }[]>(() => {
    if (issue && Array.isArray(issue.bills) && issue.bills.length > 0) {
      return issue.bills;
    }
    return [
      { id: '1', category: 'Cement & Raw Materials', description: 'High-strength cement & gravel mix', amount: 25000 },
      { id: '2', category: 'Labor & Heavy Equipment', description: 'Compactor & excavation crew (2 days)', amount: 15000 },
      { id: '3', category: 'Transport & Permits', description: 'Municipal clearance & waste disposal', amount: 10000 },
    ];
  });

  useEffect(() => {
    if (issue && Array.isArray(issue.bills) && issue.bills.length > 0) {
      setLineItems(issue.bills);
    }
  }, [issue]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState<number | ''>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!isOpen || !issue) return null;

  const totalBudget = lineItems.reduce((acc, item) => acc + item.amount, 0);

  const handleAddLineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCost || newItemCost <= 0) return;

    const newItem = {
      id: `item_${Date.now()}`,
      category: newItemName.trim(),
      description: 'Allocated by Field Officer',
      amount: Number(newItemCost),
    };

    setLineItems([...lineItems, newItem]);
    setNewItemName('');
    setNewItemCost('');
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleFinalConfirm = () => {
    onConfirm(issue.id, totalBudget, lineItems);
    setShowConfirmModal(false);
    onClose();
  };

  const handleFinalReject = () => {
    onReject(issue.id);
    setShowRejectModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-10" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative max-w-2xl w-full p-6 z-20 bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl shadow-2xl text-left my-6 max-h-[90vh] overflow-y-auto space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              🔍 Field Inspection & Repair Budget Allocation
            </h3>
            <p className="text-xs text-slate-400">Issue ID: {issue.id} · {issue.area}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Issue Details Header */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            {cat && <CategoryBadge icon={cat.icon} label={cat.label} />}
            <span className="glass-badge glass-badge-warning text-[10px]">Awaiting Inspection</span>
          </div>
          <h4 className="font-bold text-white text-base">{issue.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>📍 {issue.street}, {issue.society}, {issue.area}</span>
            <span>📅 {issue.reportedAt}</span>
          </div>
        </div>

        {/* Resident Site Photo Proof */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            📷 Resident Site Photo Proof
          </p>
          <div className="h-48 rounded-xl overflow-hidden bg-black relative">
            <img
              src={issue.beforePhotoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1080&auto=format&fit=crop'}
              alt="Reported site proof"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Itemized Budget Builder */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <label className="text-xs font-bold text-blue-400">
              💰 Set Repair Budget & Itemized Line Items (PKR)
            </label>
            <span className="text-xs font-mono font-bold text-green-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Total: ₨ {totalBudget.toLocaleString()}
            </span>
          </div>

          <form onSubmit={handleAddLineItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="Item Name (e.g. 50 Bags Cement)"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                value={newItemCost}
                onChange={e => setNewItemCost(e.target.value ? Number(e.target.value) : '')}
                placeholder="Cost (₨)"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-2.5 glass-btn glass-btn-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md"
              >
                + Add Item
              </button>
            </div>
          </form>

          <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden text-xs">
            {lineItems.map(item => (
              <div key={item.id} className="p-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">{item.category}</p>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300">₨ {item.amount.toLocaleString()}</span>
                  <button type="button" onClick={() => handleRemoveLineItem(item.id)} className="text-slate-500 hover:text-red-400 p-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleFinalConfirm}
            className="glass-btn glass-btn-primary flex-1 py-3 text-xs font-bold rounded-xl"
          >
            Confirm Issue & Publish ₨ {totalBudget.toLocaleString()} Budget
          </button>
          <button
            onClick={handleFinalReject}
            className="glass-btn glass-btn-danger px-4 py-3 text-xs font-bold rounded-xl"
          >
            Reject Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* Compact Inspection Card Component for Queue */
function CompactInspectionCard({ issue, onInspect }: { issue: any; onInspect: (issue: any) => void }) {
  const cat = ISSUE_CATEGORIES.find(c => c.id === issue.category);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={() => onInspect(issue)}
      className="glass-card p-4 text-left cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--glass-border)] hover:border-blue-500/50 transition-all"
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {cat && <CategoryBadge icon={cat.icon} label={cat.label} />}
          <span className="font-mono text-xs text-muted-foreground">{issue.id}</span>
          <span className="glass-badge glass-badge-warning text-[10px]">Awaiting Inspection</span>
        </div>
        <h4 className="font-bold text-foreground text-sm truncate">{issue.title}</h4>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin size={12} className="text-amber-500" /> {issue.area}, {issue.street}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {issue.reportedAt}</span>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onInspect(issue); }}
        className="glass-btn glass-btn-primary px-4 py-2 text-xs font-semibold rounded-xl shrink-0 self-start md:self-auto"
      >
        Inspect & Set Budget →
      </button>
    </motion.div>
  );
}

/* ─── Field Officer Dashboard ────────────────────────────────────────── */
function FieldOfficerHome() {
  const { user, allIssues, confirmIssueByFieldOfficer, rejectIssueByFieldOfficer, updateIssueProgressByFieldOfficer, resolveIssueByFieldOfficer } = useAuth();
  const [selectedIssueForResolutionModal, setSelectedIssueForResolutionModal] = useState<any | null>(null);
  const [selectedIssueForInspectionModal, setSelectedIssueForInspectionModal] = useState<any | null>(null);

  if (!user) return null;

  const isGeneral = user.area === 'All Areas';
  const areaIssues = allIssues.filter(i => isGeneral || i.area.toLowerCase().includes(user.area.toLowerCase()));

  const pendingConfirmationList = areaIssues.filter(i => i.status === 'reported');
  const confirmedList = areaIssues.filter(i => i.status === 'in_progress' || i.status === 'under_review');
  const resolvedList = areaIssues.filter(i => i.status === 'resolved');

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto space-y-6 text-left">
      {/* Resolution & Progress Modal */}
      {selectedIssueForResolutionModal && (
        <FieldOfficerResolutionModal
          issue={selectedIssueForResolutionModal}
          isOpen={!!selectedIssueForResolutionModal}
          onClose={() => setSelectedIssueForResolutionModal(null)}
          onUpdateProgress={updateIssueProgressByFieldOfficer}
          onResolve={resolveIssueByFieldOfficer}
        />
      )}

      {/* Inspection & Budget Allocation Modal */}
      {selectedIssueForInspectionModal && (
        <FieldOfficerInspectionModal
          issue={selectedIssueForInspectionModal}
          isOpen={!!selectedIssueForInspectionModal}
          onClose={() => setSelectedIssueForInspectionModal(null)}
          onConfirm={confirmIssueByFieldOfficer}
          onReject={rejectIssueByFieldOfficer}
        />
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            🏗️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Field Officer Inspection Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assigned Zone: <span className="font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">{user.area}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard value={pendingConfirmationList.length} label="Awaiting Area Inspection" icon={<Clock size={22} className="text-amber-500" />} color="bg-amber-500/10" />
        <StatCard value={confirmedList.length} label="Active Repair Projects" icon={<CheckCircle size={22} className="text-emerald-500" />} color="bg-emerald-500/10" />
        <StatCard value={resolvedList.length} label="Completed Fixes" icon={<Briefcase size={22} className="text-blue-500" />} color="bg-blue-500/10" />
      </div>

      {/* Compact Inspection Queue */}
      <div className="glass-card p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {user.area} Issue Inspection Queue
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reported issues in {user.area}. Click any issue card to inspect site photos & allocate repair budget.
            </p>
          </div>
          <span className="glass-badge glass-badge-warning font-bold px-3 py-1">
            {pendingConfirmationList.length} Pending
          </span>
        </div>

        {pendingConfirmationList.length === 0 ? (
          <div className="text-center py-10 glass-subtle rounded-2xl border border-dashed border-[var(--glass-border)]">
            <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500 opacity-80" />
            <h3 className="font-bold text-foreground text-sm">No Pending Reports in {user.area}</h3>
            <p className="text-muted-foreground text-xs mt-1">All resident reports for your zone have been inspected and confirmed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pendingConfirmationList.map((issue) => (
              <CompactInspectionCard
                key={issue.id}
                issue={issue}
                onInspect={(iss) => setSelectedIssueForInspectionModal(iss)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Active Projects List */}
      {confirmedList.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> Confirmed Active Repair Projects ({confirmedList.length})
          </h3>
          <div className="divide-y divide-[var(--glass-border-subtle)]">
            {confirmedList.map(issue => (
              <div key={issue.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground text-sm">{issue.title}</p>
                  <p className="text-muted-foreground mt-0.5">{issue.area} · Budget Set: ₨ {(issue.targetBudget || 50000).toLocaleString()} · Raised: ₨ {(issue.raisedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="glass-badge glass-badge-primary font-bold">
                    {issue.progress}% Work Done
                  </span>
                  <button
                    onClick={() => setSelectedIssueForResolutionModal(issue)}
                    className="glass-btn glass-btn-primary px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <CheckCircle size={14} /> Update Progress & Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





/* ─── Admin Dashboard ────────────────────────────────────────────────── */
function AdminHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Admin Overview 🛡️
        </h1>
        <p className="text-sm text-slate-500 mt-1">{user.area}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard value={0} label="Total Issues" icon={<FileText size={22} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard value={0} label="Resolved" icon={<CheckCircle size={22} className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard value={0} label="Active Users" icon={<Users size={22} className="text-purple-600" />} color="bg-purple-50" />
        <StatCard value={0} label="Active Campaigns" icon={<Megaphone size={22} className="text-amber-600" />} color="bg-amber-50" />
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/admin/overview')}
            className="flex items-center gap-3 p-4 rounded-xl text-white text-left"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)' }}
          >
            <BarChart3 size={24} />
            <div>
              <p className="font-semibold">Admin Overview</p>
              <p className="text-blue-200 text-xs">Full system analytics</p>
            </div>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/issues')}
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 text-left hover:border-blue-200 hover:shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Manage Issues</p>
              <p className="text-slate-400 text-xs">Review all civic reports</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── Root: dispatch by role ────────────────────────────────────────── */
export function Home() {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === 'resident') return <ResidentHome />;
  if (user.role === 'verification_officer') return <VerificationOfficerHome />;

  if (user.role === 'field_officer') return <FieldOfficerHome />;
  if (user.role === 'admin') return <AdminHome />;
  return <ResidentHome />;
}
