import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Eye, EyeOff, User, Mail, Lock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { KARACHI_AREAS } from '../../data/mockData';

const SIDE_IMG = 'https://images.unsplash.com/photo-1730698129439-6470f7fef39e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';

function strengthLabel(pw: string): { label: string; color: string; width: string; gradient: string } {
  if (pw.length === 0) return { label: '', color: '', width: '0%', gradient: '' };
  if (pw.length < 6) return { label: 'Weak', color: 'text-red-500', width: '25%', gradient: 'linear-gradient(90deg, #EF4444, #F87171)' };
  if (pw.length < 10) return { label: 'Fair', color: 'text-amber-500', width: '55%', gradient: 'linear-gradient(90deg, #F59E0B, #FCD34D)' };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: 'Strong', color: 'text-green-500', width: '100%', gradient: 'linear-gradient(90deg, #22C55E, #4ADE80)' };
  return { label: 'Good', color: 'text-blue-500', width: '75%', gradient: 'linear-gradient(90deg, #2563EB, #38BDF8)' };
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', area: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const strength = strengthLabel(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register(form.name, form.email, form.password, form.area);
    setLoading(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-glass-mesh flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="glass-strong p-10 rounded-3xl text-center max-w-sm mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)', boxShadow: '0 0 40px rgba(34,197,94,0.40)' }}
          >
            <CheckCircle size={36} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Account Created!</h2>
          <p className="text-muted-foreground text-sm">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-glass-mesh">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glass-orb glass-orb-secondary w-[500px] h-[500px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-accent w-[350px] h-[350px] bottom-0 left-0" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass-strong p-8 rounded-3xl">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-14 h-14 object-contain drop-shadow-xl shrink-0" />
              <div>
                <span className="text-2xl font-black text-foreground tracking-wide block" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
                <p className="text-[10px] text-muted-foreground font-semibold -mt-1">Karachi Civic Platform</p>
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-foreground mb-1.5" style={{ fontFamily: 'Manrope, sans-serif' }}>Create your account</h1>
            <p className="text-muted-foreground mb-8 text-sm">Join Karachi's civic movement. Report issues, drive change.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ali Hassan"
                    required
                    className="glass-input pl-11"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ali@email.com"
                    required
                    className="glass-input pl-11"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Area of Residence</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <select
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    required
                    className="glass-select glass-input pl-11 pr-4"
                    style={{ appearance: 'none' }}
                  >
                    <option value="" className="bg-slate-900 text-white">Select your area in Karachi</option>
                    {KARACHI_AREAS.map(a => <option key={a} value={a} className="bg-slate-900 text-white">{a}</option>)}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Create a strong password"
                    required
                    className="glass-input pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength */}
                <AnimatePresence>
                  {form.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="glass-progress-track">
                        <motion.div
                          className="glass-progress-fill"
                          animate={{ width: strength.width }}
                          style={{ background: strength.gradient }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className={`text-xs mt-1 font-semibold ${strength.color}`}>{strength.label}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service. You'll need to complete identity verification to report issues.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-badge glass-badge-danger p-3 rounded-xl text-xs w-full justify-start border border-red-500/30 text-red-300 bg-red-950/40"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="glass-btn glass-btn-primary w-full py-3.5 text-base rounded-xl"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Create Account</span><ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: Pakistan Flag Background Showcase Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden z-10">
        <img src="/assets/pakistan-flag.jpg" alt="Pakistan Flag Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,11,20,0.85) 0%, rgba(37,99,235,0.65) 60%, rgba(7,11,20,0.85) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex justify-end">
            <span className="glass-badge glass-badge-primary inline-flex items-center gap-1.5 text-xs px-3 py-1.5">
              📍 Empowering Karachi
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <img src="/assets/masail-logo.svg" alt="Masail Logo" className="w-16 h-16 object-contain drop-shadow-2xl shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL Civic Network</h3>
                <p className="text-blue-200 text-xs">Mazar-e-Quaid & City Skyline Approved</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Your Voice Matters.<br />Karachi Listens.
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-sm mb-6">
                Join thousands of Karachi residents taking charge of their neighborhoods.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {[
                  { n: '2,847', l: 'Issues Reported' },
                  { n: '1,923', l: 'Issues Resolved' },
                  { n: '18,650', l: 'Active Citizens' },
                  { n: '62', l: 'Areas Served' },
                ].map(s => (
                  <div key={s.l} className="glass-subtle rounded-xl px-4 py-3" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)' }}>
                    <p className="text-xl font-black text-white">{s.n}</p>
                    <p className="text-blue-200 text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
