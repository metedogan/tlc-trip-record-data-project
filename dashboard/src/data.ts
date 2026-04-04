/* ═══════════════════════════════════════════════════════════════
   Static Mock Data — Derived from Project Phase 6 & 7 Reports
   ═══════════════════════════════════════════════════════════════ */

// ---------- Model Comparison (from average_error_variance.png) ----------
export interface ModelMetrics {
  name: string;
  cvMAE: number;
  cvStd: number;
  stabilityScore: number;
  rmse: number;
  mape: number;
  alpha: number;
  polyDegree: number;
  selected: boolean;
}

export const modelComparison: ModelMetrics[] = [
  {
    name: 'Lasso Regression',
    cvMAE: 357.52,
    cvStd: 38.14,
    stabilityScore: 395.66,
    rmse: 532.18,
    mape: 8.42,
    alpha: 0.1,
    polyDegree: 1,
    selected: true,
  },
  {
    name: 'Ridge Regression',
    cvMAE: 375.24,
    cvStd: 52.81,
    stabilityScore: 428.05,
    rmse: 548.90,
    mape: 8.87,
    alpha: 1.0,
    polyDegree: 1,
    selected: false,
  },
  {
    name: 'SGD Regressor',
    cvMAE: 376.27,
    cvStd: 44.53,
    stabilityScore: 420.80,
    rmse: 552.33,
    mape: 8.91,
    alpha: 0.001,
    polyDegree: 1,
    selected: false,
  },
  {
    name: 'ElasticNet',
    cvMAE: 380.69,
    cvStd: 42.07,
    stabilityScore: 422.76,
    rmse: 561.45,
    mape: 9.12,
    alpha: 0.1,
    polyDegree: 1,
    selected: false,
  },
];

// ---------- Feature Importance (from fauture_importance.png — Lasso Coefficients) ----------
export interface FeatureCoefficient {
  name: string;
  coefficient: number;
  direction: 'positive' | 'negative';
}

export const featureImportance: FeatureCoefficient[] = [
  { name: 'lag_1',              coefficient: 1784,  direction: 'positive' },
  { name: 'lag_168',            coefficient: 612,   direction: 'positive' },
  { name: 'hour_cos',           coefficient: -478,  direction: 'negative' },
  { name: 'lag_24',             coefficient: 385,   direction: 'positive' },
  { name: 'lag_3 rolling_max_6',coefficient: 208,   direction: 'positive' },
  { name: 'lag_3 hour_sin',     coefficient: -189,  direction: 'negative' },
  { name: 'lag_1 rolling_std_6',coefficient: -165,  direction: 'negative' },
  { name: 'lag_24 rolling_min', coefficient: -112,  direction: 'negative' },
  { name: 'lag_1 lag_2',        coefficient: -98,   direction: 'negative' },
  { name: 'lag_2 rolling_std',  coefficient: -87,   direction: 'negative' },
  { name: 'lag_24 hour',        coefficient: 73,    direction: 'positive' },
  { name: 'rolling_max_12',     coefficient: 58,    direction: 'positive' },
];

// ---------- Actual vs Forecast Time Series (from final_evaluation.png — 1 week Dec 2025) ----------
function generateDemandSeries() {
  const data: { time: string; actual: number; predicted: number }[] = [];
  const startDate = new Date('2025-12-08T00:00:00');

  for (let h = 0; h < 168; h++) {
    const d = new Date(startDate.getTime() + h * 3600000);
    const hour = d.getHours();
    const dow = d.getDay();

    // Hourly seasonality: high in afternoon/evening, low at night
    const hourEffect = Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 3500 + 1200;

    // Weekend effect
    const isWeekend = dow === 0 || dow === 6;
    const weekendMod = isWeekend ? -800 : 400;

    // Weekly trend
    const trendBase = 4800;

    // Night dip
    const nightDip = hour >= 1 && hour <= 5 ? -3200 : 0;

    const actual = Math.max(
      100,
      Math.round(trendBase + hourEffect + weekendMod + nightDip + (Math.random() - 0.5) * 1200)
    );

    // Predicted follows closely with slight noise (good model ~357 MAE)
    const error = (Math.random() - 0.5) * 700;
    const predicted = Math.max(100, Math.round(actual + error));

    const timeStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;

    data.push({ time: timeStr, actual, predicted });
  }

  return data;
}

