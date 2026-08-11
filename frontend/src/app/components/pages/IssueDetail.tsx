import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Calendar, ThumbsUp, Briefcase,
  Coins, Camera, CheckCircle2, FileText, Check, Lock, History
} from 'lucide-react';
import { StatusBadge, CategoryBadge } from '../StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { ISSUE_CATEGORIES } from '../../data/mockData';
import { KarachiLocationMap } from '../KarachiLocationMap';

export function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allIssues, contributeToIssue } = useAuth();
  const [supported, setSupported] = useState(false);
  const [activePhotoTab, setActivePhotoTab] = useState<'before' | 'inProgress' | 'after'>('before');
  const [contribAmount, setContribAmount] = useState(1000);
  const [donated, setDonated] = useState(false);

  const issue = allIssues.find(i => i.id === id);

  if (!issue) {
    return (
      <div className="px-4 md:px-6 py-12 max-w-lg mx-auto text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Issue Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">This issue report does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/issues')}
          className="glass-btn glass-btn-primary px-5 py-2.5 text-sm rounded-xl"
        >
          Back to Issues
        </button>
      </div>
    );
  }

  const category = ISSUE_CATEGORIES.find(c => c.id === issue.category);

  // Check if issue is confirmed by Field Officer
  const isConfirmed = issue.status !== 'reported' && issue.status !== 'rejected';

  // Funding calculations
  const targetBudget = issue.targetBudget || 50000;
  const raisedAmount = issue.raisedAmount || 0;
  const fundingPct = Math.min(100, Math.round((raisedAmount / targetBudget) * 100));
  const isFundingComplete = fundingPct >= 100;

  const handleContribute = (amount: number) => {
    if (!isConfirmed) return;
    contributeToIssue(issue.id, amount);
    setDonated(true);
    setTimeout(() => setDonated(false), 3000);
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/issues')}
        className="glass-btn glass-btn-ghost flex items-center gap-2 text-sm mb-5 px-3 py-2 rounded-xl"
      >
        <ArrowLeft size={15} /> Back to Issues
      </button>

      {/* Unconfirmed Status Warning Banner */}
      {!isConfirmed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 glass-subtle rounded-2xl p-4 flex items-start gap-3"
          style={{ border: '1px solid rgba(245,158,11,0.28)', background: 'rgba(245,158,11,0.08)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <Lock size={18} className="text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-amber-500 text-sm">🔒 Field Inspection & Verification Pending</h3>
            <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              This report has been submitted by a resident and is currently awaiting physical site inspection by the area Field Officer.
              <strong> Funding contributions & community support remain locked</strong> until the Field Officer confirms the issue.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-5">
          {/* Site photo progression with thumbnail gallery */}
          <div className="glass-card overflow-hidden p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--glass-border)] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <Camera size={16} className="text-blue-400" /> Photo Progression & Site Evidence Proofs
              </h3>
              <div className="flex rounded-xl glass-subtle p-1 gap-1">
                <button
                  onClick={() => setActivePhotoTab('before')}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                    activePhotoTab === 'before' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📷 Before
                </button>
                <button
                  onClick={() => setActivePhotoTab('inProgress')}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                    activePhotoTab === 'inProgress' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏗️ In-Progress ({(issue.inProgressPhotos?.length || 1)})
                </button>
                <button
                  onClick={() => setActivePhotoTab('after')}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                    activePhotoTab === 'after' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✅ After Fix ({(issue.afterPhotos?.length || 1)})
                </button>
              </div>
            </div>

            {/* Display active main photo */}
            <div className="relative h-64 md:h-80 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              {activePhotoTab === 'before' && (
                <img
                  src={issue.beforePhotoUrl || 'https://images.unsplash.com/photo-1715163694958-0af07a963763?w=1080&auto=format&fit=crop'}
                  alt="Before repair"
                  className="w-full h-full object-contain rounded-xl"
                />
              )}
              {activePhotoTab === 'inProgress' && (
                issue.inProgressPhotoUrl ? (
                  <img src={issue.inProgressPhotoUrl} alt="Work in progress" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center text-slate-400 px-4">
                    <Camera size={36} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-white">Work In-Progress Photo Pending</p>
                    <p className="text-xs text-slate-400 mt-1">Field officer will upload site photos when repair work initiates.</p>
                  </div>
                )
              )}
              {activePhotoTab === 'after' && (
                issue.afterPhotoUrl ? (
                  <img src={issue.afterPhotoUrl} alt="Completed repair" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center text-slate-400 px-4">
                    <CheckCircle2 size={36} className="mx-auto mb-2 opacity-50 text-emerald-400" />
                    <p className="text-sm font-medium text-white">After-Fix Photo Pending Resolution</p>
                    <p className="text-xs text-slate-400 mt-1">Final photo will be published upon completion of repair work.</p>
                  </div>
                )
              )}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold border border-slate-700">
                {activePhotoTab === 'before' && '📷 Original Reported Condition'}
                {activePhotoTab === 'inProgress' && '🏗️ Site Execution Phase'}
                {activePhotoTab === 'after' && '✅ Verified Completed Work'}
              </div>
            </div>

            {/* Thumbnail Gallery Strip for Multiple Photos */}
            {((activePhotoTab === 'inProgress' && issue.inProgressPhotos && issue.inProgressPhotos.length > 1) ||
              (activePhotoTab === 'after' && issue.afterPhotos && issue.afterPhotos.length > 1)) && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-slate-300">📷 Uploaded Evidence Photos Gallery (Click to Inspect):</p>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {(activePhotoTab === 'inProgress' ? issue.inProgressPhotos : issue.afterPhotos).map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (activePhotoTab === 'inProgress') issue.inProgressPhotoUrl = photoUrl;
                        else issue.afterPhotoUrl = photoUrl;
                      }}
                      className="w-20 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 hover:border-blue-500 shrink-0 transition-all"
                    >
                      <img src={photoUrl} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Issue Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {category && <CategoryBadge icon={category.icon} label={category.label} />}
              <StatusBadge status={issue.status} />
              <span className="glass-badge glass-badge-muted">{issue.id}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {issue.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{issue.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} className="text-blue-500 shrink-0" />
                <span>{issue.street}, {issue.area}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={14} className="text-muted-foreground shrink-0" />
                <span>Reported {issue.reportedAt}</span>
              </div>
              {issue.assignedOfficer && (
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Briefcase size={14} className="text-green-500 shrink-0" />
                  <span>Verified by: <strong className="text-foreground">{issue.assignedOfficer}</strong></span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Civic Funding & Work Execution Progress */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <Coins size={18} className="text-amber-500" /> Civic Funding & Work Progress
              </h2>
              <span className={`glass-badge ${
                !isConfirmed ? 'glass-badge-warning'
                : isFundingComplete ? 'glass-badge-success'
                : 'glass-badge-accent'
              }`}>
                {!isConfirmed ? '🔒 Inspection Pending' : isFundingComplete ? '✓ Funded' : 'Funding Phase'}
              </span>
            </div>

            {/* Stage 1: Funding Progress */}
            {(() => {
              const actualRaised = Math.min(issue.raisedAmount, targetBudget);
              const remainingNeeded = Math.max(0, targetBudget - actualRaised);
              const isFullyFunded = actualRaised >= targetBudget;
              const calcPct = targetBudget > 0 ? Math.min(100, Math.round((actualRaised / targetBudget) * 100)) : 0;

              return (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Community Repair Fund Goal</p>
                        <p className="text-lg font-bold text-foreground">
                          ₨ {actualRaised.toLocaleString()} <span className="text-muted-foreground text-xs font-normal">raised of ₨ {targetBudget.toLocaleString()}</span>
                        </p>
                      </div>
                      <span className="text-sm font-bold text-amber-500">{calcPct}%</span>
                    </div>
                    <div className="glass-progress-track">
                      <motion.div
                        className="glass-progress-fill"
                        style={{ background: 'linear-gradient(90deg, #F59E0B, #D97706)', boxShadow: '0 0 8px rgba(245,158,11,0.40)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${calcPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Stage 2: Work Execution Progress */}
                  <div className="pt-2 border-t border-[var(--glass-border)]">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Physical Work Execution</p>
                        <p className="text-sm font-bold text-foreground">
                          {issue.status === 'resolved' ? '100% Completed ✓' : isFullyFunded ? 'Repair Crew Deployed & Active' : 'Awaiting Funding Goal'}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-blue-500">{isFullyFunded ? issue.progress : 0}%</span>
                    </div>
                    <div className="glass-progress-track">
                      <motion.div
                        className="glass-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${isFullyFunded ? issue.progress : 0}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Contribute to Repair Fund CTA */}
                  {!isConfirmed ? (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2">
                      <Lock size={24} className="mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-slate-700">Community Funding Currently Locked 🔒</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Citizens can contribute funds once the Field Officer inspects the site and approves the official repair budget.
                      </p>
                    </div>
                  ) : isFullyFunded ? (
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
                      <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                        <Check size={16} /> 100% Fully Funded (₨ {targetBudget.toLocaleString()})
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        This issue repair target has been 100% met! No extra funds are accepted to ensure 0 waste.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/60 space-y-3">
                      <div className="flex justify-between items-center text-xs text-amber-900 font-bold">
                        <span>Support Repair Funds for {issue.area}</span>
                        <span className="text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                          Remaining Needed: ₨ {remainingNeeded.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {[100, 500, 1000, remainingNeeded]
                          .filter((amt, idx, self) => amt > 0 && amt <= remainingNeeded && self.indexOf(amt) === idx)
                          .map(amt => (
                            <button
                              key={amt}
                              onClick={() => setContribAmount(Math.min(amt, remainingNeeded))}
                              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                contribAmount === amt ? 'bg-amber-600 text-white' : 'bg-white border border-amber-200 text-amber-800 hover:bg-amber-100'
                              }`}
                            >
                              {amt === remainingNeeded ? `Pay Remaining (₨ ${remainingNeeded.toLocaleString()})` : `₨ ${amt.toLocaleString()}`}
                            </button>
                          ))}
                        <button
                          onClick={() => {
                            const finalAmt = Math.min(contribAmount, remainingNeeded);
                            handleContribute(finalAmt);
                          }}
                          className="ml-auto px-4 py-2 rounded-xl font-bold text-white text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                          style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                        >
                          <Coins size={14} /> Contribute ₨ {Math.min(contribAmount, remainingNeeded).toLocaleString()}
                        </button>
                      </div>
                      {donated && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <Check size={14} /> Thank you! Your contribution was added to this repair budget.
                        </motion.p>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}


            {/* Live Community Transactions */}
            <div className="pt-2 border-t border-[var(--glass-border)]">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History size={14} className="text-green-500" /> Live Transactions ({issue.contributions?.length || 0})
              </h3>
              {(!issue.contributions || issue.contributions.length === 0) ? (
                <div className="glass-subtle p-4 rounded-xl text-center text-xs text-muted-foreground">
                  No transaction records yet. Contributions will appear live here.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {issue.contributions.map((contrib) => (
                    <div key={contrib.id} className="glass-subtle p-3 rounded-xl flex items-center justify-between text-xs" style={{ border: '1px solid rgba(34,197,94,0.15)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)' }}>
                          {contrib.donorName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{contrib.donorName}</p>
                          <p className="text-[10px] text-muted-foreground">{contrib.date}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-green-500 glass-subtle px-2.5 py-1 rounded-lg text-[11px]">
                        + ₨ {contrib.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Itemized Expense Budget */}
            <div className="pt-2 border-t border-[var(--glass-border)]">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500" /> Itemized Expense Budget
              </h3>
              {!isConfirmed ? (
                <div className="glass-subtle p-5 rounded-2xl text-center text-xs text-muted-foreground space-y-1">
                  <Lock size={18} className="mx-auto text-muted-foreground mb-1 opacity-60" />
                  <p className="font-bold text-foreground">Budget Allocation Pending 🔒</p>
                  <p className="text-[11px]">
                    The Field Officer will publish itemized line costs upon site verification.
                  </p>
                </div>
              ) : (
                <div className="glass-subtle rounded-xl overflow-hidden">
                  {issue.bills.map((bill) => (
                    <div key={bill.id} className="p-3 flex items-center justify-between text-xs border-b border-[var(--glass-border-subtle)]">
                      <div>
                        <p className="font-semibold text-foreground">{bill.category}</p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{bill.description}</p>
                      </div>
                      <span className="font-mono font-bold text-foreground glass-subtle px-2.5 py-1 rounded-lg text-[11px]">
                        ₨ {bill.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 glass-subtle flex items-center justify-between text-xs font-bold text-foreground">
                    <span>Total Target Budget</span>
                    <span className="font-mono text-blue-500 text-sm">₨ {targetBudget.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Support card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5">
            <div className="text-center mb-4">
              <p className="text-3xl font-black text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {issue.supportCount + (supported ? 1 : 0)}
              </p>
              <p className="text-sm text-muted-foreground">Karachites support this</p>
            </div>
            <motion.button
              whileHover={{ scale: isConfirmed ? 1.03 : 1, y: isConfirmed ? -2 : 0 }}
              whileTap={{ scale: isConfirmed ? 0.97 : 1 }}
              disabled={!isConfirmed}
              onClick={() => setSupported(!supported)}
              className={`glass-btn w-full py-3 rounded-xl text-sm ${
                !isConfirmed
                  ? 'glass-btn-ghost text-muted-foreground cursor-not-allowed opacity-60'
                  : supported
                  ? 'glass-btn-success'
                  : 'glass-btn-primary'
              }`}
            >
              {!isConfirmed ? (
                <><Lock size={14} /> Locked (Awaiting Inspection)</>
              ) : (
                <><ThumbsUp size={14} fill={supported ? 'currentColor' : 'none'} />
                  {supported ? 'You Support This' : 'Support This Issue'}
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Location Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2 px-1">
              <MapPin size={15} className="text-blue-500" /> Location Details Map
            </h3>
            <KarachiLocationMap
              area={issue.area}
              street={issue.street}
              interactive={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
