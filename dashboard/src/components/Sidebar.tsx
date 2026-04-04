import {
  LayoutDashboard,
  BarChart3,
  FlaskConical,
  GitBranch,
  PanelLeftClose,
  PanelLeft,
  Activity,
  BookOpen,
} from 'lucide-react';

export type View = 'overview' | 'models' | 'features' | 'stability' | 'methodology';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { view: View; icon: React.ReactNode; label: string; section?: string }[] = [
  { section: 'Dashboard', view: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { section: 'Analysis', view: 'models', icon: <BarChart3 size={18} />, label: 'Model Comparison' },
  { view: 'features', icon: <FlaskConical size={18} />, label: 'Feature Analysis' },
  { view: 'stability', icon: <Activity size={18} />, label: 'Stability Scoring' },
  { section: 'Reference', view: 'methodology', icon: <BookOpen size={18} />, label: 'Methodology' },
];

export default function Sidebar({ activeView, onViewChange, collapsed, onToggle }: SidebarProps) {
  let lastSection = '';

  return (
    <nav className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Main navigation">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GitBranch size={16} />
        </div>
        <div>
          <div className="sidebar-title">NYC Taxi Forecasting</div>
          <div className="sidebar-subtitle">TLC Trip Record Pipeline</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.view}>
              {showSection && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <button
                id={`nav-${item.view}`}
                className={`nav-item${activeView === item.view ? ' active' : ''}`}
                onClick={() => onViewChange(item.view)}
                title={item.label}
              >
                {item.icon}
                <span className="nav-item-label">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Toggle */}
      <div className="sidebar-toggle">
        <button onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
    </nav>
  );
}
