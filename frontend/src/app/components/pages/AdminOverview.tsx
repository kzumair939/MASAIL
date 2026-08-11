import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, FileText, CheckCircle } from 'lucide-react';
import { CAMPAIGNS } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { ProcessTracker } from '../ProcessTracker';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Feb', reported: 210, resolved: 150 },
  { month: 'Mar', reported: 280, resolved: 195 },
  { month: 'Apr', reported: 245, resolved: 220 },
  { month: 'May', reported: 310, resolved: 260 },
  { month: 'Jun', reported: 380, resolved: 290 },
  { month: 'Jul', reported: 420, resolved: 310 },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Road & Pothole': '#38BDF8',
  'Waterlogging': '#2563EB',
  'Garbage Collection': '#94A3B8',
  'Street Lights': '#F59E0B',
  'Sewerage / Nala': '#EF4444',
  'Water Supply (KWSB)': '#06B6D4',
  'Encroachment': '#F43F5E',
};

function StatCard({ label, value, icon, colorBg, sub }: { label: string; value: string | number; icon: React.ReactNode; colorBg: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-stat-card"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-semibold">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: colorBg, borderColor: 'rgba(255,255,255,0.15)' }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
      {sub && <p className="text-[11px] text-green-500 font-semibold mt-1 flex items-center gap-1"><TrendingUp size={11} /> {sub}</p>}
    </motion.div>
  );
}

export function AdminOverview() {
  const { allIssues } = useAuth();

  const totalIssuesCount = allIssues.length;
  const resolvedCount = allIssues.filter(i => i.status === 'resolved').length;
  const inProgressCount = allIssues.filter(i => i.status === 'in_progress').length;
  const resolutionRate = totalIssuesCount ? Math.round((resolvedCount / totalIssuesCount) * 100) : 0;

  // Registered users count
  const storedUsers = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('masail_registered_users') || '{}' : '{}');
  const userCount = Object.keys(storedUsers).length + 5; // 5 seeded mock accounts + registered users

  // Compute category breakdown from allIssues
  const catMap: Record<string, number> = {};
  allIssues.forEach(i => {
    catMap[i.category] = (catMap[i.category] || 0) + 1;
  });

  const categoryData = Object.keys(catMap).length > 0
    ? Object.entries(catMap).map(([name, count]) => ({
        name,
        value: Math.round((count / totalIssuesCount) * 100),
        color: CATEGORY_COLORS[name] || '#60A5FA',
      }))
    : [
        { name: 'Road & Pothole', value: 38, color: '#38BDF8' },
        { name: 'Waterlogging', value: 22, color: '#2563EB' },
        { name: 'Garbage Collection', value: 18, color: '#94A3B8' },
        { name: 'Street Lights', value: 12, color: '#F59E0B' },
        { name: 'Sewerage / Nala', value: 10, color: '#EF4444' },
      ];

  // Area counts
  const areaMap: Record<string, number> = {};
  allIssues.forEach(i => {
    areaMap[i.area] = (areaMap[i.area] || 0) + 1;
  });
  const areaData = Object.entries(areaMap).map(([area, issues]) => ({ area, issues }));

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>Admin Overview</h1>
        <p className="text-sm text-slate-400 mt-0.5">Karachi Civic Platform — Real-time Metrics & Governance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Issues" value={totalIssuesCount.toLocaleString()} icon={<FileText size={16} className="text-blue-500" />} colorBg="rgba(37,99,235,0.12)" sub={`${inProgressCount} active in field`} />
        <StatCard label="Resolved Issues" value={resolvedCount.toLocaleString()} icon={<CheckCircle size={16} className="text-green-500" />} colorBg="rgba(34,197,94,0.12)" sub="Verified complete" />
        <StatCard label="Resolution Rate" value={`${resolutionRate}%`} icon={<BarChart3 size={16} className="text-purple-500" />} colorBg="rgba(168,85,247,0.12)" sub="Target 85%" />
        <StatCard label="Platform Users" value={(userCount + 18400).toLocaleString()} icon={<Users size={16} className="text-amber-500" />} colorBg="rgba(245,158,11,0.12)" sub={`${userCount} active officers & citizens`} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Monthly chart */}
        <div className="md:col-span-2 glass-card p-5">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Issues Reported vs Resolved (6 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ borderRadius: '14px', background: 'var(--glass-bg-modal)', border: '1px solid var(--glass-border)', fontSize: 12, color: 'var(--foreground)' }} />
              <Bar dataKey="reported" name="Reported" fill="#2563EB" opacity={0.65} radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#22C55E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="glass-card p-5">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>By Category</h2>
          <div className="flex justify-center mb-4">
            <PieChart width={160} height={160}>
              <Pie data={categoryData} cx={75} cy={75} innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Area breakdown */}
        <div className="glass-card p-5">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Active Issues by Area</h2>
          <div className="space-y-3">
            {areaData.length > 0 ? (
              areaData.map(area => (
                <div key={area.area}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">{area.area}</span>
                    <span className="font-bold text-foreground">{area.issues} issue(s)</span>
                  </div>
                  <div className="glass-progress-track">
                    <motion.div
                      className="glass-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (area.issues / totalIssuesCount) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No area metrics recorded yet.</p>
            )}
          </div>
        </div>

        {/* Active campaigns summary */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>Active Campaigns</h2>
            <span className="glass-badge glass-badge-primary">{CAMPAIGNS.length} total</span>
          </div>
          <div className="space-y-4">
            {CAMPAIGNS.map(c => {
              const pct = Math.round((c.raisedAmount / c.targetAmount) * 100);
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-semibold line-clamp-1">{c.title}</span>
                    <span className={`font-bold ${c.status === 'funded' ? 'text-green-500' : 'text-blue-500'}`}>{pct}%</span>
                  </div>
                  <ProcessTracker
                    label={`₨${(c.raisedAmount / 100000).toFixed(1)}L / ₨${(c.targetAmount / 100000).toFixed(1)}L`}
                    percentage={pct}
                    state={c.status === 'funded' ? 'complete' : 'progress'}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent issues table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
          <h2 className="font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>Civic Complaints Ledger</h2>
          <span className="glass-badge glass-badge-muted">{allIssues.length} active issues</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-subtle border-b border-[var(--glass-border-subtle)]">
              <tr>
                {['ID', 'Title', 'Area', 'Status', 'Progress', 'Supporters'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border-subtle)]">
              {allIssues.map((issue, i) => (
                <motion.tr
                  key={issue.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-[var(--glass-bg-subtle)] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{issue.id}</td>
                  <td className="px-5 py-3 text-sm text-foreground max-w-[220px]">
                    <span className="line-clamp-1 font-semibold">{issue.title}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{issue.area}</td>
                  <td className="px-5 py-3"><StatusBadge status={issue.status} size="sm" /></td>
                  <td className="px-5 py-3 w-28">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 glass-progress-track">
                        <div className="glass-progress-fill" style={{ width: `${issue.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 font-semibold">{issue.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground font-semibold">{issue.supportCount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
