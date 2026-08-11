import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Dark backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-10"
            onClick={onClose}
          />

          {/* Modal content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative max-w-md w-full p-7 z-20 text-center shadow-2xl bg-[#0f172a]/95 border border-slate-700/60 rounded-3xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 glass-btn-icon p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Icon Header */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-amber-500/10 p-3 border border-amber-500/30 shadow-inner">
              <img src="/assets/masail-logo.svg" alt="MASAIL Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Verification Required
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              To access the <strong className="text-white font-semibold">Report Issue</strong> feature, you need to verify your Karachi resident identity first.
            </p>

            {/* Reasons List */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-left mb-6 space-y-2.5">
              <p className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1.5">Why verify?</p>
              {[
                'Ensures authentic civic complaints from real Karachi residents',
                'Prevents fake reporting and spam',
                'Direct tracking with local municipal officers',
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-xs leading-tight">{r}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { onClose(); navigate('/verification'); }}
                className="glass-btn glass-btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <span>Get Verified Now</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