export const demandTimeSeries = generateDemandSeries();

// ---------- Cross-Validation Fold Performance (for stability chart) ----------
export interface CVFoldData {
  fold: string;
  ridge: number;
  lasso: number;
  sgd: number;
  elasticnet: number;
}

export const cvFoldPerformance: CVFoldData[] = [
  { fold: 'Fold 1', ridge: 342, lasso: 328, sgd: 351, elasticnet: 356 },
  { fold: 'Fold 2', ridge: 389, lasso: 362, sgd: 385, elasticnet: 392 },
  { fold: 'Fold 3', ridge: 401, lasso: 371, sgd: 398, elasticnet: 404 },
  { fold: 'Fold 4', ridge: 356, lasso: 340, sgd: 362, elasticnet: 365 },
  { fold: 'Fold 5', ridge: 388, lasso: 386, sgd: 385, elasticnet: 387 },
];

// ---------- Hourly Demand Pattern (average by hour) ----------
export const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
  const base = 3800;
  const peak = Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 3200;
  const nightDip = hour >= 1 && hour <= 5 ? -2800 : 0;
  const avg = Math.max(300, Math.round(base + peak + nightDip));
  return {
    hour: `${String(hour).padStart(2, '0')}:00`,
    avgDemand: avg,
  };
});

// ---------- Residual Distribution (histogram bins) ----------
export const residualDistribution = [
  { bin: '-8000', count: 1 },
  { bin: '-6000', count: 3 },
  { bin: '-4000', count: 8 },
  { bin: '-3000', count: 18 },
  { bin: '-2000', count: 45 },
  { bin: '-1500', count: 95 },
  { bin: '-1000', count: 225 },
  { bin: '-500',  count: 440 },
  { bin: '0',     count: 520 },
  { bin: '500',   count: 445 },
  { bin: '1000',  count: 230 },
  { bin: '1500',  count: 140 },
  { bin: '2000',  count: 80 },
  { bin: '3000',  count: 35 },
  { bin: '4000',  count: 12 },
  { bin: '5000',  count: 4 },
];

// ---------- Stability Score Candidates (Ridge — from ridge_regressor_stable.png) ----------
export interface StabilityCandidate {
  index: number;
  mae: number;
  std: number;
  stabilityScore: number;
  selected: boolean;
  label: string;
}

export const stabilityCandidates: StabilityCandidate[] = [
  { index: 0, label: 'α=1, d=1',    mae: 340, std: 25,  stabilityScore: 365,  selected: true },
  { index: 1, label: 'α=10, d=1',   mae: 355, std: 30,  stabilityScore: 385,  selected: false },
  { index: 2, label: 'α=0.1, d=1',  mae: 380, std: 28,  stabilityScore: 408,  selected: false },
  { index: 3, label: 'α=1, d=2',    mae: 565, std: 85,  stabilityScore: 650,  selected: false },
  { index: 4, label: 'α=10, d=2',   mae: 790, std: 135, stabilityScore: 925,  selected: false },
  { index: 5, label: 'α=0.1, d=2',  mae: 1100, std: 210, stabilityScore: 1310, selected: false },
  { index: 6, label: 'α=1, d=3',    mae: 1490, std: 680, stabilityScore: 2170, selected: false },
  { index: 7, label: 'α=10, d=3',   mae: 2680, std: 780, stabilityScore: 3460, selected: false },
  { index: 8, label: 'α=0.1, d=3',  mae: 4480, std: 1200,stabilityScore: 5680, selected: false },
];

// ---------- Pipeline Phases ----------
export const pipelinePhases = [
  { phase: 1, name: 'Data Acquisition', status: 'completed' as const },
  { phase: 2, name: 'EDA', status: 'completed' as const },
  { phase: 3, name: 'Decomposition', status: 'completed' as const },
  { phase: 4, name: 'Feature Eng. (Lags)', status: 'completed' as const },
  { phase: 5, name: 'Feature Eng. (Calendar)', status: 'completed' as const },
  { phase: 6, name: 'Modelling & HP Optimization', status: 'completed' as const },
  { phase: 7, name: 'Model Evaluation', status: 'active' as const },
];
