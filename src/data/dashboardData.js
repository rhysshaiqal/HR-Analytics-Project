import { 
  loadCsvData, 
  processEmployeeData, 
  createDepartmentData, 
  createJobRoleData,
  createQuarterlyPerformanceData,
  createFeatureImportanceData
} from './dataProcessor';

// This will store our processed data
var employeeData = [];
var departmentData = [];
var jobRoleData = [];
var quarterlyPerformance = [];
var featureImportanceData = [];
var attritionDistribution = [];
var costSavingsData = [];
var attritionByFactorsData = [];
var attritionRateByAgeBand = [];
var satisfactionMatrix = [];
var modelPerformanceData = {};
var departmentTreemap = [];
var radarChartData = [];

// Initialize with sample data (in case real data isn't loaded yet)
initializeSampleData();

// Load and process the actual data
loadActualData();

async function loadActualData() {
  try {
    // Load the CSV data
    const csvData = await loadCsvData('/data/WA_FnUseC_HREmployeeAttrition.csv');
    
    // Note: In a real implementation, these would come from your ML models
    // For now, we'll generate random predictions
    const attritionPredictions = csvData.map(() => Math.random());
    const retentionDecisions = csvData.map(emp => 
      (Math.random() > 0.75 || emp.PerformanceRating < 3) ? 'Let Go' : 'Keep'
    );
    
    // Process the employee data
    employeeData = processEmployeeData(csvData, attritionPredictions, retentionDecisions);
    
    // Generate derived data structures
    departmentData = createDepartmentData(employeeData);
    jobRoleData = createJobRoleData(employeeData);
    quarterlyPerformance = createQuarterlyPerformanceData(employeeData);
    featureImportanceData = createFeatureImportanceData();
    
    // Generate additional data structures
    attritionDistribution = generateAttritionDistribution(employeeData);
    costSavingsData = generateCostSavingsData(employeeData);
    attritionByFactorsData = generateAttritionByFactors(employeeData);
    attritionRateByAgeBand = generateAttritionByAgeBand(employeeData);
    satisfactionMatrix = generateSatisfactionMatrix(employeeData);
    modelPerformanceData = generateModelPerformanceData();
    departmentTreemap = generateDepartmentTreemap(departmentData);
    radarChartData = generateRadarChartData(employeeData);
    
    console.log("Data loaded successfully!");
    
    // If you need to force a component re-render, you could use an event
    window.dispatchEvent(new Event('dataLoaded'));
    
  } catch (error) {
    console.error("Error loading actual data:", error);
    // Keep using the sample data if loading fails
  }
}

