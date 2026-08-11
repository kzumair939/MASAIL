import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const SIDE_IMG = 'https://images.unsplash.com/photo-1759323050124-eb669cec0b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-glass-mesh">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glass-orb glass-orb-primary w-[500px] h-[500px] -top-40 -left-40" />
        <div className="glass-orb glass-orb-accent w-[400px] h-[400px] bottom-0 right-0" style={{ animationDelay: '-4s' }} />
        <div className="glass-orb glass-orb-secondary w-[300px] h-[300px] top-1/2 left-1/3" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Left: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <div className="glass-strong p-8 rounded-3xl">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-14 h-14 object-contain drop-shadow-xl shrink-0" />
              <div>
                <span className="text-2xl font-black text-foreground tracking-wide block" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
                <p className="text-[10px] text-muted-foreground font-semibold -mt-1">Karachi Civic Platform</p>
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-foreground mb-1.5" style={{ fontFamily: 'Manrope, sans-serif' }}>Welcome back</h1>
            <p className="text-muted-foreground mb-8 text-sm">Log in to report and track civic issues in Karachi</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. resident@masail.pk"
                    required
                    className="glass-input pl-11"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl text-xs w-full justify-start border border-red-500/30 text-red-300 bg-red-950/60 font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="glass-btn glass-btn-primary w-full py-3.5 text-base rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Sign In</span><ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">Register free</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: Pakistan Flag Background Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden z-10">
        <img src="/assets/pakistan-flag.jpg" alt="Pakistan Flag Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,11,20,0.85) 0%, rgba(37,99,235,0.65) 60%, rgba(7,11,20,0.85) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-md space-y-6">
            <div className="flex items-center justify-center gap-3">
              <img src="/assets/masail-logo.svg" alt="Masail Logo" className="w-20 h-20 object-contain drop-shadow-2xl" />
            </div>

            <div>
              <span className="glass-badge glass-badge-primary text-xs mb-3 inline-flex items-center gap-1.5 px-3 py-1">
                📍 Karachi Civic Platform
              </span>
              <h3 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                The City of Lights Deserves Better
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto">
                Join 18,000+ Karachites reporting potholes, waterlogging, and tracking civic fixes in real time across all 18 towns.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
