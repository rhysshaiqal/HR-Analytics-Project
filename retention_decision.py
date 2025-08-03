"""
Workforce Optimization: Retention Decision Model
-------------------------------------------------
This module creates a machine learning model that recommends which employees to retain
or let go during downsizing operations, based on performance, cost, and attrition risk.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.calibration import calibration_curve
import shap
import pickle
import warnings
warnings.filterwarnings('ignore')

# Set aesthetics for plots
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette('viridis')

def load_data(file_path='PROJECT AND DATASET IN HERE/WA_Fn-UseC_-HR-Employee-Attrition.csv'):
    """Load and perform initial preprocessing of the HR dataset"""
    df = pd.read_csv(file_path)
    
    print(f"Dataset loaded: {df.shape[0]} employees with {df.shape[1]} attributes")
    print(f"Attrition rate: {df['Attrition'].value_counts(normalize=True)['Yes']:.2%}")
    
    # Convert Attrition to binary
    df['AttritionBinary'] = df['Attrition'].map({'Yes': 1, 'No': 0})
    
    return df

def engineer_features(df):
    """Create advanced HR analytics features for decision-making"""
    print("Engineering strategic HR metrics...")
    
    # 1. Cost-to-Company (CTC) Estimation
    def calculate_ctc(row):
        """Calculate annual cost to company including benefits"""
        base_annual = row['MonthlyIncome'] * 12
        
        # Add benefits percentage based on job level
        benefits_multiplier = 1.0 + (row['JobLevel'] * 0.05)
        
        # Role-specific multipliers
        role_multipliers = {
            'Manager': 1.2,
            'Research Director': 1.3,
            'Healthcare Representative': 1.15,
            'Manufacturing Director': 1.25,
            'Sales Executive': 1.18,
            'Research Scientist': 1.15,
            'Laboratory Technician': 1.12,
            'Human Resources': 1.1,
            'Sales Representative': 1.15
        }
        
        role_multiplier = role_multipliers.get(row['JobRole'], 1.1)
        
        return base_annual * benefits_multiplier * role_multiplier

    # Apply CTC calculation
    df['CTC'] = df.apply(calculate_ctc, axis=1)
    
    # 2. Performance Risk Score (higher = more risky)
    df['PerformanceRisk'] = (5 - df['PerformanceRating']) + \
                          (df['OverTime'] == 'Yes') * 2 + \
                          (df['YearsSinceLastPromotion'] > 2) * 1.5 + \
                          (4 - df['WorkLifeBalance']) * 1.5

    # 3. Retention Priority Score (higher = more valuable to retain)
    df['RetentionPriorityScore'] = ((df['JobLevel'] + df['PerformanceRating']) / 
                                  (np.log1p(df['MonthlyIncome']))) * 100
    
    # 4. Critical Role Flag (based on role and level)
    critical_roles = ['Research Director', 'Manager', 'Manufacturing Director', 'Healthcare Representative']
    df['CriticalRole'] = ((df['JobRole'].isin(critical_roles)) | 
                        (df['JobLevel'] >= 4)).astype(int)
    
    # 5. Satisfaction Composite Score
    satisfaction_cols = ['JobSatisfaction', 'EnvironmentSatisfaction', 
                        'RelationshipSatisfaction', 'WorkLifeBalance']
    df['SatisfactionComposite'] = df[satisfaction_cols].mean(axis=1)
    
    # 6. Engagement Score
    df['EngagementScore'] = (df['JobInvolvement'] * 0.4 + 
                          df['EnvironmentSatisfaction'] * 0.3 +
                          df['JobSatisfaction'] * 0.3)
    
    # 7. Career Growth Potential
    df['CareerGrowthPotential'] = ((5 - df['YearsSinceLastPromotion']) * 0.4 + 
                                df['TrainingTimesLastYear'] * 0.3 +
                                df['PerformanceRating'] * 0.3)
    
    # 8. Productivity to Cost Ratio (higher = more value for money)
    df['ProductivityCostRatio'] = (df['PerformanceRating'] * df['JobInvolvement']) / \
                                (df['CTC'] / df['CTC'].median())
                                
    print("Feature engineering complete.")
    print(f"Sample engineered features for first employee:\n{df[['CTC', 'PerformanceRisk', 'RetentionPriorityScore', 'CriticalRole', 'ProductivityCostRatio']].iloc[0]}")
    
    return df

def create_decision_labels(df):
    """Create target variable for the Keep or Let Go decision model"""
    print("Creating decision labels for training...")
    
    # Define the decision logic for training
    def decision_logic(row):
        """Decision logic for whether to Keep (0) or Let Go (1) an employee"""
        
        # Always keep critical roles
        if row['CriticalRole'] == 1:
            return 0  # Keep
        
        # Let go high attrition risk, low performers with high cost
        if ((row['AttritionBinary'] == 1 or row['PerformanceRisk'] > 5) and
            row['PerformanceRating'] <= 3 and
            row['CTC'] > df['CTC'].median() and
            row['ProductivityCostRatio'] < df['ProductivityCostRatio'].median()):
            return 1  # Let Go
        
        # Keep high performers, highly engaged, and satisfied employees
        if ((row['PerformanceRating'] >= 4) or
            (row['EngagementScore'] >= 4 and row['SatisfactionComposite'] >= 3.5)):
            return 0  # Keep
        
        # For borderline cases, use the retention priority score
        return 1 if row['RetentionPriorityScore'] < df['RetentionPriorityScore'].median() else 0
    
    # Apply the decision logic
    df['RetentionDecision'] = df.apply(decision_logic, axis=1)
    
    # Label explanation (0 = Keep, 1 = Let Go)
    print(f"Decision distribution: Keep: {df['RetentionDecision'].value_counts()[0]} employees, "
          f"Let Go: {df['RetentionDecision'].value_counts()[1]} employees")
    print(f"Percentage recommended for letting go: {df['RetentionDecision'].mean():.2%}")
    
    # Calculate potential cost savings
    potential_savings = df[df['RetentionDecision'] == 1]['CTC'].sum()
    print(f"Potential annual cost savings: ${potential_savings:,.2f}")
    
    return df

def build_retention_model(df):
    """Build and evaluate the retention decision model"""
    print("\nBuilding retention decision model...")
    
    # Prepare data
    # Remove unnecessary columns
    cols_to_drop = ['Attrition', 'AttritionBinary', 'RetentionDecision', 
                   'EmployeeCount', 'EmployeeNumber', 'StandardHours', 'Over18']
    
    X = df.drop(cols_to_drop, axis=1)
    y = df['RetentionDecision']
    
    # Identify categorical and numerical columns
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    
    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), cat_cols)
        ],
        remainder='drop'
    )
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y)
    
    # Create model pipeline
    model_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', GradientBoostingClassifier(random_state=42))
    ])
    
    # Grid search for hyperparameter tuning
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__learning_rate': [0.05, 0.1],
        'classifier__max_depth': [3, 4, 5]
    }
    
    print("Performing grid search for optimal hyperparameters...")
    grid_search = GridSearchCV(
        model_pipeline, param_grid, cv=5, scoring='roc_auc', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    best_model = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # Evaluate model performance
    y_pred = best_model.predict(X_test)
    y_pred_proba = best_model.predict_proba(X_test)[:, 1]
    
    print("\nModel Performance:")
    print(classification_report(y_test, y_pred))
    print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
    
    # Plot ROC curve
    plt.figure(figsize=(10, 6))
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    plt.plot(fpr, tpr, label=f'ROC Curve (AUC = {roc_auc_score(y_test, y_pred_proba):.4f})')
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve for Retention Decision Model')
    plt.legend()
    plt.savefig('retention_decision_roc.png')
    plt.close()
    
    # Calibration plot - checks if probabilities are accurate
    plt.figure(figsize=(10, 6))
    prob_true, prob_pred = calibration_curve(y_test, y_pred_proba, n_bins=10)
    plt.plot(prob_pred, prob_true, marker='o', linewidth=1)
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel('Predicted Probability')
    plt.ylabel('True Probability')
    plt.title('Calibration Plot for Retention Decision Model')
    plt.savefig('retention_decision_calibration.png')
    plt.close()
    
    # Generate feature importance plot instead of SHAP
    print("\nGenerating feature importance plot...")
    try:
        # Get feature names
        feature_names = num_cols + [f"{col}_{cat}" for col in cat_cols 
                                  for cat in best_model.named_steps['preprocessor']
                                  .named_transformers_['cat'].get_feature_names_out([col])]
        
        # Get feature importances
        importances = best_model.named_steps['classifier'].feature_importances_
        indices = np.argsort(importances)[::-1]
        
        # Plot feature importances
        plt.figure(figsize=(12, 8))
        plt.title('Feature Importances for Retention Decisions')
        plt.barh(range(min(20, len(indices))), 
                importances[indices[:20]],
                align='center')
        plt.yticks(range(min(20, len(indices))), 
                  [feature_names[i] for i in indices[:20]])
        plt.xlabel('Relative Importance')
        plt.tight_layout()
        plt.savefig('retention_feature_importance.png')
        plt.close()
        
        print("\nTop 10 most important features:")
        for i in range(min(10, len(indices))):
            print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
            
    except Exception as e:
        print(f"\nWarning: Could not generate feature importance plot: {str(e)}")
        print("Continuing with model saving...")
    
    # Save the model
    print("\nSaving model to 'retention_decision_model.pkl'")
    with open('retention_decision_model.pkl', 'wb') as f:
        pickle.dump(best_model, f)
    
    return best_model

def analyze_results(df, model):
    """Analyze and visualize the model results"""
    print("\nAnalyzing retention decisions...")
    
    # Generate predictions for all employees
    X = df.drop(['Attrition', 'AttritionBinary', 'RetentionDecision', 
                'EmployeeCount', 'EmployeeNumber', 'StandardHours', 'Over18'], axis=1)
    
    df['RetentionProbability'] = model.predict_proba(X)[:, 1]
    df['RetentionRecommendation'] = model.predict(X)
    
    # Create risk categories for visualization
    def categorize_risk(prob):
        if prob < 0.3:
            return 'Low Risk (Keep)'
        elif prob < 0.7:
            return 'Medium Risk'
        else:
            return 'High Risk (Let Go)'
    
    df['RetentionRiskCategory'] = df['RetentionProbability'].apply(categorize_risk)
    
    # Department analysis
    dept_analysis = df.groupby('Department')['RetentionRecommendation'].agg(
        ['count', 'mean']).reset_index()
    dept_analysis.columns = ['Department', 'EmployeeCount', 'LetGoPercentage']
    dept_analysis['LetGoPercentage'] = dept_analysis['LetGoPercentage'] * 100
    
    print("\nDepartment Analysis:")
    print(dept_analysis.sort_values('LetGoPercentage', ascending=False))
    
    # Job Level analysis
    level_analysis = df.groupby('JobLevel')['RetentionRecommendation'].agg(
        ['count', 'mean']).reset_index()
    level_analysis.columns = ['JobLevel', 'EmployeeCount', 'LetGoPercentage']
    level_analysis['LetGoPercentage'] = level_analysis['LetGoPercentage'] * 100
    
    print("\nJob Level Analysis:")
    print(level_analysis.sort_values('JobLevel'))
    
    # Cost analysis
    current_cost = df['CTC'].sum()
    retained_cost = df[df['RetentionRecommendation'] == 0]['CTC'].sum()
    savings = current_cost - retained_cost
    
    print(f"\nCost Analysis:")
    print(f"Current Annual Cost: ${current_cost:,.2f}")
    print(f"Cost After Optimization: ${retained_cost:,.2f}")
    print(f"Annual Savings: ${savings:,.2f} ({savings/current_cost:.2%})")
    
    # Export for visualization
    print("\nExporting data for visualization...")
    tableau_export = df[['EmployeeNumber', 'Age', 'Department', 'JobRole', 'Gender',
                     'MonthlyIncome', 'CTC', 'PerformanceRating', 'JobLevel',
                     'PerformanceRisk', 'RetentionPriorityScore', 'CriticalRole',
                     'SatisfactionComposite', 'OverTime', 'YearsAtCompany',
                     'EngagementScore', 'CareerGrowthPotential', 'ProductivityCostRatio',
                     'RetentionProbability', 'RetentionRiskCategory', 'RetentionRecommendation']]
    
    tableau_export.to_csv('retention_dashboard_data.csv', index=False)
    
    # Create a few key visualizations
    # 1. Department recommendations
    plt.figure(figsize=(12, 6))
    dept_keep = df[df['RetentionRecommendation'] == 0].groupby('Department').size()
    dept_let_go = df[df['RetentionRecommendation'] == 1].groupby('Department').size()
    
    dept_df = pd.DataFrame({'Keep': dept_keep, 'Let Go': dept_let_go}).fillna(0)
    dept_df.plot(kind='bar', stacked=True, colormap='viridis')
    plt.title('Retention Recommendations by Department')
    plt.xlabel('Department')
    plt.ylabel('Number of Employees')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('retention_by_department.png')
    plt.close()
    
    # 2. Performance vs Cost with Recommendations
    plt.figure(figsize=(12, 8))
    sns.scatterplot(
        data=df,
        x='PerformanceRating',
        y='CTC',
        hue='RetentionRiskCategory',
        size='JobLevel',
        sizes=(50, 200),
        alpha=0.7
    )
    plt.title('Performance vs. Cost with Retention Recommendations')
    plt.xlabel('Performance Rating')
    plt.ylabel('Annual Cost (CTC)')
    plt.tight_layout()
    plt.savefig('performance_vs_cost.png')
    plt.close()
    
    return df

def main():
    """Main function to run the retention decision model"""
    print("=" * 80)
    print("WORKFORCE OPTIMIZATION: RETENTION DECISION MODEL")
    print("=" * 80)
    
    # Load the data
    df = load_data()
    
    # Feature engineering
    df = engineer_features(df)
    
    # Create decision labels
    df = create_decision_labels(df)
    
    # Build the model
    model = build_retention_model(df)
    
    # Analyze results
    df = analyze_results(df, model)
    
    print("\nModel development complete. Results saved to files:")
    print("- retention_decision_model.pkl (Model file)")
    print("- retention_dashboard_data.csv (Data for visualization)")
    print("- retention_feature_importance.png (Feature importance)")
    print("- retention_by_department.png (Department recommendations)")
    print("- performance_vs_cost.png (Performance vs. Cost visualization)")
    
    # Sample API code for deployment
    print("\nSample code for using the model in an API:")
    print("""
    # Flask API code
    from flask import Flask, request, jsonify
    import pickle
    import pandas as pd
    
    app = Flask(__name__)
    
    # Load the model
    with open('retention_decision_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    @app.route('/predict', methods=['POST'])
    def predict():
        # Get data from request
        data = request.json
        
        # Convert to DataFrame
        df = pd.DataFrame(data['employees'])
        
        # Make predictions
        probabilities = model.predict_proba(df)[:, 1]
        decisions = model.predict(df)
        
        # Create response
        results = []
        for i, employee_id in enumerate(df['EmployeeNumber'] if 'EmployeeNumber' in df.columns else range(len(df))):
            results.append({
                'employee_id': employee_id,
                'retention_decision': 'Let Go' if decisions[i] == 1 else 'Keep',
                'confidence': float(probabilities[i] if decisions[i] == 1 else 1 - probabilities[i])
            })
        
        return jsonify({"predictions": results})
    
    if __name__ == '__main__':
        app.run(debug=True)
    """)

if __name__ == "__main__":
    main()