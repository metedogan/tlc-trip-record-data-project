# Hyperparameter Optimization Scoring Technique

## Overview

The standard approach to hyperparameter optimization typically relies on selecting the model configuration that demonstrates the absolute lowest mean cross-validation error, such as the Mean Cross-Validation Mean Absolute Error (CV MAE). While effective in stable settings, this naïve selection introduces significant risk in highly volatile, non-stationary time series environments (like NYC Taxi demand). Selecting models purely based on minimal expected error ignores the *variance* of that error across different evaluation folds. Models with low mean error but high standard deviation are statistically risky; they may aggressively overfit certain time blocks while failing catastrophically on others.

To safeguard against this, the project implements a custom **variance-penalized hyperparameter stability scoring algorithm**. Instead of simply seeking the minimum error, the `find_stable_params_optimized()` engine introduces a robust parametric optimization objective that explicitly penalizes structural variance.

## The Stability Score Equation

The scoring metric optimizes for both accuracy and stability by calculating a composite "Stability Score":

```math
\text{Stability Score} = \text{Mean CV MAE} + (\lambda \times \text{Std Dev CV MAE})
```

Where:
*   **Mean CV MAE**: The average Mean Absolute Error across all cross-validation folds.
*   **Std Dev CV MAE**: The standard deviation of the MAE across all cross-validation folds.
*   **$\lambda$ (Lambda)**: A hyperparameter penalty term dictating the degree of risk aversion in the model selection. A higher $\lambda$ imposes a stricter penalty on performance variance between folds.

The model hyperparameter permutation that *minimizes* this Stability Score is ultimately selected.

## Methodological Details and Theoretical Background

This custom stability optimization technique is theoretically anchored in **Statistical Learning Theory** and heavily extends upon the classical model selection methodologies.

### 1. The One-Standard-Error (1-SE) Rule
Introduced formally by Hastie, Tibshirani, and Friedman in *The Elements of Statistical Learning* (2001), standard parsimony practice dictates the One-Standard-Error rule: selecting the simplest model whose cross-validation error falls within one standard deviation of the absolute best model's error. While the classical 1-SE rule is essentially a binary decision threshold based on model complexity, the variance penalization formula employed in this project translates that statistical intuition into a **smooth, continuous penalty function**.

### 2. Risk-Averse Optimization (Mean-Variance Paradigm)
By modeling the objective function mathematically as the expected error plus a variance constraint ($E[\text{Error}] + \lambda \times \sqrt{Var[\text{Error}]}$), the framework naturally mirrors **Markowitz Portfolio Theory** from quantitative finance applied directly to machine learning errors. It treats cross-validation folds as probabilistic scenario distributions. The coefficient $\lambda$ implicitly manages risk-aversion. A higher value aggressively prevents catastrophic structural failures across subset folds to ensure highly stable production deployment, matching practices outlined in robust optimization literature.

### 3. Addressing Temporal Bias in Machine Learning
As demonstrated by Arlot and Celisse (2010), traditional subset CV algorithms inherently suffer from high variance when applied to temporal sequences exhibiting structural breaks (e.g., shifts spanning from standard commute weeks to holiday weeks). Explicit variance penalization intrinsically smooths over this temporal non-stationarity, enforcing the selection of generalized resilient models far less prone to localized fold variance.

## Functional Advantange

Extensive cross-validation testing confirms this framework purposefully avoids outlier machine learning topologies that score erratically. Instead of exploiting distinct, isolated fold subsets to achieve a low error mean, the optimized engine extracts parameter mappings that consistently report predictable, flat margins across the timeline's entirety.
