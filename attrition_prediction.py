"""
Talent Analytics: Employee Attrition Prediction Model
-----------------------------------------------------
This module creates a machine learning model to predict employee attrition
and identify key factors driving turnover, serving as the foundation for
strategic workforce planning.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve, precision_recall_curve
from sklearn.feature_selection import SelectKBest, f_classif
import shap
import pickle
import warnings
warnings.filterwarnings('ignore')

# Set styling for plots
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette('viridis')

def load_and_explore_data(file_path='PROJECT AND DATASET IN HERE/WA_Fn-UseC_-HR-Employee-Attrition.csv'):
    """
    Load the HR attrition dataset and perform initial exploration
    
    Parameters:
    -----------
    file_path : str
        Path to the HR attrition dataset
        
    Returns:
    --------
    pd.DataFrame
        The loaded and initially processed dataframe
    """
    print(f"Loading data from {file_path}...")
    df = pd.read_csv(file_path)
    
    print(f"Dataset shape: {df.shape}")
    print(f"Number of employees: {df.shape[0]}")
    print(f"Number of features: {df.shape[1]}")
    
    # Summary of attrition
    attrition_counts = df['Attrition'].value_counts()
    attrition_pct = df['Attrition'].value_counts(normalize=True) * 100
    
    print("\nAttrition Summary:")
    print(f"Employees who stayed: {attrition_counts['No']} ({attrition_pct['No']:.2f}%)")
    print(f"Employees who left: {attrition_counts['Yes']} ({attrition_pct['Yes']:.2f}%)")
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.sum() > 0:
        print("\nMissing values detected:")
        print(missing_values[missing_values > 0])
    else:
        print("\nNo missing values detected.")
    
    # Check data types
    print("\nData Types:")
    print(df.dtypes.value_counts())
    
    # Convert target to binary
    df['AttritionBinary'] = df['Attrition'].map({'Yes': 1, 'No': 0})
    
    return df

def perform_eda(df):
    """
    Perform exploratory data analysis on the HR dataset
    
    Parameters:
    -----------
    df : pd.DataFrame
        The HR dataset
        
    Returns:
    --------
    pd.DataFrame
        The dataframe with any EDA transformations
    """
    print("\nPerforming Exploratory Data Analysis...")
    
    # 1. Age distribution by attrition
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='Age', hue='Attrition', bins=20, multiple='dodge')
    plt.title('Age Distribution by Attrition Status')
    plt.xlabel('Age')
    plt.ylabel('Count')
    plt.savefig('age_distribution.png')
    plt.close()
    
    # 2. Attrition by Department
    dept_attrition = df.groupby('Department')['AttritionBinary'].mean() * 100
    plt.figure(figsize=(8, 5))
    sns.barplot(x=dept_attrition.index, y=dept_attrition.values)
    plt.title('Attrition Rate by Department')
    plt.xlabel('Department')
    plt.ylabel('Attrition Rate (%)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('dept_attrition.png')
    plt.close()
    
    # 3. Attrition by Job Role
    role_attrition = df.groupby('JobRole')['AttritionBinary'].mean() * 100
    plt.figure(figsize=(12, 6))
    sns.barplot(x=role_attrition.index, y=role_attrition.values)
    plt.title('Attrition Rate by Job Role')
    plt.xlabel('Job Role')
    plt.ylabel('Attrition Rate (%)')
    plt.xticks(rotation=90)
    plt.tight_layout()
    plt.savefig('role_attrition.png')
    plt.close()
    
    # 4. Monthly Income vs Attrition
    plt.figure(figsize=(10, 6))
    sns.boxplot(x='Attrition', y='MonthlyIncome', data=df)
    plt.title('Monthly Income by Attrition Status')
    plt.savefig('income_attrition.png')
    plt.close()
    
    # 5. Correlation analysis for numerical features
    numeric_df = df.select_dtypes(include=['int64', 'float64'])
    
    # Add AttritionBinary for correlation
    if 'AttritionBinary' not in numeric_df.columns:
        numeric_df['AttritionBinary'] = df['AttritionBinary']
    
    # Calculate correlation matrix
    corr_matrix = numeric_df.corr()
    
    # Plot correlation heatmap
    plt.figure(figsize=(16, 14))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(corr_matrix, mask=mask, annot=True, fmt=".2f", cmap='coolwarm', 
                linewidths=0.5, cbar_kws={"shrink": .8})
    plt.title('Feature Correlation Matrix')
    plt.tight_layout()
    plt.savefig('correlation_matrix.png')
    plt.close()
    
    # 6. Key variable exploration: OverTime
    overtime_attrition = pd.crosstab(df['OverTime'], df['Attrition'], normalize='index') * 100
    plt.figure(figsize=(8, 5))
    overtime_attrition['Yes'].plot(kind='bar', color='coral')
    plt.title('Attrition Rate by Overtime Status')
    plt.xlabel('Works Overtime')
    plt.ylabel('Attrition Rate (%)')
    plt.xticks(rotation=0)
    plt.savefig('overtime_attrition.png')
    plt.close()
    
    # 7. Work-Life Balance vs Attrition
    wlb_attrition = pd.crosstab(df['WorkLifeBalance'], df['Attrition'], normalize='index') * 100
    plt.figure(figsize=(8, 5))
    wlb_attrition['Yes'].plot(kind='bar', color='teal')
    plt.title('Attrition Rate by Work-Life Balance')
    plt.xlabel('Work-Life Balance (1=Bad, 4=Best)')
    plt.ylabel('Attrition Rate (%)')
    plt.xticks(rotation=0)
    plt.savefig('wlb_attrition.png')
    plt.close()
    
    # Print key insights
    print("\nKey EDA Insights:")
    print(f"- Overall attrition rate: {df['AttritionBinary'].mean() * 100:.2f}%")
    print(f"- Department with highest attrition: {dept_attrition.idxmax()} ({dept_attrition.max():.2f}%)")
    print(f"- Department with lowest attrition: {dept_attrition.idxmin()} ({dept_attrition.min():.2f}%)")
    print(f"- Job role with highest attrition: {role_attrition.idxmax()} ({role_attrition.max():.2f}%)")
    print(f"- Overtime attrition rate: {overtime_attrition.loc['Yes', 'Yes']:.2f}%")
    print(f"- Non-overtime attrition rate: {overtime_attrition.loc['No', 'Yes']:.2f}%")
    
    # Return the dataframe in case any transformations were made
    return df

def engineer_features(df):
    """
    Create new features to improve model performance
    
    Parameters:
    -----------
    df : pd.DataFrame
        The HR dataset
        
    Returns:
    --------
    pd.DataFrame
        The dataframe with engineered features
    """
    print("\nEngineering additional features...")
    
    # 1. Salary to Job Level Ratio (detects underpaid employees)
    df['SalaryToJobLevelRatio'] = df['MonthlyIncome'] / df['JobLevel']
    
    # 2. Years Without Promotion Risk
    df['PromotionRisk'] = df['YearsSinceLastPromotion'] / (df['YearsAtCompany'] + 1)
    
    # 3. Commute Difficulty (distance vs salary)
    df['CommuteDifficulty'] = df['DistanceFromHome'] / np.log1p(df['MonthlyIncome'])
    
    # 4. Compensation Satisfaction Proxy
    # Compare employee's salary to average salary for their job level
    job_level_avg_salary = df.groupby('JobLevel')['MonthlyIncome'].transform('mean')
    df['RelativeCompensation'] = df['MonthlyIncome'] / job_level_avg_salary
    
    # 5. Work-Life Imbalance
    df['WorkLifeImbalance'] = ((df['WorkLifeBalance'] < 3).astype(int) + 
                               (df['OverTime'] == 'Yes').astype(int))
    
    # 6. Growth Opportunity Index
    df['GrowthOpportunityIndex'] = (df['TrainingTimesLastYear'] + 1) / (df['YearsSinceLastPromotion'] + 1)
    
    # 7. Job Role Engagement
    # Combine Job Involvement and Job Satisfaction
    df['JobEngagement'] = df['JobInvolvement'] * df['JobSatisfaction']
    
    # 8. Satisfaction Composite
    satisfaction_cols = ['JobSatisfaction', 'EnvironmentSatisfaction', 
                         'RelationshipSatisfaction', 'WorkLifeBalance']
    df['SatisfactionComposite'] = df[satisfaction_cols].mean(axis=1)
    
    # 9. Career Advancement Ratio
    df['CareerAdvancementRatio'] = df['JobLevel'] / (df['TotalWorkingYears'] + 1)
    
    # 10. OverTime and Distance Combined Risk
    df['OvertimeDistanceRisk'] = ((df['OverTime'] == 'Yes').astype(int) * 
                                 (1 + (df['DistanceFromHome'] / 10)))
    
    # Print statistics on new features
    print("\nEngineered Features Summary:")
    for feature in ['SalaryToJobLevelRatio', 'PromotionRisk', 'CommuteDifficulty', 
                    'RelativeCompensation', 'WorkLifeImbalance', 'GrowthOpportunityIndex',
                    'JobEngagement', 'SatisfactionComposite', 'OvertimeDistanceRisk']:
        if feature in df.columns:
            print(f"{feature} - Mean: {df[feature].mean():.2f}, Std: {df[feature].std():.2f}")
    
    # Check correlation of new features with attrition
    engineered_features = ['SalaryToJobLevelRatio', 'PromotionRisk', 'CommuteDifficulty', 
                          'RelativeCompensation', 'WorkLifeImbalance', 'GrowthOpportunityIndex',
                          'JobEngagement', 'SatisfactionComposite', 'OvertimeDistanceRisk']
    
    correlations = df[engineered_features + ['AttritionBinary']].corr()['AttritionBinary'].sort_values()
    
    print("\nCorrelation with Attrition:")
    print(correlations[:-1])  # Exclude correlation with itself
    
    return df

def prepare_data_for_modeling(df):
    """
    Prepare the data for model training
    
    Parameters:
    -----------
    df : pd.DataFrame
        The HR dataset with engineered features
        
    Returns:
    --------
    tuple
        X_train, X_test, y_train, y_test, preprocessor
    """
    print("\nPreparing data for modeling...")
    
    # Remove unnecessary columns
    cols_to_drop = ['Attrition', 'EmployeeCount', 'EmployeeNumber', 'StandardHours', 'Over18']
    X = df.drop(['AttritionBinary'] + cols_to_drop, axis=1)
    y = df['AttritionBinary']
    
    # Identify categorical and numerical columns
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    
    print(f"Categorical features: {len(cat_cols)}")
    print(f"Numerical features: {len(num_cols)}")
    print(f"Total features: {len(cat_cols) + len(num_cols)}")
    
    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), cat_cols)
        ],
        remainder='drop'
    )
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set size: {X_train.shape[0]} samples")
    print(f"Testing set size: {X_test.shape[0]} samples")
    
    return X_train, X_test, y_train, y_test, preprocessor

def build_and_evaluate_models(X_train, X_test, y_train, y_test, preprocessor):
    """
    Build and evaluate multiple machine learning models
    
    Parameters:
    -----------
    X_train, X_test, y_train, y_test : pd.DataFrame, pd.Series
        Training and testing data
    preprocessor : ColumnTransformer
        The preprocessing pipeline
        
    Returns:
    --------
    dict
        Dictionary of trained models
    """
    print("\nBuilding and evaluating machine learning models...")
    
    # Create model pipelines
    models = {
        'Logistic Regression': Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', LogisticRegression(random_state=42, max_iter=1000))
        ]),
        
        'Random Forest': Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(random_state=42))
        ]),
        
        'Gradient Boosting': Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', GradientBoostingClassifier(random_state=42))
        ])
    }
    
    # Train and evaluate each model
    results = {}
    best_auc = 0
    best_model_name = None
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        
        # Predict on test set
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        auc = roc_auc_score(y_test, y_prob)
        
        print(f"{name} Results:")
        print(classification_report(y_test, y_pred))
        print(f"ROC AUC: {auc:.4f}")
        
        # Store results
        results[name] = {
            'model': model,
            'auc': auc,
            'predictions': y_pred,
            'probabilities': y_prob
        }
        
        # Track best model
        if auc > best_auc:
            best_auc = auc
            best_model_name = name
    
    # Perform cross-validation on the best model
    if best_model_name:
        print(f"\nPerforming cross-validation on {best_model_name}...")
        best_model = models[best_model_name]
        cv_scores = cross_val_score(best_model, X_train, y_train, 
                                    cv=StratifiedKFold(5, shuffle=True, random_state=42),
                                    scoring='roc_auc')
        
        print(f"Cross-validation ROC AUC scores: {cv_scores}")
        print(f"Mean CV ROC AUC: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    
    # Tune hyperparameters for the best model
    if best_model_name == 'Random Forest':
        print("\nTuning Random Forest hyperparameters...")
        param_grid = {
            'classifier__n_estimators': [100, 200],
            'classifier__max_depth': [None, 10, 20],
            'classifier__min_samples_split': [2, 5, 10]
        }
        
        grid_search = GridSearchCV(models['Random Forest'], param_grid, cv=5, 
                                   scoring='roc_auc', n_jobs=-1)
        grid_search.fit(X_train, y_train)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV ROC AUC: {grid_search.best_score_:.4f}")
        
        # Update the model with tuned hyperparameters
        models['Random Forest'] = grid_search.best_estimator_
        
        # Re-evaluate the tuned model
        y_pred = models['Random Forest'].predict(X_test)
        y_prob = models['Random Forest'].predict_proba(X_test)[:, 1]
        
        auc = roc_auc_score(y_test, y_prob)
        
        print("\nTuned Random Forest Results:")
        print(classification_report(y_test, y_pred))
        print(f"ROC AUC: {auc:.4f}")
        
        results['Random Forest (Tuned)'] = {
            'model': models['Random Forest'],
            'auc': auc,
            'predictions': y_pred,
            'probabilities': y_prob
        }
        
    elif best_model_name == 'Gradient Boosting':
        print("\nTuning Gradient Boosting hyperparameters...")
        param_grid = {
            'classifier__n_estimators': [100, 200],
            'classifier__learning_rate': [0.05, 0.1],
            'classifier__max_depth': [3, 5, 7]
        }
        
        grid_search = GridSearchCV(models['Gradient Boosting'], param_grid, cv=5, 
                                   scoring='roc_auc', n_jobs=-1)
        grid_search.fit(X_train, y_train)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV ROC AUC: {grid_search.best_score_:.4f}")
        
        # Update the model with tuned hyperparameters
        models['Gradient Boosting'] = grid_search.best_estimator_
        
        # Re-evaluate the tuned model
        y_pred = models['Gradient Boosting'].predict(X_test)
        y_prob = models['Gradient Boosting'].predict_proba(X_test)[:, 1]
        
        auc = roc_auc_score(y_test, y_prob)
        
        print("\nTuned Gradient Boosting Results:")
        print(classification_report(y_test, y_pred))
        print(f"ROC AUC: {auc:.4f}")
        
        results['Gradient Boosting (Tuned)'] = {
            'model': models['Gradient Boosting'],
            'auc': auc,
            'predictions': y_pred,
            'probabilities': y_prob
        }
    
    # Compare ROC curves
    plt.figure(figsize=(10, 8))
    
    for name, result in results.items():
        fpr, tpr, _ = roc_curve(y_test, result['probabilities'])
        plt.plot(fpr, tpr, label=f"{name} (AUC = {result['auc']:.4f})")
    
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curves for Attrition Prediction Models')
    plt.legend(loc='lower right')
    plt.savefig('roc_curves_comparison.png')
    plt.close()
    
    # Find the best final model
    best_final_model_name = max(results, key=lambda x: results[x]['auc'])
    best_final_model = results[best_final_model_name]['model']
    
    print(f"\nBest model: {best_final_model_name} with ROC AUC = {results[best_final_model_name]['auc']:.4f}")
    
    # Save the best model
    with open('attrition_prediction_model.pkl', 'wb') as f:
        pickle.dump(best_final_model, f)
    
    print("Best model saved as 'attrition_prediction_model.pkl'")
    
    return results, best_final_model

def analyze_model_features(model, X_train, X_test, y_test, preprocessor, feature_names=None):
    """
    Analyze feature importance and generate SHAP explanations
    
    Parameters:
    -----------
    model : Pipeline
        The trained machine learning model
    X_train, X_test : pd.DataFrame
        Training and testing data
    y_test : pd.Series
        Test labels
    preprocessor : ColumnTransformer
        The preprocessing pipeline
    feature_names : list, optional
        List of feature names
        
    Returns:
    --------
    None
    """
    print("\nAnalyzing model features and generating explanations...")
    
    # Extract the classifier from the pipeline
    classifier = model.named_steps['classifier']
    
    # Get feature names after preprocessing
    if feature_names is None:
        feature_names = []
        for name, transformer, cols in preprocessor.transformers_:
            if name == 'num':
                feature_names.extend(cols)
            elif name == 'cat':
                # For categorical features, get one-hot encoded column names
                for i, col in enumerate(cols):
                    categories = transformer.categories_[i][1:]  # Skip first category (dropped)
                    feature_names.extend([f"{col}_{cat}" for cat in categories])
    
    # Get feature importances if available
    if hasattr(classifier, 'feature_importances_'):
        importances = classifier.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        # Plot feature importances
        plt.figure(figsize=(12, 8))
        plt.title('Feature Importances for Attrition Prediction')
        plt.barh(range(min(20, len(indices))), 
                importances[indices[:20]],
                align='center')
        plt.yticks(range(min(20, len(indices))), 
                  [feature_names[i] if i < len(feature_names) else f"Feature {i}" 
                   for i in indices[:20]])
        plt.xlabel('Relative Importance')
        plt.tight_layout()
        plt.savefig('feature_importances.png')
        plt.close()
        
        # Print top features
        print("\nTop 10 features by importance:")
        for i in range(min(10, len(indices))):
            if indices[i] < len(feature_names):
                print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
            else:
                print(f"{i+1}. Feature {indices[i]}: {importances[indices[i]]:.4f}")
    
    # Generate SHAP explanations
    # Use a sample of test data for efficiency
    try:
        sample_size = min(100, X_test.shape[0])
        X_sample = X_test.sample(sample_size, random_state=42)
        y_sample = y_test.loc[X_sample.index]
        
        # Transform the sample data
        X_sample_transformed = preprocessor.transform(X_sample)
        
        # Create a SHAP explainer
        if hasattr(classifier, 'feature_importances_'):
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(X_sample_transformed)
            
            # Summary plot
            plt.figure(figsize=(12, 8))
            shap.summary_plot(shap_values[1] if isinstance(shap_values, list) else shap_values, 
                             X_sample_transformed, 
                             feature_names=feature_names if len(feature_names) == X_sample_transformed.shape[1] else None,
                             show=False)
            plt.tight_layout()
            plt.savefig('shap_summary.png')
            plt.close()
            
            # Dependence plots for top features
            if isinstance(shap_values, list):
                shap_values = shap_values[1]  # For binary classification, use positive class
                
            # Get the top feature indices by mean absolute SHAP value
            top_indices = np.argsort(-np.abs(shap_values).mean(0))[:3]
            
            for i, idx in enumerate(top_indices):
                if idx < len(feature_names):
                    plt.figure(figsize=(10, 6))
                    shap.dependence_plot(idx, shap_values, X_sample_transformed, 
                                        feature_names=feature_names if len(feature_names) == X_sample_transformed.shape[1] else None,
                                        show=False)
                    plt.title(f"SHAP Dependence Plot: {feature_names[idx] if idx < len(feature_names) else f'Feature {idx}'}")
                    plt.tight_layout()
                    plt.savefig(f'shap_dependence_{i+1}.png')
                    plt.close()
            
            # Individual explanation for a high-attrition-risk employee
            y_prob = model.predict_proba(X_sample)[:, 1]
            high_risk_idx = np.argmax(y_prob)
            
            plt.figure(figsize=(16, 6))
            shap.force_plot(explainer.expected_value[1] if hasattr(explainer, 'expected_value') and isinstance(explainer.expected_value, list) else explainer.expected_value, 
                           shap_values[high_risk_idx, :], 
                           X_sample_transformed[high_risk_idx, :],
                           feature_names=feature_names if len(feature_names) == X_sample_transformed.shape[1] else None,
                           matplotlib=True, show=False)
            plt.title("SHAP Explanation for High Attrition Risk Employee")
            plt.tight_layout()
            plt.savefig('high_risk_explanation.png')
            plt.close()
            
            print("\nSHAP analysis completed. Visualizations saved to PNG files.")
    except Exception as e:
        print(f"Error generating SHAP explanations: {e}")
        pass

def create_attrition_risk_profiles(df, model, preprocessor):
    """
    Create attrition risk profiles based on model predictions
    
    Parameters:
    -----------
    df : pd.DataFrame
        The HR dataset
    model : Pipeline
        The trained attrition prediction model
    preprocessor : ColumnTransformer
        The preprocessing pipeline
        
    Returns:
    --------
    pd.DataFrame
        Dataframe with risk profiles
    """
    print("\nCreating attrition risk profiles...")
    
    # Remove unnecessary columns for prediction
    X = df.drop(['Attrition', 'AttritionBinary', 'EmployeeCount', 
                'EmployeeNumber', 'StandardHours', 'Over18'], axis=1)
    
    # Generate predictions
    df_risk = df.copy()
    df_risk['AttritionProbability'] = model.predict_proba(X)[:, 1]
    
    # Create risk categories
    bins = [0, 0.3, 0.6, 1.0]
    labels = ['Low Risk', 'Medium Risk', 'High Risk']
    df_risk['RiskCategory'] = pd.cut(df_risk['AttritionProbability'], bins=bins, labels=labels)
    
    # Summarize risk categories
    risk_summary = df_risk['RiskCategory'].value_counts().sort_index()
    risk_percentages = df_risk['RiskCategory'].value_counts(normalize=True).sort_index() * 100
    
    print("\nRisk Category Distribution:")
    for category, count, percentage in zip(risk_summary.index, risk_summary.values, risk_percentages.values):
        print(f"{category}: {count} employees ({percentage:.1f}%)")
    
    # Department risk analysis
    dept_risk = df_risk.groupby('Department')['AttritionProbability'].agg(['mean', 'count'])
    dept_risk.columns = ['Average Risk', 'Employee Count']
    dept_risk = dept_risk.sort_values('Average Risk', ascending=False)
    
    print("\nDepartment Risk Analysis:")
    print(dept_risk)
    
    # Job role risk analysis
    role_risk = df_risk.groupby('JobRole')['AttritionProbability'].agg(['mean', 'count'])
    role_risk.columns = ['Average Risk', 'Employee Count']
    role_risk = role_risk.sort_values('Average Risk', ascending=False)
    
    print("\nJob Role Risk Analysis:")
    print(role_risk.head())
    
    # Identify top factors driving high risk
    high_risk_employees = df_risk[df_risk['RiskCategory'] == 'High Risk']
    
    # Compare high risk vs overall for key metrics
    risk_comparisons = []
    for col in ['MonthlyIncome', 'JobSatisfaction', 'WorkLifeBalance', 
               'YearsSinceLastPromotion', 'DistanceFromHome', 'OverTime']:
        if col == 'OverTime':
            # Handle categorical variable
            overall_value = (df[col] == 'Yes').mean() * 100
            high_risk_value = (high_risk_employees[col] == 'Yes').mean() * 100
            unit = '%'
        else:
            overall_value = df[col].mean()
            high_risk_value = high_risk_employees[col].mean()
            unit = ''
        
        comparison = {
            'Factor': col,
            'Overall Average': f"{overall_value:.2f}{unit}",
            'High Risk Average': f"{high_risk_value:.2f}{unit}",
            'Difference': f"{((high_risk_value - overall_value) / overall_value * 100):.1f}%"
        }
        risk_comparisons.append(comparison)
    
    print("\nHigh Risk vs Overall Comparisons:")
    for comp in risk_comparisons:
        print(f"{comp['Factor']}: Overall {comp['Overall Average']} vs High Risk {comp['High Risk Average']} ({comp['Difference']} difference)")
    
    # Export risk data for dashboard
    df_risk.to_csv('attrition_risk_profiles.csv', index=False)
    print("\nRisk profiles exported to 'attrition_risk_profiles.csv'")
    
    return df_risk

def main():
    """Main function to run the attrition prediction pipeline"""
    print("=" * 80)
    print("TALENT ANALYTICS: EMPLOYEE ATTRITION PREDICTION")
    print("=" * 80)
    
    # Load and explore data
    df = load_and_explore_data()
    
    # Perform exploratory data analysis
    df = perform_eda(df)
    
    # Engineer features
    df = engineer_features(df)
    
    # Prepare data for modeling
    X_train, X_test, y_train, y_test, preprocessor = prepare_data_for_modeling(df)
    
    # Build and evaluate models
    results, best_model = build_and_evaluate_models(X_train, X_test, y_train, y_test, preprocessor)
    
    # Analyze model features
    analyze_model_features(best_model, X_train, X_test, y_test, preprocessor)
    
    # Create attrition risk profiles
    risk_profiles = create_attrition_risk_profiles(df, best_model, preprocessor)
    
    print("\nAttrition prediction model development completed.")
    print("Results and visualizations have been saved as PNG files.")
    print("The model has been saved as 'attrition_prediction_model.pkl'")
    
    # Example of how to use the model for prediction
    print("\nExample of using the model for prediction:")
    print("""
    import pickle
    import pandas as pd
    
    # Load the model
    with open('attrition_prediction_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Prepare new employee data
    new_employees = pd.DataFrame({
        'Age': [35, 42, 29],
        'BusinessTravel': ['Travel_Rarely', 'Travel_Frequently', 'Travel_Rarely'],
        'DailyRate': [1102, 857, 1200],
        'Department': ['Sales', 'Research & Development', 'Human Resources'],
        'DistanceFromHome': [15, 3, 25],
        # Add all required features...
    })
    
    # Make predictions
    probabilities = model.predict_proba(new_employees)[:, 1]
    
    # Create risk categories
    risk_categories = ['Low Risk' if p < 0.3 else 'Medium Risk' if p < 0.6 else 'High Risk' 
                      for p in probabilities]
    
    # Display results
    for i, (prob, risk) in enumerate(zip(probabilities, risk_categories)):
        print(f"Employee {i+1}: {prob:.2%} probability of attrition - {risk}")
    """)

if __name__ == "__main__":
    main()