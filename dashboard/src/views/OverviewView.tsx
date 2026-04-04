import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Area, AreaChart,
} from 'recharts';
import {
  TrendingUp, Target, Sigma, Clock, Award,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ChartPanel from '../components/ChartPanel';
import PipelinePhases from '../components/PipelinePhases';
import {
  modelComparison, demandTimeSeries, cvFoldPerformance, hourlyPattern,
} from '../data';

export default function OverviewView() {
  const [forecastRange, setForecastRange] = useState<'week' | 'day'>('week');

  const bestModel = modelComparison.find((m) => m.selected)!;
  const displaySeries = forecastRange === 'day' ? demandTimeSeries.slice(0, 24) : demandTimeSeries;

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <h1>NYC Taxi Demand Forecasting</h1>
        <p>
          End-to-end time-series forecasting pipeline for hourly taxi demand using
          variance-penalized cross-validation and regularized linear regressors.
        </p>
        <div className="page-header-meta">
          <span className="badge badge-success">
            <Award size={12} /> Best Model: {bestModel.name}
          </span>
          <span className="badge badge-primary">
            <Clock size={12} /> Hourly Aggregation
          </span>
          <span className="badge badge-warning">
            <Sigma size={12} /> λ = 1.0
          </span>
        </div>
      </div>

      {/* Pipeline Phases */}
      <PipelinePhases />

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <MetricCard
          id="kpi-mae"
          accent="primary"
          icon={<Target size={18} />}
          label="CV MAE"
          value={bestModel.cvMAE.toFixed(2)}
          sub={<>Cross-validated Mean Absolute Error</>}
        />
        <MetricCard
          id="kpi-rmse"
          accent="secondary"
          icon={<TrendingUp size={18} />}
          label="RMSE"
          value={bestModel.rmse.toFixed(2)}
          sub={<>Root Mean Squared Error</>}
        />
        <MetricCard
          id="kpi-mape"
          accent="success"
          icon={<Sigma size={18} />}
          label="MAPE"
          value={`${bestModel.mape.toFixed(2)}%`}
          sub={<>Mean Absolute Percentage Error</>}
        />
        <MetricCard
          id="kpi-stability"
          accent="warning"
          icon={<Award size={18} />}
          label="Stability Score"
          value={bestModel.stabilityScore.toFixed(2)}
          sub={
            <>
              MAE + λ·σ &nbsp;(σ = <span className="mono">{bestModel.cvStd.toFixed(2)}</span>)
            </>
          }
        />
        <MetricCard
          id="kpi-cv-std"
          accent="danger"
          icon={<Clock size={18} />}
          label="CV Std Dev"
          value={bestModel.cvStd.toFixed(2)}
          sub={<>Fold-to-fold variance measure</>}
        />
      </div>

      {/* Actual vs Forecast Chart */}
      <div className="chart-grid chart-grid-full">
        <ChartPanel
          id="chart-forecast"
          title="Actual vs. Predicted Demand"
          subtitle={`Lasso (Stable) — Test set, 1-${forecastRange === 'week' ? 'week' : 'day'} horizon (Dec 2025)`}
          actions={
            <>
              <button
                className={`chart-tab${forecastRange === 'day' ? ' active' : ''}`}
                onClick={() => setForecastRange('day')}
              >
                24h
              </button>
              <button
                className={`chart-tab${forecastRange === 'week' ? ' active' : ''}`}
                onClick={() => setForecastRange('week')}
              >
                7 Days
              </button>
            </>
          }
        >
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={displaySeries} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d5a8e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2d5a8e" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                interval={forecastRange === 'day' ? 1 : 23}
                axisLine={{ stroke: '#e2ddd4' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                axisLine={{ stroke: '#e2ddd4' }}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#2d5a8e"
                strokeWidth={2}
                fill="url(#actualGrad)"
                name="Actual Demand"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#c0392b"
                strokeWidth={2}
                strokeDasharray="6 3"
                name="Predicted (Lasso Stable)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      {/* CV Fold & Hourly Pattern */}
      <div className="chart-grid chart-grid-2">
        <ChartPanel
          id="chart-cv-folds"
          title="Cross-Validation Fold Performance"
          subtitle="MAE per fold — TimeSeriesSplit (5 folds)"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cvFoldPerformance} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis dataKey="fold" tick={{ fontSize: 11, fill: '#8e8ea0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8e8ea0' }} domain={[280, 430]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="lasso" fill="#2d5a8e" name="Lasso" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ridge" fill="#6b4c8a" name="Ridge" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sgd" fill="#2e7d4f" name="SGD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="elasticnet" fill="#b8860b" name="ElasticNet" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          id="chart-hourly-pattern"
          title="Average Hourly Demand Pattern"
          subtitle="Mean trip count by hour of day"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hourlyPattern} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b4c8a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6b4c8a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd4" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#8e8ea0' }} interval={2} />
              <YAxis
                tick={{ fontSize: 11, fill: '#8e8ea0' }}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="avgDemand"
                stroke="#6b4c8a"
                strokeWidth={2}
                fill="url(#hourlyGrad)"
                name="Avg. Demand"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </>
  );
}
