import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ErrorBar,
  ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts';
import ChartPanel from '../components/ChartPanel';
import { modelComparison } from '../data';

export default function ModelsView() {
  const scatterData = modelComparison.map((m) => ({
    name: m.name,
    mae: m.cvMAE,
    std: m.cvStd,
    selected: m.selected,
  }));

  return (
    <>
      <div className="page-header">
        <h1>Model Comparison</h1>
        <p>
          Final cross-validated performance metrics for all candidate regressors.
          The selected model minimizes the variance-penalized Stability Score.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="chart-grid chart-grid-full" style={{ marginBottom: 24 }}>
        <ChartPanel id="table-comparison" title="Model Performance Summary" subtitle="Sorted by Stability Score (ascending)">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>CV MAE</th>
                <th>CV Std Dev</th>
                <th>Stability Score</th>
                <th>RMSE</th>
                <th>MAPE</th>
                <th>α</th>
                <th>Poly Degree</th>
              </tr>
            </thead>
            <tbody>
              {[...modelComparison]
                .sort((a, b) => a.stabilityScore - b.stabilityScore)
                .map((m) => (
                  <tr key={m.name} className={m.selected ? 'best-model' : ''}>
                    <td>{m.name} {m.selected && '✓'}</td>
                    <td className="mono">{m.cvMAE.toFixed(2)}</td>
                    <td className="mono">{m.cvStd.toFixed(2)}</td>
                    <td className="mono">{m.stabilityScore.toFixed(2)}</td>
                    <td className="mono">{m.rmse.toFixed(2)}</td>
                    <td className="mono">{m.mape.toFixed(2)}%</td>
                    <td className="mono">{m.alpha}</td>
                    <td className="mono">{m.polyDegree}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ChartPanel>
      </div>

      <div className="chart-grid chart-grid-2">
        {/* Bar Chart — MAE with Error Bars */}
        <ChartPanel
          id="chart-model-bars"
          title="Mean CV MAE with Variance"
          subtitle="Error bars represent ±1 standard deviation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={modelComparison.map((m) => ({
                name: m.name.replace(' Regression', '').replace(' Regressor', ''),
                mae: m.cvMAE,
                errorBar: m.cvStd,
              }))}
              margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5a5a72' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8e8ea0' }} domain={[300, 430]} />
              <Tooltip />
              <Bar dataKey="mae" name="Mean CV MAE" radius={[6, 6, 0, 0]}>
                {modelComparison.map((m, i) => (
                  <Cell
                    key={i}
                    fill={m.selected ? '#2d5a8e' : '#b8c5d6'}
                  />
                ))}
                <ErrorBar dataKey="errorBar" width={6} strokeWidth={2} stroke="#5a5a72" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Scatter — MAE vs Std Trade-off */}
        <ChartPanel
          id="chart-tradeoff"
          title="Error–Variance Trade-off"
          subtitle="Lower-left is optimal (low error, low variance)"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis
                dataKey="mae"
                name="Mean CV MAE"
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                label={{ value: 'CV MAE →', position: 'bottom', offset: -2, style: { fontSize: 11, fill: '#8e8ea0' } }}
              />
              <YAxis
                dataKey="std"
                name="CV Std Dev"
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                label={{ value: 'Std Dev →', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#8e8ea0' } }}
              />
              <ZAxis range={[120, 120]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Models" data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.selected ? '#2d5a8e' : '#b8c5d6'}
                    stroke={entry.selected ? '#1a3d66' : '#8e8ea0'}
                    strokeWidth={entry.selected ? 2 : 1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </>
  );
}
