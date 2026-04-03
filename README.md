# NYC Taxi Demand Forecasting

## Overview
This repository contains an end-to-end data engineering and time-series forecasting pipeline designed to predict hourly taxi demand in New York City. Operating on the official NYC Taxi and Limousine Commission (TLC) Yellow Taxi trip records, the project processes raw trip data, engineers temporal and autoregressive features, and optimizes machine learning regressors to forecast future demand patterns.

## Project Architecture
The project follows a rigorous 7-phase methodology documented across progressive Jupyter Notebooks.

### Phase Breakdown
1. **Data Acquisition and Cleaning (`01_data_acquisition_and_cleaning.ipynb`):** Loads raw `.parquet` TLC records. Addresses missing values, geographical anomalies, and validates physical and financial structures per the TLC Data Dictionary.
2. **Exploratory Data Analysis (`02_exploratory_data_analysis.ipynb`):** Analyzes spatial and temporal distributions to establish optimal aggregation horizons, culminating in the decision to utilize an hourly aggregation framework.
3. **Time Series Decomposition (`03_time_series_decomposition.ipynb`):** Decomposes target arrays to evaluate underlying trends and seasonal structures (daily and weekly periodicities) while formally validating stationarity via ADF testing.
4. **Feature Engineering - Lags and Windows (`04_feature_engineering_lags_and_windows.ipynb`):** Generates historical autoregressive matrices including localized lags, Simple Moving Averages (SMA), and Exponentially Weighted Moving Averages (EWMA) to furnish models with historic memory context.
5. **Feature Engineering - Calendar Effects (`05_feature_engineering_calendar_effects.ipynb`):** Parses continuous datetime schemas into numerical and categorical vectors and implements boolean flags bounding structural disruptions, such as public holidays.
6. **Modelling and Hyperparameter Optimization (`06_modelling_hyperparameter_optimization.ipynb`):** Optimizes continuous regressors (Ridge, Lasso, ElasticNet, SGDRegressor) over dense matrices leveraging `TimeSeriesSplit` cross-validation. Employs a custom Variance Penalty Scoring formula during `GridSearchCV` to actively prioritize model stability over volatile peak performance.
7. **Model Evaluation (`07_model_evaluation_and_comparison.ipynb`):** Computes definitive out-of-sample scaling metrics (MAE, RMSE, MAPE) on a strict 20% validation holdout sequence and provides comprehensive residual diagnostics alongside feature weight mapping.

## Repository Structure
```text
tlc-trip-record-data-project/
├── data/
│   ├── raw/                  # Raw TLC Parquet operational files
│   └── processed/            # Intermediate and fully engineered datasets ready for ML
├── notebooks/                # Sequential 7-phase execution pipeline
├── reports/
│   ├── figures/              # Exported visualization graphics, residual distributions, and metric plots
│   ├── data_dictionary_report.md
│   └── nyc_taxi_demand_report.md
├── src/                      # Modular and scalable operational source code
└── README.md
```

## Setup and Installation

### Prerequisites
* Python 3.9+ environment
* Standard system package managers (pip/conda)

### Environment Configuration
1. Clone the repository to your local operating environment.
2. It is strictly recommended to configure a dedicated virtual environment before proceeding to prevent dependency conflicts.
3. Install required software dependencies via standard package configuration (ensure `pandas`, `scikit-learn`, `numpy`, and `holidays` are available).

## Execution Guide
The pipeline architecture is designed to be executed strictly sequentially to properly pass intermediate parquet checkpoints. Begin at the root of the `notebooks/` directory:

1. Initialize a generic Jupyter notebook server or compatible execution environment.
2. Execute files `01_data_acquisition_and_cleaning.ipynb` through `07_model_evaluation_and_comparison.ipynb` in explicit numeric order.
3. Transformed dataset checkpoints and diagnostic plots will programmatically write to the `/data` and `/reports` local directories respectively.
4. Final stability scoring metrics, test set performance calculations, and comparative residual diagnostics will render in Phase 7.

## Core Modeling Philosophy
A fundamental technical element of this pipeline is the deployment of a custom hyperparameter stability scoring algorithm within the cross-validation logic:
* Rather than utilizing standard grid searches that naively favor the lowest continuous error, this project actively integrates an adjustable standard deviation penalty ($\lambda$).
* This targets cross-validation variance across distinct temporal folds, guaranteeing that selected hyperparameters are heavily penalized for erratic predictions in volatile circumstances and mathematically rewarded for robust stability.

## License
This project is provided for educational and analytical purposes. Please verify specific data usage limits mapped by the New York City Taxi and Limousine Commission (TLC) regarding the underlying raw parquet sets.
