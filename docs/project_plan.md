# NYC Yellow Taxi Time Series Project Plan

## Overview
This document outlines the project plan for the NYC Yellow Taxi Demand Forecasting project. The plan leverages the data structure from 2024 to early 2026.

## Data Sources
- **Location:** `data/raw/`
- **Files:** TLC Yellow Taxi trip records formatted as `.parquet` files.
- **Time Range:** January 2024 through February 2026 (26 months of data, ~1.5 GB).
- **Data Dictionary:** Defined in `references/data_dictionary_trip_records_yellow.pdf`.

## Workflow & Notebook Structure
The project is divided into 8 sequential phases, each mapping to a Jupyter notebook in the `notebooks/` directory.

### Phase 1: Data Acquisition and Cleaning
*Notebook: `01_data_acquisition_and_cleaning.ipynb`*
- Load `.parquet` files from `data/raw/`.
- Handle missing values and anomalies in time variables.
- Filter invalid coordinates, extreme passenger counts, or negative fares based on the data dictionary.

### Phase 2: Exploratory Data Analysis (EDA)
*Notebook: `02_exploratory_data_analysis.ipynb`*
- Analyze spatial-temporal distributions of trips.
- Determine aggregated unit of time (e.g., hourly or daily demand).
- Identify demand hotspots (PULocationID / DOLocationID).

### Phase 3: Time Series Decomposition
*Notebook: `03_time_series_decomposition.ipynb`*
- Decompose the aggregated time series data into trend, seasonality, and residual components.
- Analyze daily, weekly, and yearly seasonal patterns.
- Check for stationarity (e.g., Augmented Dickey-Fuller test).

### Phase 4: Feature Engineering - Lags and Windows
*Notebook: `04_feature_engineering_lags_and_windows.ipynb`*
- Generate lag features (e.g., $t-1, t-2, t-24$).
- Calculate rolling window statistics (moving averages, standard deviations) to capture short-term trends.
- Apply exponential smoothing.

### Phase 5: Feature Engineering - Calendar Effects
*Notebook: `05_feature_engineering_calendar_effects.ipynb`*
- Extract date parts: hour of day, day of week, month.
- Identify and flag US and NYC-specific public holidays.
- Identify special events and extreme weather exceptions.

### Phase 6: Modelling and Hyperparameter Optimization
*Notebook: `06_modelling_hyperparameter_optimization.ipynb`*
- Implement baseline models (e.g., Naive, ARIMA, Prophet).
- Train advanced Machine Learning models (e.g., XGBoost, LightGBM).
- Perform hyperparameter tuning using Time Series Cross-Validation to prevent data leakage.

### Phase 7: Model Evaluation and Comparison
*Notebook: `07_model_evaluation_and_comparison.ipynb`*
- Compare models using appropriate metrics: MAE, RMSE, MAPE.
- Perform residual analysis on final candidate models.
- Determine feature importance (for tree-based models).

### Phase 8: Final Forecasting and Submission
*Notebook: `08_final_forecasting_and_submission.ipynb`*
- Train the best performing model on the entire dataset.
- Generate forecasts for the holdout/future time periods.
- Prepare the final submission or production pipeline output.
