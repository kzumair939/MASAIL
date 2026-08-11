import type { IssueStatus } from '../data/mockData';

const STATUS_CONFIG: Record<string, { label: string; glassClass: string; dot: string }> = {
  reported:     { label: 'Reported',     glassClass: 'glass-badge-muted',    dot: '⬦' },
  under_review: { label: 'Under Review', glassClass: 'glass-badge-warning',  dot: '◎' },
  assigned:     { label: 'Assigned',     glassClass: 'glass-badge-accent',   dot: '◉' },
  in_progress:  { label: 'In Progress',  glassClass: 'glass-badge-primary',  dot: '●' },
  resolved:     { label: 'Resolved',     glassClass: 'glass-badge-success',  dot: '✓' },
  rejected:     { label: 'Rejected',     glassClass: 'glass-badge-danger',   dot: '✕' },
  // API uppercase variants
  REPORTED:     { label: 'Reported',     glassClass: 'glass-badge-muted',    dot: '⬦' },
  UNDER_REVIEW: { label: 'Under Review', glassClass: 'glass-badge-warning',  dot: '◎' },
  ASSIGNED:     { label: 'Assigned',     glassClass: 'glass-badge-accent',   dot: '◉' },
  IN_PROGRESS:  { label: 'In Progress',  glassClass: 'glass-badge-primary',  dot: '●' },
  RESOLVED:     { label: 'Resolved',     glassClass: 'glass-badge-success',  dot: '✓' },
  REJECTED:     { label: 'Rejected',     glassClass: 'glass-badge-danger',   dot: '✕' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, glassClass: 'glass-badge-muted', dot: '●' };
  return (
    <span
      className={`glass-badge ${config.glassClass} ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      <span className="text-[8px]">{config.dot}</span>
      {config.label}
    </span>
  );
}

interface CategoryBadgeProps {
  icon: string;
  label: string;
  className?: string;
}

export function CategoryBadge({ icon, label }: CategoryBadgeProps) {
  return (
    <span className="glass-badge glass-badge-accent text-xs">
      <span>{icon}</span>
      {label}
    </span>
  );
}
