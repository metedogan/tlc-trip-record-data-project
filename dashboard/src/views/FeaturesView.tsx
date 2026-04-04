import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
} from 'recharts';
import ChartPanel from '../components/ChartPanel';
import { featureImportance, residualDistribution } from '../data';

export default function FeaturesView() {
  const maxAbs = Math.max(...featureImportance.map((f) => Math.abs(f.coefficient)));

  const barChartData = featureImportance.map((f) => ({
    name: f.name,
    value: f.coefficient,
    positive: f.direction === 'positive',
  }));

  return (
    <>
      <div className="page-header">
        <h1>Feature Analysis</h1>
        <p>
          Lasso coefficient magnitudes reveal which engineered features contribute
          most to hourly demand predictions. Positive values increase predicted demand;
          negative values decrease it.
        </p>
      </div>

      {/* Feature Importance — Horizontal Bar */}
      <div className="chart-grid chart-grid-full" style={{ marginBottom: 24 }}>
        <ChartPanel
          id="chart-feature-importance"
          title="Top 12 Feature Coefficients (Lasso)"
          subtitle="Coefficient direction and magnitude — green: positive, red: negative"
        >
          <div className="feature-list">
            {featureImportance.map((f, i) => {
              const pct = (Math.abs(f.coefficient) / maxAbs) * 100;
              return (
                <div className="feature-item" key={f.name}>
                  <span className="feature-rank">{i + 1}</span>
                  <span className="feature-name" title={f.name}>{f.name}</span>
                  <div className="feature-bar-track">
                    <div
                      className={`feature-bar-fill ${f.direction}`}
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 12 && (
                        <span className="feature-bar-value">{f.coefficient}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartPanel>
      </div>

      <div className="chart-grid chart-grid-2">
        {/* Feature Coefficient Bar Chart (recharts) */}
        <ChartPanel
          id="chart-feature-bars"
          title="Coefficient Magnitudes"
          subtitle="Signed coefficients — Lasso model"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8e8ea0' }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: '#5a5a72', fontFamily: "'JetBrains Mono', monospace" }}
                width={115}
              />
              <Tooltip />
              <Bar dataKey="value" name="Coefficient" radius={[0, 4, 4, 0]}>
                {barChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.positive ? '#2e7d4f' : '#c0392b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Residual Distribution */}
        <ChartPanel
          id="chart-residuals"
          title="Residual Distribution"
          subtitle="Histogram of prediction errors (Actual − Predicted)"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={residualDistribution} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="residGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d5a8e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2d5a8e" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis dataKey="bin" tick={{ fontSize: 11, fill: '#8e8ea0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8e8ea0' }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2d5a8e"
                strokeWidth={2}
                fill="url(#residGrad)"
                name="Frequency"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </>
  );
}