function initializeSampleData() {
  // Initialize with the sample data from your dashboard
  employeeData = [
    { id: 1, name: "John Smith", department: "R&D", jobRole: "Research Scientist", age: 34, attritionRisk: 0.15, attritionCategory: "Low Risk", retentionDecision: "Keep", performance: 4, monthlySalary: 5400, satisfactionScore: 3.8, workLifeBalance: 3, yearsAtCompany: 5, jobLevel: 2, overtime: "No", gender: "Male", distanceFromHome: 7 },
    { id: 2, name: "Maria Garcia", department: "Sales", jobRole: "Sales Executive", age: 29, attritionRisk: 0.82, attritionCategory: "High Risk", retentionDecision: "Let Go", performance: 2, monthlySalary: 4800, satisfactionScore: 2.1, workLifeBalance: 1, yearsAtCompany: 2, jobLevel: 1, overtime: "Yes", gender: "Female", distanceFromHome: 18 },
    { id: 3, name: "Robert Chen", department: "HR", jobRole: "Human Resources", age: 41, attritionRisk: 0.35, attritionCategory: "Medium Risk", retentionDecision: "Keep", performance: 3, monthlySalary: 4200, satisfactionScore: 3.2, workLifeBalance: 3, yearsAtCompany: 7, jobLevel: 2, overtime: "No", gender: "Male", distanceFromHome: 5 }
  ];
  
  departmentData = [
    { name: 'R&D', keep: 251, letGo: 67, attritionRate: 18.4, avgSatisfaction: 3.2, avgPerformance: 3.8, costSavings: 2450000 },
    { name: 'Sales', keep: 188, letGo: 83, attritionRate: 24.7, avgSatisfaction: 2.7, avgPerformance: 3.3, costSavings: 3210000 },
    { name: 'HR', keep: 52, letGo: 21, attritionRate: 16.2, avgSatisfaction: 3.4, avgPerformance: 3.5, costSavings: 860000 }
  ];
  
  jobRoleData = [
    { name: 'Sales Executive', count: 78, attritionRate: 24.8, avgSalary: 6780, riskScore: 0.68 },
    { name: 'Research Scientist', count: 85, attritionRate: 14.2, avgSalary: 8240, riskScore: 0.42 },
    { name: 'Laboratory Technician', count: 114, attritionRate: 22.6, avgSalary: 3420, riskScore: 0.73 }
  ];
  
  quarterlyPerformance = [
    { quarter: 'Q1', performance: 83.6, attrition: 16.2, engagement: 72.8, satisfaction: 67.4 },
    { quarter: 'Q2', performance: 89.2, attrition: 15.8, engagement: 76.3, satisfaction: 70.1 },
    { quarter: 'Q3', performance: 78.5, attrition: 17.9, engagement: 68.7, satisfaction: 65.2 },
    { quarter: 'Q4', performance: 86.3, attrition: 16.5, engagement: 75.6, satisfaction: 69.8 }
  ];
  
  featureImportanceData = [
    { name: 'OverTime', importance: 0.183 },
    { name: 'MonthlyIncome', importance: 0.152 },
    { name: 'Age', importance: 0.121 },
    { name: 'JobSatisfaction', importance: 0.112 },
    { name: 'DistanceFromHome', importance: 0.094 }
  ];
  
  attritionDistribution = [
    { name: 'Voluntary', value: 230, percentage: 50 },
    { name: 'Involuntary', value: 152, percentage: 33 },
    { name: 'Retirement', value: 78, percentage: 17 }
  ];
  
  costSavingsData = [
    { month: 'Jan', actual: 0, projected: 670000 },
    { month: 'Feb', actual: 0, projected: 740000 },
    { month: 'Mar', actual: 0, projected: 810000 },
    { month: 'Apr', actual: 520000, projected: 860000 }
  ];
  
  attritionByFactorsData = [
    { name: 'Low Work-Life Balance', rate: 31.8 },
    { name: 'Overtime Workers', rate: 28.7 },
    { name: 'Low Job Satisfaction', rate: 26.2 }
  ];
  
  attritionRateByAgeBand = [
    { ageGroup: '18-25', attritionRate: 28.4 },
    { ageGroup: '26-35', attritionRate: 21.7 },
    { ageGroup: '36-45', attritionRate: 14.2 }
  ];
  
  satisfactionMatrix = [
    { name: 'Job Satisfaction', low: 28.7, medium: 16.4, high: 8.2 },
    { name: 'Work-Life Balance', low: 31.8, medium: 17.9, high: 7.5 }
  ];
  
  modelPerformanceData = {
    accuracies: [
      { model: 'Logistic Regression', accuracy: 0.78, precision: 0.71, recall: 0.67, f1: 0.69 },
      { model: 'Random Forest', accuracy: 0.86, precision: 0.83, recall: 0.79, f1: 0.81 }
    ],
    confusionMatrix: [
      { name: 'True Negative', value: 242 },
      { name: 'False Positive', value: 28 },
      { name: 'False Negative', value: 19 },
      { name: 'True Positive', value: 105 }
    ],
    rocCurve: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.5, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  };
  
  departmentTreemap = departmentData.map(dept => ({
    name: dept.name,
    size: dept.keep + dept.letGo,
    attrition: (dept.letGo / (dept.keep + dept.letGo) * 100).toFixed(1)
  }));
  
  radarChartData = [
    { subject: 'Job Satisfaction', A: 3.6, B: 2.2, fullMark: 5 },
    { subject: 'Work-Life Balance', A: 3.8, B: 1.9, fullMark: 5 }
  ];
}

