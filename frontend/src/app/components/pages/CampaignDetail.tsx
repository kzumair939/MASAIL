import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Clock, Share2, Heart, ChevronRight } from 'lucide-react';
import { CAMPAIGNS } from '../../data/mockData';
import { ProcessTracker } from '../ProcessTracker';
import { useState } from 'react';

const UPDATES = [
  { date: '2026-07-10', msg: 'Engineering survey completed. Drain clearing scheduled for next 3 Saturdays with community volunteers.', icon: '📋' },
  { date: '2026-07-05', msg: 'Campaign reached 70% funding milestone! Three major drains prioritized: Rashid Minhas, University Road, Shaheed-e-Millat.', icon: '🎯' },
  { date: '2026-06-28', msg: 'Campaign launched after community meeting at Gulshan Community Center attended by 140+ residents.', icon: '🚀' },
];

const SUPPORTERS = [
  { name: 'Ali H.', amount: 5000, area: 'Gulshan Block 13' },
  { name: 'Fatima M.', amount: 10000, area: 'PECHS Block 6' },
  { name: 'Ahmed S.', amount: 2500, area: 'F.B. Area' },
  { name: 'Zainab K.', amount: 25000, area: 'Clifton Block 5' },
  { name: 'Irfan B.', amount: 1500, area: 'North Karachi' },
];

export function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donated, setDonated] = useState(false);
  const [donateAmount, setDonateAmount] = useState(1000);

  const campaign = CAMPAIGNS.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="px-4 md:px-6 py-12 max-w-lg mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Campaign Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">This campaign does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)' }}
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const pct = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5">
        <ArrowLeft size={16} /> Back to Campaigns
      </button>


      <div className="grid md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 space-y-5">
          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden">
            <img src={campaign.image} alt={campaign.title} className="w-full h-64 md:h-80 object-cover" />
          </div>

          {/* Campaign info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                campaign.status === 'funded' ? 'bg-emerald-100 text-emerald-700' :
                campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {campaign.status === 'funded' ? '✓ Fully Funded' : campaign.status === 'completed' ? 'Completed' : '🔥 Active Campaign'}
              </span>
              <span className="text-xs text-slate-400">{campaign.area}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>{campaign.title}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{campaign.description}</p>
          </motion.div>

          {/* Funding progress */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Funding Progress</h2>
            <ProcessTracker
              label={`₨${(campaign.raisedAmount / 100000).toFixed(2)}L raised of ₨${(campaign.targetAmount / 100000).toFixed(1)}L goal`}
              percentage={pct}
              state={campaign.status === 'funded' ? 'complete' : 'progress'}
              size="lg"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Manrope, sans-serif' }}>₨{(campaign.raisedAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-slate-400">Raised</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>₨{(campaign.targetAmount / 100000).toFixed(1)}L</p>
                <p className="text-xs text-slate-400">Goal</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-emerald-600" style={{ fontFamily: 'Manrope, sans-serif' }}>{campaign.supporters.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Supporters</p>
              </div>
            </div>
          </motion.div>

          {/* Updates */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Campaign Updates</h2>
            <div className="space-y-4">
              {UPDATES.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-base shrink-0">{u.icon}</div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">{u.date}</p>
                    <p className="text-sm text-slate-700">{u.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent donors */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Supporters</h2>
            <div className="space-y-3">
              {SUPPORTERS.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.area}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">₨{s.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
              View all {campaign.supporters} supporters <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* Sidebar: Donate */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-5 border border-slate-100 sticky top-20">
            {!donated ? (
              <>
                <h3 className="font-semibold text-slate-800 mb-4">Support This Campaign</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[500, 1000, 2500, 5000, 10000, 25000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDonateAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        donateAmount === amt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      ₨{amt >= 1000 ? `${amt/1000}k` : amt}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-slate-500 mb-1.5">Custom amount (₨)</label>
                  <input
                    type="number"
                    value={donateAmount}
                    onChange={e => setDonateAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDonated(true)}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                >
                  💚 Donate ₨{donateAmount.toLocaleString()}
                </motion.button>
              </>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-bold text-emerald-700">Shukria! جزاک اللہ</p>
                <p className="text-sm text-slate-500 mt-1">Your contribution of ₨{donateAmount.toLocaleString()} has been recorded</p>
                <button onClick={() => setDonated(false)} className="mt-3 text-xs text-blue-600 font-medium">Donate again</button>
              </motion.div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">
                <Share2 size={14} /> Share
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">
                <Heart size={14} /> Save
              </button>
            </div>
          </motion.div>

          {campaign.status === 'active' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">{daysLeft} days remaining</p>
              </div>
              <p className="text-xs text-amber-600">Campaign ends {campaign.endDate}. Funds are released only if 100% target is met.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
