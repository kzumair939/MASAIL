import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, CheckCircle, MapPin, Users, TrendingUp, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { STATS } from '../../data/mockData';
import { BeforeAfterSlider } from '../BeforeAfterSlider';

const HERO_IMG = 'https://images.unsplash.com/photo-1759323049966-8ae3fc89c0ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';
const COAST_IMG = 'https://images.unsplash.com/photo-1759323050124-eb669cec0b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';
const STREET_IMG = 'https://images.unsplash.com/photo-1715163694958-0af07a963763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBzdHJlZXQlMjByb2FkfGVufDF8fHx8MTc4Mzg4Njk2MHww&ixlib=rb-4.1.0&q=80&w=1080';
const NIGHT_IMG = 'https://images.unsplash.com/photo-1759210720487-c74d9764da79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';
const BUS_IMG = 'https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBzdHJlZXQlMjByb2FkfGVufDF8fHx8MTc4Mzg4Njk2MHww&ixlib=rb-4.1.0&q=80&w=1080';
const AERIAL_IMG = 'https://images.unsplash.com/photo-1752731904238-37ca976fd275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxLYXJhY2hpJTIwUGFraXN0YW4lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3ODM4ODY5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080';

const FAQS = [
  { q: 'Who can use MASAIL?', a: 'Any resident of Karachi can register, get verified, and start reporting civic issues in their area. It\'s free and open to all.' },
  { q: 'How does verification work?', a: 'You upload a utility bill (electricity/gas) and optionally your rental agreement. A verification officer reviews it within 48 hours and approves or requests corrections.' },
  { q: 'What happens after I report an issue?', a: 'Your issue goes into the review queue. Once verified, it\'s assigned to the relevant authority (KMC, KWSB, K-Electric, etc.) and a field officer is dispatched. You get notified at every step.' },
  { q: 'Which areas does MASAIL cover?', a: 'MASAIL currently covers all 18 towns of Karachi including Clifton, Defence, Gulshan, PECHS, Saddar, Orangi Town, Lyari, Malir, Korangi, and more.' },
  { q: 'Can I donate to fix issues?', a: 'Yes! Through our Campaigns feature, residents can pool funds for major civic projects. All funds are managed transparently with real-time tracking.' },
];

const TESTIMONIALS = [
  { name: 'Hira Baig', area: 'Clifton, Block 9', text: 'I reported a massive pothole on my street that had been there for 3 months. Within 2 weeks of using MASAIL, KMC filled it up. Incredible how it actually works!', rating: 5, avatar: 'HB' },
  { name: 'Mohammad Irfan', area: 'Gulshan-e-Iqbal, Block 13', text: 'The waterlogging in our block was unbearable every monsoon. After our campaign got funded through MASAIL, the drains were fixed and this year we had zero flooding. Shukria MASAIL!', rating: 5, avatar: 'MI' },
  { name: 'Shabana Qureshi', area: 'North Karachi, Sector 11', text: 'As a working mother, I never had time to follow up on civic complaints. MASAIL sends me updates automatically. The transparency is what sets it apart from older complaint systems.', rating: 5, avatar: 'SQ' },
];