// Helper functions to generate additional data structures
function generateAttritionDistribution(employeeData) {
  // Implementation for generating attrition distribution
  return [
    { name: 'Voluntary', value: Math.floor(employeeData.length * 0.5), percentage: 50 },
    { name: 'Involuntary', value: Math.floor(employeeData.length * 0.33), percentage: 33 },
    { name: 'Retirement', value: Math.floor(employeeData.length * 0.17), percentage: 17 }
  ];
}

function generateCostSavingsData(employeeData) {
  // Implementation for generating cost savings data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => ({
    month,
    actual: index < currentMonth ? Math.floor(Math.random() * 1000000) : 0,
    projected: Math.floor(670000 + (index * 50000))
  }));
}

function generateAttritionByFactors(employeeData) {
  // Implementation for generating attrition by factors
  return [
    { name: 'Low Work-Life Balance', rate: 31.8 },
    { name: 'Overtime Workers', rate: 28.7 },
    { name: 'Low Job Satisfaction', rate: 26.2 }
  ];
}

function generateAttritionByAgeBand(employeeData) {
  // Implementation for generating attrition by age band
  return [
    { ageGroup: '18-25', attritionRate: 28.4 },
    { ageGroup: '26-35', attritionRate: 21.7 },
    { ageGroup: '36-45', attritionRate: 14.2 }
  ];
}

function generateSatisfactionMatrix(employeeData) {
  // Implementation for generating satisfaction matrix
  return [
    { name: 'Job Satisfaction', low: 28.7, medium: 16.4, high: 8.2 },
    { name: 'Work-Life Balance', low: 31.8, medium: 17.9, high: 7.5 }
  ];
}

function generateModelPerformanceData() {
  // Implementation for generating model performance data
  return {
    accuracies: [
      { model: 'Logistic Regression', accuracy: 0.78, precision: 0.71, recall: 0.67, f1: 0.69 },
      { model: 'Random Forest', accuracy: 0.86, precision: 0.83, recall: 0.79, f1: 0.81 }
    ],
    confusionMatrix: [
      { name: 'True Negative', value: 242 },
      { name: 'False Positive', value: 28 },
      { name: 'False Negative', value: 19 },
      { name: 'True Positive', value: 105 }
    ],
    rocCurve: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.5, tpr: 0.94 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  };
}

function generateDepartmentTreemap(departmentData) {
  return departmentData.map(dept => ({
    name: dept.name,
    size: dept.keep + dept.letGo,
    attrition: (dept.letGo / (dept.keep + dept.letGo) * 100).toFixed(1)
  }));
}

function generateRadarChartData(employeeData) {
  return [
    { subject: 'Job Satisfaction', A: 3.6, B: 2.2, fullMark: 5 },
    { subject: 'Work-Life Balance', A: 3.8, B: 1.9, fullMark: 5 }
  ];
}

// Export all the data structures
export {
  employeeData,
  departmentData,
  jobRoleData,
  quarterlyPerformance,
  featureImportanceData,
  attritionDistribution,
  costSavingsData,
  attritionByFactorsData,
  attritionRateByAgeBand,
  satisfactionMatrix,
  modelPerformanceData,
  departmentTreemap,
  radarChartData
};

// Department Data
export const departmentData = [
  { name: 'R&D', keep: 251, letGo: 67, attritionRate: 18.4, avgSatisfaction: 3.2, avgPerformance: 3.8, costSavings: 2450000 },
  { name: 'Sales', keep: 188, letGo: 83, attritionRate: 24.7, avgSatisfaction: 2.7, avgPerformance: 3.3, costSavings: 3210000 },
  { name: 'HR', keep: 52, letGo: 21, attritionRate: 16.2, avgSatisfaction: 3.4, avgPerformance: 3.5, costSavings: 860000 },
  { name: 'Finance', keep: 78, letGo: 19, attritionRate: 11.8, avgSatisfaction: 3.6, avgPerformance: 4.1, costSavings: 1140000 },
  { name: 'Marketing', keep: 68, letGo: 24, attritionRate: 20.1, avgSatisfaction: 3.0, avgPerformance: 3.6, costSavings: 920000 }
];

