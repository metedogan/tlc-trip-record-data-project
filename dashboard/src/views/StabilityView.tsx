import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ZAxis,
} from 'recharts';
import ChartPanel from '../components/ChartPanel';
import { stabilityCandidates } from '../data';

export default function StabilityView() {
  return (
    <>
      <div className="page-header">
        <h1>Stability Scoring</h1>
        <p>
          The custom variance-penalized hyperparameter scoring engine selects models
          by jointly minimizing error and cross-validation fold variance, following
          the 1-Standard-Error Rule philosophy.
        </p>
      </div>

      {/* Equation Card */}
      <div className="equation-card" id="stability-equation">
        <div className="equation-label">Stability Score Objective Function</div>
        <div className="equation-formula">
          Stability Score = <span className="var">Mean CV MAE</span> + (
          <span className="var">λ</span> × <span className="var">Std Dev CV MAE</span>)
        </div>
        <div style={{ fontSize: 12, color: '#8e8ea0', marginTop: 8 }}>
          λ = 1.0 — Selected to penalize high-variance parameter configurations equally
        </div>
      </div>

      <div className="chart-grid chart-grid-2">
        {/* Stability Scatter */}
        <ChartPanel
          id="chart-stability-scatter"
          title="Hyperparameter Stability Analysis (Ridge)"
          subtitle="Candidates ranked by Stability Score — error bars show ±σ"
        >
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis
                dataKey="index"
                name="Candidate (ranked)"
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                label={{ value: 'Candidate (ranked by Stability Score)', position: 'bottom', offset: -2, style: { fontSize: 11, fill: '#8e8ea0' } }}
              />
              <YAxis
                dataKey="mae"
                name="Mean CV MAE"
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                label={{ value: 'MAE', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#8e8ea0' } }}
              />
              <ZAxis dataKey="std" range={[60, 300]} name="Std Dev" />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{
                      background: '#fff',
                      border: '1px solid #e2ddd4',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.label}</div>
                      <div>MAE: <strong>{d.mae}</strong></div>
                      <div>Std: <strong>{d.std}</strong></div>
                      <div>Stability: <strong>{d.stabilityScore}</strong></div>
                      {d.selected && <div style={{ color: '#2e7d4f', fontWeight: 600, marginTop: 4 }}>✓ Selected</div>}
                    </div>
                  );
                }}
              />
              <Scatter name="Candidates" data={stabilityCandidates}>
                {stabilityCandidates.map((c, i) => (
                  <Cell
                    key={i}
                    fill={c.selected ? '#2e7d4f' : '#b8c5d6'}
                    stroke={c.selected ? '#1a5c36' : '#8e8ea0'}
                    strokeWidth={c.selected ? 3 : 1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* Candidate Table */}
        <ChartPanel
          id="table-candidates"
          title="Candidate Parameter Grid"
          subtitle="All evaluated hyperparameter permutations"
        >
          <table className="comparison-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Parameters</th>
                <th>MAE</th>
                <th>Std Dev</th>
                <th>Stability</th>
              </tr>
            </thead>
            <tbody>
              {stabilityCandidates.map((c) => (
                <tr key={c.index} className={c.selected ? 'best-model' : ''}>
                  <td className="mono">{c.index}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{c.label}</td>
                  <td className="mono">{c.mae}</td>
                  <td className="mono">{c.std}</td>
                  <td className="mono">{c.stabilityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartPanel>
      </div>
    </>
  );
}
