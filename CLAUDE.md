# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

End-to-end time series forecasting pipeline predicting hourly NYC Yellow Taxi demand using TLC trip records. The pipeline runs as sequential Jupyter notebooks (01→06), producing trained models and a React dashboard for stakeholder communication.

## Commands

### Python (uv package manager)

```bash
# Install dependencies
uv pip install -e .

# Launch Jupyter to run notebooks
jupyter notebook

# Run a specific notebook non-interactively
jupyter nbconvert --to notebook --execute notebooks/06_modelling_hyperparameter_optimization.ipynb
```

### Dashboard (React/Vite)

```bash
cd dashboard
npm run dev      # Dev server with HMR
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Data Pipeline (Notebooks → `data/` → `models/`)

The 6 completed notebooks form a strict sequential pipeline — each writes parquet checkpoints consumed by the next:

| Notebook | Input | Output |
|----------|-------|--------|
| 01 Acquisition & Cleaning | `data/raw/*.parquet` (TLC Yellow Taxi, 9 months) | `data/interim/` |
| 02 EDA | interim data | analysis only |
| 03 Time Series Decomposition | interim | `data/processed/base_hourly_demand.parquet` |
| 04 Feature Engineering (Lags/Windows) | base hourly | lag_1/24/168, SMA, EWMA features |
| 05 Feature Engineering (Calendar) | lag features | `data/processed/features_hourly_demand.parquet` |
| 06 Modelling & Hyperparameter Optimization | `final_ml_features.parquet`, `X_train/X_test/y_train/y_test` | `models/*.joblib`, `reports/figures/*.png` |

**Train/test split:** strict 80/20 temporal holdout (no shuffling — respects time ordering).

**CV strategy:** `TimeSeriesSplit` to prevent future-data leakage.

### Custom Stability Scoring

The core ML innovation is a variance-penalized scoring function replacing standard `GridSearchCV` scoring:

```
Stability Score = Mean CV MAE + (λ × Std Dev CV MAE)
```

This penalizes hyperparameters that fit well on some folds but poorly on others. λ is the risk-aversion coefficient. See `reports/hyperparameter_optimization_scoring.md` for full theoretical treatment.

**Selected model:** Lasso (cvMAE=357.52, Stability Score=395.66, MAPE=8.42%).

### Dashboard (`dashboard/`)

React + TypeScript + Vite SPA with 5 views: Overview, Models, Features, Stability, Methodology. Chart data lives in `dashboard/src/data.ts` — currently mocked from actual model outputs (not API-driven). Uses Recharts for visualizations.

## Key Data Files

- `data/raw/` — Raw TLC parquet files (tracked via Git LFS, ~900MB)
- `data/processed/final_ml_features.parquet` — ML-ready feature matrix
- `models/model_metadata.joblib` — Serialized model metadata including scoring results
- `references/data_dictionary_trip_records_yellow.pdf` — Official TLC schema reference

## Environment

- Python 3.13 (`uv` for dependency management, `.venv/` directory)
- Node 18+ (dashboard only)
- No Docker — native venv + Node

## Top Features (by Lasso coefficient magnitude)

`lag_1` > `lag_168` (weekly) > `hour_cos` > `lag_24` (daily) > rolling statistics and calendar interaction terms. Autoregressive lags dominate; calendar effects contribute but are secondary.