// Job Role Data
export const jobRoleData = [
  { name: 'Sales Executive', count: 78, attritionRate: 24.8, avgSalary: 6780, riskScore: 0.68 },
  { name: 'Research Scientist', count: 85, attritionRate: 14.2, avgSalary: 8240, riskScore: 0.42 },
  { name: 'Laboratory Technician', count: 114, attritionRate: 22.6, avgSalary: 3420, riskScore: 0.73 },
  { name: 'Manufacturing Director', count: 42, attritionRate: 10.5, avgSalary: 12760, riskScore: 0.31 },
  { name: 'Healthcare Representative', count: 67, attritionRate: 12.8, avgSalary: 9380, riskScore: 0.38 },
  { name: 'Manager', count: 32, attritionRate: 8.4, avgSalary: 16500, riskScore: 0.27 },
  { name: 'Sales Representative', count: 54, attritionRate: 32.6, avgSalary: 4270, riskScore: 0.81 },
  { name: 'Human Resources', count: 36, attritionRate: 16.2, avgSalary: 5960, riskScore: 0.53 }
];

// Sample Employee Data
export const employeeData = [
  { id: 1, name: "John Smith", department: "R&D", jobRole: "Research Scientist", age: 34, attritionRisk: 0.15, attritionCategory: "Low Risk", retentionDecision: "Keep", performance: 4, monthlySalary: 5400, satisfactionScore: 3.8, workLifeBalance: 3, yearsAtCompany: 5, jobLevel: 2, overtime: "No", gender: "Male", distanceFromHome: 7 },
  { id: 2, name: "Maria Garcia", department: "Sales", jobRole: "Sales Executive", age: 29, attritionRisk: 0.82, attritionCategory: "High Risk", retentionDecision: "Let Go", performance: 2, monthlySalary: 4800, satisfactionScore: 2.1, workLifeBalance: 1, yearsAtCompany: 2, jobLevel: 1, overtime: "Yes", gender: "Female", distanceFromHome: 18 },
  { id: 3, name: "Robert Chen", department: "HR", jobRole: "Human Resources", age: 41, attritionRisk: 0.35, attritionCategory: "Medium Risk", retentionDecision: "Keep", performance: 3, monthlySalary: 4200, satisfactionScore: 3.2, workLifeBalance: 3, yearsAtCompany: 7, jobLevel: 2, overtime: "No", gender: "Male", distanceFromHome: 5 },
  { id: 4, name: "James Wilson", department: "R&D", jobRole: "Research Director", age: 48, attritionRisk: 0.08, attritionCategory: "Low Risk", retentionDecision: "Keep", performance: 5, monthlySalary: 12500, satisfactionScore: 4.1, workLifeBalance: 4, yearsAtCompany: 10, jobLevel: 4, overtime: "No", gender: "Male", distanceFromHome: 3 },
  { id: 5, name: "Sarah Johnson", department: "Sales", jobRole: "Sales Representative", age: 26, attritionRisk: 0.91, attritionCategory: "High Risk", retentionDecision: "Let Go", performance: 2, monthlySalary: 3200, satisfactionScore: 1.8, workLifeBalance: 1, yearsAtCompany: 1, jobLevel: 1, overtime: "Yes", gender: "Female", distanceFromHome: 22 },
  { id: 6, name: "Michael Brown", department: "R&D", jobRole: "Laboratory Technician", age: 32, attritionRisk: 0.64, attritionCategory: "High Risk", retentionDecision: "Let Go", performance: 2, monthlySalary: 3100, satisfactionScore: 2.3, workLifeBalance: 2, yearsAtCompany: 3, jobLevel: 1, overtime: "Yes", gender: "Male", distanceFromHome: 15 },
  { id: 7, name: "Jennifer Lee", department: "R&D", jobRole: "Research Scientist", age: 36, attritionRisk: 0.22, attritionCategory: "Low Risk", retentionDecision: "Keep", performance: 4, monthlySalary: 5100, satisfactionScore: 3.5, workLifeBalance: 3, yearsAtCompany: 6, jobLevel: 2, overtime: "No", gender: "Female", distanceFromHome: 9 },
  { id: 8, name: "David Miller", department: "Sales", jobRole: "Sales Executive", age: 31, attritionRisk: 0.75, attritionCategory: "High Risk", retentionDecision: "Let Go", performance: 3, monthlySalary: 4600, satisfactionScore: 2.4, workLifeBalance: 2, yearsAtCompany: 2, jobLevel: 1, overtime: "Yes", gender: "Male", distanceFromHome: 12 },
  { id: 9, name: "Emily Davis", department: "Finance", jobRole: "Financial Analyst", age: 28, attritionRisk: 0.31, attritionCategory: "Medium Risk", retentionDecision: "Keep", performance: 4, monthlySalary: 4900, satisfactionScore: 3.3, workLifeBalance: 3, yearsAtCompany: 3, jobLevel: 1, overtime: "No", gender: "Female", distanceFromHome: 11 },
  { id: 10, name: "Thomas Roberts", department: "Marketing", jobRole: "Marketing Manager", age: 42, attritionRisk: 0.18, attritionCategory: "Low Risk", retentionDecision: "Keep", performance: 5, monthlySalary: 8700, satisfactionScore: 3.9, workLifeBalance: 3, yearsAtCompany: 8, jobLevel: 3, overtime: "No", gender: "Male", distanceFromHome: 6 }
];

