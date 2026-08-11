import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Home, Upload, CheckCircle, Clock, AlertCircle, FileText, Phone, CreditCard, MapPin, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KARACHI_AREAS } from '../../data/mockData';
import { ImageFileUpload } from '../ImageFileUpload';


export function VerificationRequest() {
  const navigate = useNavigate();
  const { user, verifications, submitVerification } = useAuth();

  const [phone, setPhone] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [area, setArea] = useState(user?.area.split(',')[0] || 'Gulshan-e-Iqbal');
  const [society, setSociety] = useState('Block 13');
  const [street, setStreet] = useState('Main Street');
  const [utilityBillNumber, setUtilityBillNumber] = useState('');
  const [billPhotoUrl, setBillPhotoUrl] = useState('');
  const [cnicPhotoUrl, setCnicPhotoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // Check if current user already has a verification application
  const existingApp = verifications.find(v => v.userId === user.id || v.userEmail === user.email);

  // If user is ALREADY verified
  if (user.verified) {
    return (
      <div className="px-4 md:px-6 py-10 max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)', boxShadow: '0 0 32px rgba(34,197,94,0.40)' }}>
            <CheckCircle size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            You Are a Verified Resident!
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Your identity and Karachi address proof have been verified by a Verification Officer. You have full access to report civic issues.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/report-issue')}
              className="glass-btn glass-btn-primary px-6 py-3 text-sm rounded-xl"
            >
              Report New Issue
            </button>
            <button
              onClick={() => navigate('/home')}
              className="glass-btn glass-btn-ghost px-6 py-3 text-sm rounded-xl"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // If application is already PENDING
  if (existingApp && existingApp.status === 'pending') {
    return (
      <div className="px-4 md:px-6 py-10 max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-8" style={{ border: '1px solid rgba(245,158,11,0.30)' }}>
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Clock size={36} className="text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Verification Application Under Review
          </h1>
          <p className="text-muted-foreground mb-4 text-sm">
            Your application (<strong>{existingApp.id}</strong>) has been submitted to the Verification Officer queue.
          </p>
          <div className="glass-subtle rounded-xl p-4 text-xs text-foreground space-y-1 mb-6 text-left border border-[var(--glass-border)]">
            <p><span className="font-semibold text-muted-foreground">CNIC:</span> {existingApp.cnicNumber}</p>
            <p><span className="font-semibold text-muted-foreground">Phone:</span> {existingApp.phone}</p>
            <p><span className="font-semibold text-muted-foreground">Area:</span> {existingApp.area}, {existingApp.society}</p>
            <p><span className="font-semibold text-muted-foreground">Utility Bill No:</span> {existingApp.utilityBillNumber}</p>
            <p><span className="font-semibold text-muted-foreground">Status:</span> <span className="text-amber-600 font-bold uppercase">Pending Verification</span></p>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Review usually takes 24–48 hours. Log in as <code>officer@masail.pk</code> to approve this application!
          </p>
          <button
            onClick={() => navigate('/home')}
            className="glass-btn glass-btn-primary px-6 py-3 text-sm rounded-xl"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      submitVerification({
        phone,
        cnicNumber,
        area,
        society,
        street,
        utilityBillNumber,
        utilityBillPhotoUrl: billPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
        cnicFrontPhotoUrl: cnicPhotoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      });
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="px-4 md:px-6 py-10 max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)', boxShadow: '0 0 32px rgba(34,197,94,0.40)' }}>
            <CheckCircle size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Application Submitted!
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Your verification request has been forwarded to the Verification Officer queue. Once approved, you will become a Verified Resident and can report civic issues.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="glass-btn glass-btn-primary px-6 py-3 text-sm rounded-xl"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/home')}
          className="glass-btn-icon p-2"
        >
          <Home size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Resident Identity Verification
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verify your Karachi residence to start reporting civic issues
          </p>
        </div>
      </div>

      <div className="glass-subtle rounded-2xl p-4 mb-6 text-sm flex items-start gap-3" style={{ border: '1px solid rgba(245,158,11,0.28)', background: 'rgba(245,158,11,0.08)' }}>
        <Shield size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-500">Why is verification required?</p>
          <p className="text-xs text-amber-600 mt-0.5">
            To prevent spam and ensure civic complaints come from genuine Karachi residents, all reporters must verify their CNIC and utility bill address with a Verification Officer.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name (Matching CNIC)</label>
            <input
              type="text"
              value={user.name}
              disabled
              className="glass-input opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0300-1234567"
                required
                className="glass-input pl-11"
              />
            </div>
          </div>
        </div>

        {/* CNIC */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">CNIC Number (13 Digits) <span className="text-red-500">*</span></label>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
            <input
              type="text"
              value={cnicNumber}
              onChange={e => setCnicNumber(e.target.value)}
              placeholder="e.g. 42101-1234567-1"
              required
              className="glass-input pl-11"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-3 pt-2 border-t border-[var(--glass-border)]">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin size={16} className="text-blue-400" /> Karachi Address Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Area <span className="text-red-500">*</span></label>
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                className="glass-select w-full"
              >
                {KARACHI_AREAS.map(a => <option key={a} value={a} className="bg-slate-900 text-white">{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Society / Sector <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={society}
                onChange={e => setSociety(e.target.value)}
                placeholder="e.g. Block 13, Phase 6"
                required
                className="glass-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Street Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder="e.g. House # 12, Street 4"
              required
              className="glass-input"
            />
          </div>
        </div>

        {/* Utility Bill & Photos */}
        <div className="space-y-3 pt-2 border-t border-[var(--glass-border)]">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-blue-400" /> Utility Bill & Identity Documents
          </h3>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Utility Bill Number (K-Electric / SSGC / KWSB) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={utilityBillNumber}
              onChange={e => setUtilityBillNumber(e.target.value)}
              placeholder="e.g. KEL-98765432"
              required
              className="glass-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ImageFileUpload
              label="📷 Upload Utility Bill Photo File (K-Electric / SSGC / KWSC)"
              value={billPhotoUrl}
              onChange={setBillPhotoUrl}
            />
            <ImageFileUpload
              label="🪪 Upload CNIC Front Photo File"
              value={cnicPhotoUrl}
              onChange={setCnicPhotoUrl}
            />
          </div>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="glass-btn glass-btn-primary w-full py-3.5 rounded-xl mt-4 disabled:opacity-70"
        >
          {loading ? 'Submitting Application...' : 'Submit Verification Request'}
        </button>
      </form>
    </div>
  );
}
