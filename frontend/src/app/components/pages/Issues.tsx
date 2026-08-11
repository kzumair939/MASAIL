import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, PlusCircle, Inbox, Home, Lock, CheckCircle2 } from 'lucide-react';
import { ISSUE_CATEGORIES, KARACHI_AREAS } from '../../data/mockData';
import { StatusBadge, CategoryBadge } from '../StatusBadge';
import { ProcessTracker } from '../ProcessTracker';
import { useAuth } from '../../context/AuthContext';
import { VerificationModal } from '../VerificationModal';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Issues' },
  { value: 'reported', label: 'Reported / Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function Issues() {
  const navigate = useNavigate();
  const { user, allIssues } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showVerifModal, setShowVerifModal] = useState(false);

  const displayIssues = allIssues.filter(i => i.status !== 'rejected');

  const filtered = displayIssues.filter(issue => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (areaFilter !== 'all' && issue.area !== areaFilter) return false;
    if (categoryFilter !== 'all' && issue.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.area.toLowerCase().includes(q) ||
        issue.street.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReportClick = () => {
    if (!user?.verified) setShowVerifModal(true);
    else navigate('/report-issue');
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
      <VerificationModal isOpen={showVerifModal} onClose={() => setShowVerifModal(false)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="glass-btn-icon p-2"
          >
            <Home size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>Civic Issues</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} confirmed issue{filtered.length !== 1 ? 's' : ''} active in Karachi
            </p>
          </div>
        </div>
        {user?.role === 'resident' && (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            onClick={handleReportClick}
            className="glass-btn glass-btn-primary flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl"
            style={!user?.verified ? { background: 'linear-gradient(135deg, #D97706, #B45309)', boxShadow: '0 4px 20px rgba(217,119,6,0.40)' } : undefined}
          >
            {user?.verified ? <PlusCircle size={15} /> : <Lock size={15} />}
            <span>{user?.verified ? 'Report Issue' : 'Report Issue 🔒'}</span>
          </motion.button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 mb-5 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search confirmed issues, areas, streets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-10"
          />
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${statusFilter === f.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'glass-subtle text-muted-foreground hover:text-foreground'
                }`}
              style={statusFilter === f.value ? { boxShadow: '0 4px 14px rgba(37,99,235,0.35)' } : undefined}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Selects */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-36">
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="glass-input text-xs pr-4"
              style={{ appearance: 'none' }}
            >
              <option value="all">All Areas</option>
              {KARACHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-36">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="glass-input text-xs pr-4"
              style={{ appearance: 'none' }}
            >
              <option value="all">All Categories</option>
              {ISSUE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Issues Grid or Empty */}
      {filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 rounded-2xl glass-subtle flex items-center justify-center mb-4">
            <Inbox size={26} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="font-bold text-foreground text-base mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
            No Confirmed Issues Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Reported issues undergo physical inspection by Field Officers before appearing here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((issue, i) => {
            const cat = ISSUE_CATEGORIES.find(c => c.id === issue.category);
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="glass-card p-5 cursor-pointer"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {cat && <CategoryBadge icon={cat.icon} label={cat.label} />}
                    <span className="glass-badge glass-badge-muted font-mono">{issue.id}</span>
                  </div>
                  <StatusBadge status={issue.status} size="sm" />
                </div>

                <h3 className="font-bold text-foreground mb-2 leading-snug">{issue.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{issue.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {issue.area}, {issue.street}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {issue.reportedAt}</span>
                  {issue.assignedOfficer && (
                    <span className="text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> {issue.assignedOfficer}
                    </span>
                  )}
                </div>

                <ProcessTracker
                  label={issue.status === 'resolved' ? 'Resolved ✓' : 'Work in Progress'}
                  percentage={issue.progress}
                  state={issue.status === 'resolved' ? 'complete' : 'progress'}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
