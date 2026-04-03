# NYC Taxi Demand Forecasting: Detailed Project Report

This report outlines the end-to-end pipeline developed for forecasting NYC Yellow Taxi demand. The project is systematically structured into seven sequential phases, progressing from raw data acquisition to final model evaluation, using highly engineered hourly aggregated time series methodologies.

## Phase 1: Data Acquisition and Cleaning
The pipeline begins by loading raw `.parquet` files from the TLC dataset. Data integrity is strictly enforced by cleaning anomalies according to explicit rules from the TLC data dictionary. A rigorous programmatic filtering process ensures that the root dataset is structurally sound:
- **Spatial Validation:** Filters invalid location coordinates and guarantees that `PULocationID` (Pick-up) and `DOLocationID` (Drop-off) map identically to the 263 officially recognized TLC zones. Any foreign or irregular geometries are instantly purged.
- **Financial Validation:** Systematically removes trips with missing, negative, or zero financial features including `fare_amount`, `total_amount`, and structural floor limits on `trip_distance`.
- **Occupancy Validation:** Sets logical boundaries on `passenger_count`. Empty vehicles ($0$ passengers) or wildly excessive capacities ($>9$) are actively removed since they suggest erroneous meter inputs rather than representing valid macro consumer demand profiles.

**Initial Raw Data Glimpse:**
| VendorID | tpep_pickup_datetime | passenger_count | trip_distance | PULocationID | DOLocationID | fare_amount | total_amount |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2025-01-01 00:18:38 | 1.0 | 1.60 | 229 | 237 | 10.0 | 18.00 |
| 1 | 2025-01-01 00:32:40 | 1.0 | 0.50 | 236 | 237 | 5.1 | 12.12 |
| 2 | 2025-01-01 00:14:27 | 3.0 | 0.52 | 244 | 244 | 7.2 | 9.70 |

## Phase 2: Exploratory Data Analysis (EDA)
Spatial and temporal distributions undergo heavy analysis to dictate the overarching project scaling and the scope of the aggregation modeling:
- **Spatial Targeting (Demand Hotspots):** Investigates geographical density by isolating the top intersecting pick-up and drop-off zones. This allows the model to constrain its algorithmic focus on highly viable, heavy-traffic macro-zones.
- **Aggregation Strategy:** A critical project decision involved determining the temporal base grouping. The project formally commits to an **hourly aggregation baseline** to retain high-fidelity intraday seasonality characteristics—specifically the stark contrasting peaks and valleys associated with morning rushes, midday lulls, and late-night variances.

![Demand Variance Analysis](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/demand_variance.png)

## Phase 3: Time Series Decomposition
An additive decomposition algorithm is performed on the standard hourly demand signal. This unpacks foundational periodicities and assesses the statistical integrity of the data before injecting complex ML matrices:
- **Seasonality Profiling:** The mathematical decomposition isolates the raw demand curve into underlying long-term trends, repeating seasonality vibrations, and residual stochastic noise. It explicitly flags the 24-hour rapid daily rhythm cleanly alongside the wider 168-hour weekly cycle.

````carousel
![Daily Seasonality Signal](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/daily_seosonality.png)
<!-- slide -->
![Isolated Seasonal Components](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/isolated_seasonal.png)
````

- **Stationarity Validation (ADF Test):** Formally performs the Augmented Dickey-Fuller (ADF) statistical test to mathematically declare stationarity. Ensuring stable bounds across the time axis confirms that time-series variance and the rolling mean do not drift endlessly.

## Phase 4: Feature Engineering - Lags and Windows
Historical demand context is explicitly synthesized and mapped directly into the dataset footprint:
- **Autoregressive Lag Features:** Shifts sequential historical demand vectors. Spans immediate short-term local lags ($t-1, t-2, t-3$ hours), as well as cyclic delays ($t-24, t-168$).
- **Rolling Statistical Windows & EWMA:** Generates rolling calculation buffers dynamically computing Simple Moving Averages and Standard Deviations across designated horizons. Augments basic rollings by applying exponential decay architectures (EWMA).

![Demand Moving Average](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/demand_moving_average.png)

**Engineered Feature Data Output (Lag Matrix Preview):**
| timestamp | total_demand | lag_1 | lag_2 | lag_3 | lag_24 | lag_48 | lag_168 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-02-28 20:00:00 | 7594 | 9639.0 | 9526.0 | 7894.0 | 8670.0 | 8865.0 | 7688.0 |
| 2026-02-28 21:00:00 | 7760 | 7594.0 | 9639.0 | 9526.0 | 8089.0 | 9296.0 | 6855.0 |

## Phase 5: Feature Engineering - Calendar Effects
Core raw datetime schemas are natively uninterpretable by standard non-sequential regressors; therefore, the index must be thoroughly parsed:
- **Explicit Date Architectures:** Extracts segmented datetime items plotting out categorical cyclic boundaries, including continuous 24-block hour arrays, the exact mathematical day of the week, and broader monthly mapping. 
- **Dynamic Holiday Flagging:** Deploys the Python `holidays` engine to automatically inject Boolean alert classifiers that warn the algorithm of established anomalies such as Federal US holidays and NYC public holidays.

## Phase 6: Modeling and Hyperparameter Optimization
With a densely engineered feature space completed, the extreme 80% training array is subjected to rigorous cyclic parametric testing strictly operating on `TimeSeriesSplit` cross-validation.

### Custom Variance Parameter Scoring Strategy (Optimized Hyperparameter Selection)
During standard optimization, `GridSearchCV` dictates naive selection of whichever hyperparameter permutation demonstrates the absolute lowest continuous Mean Absolute Error (MAE). Conversely, this project executes a proprietary `find_stable_params_optimized()` engine that actively penalizes model variance. 
$$\text{Stability Score} = \text{Mean CV MAE} + (\lambda \times \text{Std Dev CV MAE})$$

**Hyperparameter Model Search Analytics:**
Below are the individual outputs visualizing the Variance Target Optimization for each GridSearch component explored across various Regularized models:

````carousel
![SGD Regressor Optimal Variance Target](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/sgd_regressor_stable.png)
<!-- slide -->
![Lasso Regressor Optimal Variance Target](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/lasso_regressor_stable.png)
<!-- slide -->
![Ridge Regressor Optimal Variance Target](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/ridge_regressor_stable.png)
<!-- slide -->
![ElasticNet Regressor Optimal Variance Target](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/elasticnet_regressor_stable.png)
````

## Phase 7: Final Evaluation and Comparison
Using the explicitly selected robust hyperparameters determined directly from the Variance Stability Scoring out of Phase 6, the optimized systems confront the highly isolated 20% untouched temporal test frame.

````carousel
![Holdout Set Prediction Accuracy Map](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/final_evaluation.png)
<!-- slide -->
![Residual Diagnostic Check](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/residual_distribution.png)
<!-- slide -->
![Average Error Variance Assessment](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/average_error_variance.png)
````

- **Influence Topology Mapping:** Dynamically processes and isolates terminating dense remaining weights and variables resulting directly post Lasso/ElasticNet decimation. 

![Extracted Feature Importances](C:/Users/user/.gemini/antigravity/brain/b6360750-3628-403c-9df2-5a2f7cd489f4/artifacts/figures/fauture_importance.png)
