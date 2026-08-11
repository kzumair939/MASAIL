import { motion } from 'motion/react';

interface ProcessTrackerProps {
  label: string;
  percentage: number;
  state?: 'progress' | 'complete' | 'failed';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProcessTracker({ label, percentage, state = 'progress', showPercentage = true, size = 'md' }: ProcessTrackerProps) {
  const clampedPct = Math.min(100, Math.max(0, percentage));

  const gradient =
    state === 'complete'
      ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
      : state === 'failed'
      ? 'linear-gradient(90deg, #EF4444, #F87171)'
      : clampedPct >= 80
      ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
      : clampedPct >= 40
      ? 'linear-gradient(90deg, #F59E0B, #FCD34D)'
      : 'linear-gradient(90deg, #2563EB, #38BDF8)';

  const glowColor =
    state === 'complete' ? 'rgba(34,197,94,0.40)' :
    state === 'failed'   ? 'rgba(239,68,68,0.40)' :
    'rgba(37,99,235,0.35)';

  const labelColor =
    state === 'complete' ? '#22C55E' :
    state === 'failed'   ? '#EF4444' :
    clampedPct >= 80 ? '#22C55E' :
    clampedPct >= 40 ? '#F59E0B' :
    '#2563EB';

  const trackH = size === 'sm' ? '5px' : size === 'lg' ? '10px' : '7px';
  const textSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`${textSize} font-medium text-muted-foreground`}>{label}</span>
        {showPercentage && (
          <span className={`${textSize} font-bold`} style={{ color: labelColor }}>
            {clampedPct}%
          </span>
        )}
      </div>
      <div
        className="w-full rounded-full overflow-hidden glass-subtle"
        style={{ height: trackH, border: '1px solid var(--glass-border-subtle)' }}
      >
        <motion.div
          style={{ height: '100%', borderRadius: '999px', background: gradient, boxShadow: `0 0 8px ${glowColor}` }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPct}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </div>
  );
}

interface StepTrackerProps {
  steps: string[];
  currentStep: number;
  label?: string;
}

export function StepTracker({ steps, currentStep, label }: StepTrackerProps) {
  const pct = Math.round((currentStep / steps.length) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{label || steps[currentStep - 1]}</span>
        <span className="text-sm font-bold text-blue-500">Step {currentStep} of {steps.length}</span>
      </div>
      <div className="glass-progress-track">
        <motion.div
          className="glass-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, i) => (
          <span
            key={i}
            className={`text-[10px] font-medium ${i < currentStep ? 'text-blue-500' : 'text-muted-foreground'}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
