import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Upload, MapPin, CheckCircle, Camera, X, Home } from 'lucide-react';
import { ISSUE_CATEGORIES, KARACHI_AREAS } from '../../data/mockData';
import { StepTracker } from '../ProcessTracker';
import { useAuth } from '../../context/AuthContext';
import type { LocalIssue } from '../../context/AuthContext';
import { KarachiLocationMap } from '../KarachiLocationMap';
import { ImageFileUpload } from '../ImageFileUpload';
import { MultiImageFileUpload } from '../MultiImageFileUpload';



const SOCIETIES: Record<string, string[]> = {
  'Gulshan-e-Iqbal': ['Block 1', 'Block 2', 'Block 6', 'Block 7', 'Block 10A', 'Block 13', 'Block 14'],
  'Defence (DHA)': ['DHA Phase 1', 'DHA Phase 2', 'DHA Phase 4', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 7', 'DHA Phase 8'],
  'PECHS': ['PECHS Block 1', 'PECHS Block 2', 'PECHS Block 6', 'PECHS Block 7'],
  'Clifton': ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 8'],
  'North Karachi': ['Sector 5-C', 'Sector 5-E', 'Sector 11', 'Sector 11B', 'Sector 14'],
  'Orangi Town': ['Sector 11B', 'Sector 12', 'Sector 13', 'Sector 14', 'Sector 15'],
};

const STEPS = ['Details', 'Location', 'Photos', 'Review'];

interface FormData {
  category: string;
  title: string;
  description: string;
  area: string;
  society: string;
  street: string;
  urgency: string;
  photos: string[];
}

export function ReportIssue() {
  const navigate = useNavigate();
  const { user, addMyIssue } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>({
    category: '',
    title: '',
    description: '',
    area: '',
    society: '',
    street: '',
    urgency: 'medium',
    photos: [],
  });

  if (!user) return null;

  // Unverified Resident Gate
  if (!user.verified) {
    return (
      <div className="px-4 md:px-6 py-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-6 md:p-8 text-center"
          style={{ border: '1.5px solid rgba(245,158,11,0.30)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Identity Verification Required
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Only <strong>Verified Residents</strong> of Karachi can submit civic issue reports. This ensures all reports come from verified citizens and prevents fake submissions.
          </p>
          <div className="glass-subtle rounded-xl p-3 text-xs text-muted-foreground text-left mb-6 space-y-1" style={{ border: '1px solid rgba(245,158,11,0.20)' }}>
            <p className="font-semibold text-foreground">How to get verified:</p>
            <p>1. Submit your CNIC number & phone number</p>
            <p>2. Provide utility bill matching your Karachi residence</p>
            <p>3. Verification Officer reviews application within 24–48h</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/verification')}
              className="glass-btn glass-btn-primary flex-1 py-3 px-4 text-sm rounded-xl"
            >
              Get Verified Now →
            </button>
            <button
              onClick={() => navigate('/issues')}
              className="glass-btn glass-btn-ghost py-3 px-4 text-sm rounded-xl"
            >
              Browse Issues
            </button>
          </div>
        </motion.div>
      </div>
    );
  }


  const cat = (id: string) => ISSUE_CATEGORIES.find(c => c.id === id);
  const selectedCat = cat(form.category);

  const canProceed = () => {
    if (step === 1) return form.category && form.title.length >= 10 && form.description.length >= 20;
    if (step === 2) return form.area && form.street;
    if (step === 3) return true;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    // Generate a local issue ID and persist to auth context
    addMyIssue({
      id: `ISS-${String(Date.now()).slice(-5)}`,
      title: form.title,
      description: form.description,
      category: form.category,
      area: form.area,
      society: form.society,
      street: form.street,
      urgency: form.urgency,
      status: 'reported',
      reportedAt: new Date().toISOString().split('T')[0],
      progress: 5,
      supportCount: 0,
      beforePhotoUrl: form.photos[0] || 'https://images.unsplash.com/photo-1715163694958-0af07a963763?w=600',
    });


    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-strong rounded-3xl p-8 text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)', boxShadow: '0 0 32px rgba(34,197,94,0.40)' }}>
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Issue Reported!</h2>
          <p className="text-muted-foreground mb-2">Your issue has been submitted and assigned ID <strong className="text-foreground">ISS-00{Math.floor(Math.random() * 90) + 10}</strong></p>
          <p className="text-xs text-muted-foreground mb-6">A verification officer will review it within 24–48 hours. You'll be notified at every step.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/my-issues')} className="glass-btn glass-btn-primary flex-1 py-3 rounded-xl text-sm">
              View My Issues
            </button>
            <button onClick={() => { setDone(false); setStep(1); setForm({ category: '', title: '', description: '', area: '', society: '', street: '', urgency: 'medium', photos: [] }); }}
              className="glass-btn glass-btn-ghost flex-1 py-3 rounded-xl text-sm">
              Report Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => navigate('/home')}
          className="glass-btn-icon p-2"
        >
          <Home size={18} />
        </button>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="glass-btn glass-btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Report a Civic Issue</h1>
        <StepTracker steps={STEPS} currentStep={step} label={STEPS[step - 1]} />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="glass-card p-5">
              <h2 className="font-semibold text-foreground mb-4">Issue Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ISSUE_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setForm({ ...form, category: c.id })}
                    className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                      form.category === c.id
                        ? 'bg-blue-500/15 border-2 border-blue-500 text-blue-500'
                        : 'glass-subtle hover:bg-[var(--glass-bg-hover)]'
                    }`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-xs font-semibold text-foreground">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Issue Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Large pothole on main street causing accidents"
                  maxLength={100}
                  className="glass-input"
                />
                <p className="text-xs text-muted-foreground mt-1">{form.title.length}/100 characters (min 10)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail. When did it start? How severe is it? Who is affected? Any past complaints?"
                  rows={4}
                  className="glass-textarea w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">{form.description.length} characters (min 20)</p>
              </div>
              <div className="glass-subtle p-3.5 text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-base">⚖️</span>
                <span><strong className="text-foreground">Automatic Priority System:</strong> Issue priority will be determined automatically based on resident support votes from Karachites.</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><MapPin size={16} className="text-blue-500" />Location Details</h2>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Area in Karachi <span className="text-red-500">*</span></label>
                <select
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value, society: '' })}
                  className="glass-input text-sm"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Select area...</option>
                  {KARACHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {form.area && SOCIETIES[form.area] && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Society / Sector</label>
                  <select
                    value={form.society}
                    onChange={e => setForm({ ...form, society: e.target.value })}
                    className="glass-input text-sm"
                    style={{ appearance: 'none' }}
                  >
                    <option value="">Select society...</option>
                    {SOCIETIES[form.area].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Street / Landmark <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })}
                  placeholder="e.g. Rashid Minhas Road near KFC, Block 13"
                  className="glass-input text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Interactive Location Pin Map</label>
                <KarachiLocationMap
                  area={form.area || 'Karachi Central'}
                  street={form.street || 'Main Street'}
                  interactive={true}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><Camera size={16} className="text-blue-500" />Photo Evidence Upload (1 to 10 Photos)</h2>
              <p className="text-sm text-muted-foreground">Upload clear site photos from your phone or computer. You can upload up to 10 photos of the reported issue.</p>
              
              <MultiImageFileUpload
                label="📷 Upload Site Evidence Photos"
                images={form.photos}
                maxImages={10}
                onChange={(urls) => setForm({ ...form, photos: urls })}
              />

              <div className="glass-subtle rounded-xl px-4 py-3" style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)' }}>
                <p className="text-sm text-amber-500 font-semibold">💡 Photo Guidelines</p>
                <ul className="text-xs text-amber-600 mt-1 space-y-0.5">
                  <li>• You can upload 1 to 10 photos of the issue site</li>
                  <li>• Take photos in daylight for optimal clarity</li>
                  <li>• Field officer will inspect these photos against physical site conditions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}



        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="glass-card p-5">
              <h2 className="font-semibold text-foreground mb-4">Review Your Report</h2>
              <div className="space-y-4">
                {selectedCat && (
                  <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border-subtle)]">
                    <span className="text-2xl">{selectedCat.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-semibold text-foreground">{selectedCat.label}</p>
                    </div>
                  </div>
                )}
                <div className="pb-4 border-b border-[var(--glass-border-subtle)]">
                  <p className="text-xs text-muted-foreground mb-1">Title</p>
                  <p className="font-semibold text-foreground">{form.title || '—'}</p>
                </div>
                <div className="pb-4 border-b border-[var(--glass-border-subtle)]">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{form.description || '—'}</p>
                </div>
                <div className="pb-4 border-b border-[var(--glass-border-subtle)]">
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <p className="text-sm text-muted-foreground">{[form.street, form.society, form.area, 'Karachi'].filter(Boolean).join(', ') || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Photos</p>
                  <p className="text-sm text-muted-foreground">{form.photos.length} photo{form.photos.length !== 1 ? 's' : ''} attached</p>
                </div>
              </div>
            </div>
            <div className="glass-subtle rounded-xl px-4 py-3 text-sm text-blue-500" style={{ border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.08)' }}>
              By submitting, you confirm this report is accurate. False reports may result in account suspension.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step < 4 ? (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className="glass-btn glass-btn-primary flex-1 py-3.5 text-sm rounded-xl disabled:opacity-40"
          >
            Continue <ArrowRight size={16} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="glass-btn glass-btn-success flex-1 py-3.5 text-sm rounded-xl disabled:opacity-70"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <><CheckCircle size={16} />Submit Report</>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
