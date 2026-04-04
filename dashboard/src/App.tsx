import { useState } from 'react';
import Sidebar, { type View } from './components/Sidebar';
import OverviewView from './views/OverviewView';
import ModelsView from './views/ModelsView';
import FeaturesView from './views/FeaturesView';
import StabilityView from './views/StabilityView';
import MethodologyView from './views/MethodologyView';
import './index.css';

const viewComponents: Record<View, React.ComponentType> = {
  overview: OverviewView,
  models: ModelsView,
  features: FeaturesView,
  stability: StabilityView,
  methodology: MethodologyView,
};

export default function App() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ActiveComponent = viewComponents[activeView];

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main className={`main-content${sidebarCollapsed ? ' collapsed' : ''}`}>
        <ActiveComponent />
      </main>
    </div>
  );
}