// Quarterly Performance Data
export const quarterlyPerformance = [
  { quarter: 'Q1', performance: 83.6, attrition: 16.2, engagement: 72.8, satisfaction: 67.4 },
  { quarter: 'Q2', performance: 89.2, attrition: 15.8, engagement: 76.3, satisfaction: 70.1 },
  { quarter: 'Q3', performance: 78.5, attrition: 17.9, engagement: 68.7, satisfaction: 65.2 },
  { quarter: 'Q4', performance: 86.3, attrition: 16.5, engagement: 75.6, satisfaction: 69.8 }
];

// Attrition Distribution
export const attritionDistribution = [
  { name: 'Voluntary', value: 230, percentage: 50 },
  { name: 'Involuntary', value: 152, percentage: 33 },
  { name: 'Retirement', value: 78, percentage: 17 }
];

// Feature Importance Data
export const featureImportanceData = [
  { name: 'OverTime', importance: 0.183 },
  { name: 'MonthlyIncome', importance: 0.152 },
  { name: 'Age', importance: 0.121 },
  { name: 'JobSatisfaction', importance: 0.112 },
  { name: 'DistanceFromHome', importance: 0.094 },
  { name: 'YearsAtCompany', importance: 0.078 },
  { name: 'WorkLifeBalance', importance: 0.068 },
  { name: 'JobInvolvement', importance: 0.056 },
  { name: 'TotalWorkingYears', importance: 0.052 },
  { name: 'EnvironmentSatisfaction', importance: 0.047 }
];

// Cost Savings Data
export const costSavingsData = [
  { month: 'Jan', actual: 0, projected: 670000 },
  { month: 'Feb', actual: 0, projected: 740000 },
  { month: 'Mar', actual: 0, projected: 810000 },
  { month: 'Apr', actual: 520000, projected: 860000 },
  { month: 'May', actual: 610000, projected: 920000 },
  { month: 'Jun', actual: 780000, projected: 970000 },
  { month: 'Jul', actual: 840000, projected: 1020000 },
  { month: 'Aug', actual: 930000, projected: 1080000 },
  { month: 'Sep', actual: 980000, projected: 1130000 },
  { month: 'Oct', actual: 0, projected: 1190000 },
  { month: 'Nov', actual: 0, projected: 1240000 },
  { month: 'Dec', actual: 0, projected: 1300000 }
];

