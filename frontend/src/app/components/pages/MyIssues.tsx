import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { PlusCircle, MapPin, Calendar, Inbox, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, CategoryBadge } from '../StatusBadge';
import { ProcessTracker } from '../ProcessTracker';
import { ISSUE_CATEGORIES } from '../../data/mockData';

export function MyIssues() {
  const navigate = useNavigate();
  const { myIssues } = useAuth();

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="glass-btn-icon p-2">
          <Home size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
            My Reported Issues
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {myIssues.length === 0
              ? 'No issues submitted yet'
              : `${myIssues.length} issue${myIssues.length !== 1 ? 's' : ''} submitted by you`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          onClick={() => navigate('/report-issue')}
          className="glass-btn glass-btn-primary flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl shrink-0"
        >
          <PlusCircle size={15} /> Report New
        </motion.button>
      </div>

      {myIssues.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl glass-subtle flex items-center justify-center mb-5">
            <Inbox size={28} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="font-bold text-foreground mb-2">No issues reported yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            See something wrong in your area? Report it and track progress right here.
          </p>
          <button
            onClick={() => navigate('/report-issue')}
            className="glass-btn glass-btn-primary px-6 py-3 rounded-xl text-sm"
          >
            Report First Issue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myIssues.map((issue, i) => {
            const cat = ISSUE_CATEGORIES.find(c => c.id === issue.category);
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="glass-card p-5 cursor-pointer"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {cat && <CategoryBadge icon={cat.icon} label={cat.label} />}
                    <span className="glass-badge glass-badge-muted font-mono">{issue.id}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {issue.status === 'reported' ? (
                      <span className="glass-badge glass-badge-warning text-[10px]">
                        🔒 Inspection Pending
                      </span>
                    ) : (
                      <StatusBadge status={issue.status} size="sm" />
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-foreground mb-2 leading-snug">{issue.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {issue.area}{issue.society ? `, ${issue.society}` : ''}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {issue.reportedAt}</span>
                  <span className="capitalize">🔶 {issue.urgency} urgency</span>
                </div>

                <ProcessTracker
                  label={
                    issue.status === 'resolved' ? 'Resolved ✓'
                    : issue.status === 'in_progress' ? 'Work in Progress'
                    : issue.status === 'under_review' ? 'Under Review'
                    : issue.status === 'rejected' ? 'Rejected'
                    : 'Awaiting Review'
                  }
                  percentage={issue.progress}
                  state={
                    issue.status === 'resolved' ? 'complete'
                    : issue.status === 'rejected' ? 'failed'
                    : 'progress'
                  }
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
