import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE — Damaged Street & Drainage',
  afterLabel = 'AFTER — Fully Carpeted & Greened Road',
  title = 'Block 13, Gulshan-e-Iqbal, Karachi',
  subtitle = 'Drag the slider left or right to see the real civic transformation achieved by residents & KMC.'
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden glass-card cursor-ew-resize select-none border border-white/20 shadow-2xl group"
      >
        {/* AFTER IMAGE (Bottom Layer - Clean Paved Street) */}
        <img
          src={afterImage}
          alt="After Restoration"
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        />

        {/* BEFORE IMAGE (Top Layer clipped by sliderPos - Broken Street) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src={beforeImage}
            alt="Before Restoration"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>

        {/* BEFORE Badge (Left Side) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="glass-badge glass-badge-danger px-3 py-1 text-xs font-bold shadow-lg">
            🔴 BEFORE
          </span>
        </div>

        {/* AFTER Badge (Right Side) */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <span className="glass-badge glass-badge-success px-3 py-1 text-xs font-bold shadow-lg">
            🟢 AFTER
          </span>
        </div>

        {/* SLIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          {/* Vertical Glowing Line */}
          <div className="w-1 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)]" />

          {/* Interactive Handle Knob */}
          <motion.div
            animate={{ scale: isDragging ? 1.15 : 1 }}
            className="absolute w-11 h-11 rounded-full bg-white/95 text-slate-900 shadow-2xl flex items-center justify-center border-2 border-blue-500 backdrop-blur-md"
          >
            <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
            </svg>
          </motion.div>
        </div>

        {/* Bottom Hint Banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 rounded-full glass-subtle text-[11px] text-white/90 font-medium border border-white/20 shadow-lg hidden sm:block">
          👈 Drag slider to compare Before & After 👉
        </div>
      </div>

      {/* Description Card */}
      <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div>
          <h3 className="text-base font-bold text-white mb-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>{title}</h3>
          <p className="text-xs text-slate-300">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <span className="text-red-400 font-semibold">• {beforeLabel}</span>
          <span className="text-emerald-400 font-semibold">• {afterLabel}</span>
        </div>
      </div>
    </div>
  );
}