// Attrition by Factors
export const attritionByFactorsData = [
  { name: 'Low Work-Life Balance', rate: 31.8 },
  { name: 'Overtime Workers', rate: 28.7 },
  { name: 'Low Job Satisfaction', rate: 26.2 },
  { name: 'Long Distance Commute', rate: 24.1 },
  { name: 'Low Monthly Income', rate: 19.8 },
  { name: 'No Promotion >5 Years', rate: 18.3 },
  { name: 'New Employees (<2 Years)', rate: 16.9 },
  { name: 'Single Employees', rate: 15.3 }
];

// Attrition Rate by Age Band
export const attritionRateByAgeBand = [
  { ageGroup: '18-25', attritionRate: 28.4 },
  { ageGroup: '26-35', attritionRate: 21.7 },
  { ageGroup: '36-45', attritionRate: 14.2 },
  { ageGroup: '46-55', attritionRate: 9.8 },
  { ageGroup: '56+', attritionRate: 15.6 }
];

// Satisfaction Matrix
export const satisfactionMatrix = [
  { name: 'Job Satisfaction', low: 28.7, medium: 16.4, high: 8.2 },
  { name: 'Work-Life Balance', low: 31.8, medium: 17.9, high: 7.5 },
  { name: 'Environment Satisfaction', low: 24.3, medium: 15.6, high: 9.1 },
  { name: 'Relationship Satisfaction', low: 21.5, medium: 14.8, high: 10.3 }
];

// Model Performance Data
export const modelPerformanceData = {
  accuracies: [
    { model: 'Logistic Regression', accuracy: 0.78, precision: 0.71, recall: 0.67, f1: 0.69 },
    { model: 'Random Forest', accuracy: 0.86, precision: 0.83, recall: 0.79, f1: 0.81 },
    { model: 'Gradient Boosting', accuracy: 0.89, precision: 0.86, recall: 0.84, f1: 0.85 },
    { model: 'Neural Network', accuracy: 0.85, precision: 0.82, recall: 0.78, f1: 0.80 }
  ],
  confusionMatrix: [
    { name: 'True Negative', value: 242 },
    { name: 'False Positive', value: 28 },
    { name: 'False Negative', value: 19 },
    { name: 'True Positive', value: 105 }
  ],
  rocCurve: [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.38 },
    { fpr: 0.1, tpr: 0.61 },
    { fpr: 0.2, tpr: 0.79 },
    { fpr: 0.3, tpr: 0.86 },
    { fpr: 0.4, tpr: 0.91 },
    { fpr: 0.5, tpr: 0.94 },
    { fpr: 0.6, tpr: 0.96 },
    { fpr: 0.7, tpr: 0.97 },
    { fpr: 0.8, tpr: 0.98 },
    { fpr: 0.9, tpr: 0.99 },
    { fpr: 1.0, tpr: 1.0 }
  ]
};

// Department Treemap Data
export const departmentTreemap = departmentData.map(dept => ({
  name: dept.name,
  size: dept.keep + dept.letGo,
  attrition: (dept.letGo / (dept.keep + dept.letGo) * 100).toFixed(1)
}));

// Radar Chart Data
export const radarChartData = [
  { subject: 'Job Satisfaction', A: 3.6, B: 2.2, fullMark: 5 },
  { subject: 'Work-Life Balance', A: 3.8, B: 1.9, fullMark: 5 },
  { subject: 'Environment', A: 3.7, B: 2.4, fullMark: 5 },
  { subject: 'Relationships', A: 3.4, B: 2.5, fullMark: 5 },
  { subject: 'Job Involvement', A: 3.9, B: 2.7, fullMark: 5 },
  { subject: 'Performance', A: 4.1, B: 2.3, fullMark: 5 }
]; 