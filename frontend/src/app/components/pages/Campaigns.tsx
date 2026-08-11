import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Clock, TrendingUp, Home, Megaphone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProcessTracker } from '../ProcessTracker';
import { useAuth } from '../../context/AuthContext';

export function Campaigns() {
  const navigate = useNavigate();
  const { allIssues } = useAuth();

  // Active verified campaigns are issues confirmed by Field Officers
  const verifiedCampaigns = allIssues.filter(i => i.confirmedByOfficer || i.status === 'in_progress' || i.status === 'under_review' || i.status === 'resolved');

  const totalRaised = verifiedCampaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
  const projectsFunded = verifiedCampaigns.filter(c => (c.raisedAmount || 0) >= (c.targetBudget || 50000) || c.status === 'resolved').length;

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="glass-btn-icon p-2">
          <Home size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>Verified Community Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Verified civic projects inspected by Field Officers awaiting public funding & tracking</p>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Verified Campaigns', value: verifiedCampaigns.length.toString(), emoji: '🎯', color: 'rgba(37,99,235,0.12)' },
          { label: 'Total Raised', value: `₨${(totalRaised / 100000).toFixed(1)}L`, emoji: '💰', color: 'rgba(34,197,94,0.12)' },
          { label: 'Projects Funded', value: projectsFunded.toString(), emoji: '✅', color: 'rgba(245,158,11,0.12)' },
        ].map(s => (
          <div key={s.label} className="glass-stat-card text-center">
            <div className="text-2xl mb-2">{s.emoji}</div>
            <p className="font-black text-foreground text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State or Campaign Cards */}
      {verifiedCampaigns.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl glass-subtle flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(37,99,235,0.12)' }}>
            <Megaphone size={30} className="text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>No Verified Campaigns Yet</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
            Reported civic complaints undergo physical inspection by Field Officers before appearing here as active fundraising campaigns.
          </p>
          <button
            onClick={() => navigate('/issues')}
            className="glass-btn glass-btn-primary px-6 py-3 text-sm rounded-xl"
          >
            Browse Civic Issues
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedCampaigns.map((issue, i) => {
            const budget = issue.targetBudget || 50000;
            const raised = issue.raisedAmount || 0;
            const pct = Math.min(100, Math.round((raised / budget) * 100));
            const isFullyFunded = raised >= budget || issue.status === 'resolved';

            return (
              <motion.button
                key={issue.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="glass-card overflow-hidden text-left cursor-pointer"
              >
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={issue.inProgressPhotoUrl || issue.beforePhotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1080&auto=format&fit=crop'}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,17,32,0.7), transparent 60%)' }} />
                  <div className="absolute top-3 left-3">
                    <span className="glass-badge glass-badge-primary text-[10px] flex items-center gap-1 font-mono">
                      <ShieldCheck size={11} /> Verified Issue
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {isFullyFunded ? (
                      <span className="glass-badge glass-badge-success font-semibold">✓ Fully Funded</span>
                    ) : (
                      <span className="glass-badge glass-badge-warning font-semibold">Active Campaign</span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">{issue.area} · {issue.category}</p>
                  <h3 className="font-bold text-foreground text-sm leading-snug mb-3 line-clamp-2">{issue.title}</h3>

                  <ProcessTracker
                    label={`₨${(raised / 100000).toFixed(1)}L of ₨${(budget / 100000).toFixed(1)}L Budget`}
                    percentage={pct}
                    state={isFullyFunded ? 'complete' : 'progress'}
                    size="sm"
                  />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border-subtle)]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users size={11} /> {issue.supportCount || 12} supporters
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isFullyFunded ? 'text-green-500' : 'text-blue-500'}`}>
                      <TrendingUp size={11} /> {pct}% funded
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
