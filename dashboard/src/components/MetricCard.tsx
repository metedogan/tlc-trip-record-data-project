import type { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: ReactNode;
  accent: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  id: string;
}

export default function MetricCard({ icon, label, value, sub, accent, id }: MetricCardProps) {
  return (
    <div className={`metric-card accent-${accent}`} id={id}>
      <div className="metric-card-header">
        <div className={`metric-card-icon bg-${accent}`}>{icon}</div>
        <span className="metric-card-label">{label}</span>
      </div>
      <div className="metric-card-value">{value}</div>
      {sub && <div className="metric-card-sub">{sub}</div>}
    </div>
  );
}
