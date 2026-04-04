export default function MethodologyView() {
  return (
    <>
      <div className="page-header">
        <h1>Methodology</h1>
        <p>
          A detailed reference of the theoretical foundations underpinning the custom
          variance-penalized hyperparameter stability scoring algorithm used throughout
          this forecasting pipeline.
        </p>
      </div>

      {/* Equation */}
      <div className="equation-card" id="methodology-equation">
        <div className="equation-label">Core Optimization Objective</div>
        <div className="equation-formula">
          Stability Score = <span className="var">E</span>[MAE] + <span className="var">λ</span> · <span className="var">σ</span>(MAE)
        </div>
        <div style={{ fontSize: 12, color: '#8e8ea0', marginTop: 8 }}>
          Minimized across all hyperparameter permutations evaluated via <code>GridSearchCV</code> with <code>TimeSeriesSplit</code>
        </div>
      </div>

      {/* Methodology Cards */}
      <div className="methodology-grid" id="methodology-cards">
        <div className="methodology-card">
          <div className="methodology-card-number">01</div>
          <div className="methodology-card-title">The One-Standard-Error (1-SE) Rule</div>
          <div className="methodology-card-desc">
            Introduced by Hastie, Tibshirani &amp; Friedman (2001), the classical 1-SE
            rule selects the simplest model whose CV error falls within one standard
            deviation of the best. This project extends that binary threshold into a
            smooth, continuous penalty function through the λ-weighted variance term.
          </div>
        </div>

        <div className="methodology-card">
          <div className="methodology-card-number">02</div>
          <div className="methodology-card-title">Risk-Averse Optimization (Mean-Variance)</div>
          <div className="methodology-card-desc">
            By formulating E[Error] + λ·σ(Error) as the objective, the framework mirrors
            Markowitz Portfolio Theory applied to ML. Cross-validation folds are treated
            as probabilistic scenario distributions, and λ manages risk aversion — higher
            values prevent catastrophic fold failures for stable production deployment.
          </div>
        </div>

        <div className="methodology-card">
          <div className="methodology-card-number">03</div>
          <div className="methodology-card-title">Addressing Temporal Bias</div>
          <div className="methodology-card-desc">
            Traditional CV suffers from high variance on temporal sequences with structural
            breaks (Arlot &amp; Celisse, 2010). Explicit variance penalization smooths over
            temporal non-stationarity, enforcing selection of generalized models that are
            resilient to localized fold variance from holiday weeks and demand shifts.
          </div>
        </div>
      </div>

      {/* Detailed Writeup */}
      <div className="chart-grid chart-grid-full" style={{ marginTop: 32 }}>
        <div className="chart-panel" id="methodology-details">
          <div className="chart-panel-header">
            <div>
              <div className="chart-panel-title">Implementation Details</div>
              <div className="chart-panel-subtitle">How the scoring engine integrates with the pipeline</div>
            </div>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.75, color: '#5a5a72', maxWidth: 780 }}>
            <p style={{ marginBottom: 16 }}>
              The <code style={{ background: '#f0ede7', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              find_stable_params_optimized()</code> function operates as a post-processing
              layer on top of Scikit-Learn's <code style={{ background: '#f0ede7', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              GridSearchCV</code>. Rather than relying on the default <code style={{ background: '#f0ede7', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              best_score_</code> attribute (which naïvely selects minimum mean error),
              the engine extracts per-fold scores from <code style={{ background: '#f0ede7', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              cv_results_</code> and computes the composite Stability Score.
            </p>

            <p style={{ marginBottom: 16 }}>
              The cross-validation strategy employs <code style={{ background: '#f0ede7', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              TimeSeriesSplit(n_splits=5)</code> to preserve temporal ordering and prevent
              data leakage. This is critical for time-series data where future information
              must never influence past predictions.
            </p>

            <p>
              Candidate models are evaluated across a grid spanning regularization strength
              (α ∈ {'{'}0.001, 0.01, 0.1, 1.0, 10.0{'}'}) and polynomial feature degree
              (d ∈ {'{'}1, 2, 3{'}'}). The 1-SE philosophy naturally favors degree-1
              (linear) configurations over higher polynomial expansions when performance
              is statistically comparable, yielding more interpretable and deployable models.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