const FEATURES = [
  { icon: '📍', title: 'Precise Geo-Location', desc: 'Pin exact location on map — from city to society level. No more vague complaints.' },
  { icon: '📸', title: 'Photo Evidence', desc: 'Upload before/during/after photos. Officers see the full picture, no excuses.' },
  { icon: '📊', title: 'Live Status Tracking', desc: 'Know exactly where your issue stands at every moment — from report to resolution.' },
  { icon: '🤝', title: 'Community Campaigns', desc: 'Pool funds with neighbors for large-scale fixes KMC alone can\'t handle.' },
  { icon: '⚡', title: 'Authority Routing', desc: 'Issues auto-routed to the right authority — KMC, KWSB, K-Electric, NHA.' },
  { icon: '🔔', title: 'Real-time Alerts', desc: 'Push notifications at every status change. Your time is not wasted waiting.' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setStarted(true)}
      className="text-center"
    >
      <p className="text-4xl md:text-5xl font-black text-white mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {count.toLocaleString()}{suffix}
      </p>
    </motion.div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* ── Floating Glass Navbar ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav mx-0 rounded-none shadow-lg'
          : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className={`text-lg font-bold ${scrolled ? 'text-foreground' : 'text-white'}`} style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-6">
            {['#how', '#features', '#stats', '#faq'].map((href, i) => (
              <a
                key={href}
                href={href}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground hover:bg-[var(--glass-bg-subtle)]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {['How It Works', 'Features', 'Impact', 'FAQ'][i]}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/login"
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                scrolled
                  ? 'text-muted-foreground hover:text-foreground glass-btn glass-btn-ghost'
                  : 'text-white/80 hover:text-white hover:bg-white/10 rounded-xl'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="glass-btn glass-btn-primary text-sm px-4 py-2 rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section with Mazar-e-Quaid Background ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Full Hero Background Image: Mazar-e-Quaid */}
        <div className="absolute inset-0 z-0">
          <img src="/assets/mazar-quaid-hero.jpg" alt="Mazar-e-Quaid Karachi" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(7,11,20,0.85) 0%, rgba(11,17,32,0.65) 50%, rgba(7,11,20,0.95) 100%)'
          }} />
        </div>

        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="glass-orb w-[600px] h-[600px] -top-40 -right-40 opacity-25 animate-float-slow"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.8) 0%, transparent 70%)' }} />
          <div className="glass-orb w-[500px] h-[500px] bottom-0 left-0 opacity-20 animate-float"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.8) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34,1.56,0.64,1] }}
            className="flex flex-col items-center"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold shadow-lg"
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#93c5fd'
              }}
            >
              <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-8 h-8 object-contain drop-shadow-md shrink-0" />
              <MapPin size={14} className="text-amber-400 shrink-0" />
              <span>Serving All 18 Towns of Karachi</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Report.{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38BDF8, #60A5FA)' }}>
                Track.
              </span>
              {' '}Fix.
              <br />
              <span className="text-transparent bg-clip-text text-4xl md:text-5xl" style={{ backgroundImage: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                Karachi Deserves Better.
              </span>
            </h1>

            <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-2xl drop-shadow-md">
              MASAIL is Karachi's civic issue reporting platform. Report potholes, waterlogging, broken street lights, and more — and track them until they're fixed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md">
              <button
                onClick={() => navigate('/register')}
                className="glass-btn glass-btn-primary px-7 py-3.5 text-base w-full sm:w-auto font-bold shadow-xl"
              >
                Report an Issue <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/issues')}
                className="glass-btn px-7 py-3.5 text-base text-white w-full sm:w-auto font-semibold shadow-xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.60)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.30)',
                }}
              >
                Explore Issues
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/15 w-full max-w-xl">
              {[
                { val: `${STATS.activeUsers.toLocaleString()}+`, label: 'Citizens' },
                { val: `${STATS.resolvedIssues.toLocaleString()}`, label: 'Resolved' },
                { val: `${STATS.areasServed}`, label: 'Areas' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white drop-shadow-md" style={{ fontFamily: 'Manrope, sans-serif' }}>{s.val}</div>
                  <div className="text-xs text-slate-300 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section id="stats" className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 50%, #4F46E5 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="glass-orb w-96 h-96 -top-20 -left-20 opacity-20" style={{ background: 'radial-gradient(circle, #38BDF8, transparent 70%)' }} />
          <div className="glass-orb w-64 h-64 bottom-0 right-0 opacity-15" style={{ background: 'radial-gradient(circle, #A78BFA, transparent 70%)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { target: STATS.totalIssues, label: 'Issues Reported', suffix: '+' },
              { target: STATS.resolvedIssues, label: 'Issues Resolved', suffix: '' },
              { target: STATS.activeUsers, label: 'Active Citizens', suffix: '+' },
              { target: STATS.areasServed, label: 'Areas Covered', suffix: '' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="py-24 bg-glass-mesh">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="glass-badge glass-badge-primary mb-5 w-fit">
                <Shield size={12} /> Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Building a Better Karachi,<br />One Issue at a Time
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Karachi — the City of Lights — faces civic challenges that have persisted for decades. MASAIL gives every Karachiite a voice and a platform to demand accountability from those responsible.
              </p>
              <ul className="space-y-3">
                {[
                  'Transparent process from report to resolution',
                  'Direct line to KMC, KWSB, K-Electric, and NHA',
                  'Community-driven campaigns for large projects',
                  'Real accountability with photo evidence',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                      <CheckCircle size={13} className="text-green-500" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-3">
              {[COAST_IMG, AERIAL_IMG, STREET_IMG, NIGHT_IMG].map((src, i) => (
                <div key={i} className="glass-card overflow-hidden" style={{ marginTop: i % 2 === 1 ? '1.5rem' : '0' }}>
                  <img src={src} alt={`Karachi ${i}`} className="w-full h-44 object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              How MASAIL Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to turning a complaint into a resolved civic issue</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">

            {[
              { step: '01', emoji: '📸', title: 'Report & Document', desc: 'Take photos, pin the location, describe the issue. Verified residents can report in under 3 minutes.' },
              { step: '02', emoji: '🏛️', title: 'Review & Assign', desc: 'Verification officers review the report and route it to the correct city authority with full documentation.' },
              { step: '03', emoji: '✅', title: 'Track to Resolution', desc: 'Follow live progress via our Process Tracker. Get notified when work starts and when it\'s complete.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ background: `linear-gradient(135deg, rgba(37,99,235,0.15), rgba(56,189,248,0.10))`, border: '1px solid rgba(37,99,235,0.20)' }}>
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-blue-500 mb-2 tracking-wider">{item.step}</div>
                <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Infinite Liquid Glass Carousel ── */}
      <section id="features" className="py-24 bg-glass-mesh overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Built for Karachi
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Features tailored specifically for civic challenges across Karachi</p>
          </motion.div>
        </div>

        {/* Infinite Horizontal Motion Track */}
        <div className="liquid-glass-carousel-container">
          <div className="liquid-glass-carousel-track">
            {/* Duplicated for 100% continuous infinite loop */}
            {[...FEATURES, ...FEATURES].map((f, i) => (
              <div key={`${f.title}-${i}`} className="liquid-glass-card-item group/card">
                <div className="glass-icon-capsule mb-5 text-2xl">{f.icon}</div>
                <h3 className="font-bold text-foreground text-lg mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After Results ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Real Results in Karachi
            </h2>
            <p className="text-muted-foreground">Issues reported by residents, resolved by collective action</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* BEFORE CARD */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-red-500/20 hover:border-red-500/40 transition-all shadow-xl"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
                <img
                  src="/assets/street-before-broken.jpg"
                  alt="Before Restoration - Block 13 Gulshan"
                  className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="glass-badge glass-badge-danger text-xs px-3 py-1 font-bold shadow-lg">
                    🔴 BEFORE
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-2 bg-slate-950/60">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Block 13, Gulshan-e-Iqbal, Karachi
                  </h3>
                  <p className="text-red-200/90 text-xs leading-relaxed">
                    Severe waterlogging, overflowing sewage, broken pavement & dangerous overhead wires reported by 210 residents.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Reported: Jan 14, 2026</span>
                  <span className="text-red-400 font-semibold">Priority Level: High</span>
                </div>
              </div>
            </motion.div>

            {/* AFTER CARD */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
                <img
                  src="/assets/street-after-clean.jpg"
                  alt="After Restoration - Clean Paved Street with Trees"
                  className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="glass-badge glass-badge-success text-xs px-3 py-1 font-bold shadow-lg">
                    🟢 AFTER
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-2 bg-slate-950/60">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Fully Restored, Paved & Greened
                  </h3>
                  <p className="text-emerald-200/90 text-xs leading-relaxed">
                    Carpeted asphalt road, clean underground drainage, paved sidewalks & newly planted trees via KMC & Masail Campaign.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Resolved: Jan 26, 2026</span>
                  <span className="text-emerald-400 font-semibold">100% Verified Fix</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Infinite Liquid Glass Carousel ── */}
      <section className="py-24 bg-glass-mesh overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              What Karachites Are Saying
            </h2>
          </motion.div>
        </div>

        {/* Infinite Horizontal Motion Track */}
        <div className="liquid-glass-carousel-container">
          <div className="liquid-glass-carousel-track" style={{ animationDuration: '45s' }}>
            {/* Duplicated for 100% continuous infinite loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={`${t.name}-${i}`} className="liquid-glass-card-item">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)', boxShadow: '0 0 12px rgba(37,99,235,0.40)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card overflow-visible"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                  <span className="text-muted-foreground shrink-0 ml-3 transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={18} />
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">
                        <div className="glass-divider mb-3" />
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 50%, #4F46E5 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="glass-orb w-96 h-96 -top-20 -right-20 opacity-20" style={{ background: 'radial-gradient(circle, #38BDF8, transparent 70%)' }} />
          <div className="glass-orb w-80 h-80 bottom-0 left-0 opacity-15" style={{ background: 'radial-gradient(circle, #A78BFA, transparent 70%)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Karachi is Our City.<br />Let's Fix It Together.
            </h2>
            <p className="text-blue-200 mb-10 max-w-xl mx-auto text-lg">
              Join 18,000+ Karachites already using MASAIL to demand better civic services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="glass-btn px-8 py-4 text-base font-bold text-blue-700 rounded-2xl"
                style={{ background: '#ffffff', boxShadow: '0 8px 32px rgba(255,255,255,0.30)' }}
              >
                Register Free — It's Quick
              </button>
              <button
                onClick={() => navigate('/login')}
                className="glass-btn px-8 py-4 text-base font-semibold text-white rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(14px)' }}
              >
                Login to Your Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'rgba(11,17,32,0.98)', backdropFilter: 'blur(20px)' }} className="text-slate-400 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-8 h-8 object-contain drop-shadow-md shrink-0" />
                <span className="text-white font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>MASAIL</span>
              </div>
              <p className="text-sm leading-relaxed">Karachi's civic issue reporting platform. Built for citizens, backed by accountability.</p>
            </div>
            {[
              { title: 'Platform', links: ['Report an Issue', 'Browse Issues', 'Campaigns', 'How It Works'] },
              { title: 'Authorities', links: ['KMC', 'KWSB', 'K-Electric', 'District Municipal Corp', 'NHA'] },
              { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold mb-3 text-sm">{col.title}</p>
                <ul className="space-y-2 text-sm">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="glass-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2026 MASAIL. Made with ❤️ for Karachi.</p>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-green-500" />
              <span className="text-sm">Karachi, Sindh, Pakistan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
