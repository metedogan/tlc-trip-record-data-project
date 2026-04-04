import type { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  id: string;
}

export default function ChartPanel({ title, subtitle, actions, children, id }: ChartPanelProps) {
  return (
    <div className="chart-panel" id={id}>
      <div className="chart-panel-header">
        <div>
          <div className="chart-panel-title">{title}</div>
          {subtitle && <div className="chart-panel-subtitle">{subtitle}</div>}
        </div>
        {actions && <div className="chart-panel-actions">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
