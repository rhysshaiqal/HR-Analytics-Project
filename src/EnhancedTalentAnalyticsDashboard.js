import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  ComposedChart, Treemap
} from 'recharts';

// Sample data - in production would come from your models' outputs
const departmentData = [
  { name: 'R&D', keep: 251, letGo: 67, attritionRate: 18.4, avgSatisfaction: 3.2, avgPerformance: 3.8, costSavings: 2450000 },
  { name: 'Sales', keep: 188, letGo: 83, attritionRate: 24.7, avgSatisfaction: 2.7, avgPerformance: 3.3, costSavings: 3210000 },
  { name: 'HR', keep: 52, letGo: 21, attritionRate: 16.2, avgSatisfaction: 3.4, avgPerformance: 3.5, costSavings: 860000 },
  { name: 'Finance', keep: 78, letGo: 19, attritionRate: 11.8, avgSatisfaction: 3.6, avgPerformance: 4.1, costSavings: 1140000 },
  { name: 'Marketing', keep: 68, letGo: 24, attritionRate: 20.1, avgSatisfaction: 3.0, avgPerformance: 3.6, costSavings: 920000 }
];

const jobRoleData = [
  { name: 'Sales Executive', count: 78, attritionRate: 24.8, avgSalary: 6780, riskScore: 0.68 },
  { name: 'Research Scientist', count: 85, attritionRate: 14.2, avgSalary: 8240, riskScore: 0.42 },
  { name: 'Laboratory Technician', count: 114, attritionRate: 22.6, avgSalary: 3420, riskScore: 0.73 },
  { name: 'Manufacturing Director', count: 42, attritionRate: 10.5, avgSalary: 12760, riskScore: 0.31 },
  { name: 'Healthcare Representative', count: 67, attritionRate: 12.8, avgSalary: 9380, riskScore: 0.38 },
  { name: 'Manager', count: 32, attritionRate: 8.4, avgSalary: 16500, riskScore: 0.27 },
  { name: 'Sales Representative', count: 54, attritionRate: 32.6, avgSalary: 4270, riskScore: 0.81 },
  { name: 'Human Resources', count: 36, attritionRate: 16.2, avgSalary: 5960, riskScore: 0.53 }
];

const employeeData = [
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

const quarterlyPerformance = [
  { quarter: 'Q1', performance: 83.6, attrition: 16.2, engagement: 72.8, satisfaction: 67.4 },
  { quarter: 'Q2', performance: 89.2, attrition: 15.8, engagement: 76.3, satisfaction: 70.1 },
  { quarter: 'Q3', performance: 78.5, attrition: 17.9, engagement: 68.7, satisfaction: 65.2 },
  { quarter: 'Q4', performance: 86.3, attrition: 16.5, engagement: 75.6, satisfaction: 69.8 }
];

const attritionDistribution = [
  { name: 'Voluntary', value: 230, percentage: 50 },
  { name: 'Involuntary', value: 152, percentage: 33 },
  { name: 'Retirement', value: 78, percentage: 17 }
];

const featureImportanceData = [
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

const costSavingsData = [
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

const attritionByFactorsData = [
  { name: 'Low Work-Life Balance', rate: 31.8 },
  { name: 'Overtime Workers', rate: 28.7 },
  { name: 'Low Job Satisfaction', rate: 26.2 },
  { name: 'Long Distance Commute', rate: 24.1 },
  { name: 'Low Monthly Income', rate: 19.8 },
  { name: 'No Promotion >5 Years', rate: 18.3 },
  { name: 'New Employees (<2 Years)', rate: 16.9 },
  { name: 'Single Employees', rate: 15.3 }
];

const attritionRateByAgeBand = [
  { ageGroup: '18-25', attritionRate: 28.4 },
  { ageGroup: '26-35', attritionRate: 21.7 },
  { ageGroup: '36-45', attritionRate: 14.2 },
  { ageGroup: '46-55', attritionRate: 9.8 },
  { ageGroup: '56+', attritionRate: 15.6 }
];

const satisfactionMatrix = [
  { name: 'Job Satisfaction', low: 28.7, medium: 16.4, high: 8.2 },
  { name: 'Work-Life Balance', low: 31.8, medium: 17.9, high: 7.5 },
  { name: 'Environment Satisfaction', low: 24.3, medium: 15.6, high: 9.1 },
  { name: 'Relationship Satisfaction', low: 21.5, medium: 14.8, high: 10.3 }
];

const modelPerformanceData = {
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

const departmentTreemap = departmentData.map(dept => ({
  name: dept.name,
  size: dept.keep + dept.letGo,
  attrition: (dept.letGo / (dept.keep + dept.letGo) * 100).toFixed(1)
}));

const radarChartData = [
  { subject: 'Job Satisfaction', A: 3.6, B: 2.2, fullMark: 5 },
  { subject: 'Work-Life Balance', A: 3.8, B: 1.9, fullMark: 5 },
  { subject: 'Environment', A: 3.7, B: 2.4, fullMark: 5 },
  { subject: 'Relationships', A: 3.4, B: 2.5, fullMark: 5 },
  { subject: 'Job Involvement', A: 3.9, B: 2.7, fullMark: 5 },
  { subject: 'Performance', A: 4.1, B: 2.3, fullMark: 5 },
];

// Color palettes
const RISK_COLORS = {
  'Low Risk': '#4caf50',
  'Medium Risk': '#ff9800',
  'High Risk': '#f44336'
};

const DECISION_COLORS = {
  'Keep': '#2196f3',
  'Let Go': '#ff5722'
};

const PIE_COLORS = ['#2196f3', '#00bcd4', '#ff9800', '#f44336', '#9c27b0'];
const AREA_COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800'];
const COMPARISON_COLORS = ['#4caf50', '#f44336'];

// Enhanced Talent Analytics Dashboard
const EnhancedTalentAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [department, setDepartment] = useState('All');
  const [jobRole, setJobRole] = useState('All');
  const [riskThreshold, setRiskThreshold] = useState(0.5);
  const [ageFilter, setAgeFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // List of unique departments and job roles
  const departments = ['All', ...new Set(employeeData.map(e => e.department))];
  const jobRoles = ['All', ...new Set(employeeData.map(e => e.jobRole))];
  const ageRanges = ['All', '18-30', '31-40', '41-50', '51+'];

  // Filter employees based on selection
  const filteredEmployees = employeeData
    .filter(emp => department === 'All' || emp.department === department)
    .filter(emp => jobRole === 'All' || emp.jobRole === jobRole)
    .filter(emp => {
      if (ageFilter === 'All') return true;
      if (ageFilter === '18-30') return emp.age >= 18 && emp.age <= 30;
      if (ageFilter === '31-40') return emp.age >= 31 && emp.age <= 40;
      if (ageFilter === '41-50') return emp.age >= 41 && emp.age <= 50;
      if (ageFilter === '51+') return emp.age >= 51;
      return true;
    })
    .filter(emp => 
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.jobRole.toLowerCase().includes(searchText.toLowerCase())
    );

  // Calculate key metrics
  const totalEmployees = employeeData.length;
  const highRiskCount = employeeData.filter(e => e.attritionCategory === 'High Risk').length;
  const recommendedForLetGo = employeeData.filter(e => e.retentionDecision === 'Let Go').length;
  const avgAttritionRisk = (employeeData.reduce((sum, e) => sum + e.attritionRisk, 0) / totalEmployees * 100).toFixed(1);
  
  // Calculate total and optimized cost
  const totalMonthlyCost = employeeData.reduce((sum, e) => sum + e.monthlySalary, 0);
  const optimizedMonthlyCost = employeeData
    .filter(e => e.retentionDecision === 'Keep')
    .reduce((sum, e) => sum + e.monthlySalary, 0);
  const annualSavings = (totalMonthlyCost - optimizedMonthlyCost) * 12;

  // Employee Selection Handler
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Talent Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-700 px-3 py-1 rounded-full text-sm">
              Last updated: April 30, 2025
            </div>
            <div className="flex items-center">
              <span className="mr-2">Risk Threshold:</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="ml-2">{(riskThreshold * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto">
          <div className="flex">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'executive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('executive')}
            >
              Executive Summary
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'attrition' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('attrition')}
            >
              Attrition Analysis
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'workforce' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('workforce')}
            >
              Workforce Optimization
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'employee' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('employee')}
            >
              Employee Explorer
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'model' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('model')}
            >
              Model Performance
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        {/* Executive Summary Tab */}
        {activeTab === 'executive' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="text-gray-500 text-sm font-medium mb-1">Total Employees</div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-gray-800">{totalEmployees}</div>
                  <div className="text-green-500 text-sm ml-2 mb-1">+3.2% YoY</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Across 5 departments</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="text-gray-500 text-sm font-medium mb-1">Attrition Risk</div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-amber-500">{avgAttritionRisk}%</div>
                  <div className="text-red-500 text-sm ml-2 mb-1">+2.4% QoQ</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">{highRiskCount} high-risk employees</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="text-gray-500 text-sm font-medium mb-1">Annual Savings</div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-green-600">${(annualSavings/1000000).toFixed(2)}M</div>
                  <div className="text-gray-500 text-sm ml-2 mb-1">{((annualSavings/(totalMonthlyCost*12))*100).toFixed(1)}% reduction</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Based on optimization recommendations</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="text-gray-500 text-sm font-medium mb-1">Recommended Actions</div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-blue-600">{totalEmployees - recommendedForLetGo}</div>
                  <div className="text-sm text-gray-600 ml-2 mb-1">Keep</div>
                </div>
                <div className="flex items-end mt-1">
                  <div className="text-xl font-bold text-orange-500">{recommendedForLetGo}</div>
                  <div className="text-sm text-gray-600 ml-2 mb-0">Consider for transition</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Quarterly Performance Metrics</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={quarterlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" name="Performance Score" fill="#4caf50" />
                    <Bar dataKey="satisfaction" name="Satisfaction Score" fill="#2196f3" />
                    <Line type="monotone" dataKey="attrition" name="Attrition Rate (%)" stroke="#f44336" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Department Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="keep" name="Keep" stackId="a" fill="#2196f3" />
                    <Bar dataKey="letGo" name="Let Go" stackId="a" fill="#ff5722" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Attrition Distribution</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={attritionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attritionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Cost Savings Projection</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={costSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Area type="monotone" dataKey="actual" name="Actual Savings" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="projected" name="Projected Savings" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Key Risk Factors</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={featureImportanceData.slice(0, 5)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 0.2]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']} />
                    <Bar dataKey="importance" fill="#ff9800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Attrition Analysis Tab */}
        {activeTab === 'attrition' && (
          <div>
            <div className="flex justify-between mb-6">
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                  <select 
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                  >
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select 
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                  >
                    {ageRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-700">
                  <span className="font-medium">ML Model:</span> Gradient Boosting (AUC: 0.89)
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Attrition by Key Factors</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={attritionByFactorsData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 35]} />
                    <YAxis dataKey="name" type="category" width={160} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Attrition Rate']} />
                    <Bar dataKey="rate" fill="#f44336">
                      {attritionByFactorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.rate > 25 ? '#f44336' : entry.rate > 20 ? '#ff9800' : entry.rate > 15 ? '#2196f3' : '#4caf50'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Risk Distribution by Department</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap
                    data={departmentTreemap}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {departmentTreemap.map((item, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Number(item.attrition) > 20 ? '#f44336' : Number(item.attrition) > 15 ? '#ff9800' : '#4caf50'}
                      />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Size = Number of employees, Color = Attrition rate (Red &gt; 20%, Orange &gt; 15%, Green &le; 15%)
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Attrition by Age Group</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={attritionRateByAgeBand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis domain={[0, 30]} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Attrition Rate']} />
                    <Bar dataKey="attritionRate" fill="#5c6bc0">
                      {attritionRateByAgeBand.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.attritionRate > 20 ? '#f44336' : entry.attritionRate > 15 ? '#ff9800' : '#4caf50'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Satisfaction vs Attrition</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={satisfactionMatrix}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 35]} />
                    <YAxis dataKey="name" type="category" width={50} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Attrition Rate']} />
                    <Legend align="right" verticalAlign="top" layout="vertical" />
                    <Bar dataKey="low" name="Low Satisfaction" stackId="a" fill="#f44336" />
                    <Bar dataKey="medium" name="Medium Satisfaction" stackId="a" fill="#ff9800" />
                    <Bar dataKey="high" name="High Satisfaction" stackId="a" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Stay vs Leave Comparison</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart outerRadius={90} data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Stay" dataKey="A" stroke="#4caf50" fill="#4caf50" fillOpacity={0.5} />
                    <Radar name="Leave" dataKey="B" stroke="#f44336" fill="#f44336" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Feature Importance for Attrition Prediction</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.2]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']} />
                  <Bar dataKey="importance" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800">Model Insights:</p>
                <ul className="mt-2 list-disc list-inside text-blue-700 space-y-1">
                  <li>Working overtime increases attrition risk by 3.2x</li>
                  <li>For every $1000 decrease in monthly income, attrition risk increases by 5.8%</li>
                  <li>Each point decrease in job satisfaction increases attrition risk by 28%</li>
                  <li>Employees with 10+ mile commute have 2.1x higher attrition risk</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Workforce Optimization Tab */}
        {activeTab === 'workforce' && (
          <div>
            <div className="flex flex-wrap justify-between mb-6">
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Filter</label>
                  <select 
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-700">
                  <span className="font-medium">AI Recommendation:</span> Optimize 214 positions for 23.5% cost reduction
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Performance vs. Cost Distribution</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="performance" name="Performance" unit="" domain={[1, 5]} />
                    <YAxis 
                      type="number" 
                      dataKey="monthlySalary" 
                      name="Monthly Salary" 
                      unit="$" 
                      domain={['dataMin - 500', 'dataMax + 500']} 
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      formatter={(value, name) => [name === 'monthlySalary' ? `$${value}` : value, name === 'monthlySalary' ? 'Monthly Salary' : 'Performance Rating']} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const employee = employeeData.find(e => e.monthlySalary === payload[0].value && e.performance === payload[1].value);
                          if (employee) {
                            return (
                              <div className="bg-white border border-gray-200 shadow-md rounded-md p-3 text-sm">
                                <p className="font-bold">{employee.name}</p>
                                <p>{employee.jobRole} ({employee.department})</p>
                                <p>Performance: {employee.performance}/5</p>
                                <p>Salary: ${employee.monthlySalary}</p>
                                <p>Attrition Risk: {(employee.attritionRisk * 100).toFixed(0)}%</p>
                                <p className={`font-medium ${employee.retentionDecision === 'Keep' ? 'text-blue-600' : 'text-orange-600'}`}>
                                  Recommendation: {employee.retentionDecision}
                                </p>
                              </div>
                            );
                          }
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Scatter 
                      name="Keep" 
                      data={filteredEmployees.filter(e => e.retentionDecision === 'Keep')} 
                      fill="#2196f3" 
                      shape="circle"
                    />
                    <Scatter 
                      name="Let Go" 
                      data={filteredEmployees.filter(e => e.retentionDecision === 'Let Go')} 
                      fill="#ff5722" 
                      shape="circle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Each point represents an employee. Hover for details.
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Optimization Summary</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Current Annual Cost</div>
                    <div className="text-2xl font-bold">${(totalMonthlyCost * 12).toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Optimized Annual Cost</div>
                    <div className="text-2xl font-bold text-blue-600">${(optimizedMonthlyCost * 12).toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Projected Annual Savings</div>
                    <div className="text-2xl font-bold text-green-600">${annualSavings.toLocaleString()}</div>
                    <div className="text-sm text-green-500">
                      {((annualSavings/(totalMonthlyCost*12))*100).toFixed(1)}% cost reduction
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-sm font-medium mb-2">Risk Threshold Adjustment</div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={riskThreshold}
                        onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>{(riskThreshold * 100).toFixed(0)}%</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-semibold mb-3">Transition Impact</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Positions Affected</div>
                      <div className="text-xl font-bold text-gray-800">{recommendedForLetGo}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Performance Impact</div>
                      <div className="text-xl font-bold text-amber-500">-3.2%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Knowledge Retention</div>
                      <div className="text-xl font-bold text-blue-500">92%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Team Satisfaction</div>
                      <div className="text-xl font-bold text-green-500">+5.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Optimization by Department</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={departmentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 30]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'costSavings') return [`$${value.toLocaleString()}`, 'Cost Savings'];
                      if (name === 'attritionRate') return [`${value.toFixed(1)}%`, 'Attrition Rate'];
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="costSavings" name="Cost Savings" fill="#4caf50" />
                    <Line yAxisId="right" type="monotone" dataKey="attritionRate" name="Attrition Rate" stroke="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Job Role Analysis</h2>
                <div className="mb-4">
                  <select 
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                  >
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Salary</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobRoleData.map((role, index) => (
                        <tr key={index} className={role.name === jobRole || jobRole === 'All' ? 'bg-blue-50' : ''}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{role.count}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${role.avgSalary}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              role.riskScore < 0.4 
                                ? 'bg-green-100 text-green-800' 
                                : role.riskScore < 0.7 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {(role.riskScore * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              role.riskScore < 0.5 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {role.riskScore < 0.5 ? 'Retain' : 'Optimize'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Employee Explorer Tab */}
        {activeTab === 'employee' && (
          <div>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Employees</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, department, or job role..."
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select 
                  className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                <select 
                  className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                >
                  {jobRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select 
                  className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                >
                  {ageRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attrition</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr 
                          key={employee.id} 
                          className={`hover:bg-blue-50 cursor-pointer ${selectedEmployee && selectedEmployee.id === employee.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleEmployeeSelect(employee)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{employee.jobRole}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {employee.age}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{employee.performance}/5</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${employee.monthlySalary}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.attritionCategory === 'Low Risk' 
                                ? 'bg-green-100 text-green-800' 
                                : employee.attritionCategory === 'Medium Risk' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {(employee.attritionRisk * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.retentionDecision === 'Keep' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {employee.retentionDecision}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 text-sm text-gray-500 border-t">
                  Showing {filteredEmployees.length} of {employeeData.length} employees
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
                {selectedEmployee ? (
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <div className="text-xl font-medium text-gray-900">{selectedEmployee.name}</div>
                      <div className="text-sm text-gray-500">{selectedEmployee.jobRole}, {selectedEmployee.department}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Age</div>
                        <div className="text-md font-medium">{selectedEmployee.age}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Gender</div>
                        <div className="text-md font-medium">{selectedEmployee.gender}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Monthly Salary</div>
                        <div className="text-md font-medium">${selectedEmployee.monthlySalary}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Years at Company</div>
                        <div className="text-md font-medium">{selectedEmployee.yearsAtCompany}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Job Level</div>
                        <div className="text-md font-medium">{selectedEmployee.jobLevel}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Overtime</div>
                        <div className="text-md font-medium">{selectedEmployee.overtime}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Performance Rating</div>
                          <div className="text-sm font-medium">{selectedEmployee.performance}/5</div>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedEmployee.performance >= 4 
                                ? 'bg-green-500' 
                                : selectedEmployee.performance >= 3 
                                  ? 'bg-blue-500' 
                                  : 'bg-red-500'
                            }`} 
                            style={{ width: `${selectedEmployee.performance / 5 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Satisfaction Score</div>
                          <div className="text-sm font-medium">{selectedEmployee.satisfactionScore}/5</div>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedEmployee.satisfactionScore >= 3.5 
                                ? 'bg-green-500' 
                                : selectedEmployee.satisfactionScore >= 2.5 
                                  ? 'bg-blue-500' 
                                  : 'bg-red-500'
                            }`} 
                            style={{ width: `${selectedEmployee.satisfactionScore / 5 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Work-Life Balance</div>
                          <div className="text-sm font-medium">{selectedEmployee.workLifeBalance}/5</div>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedEmployee.workLifeBalance >= 3 
                                ? 'bg-green-500' 
                                : selectedEmployee.workLifeBalance >= 2 
                                  ? 'bg-blue-500' 
                                  : 'bg-red-500'
                            }`} 
                            style={{ width: `${selectedEmployee.workLifeBalance / 5 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="mb-2 flex justify-between">
                        <div className="text-sm font-medium">Attrition Risk Score</div>
                        <div className={`text-sm font-medium ${
                          selectedEmployee.attritionCategory === 'Low Risk' 
                            ? 'text-green-600' 
                            : selectedEmployee.attritionCategory === 'Medium Risk' 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}>
                          {selectedEmployee.attritionCategory} ({(selectedEmployee.attritionRisk * 100).toFixed(0)}%)
                        </div>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedEmployee.attritionRisk < 0.3 
                              ? 'bg-green-500' 
                              : selectedEmployee.attritionRisk < 0.6 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${selectedEmployee.attritionRisk * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Retention Decision</div>
                      <div className={`text-center py-2 rounded-lg font-medium ${
                        selectedEmployee.retentionDecision === 'Keep' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedEmployee.retentionDecision}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium">Key Factors:</div>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {selectedEmployee.retentionDecision === 'Keep' ? (
                            <>
                              <li className="text-green-600">Strong performance rating ({selectedEmployee.performance}/5)</li>
                              {selectedEmployee.satisfactionScore >= 3.5 && 
                                <li className="text-green-600">High satisfaction score ({selectedEmployee.satisfactionScore}/5)</li>
                              }
                              {selectedEmployee.attritionRisk < 0.3 && 
                                <li className="text-green-600">Low attrition risk ({(selectedEmployee.attritionRisk * 100).toFixed(0)}%)</li>
                              }
                              {selectedEmployee.overtime === 'No' && 
                                <li className="text-green-600">No overtime (better work-life balance)</li>
                              }
                            </>
                          ) : (
                            <>
                              {selectedEmployee.performance <= 3 && 
                                <li className="text-red-600">Low performance rating ({selectedEmployee.performance}/5)</li>
                              }
                              {selectedEmployee.satisfactionScore < 2.5 && 
                                <li className="text-red-600">Low satisfaction score ({selectedEmployee.satisfactionScore}/5)</li>
                              }
                              {selectedEmployee.attritionRisk >= 0.6 && 
                                <li className="text-red-600">High attrition risk ({(selectedEmployee.attritionRisk * 100).toFixed(0)}%)</li>
                              }
                              {selectedEmployee.overtime === 'Yes' && 
                                <li className="text-red-600">Works overtime (potential burnout risk)</li>
                              }
                              {selectedEmployee.distanceFromHome > 15 && 
                                <li className="text-red-600">Long commute distance ({selectedEmployee.distanceFromHome} miles)</li>
                              }
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>Select an employee to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Model Performance Tab */}
        {activeTab === 'model' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Model Performance Metrics</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precision</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recall</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F1 Score</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modelPerformanceData.accuracies.map((model, index) => (
                        <tr key={index} className={model.model === 'Gradient Boosting' ? 'bg-green-50' : ''}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {model.model} {model.model === 'Gradient Boosting' && <span className="text-green-600">(Selected)</span>}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {(model.accuracy * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {(model.precision * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {(model.recall * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {(model.f1 * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">ROC Curve (AUC = 0.89)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={modelPerformanceData.rocCurve}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="fpr" 
                      domain={[0, 1]} 
                      label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, value === 'fpr' ? 'False Positive Rate' : 'True Positive Rate']} />
                    <Line type="monotone" dataKey="tpr" stroke="#8884d8" dot />
                    <Line type="monotone" dataKey="fpr" stroke="#82ca9d" dot={false} activeDot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Confusion Matrix</h2>
                <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-6">
                  <div className="border p-4 bg-green-50 text-center">
                    <div className="text-sm text-gray-500">True Negative</div>
                    <div className="text-2xl font-bold text-green-600">{modelPerformanceData.confusionMatrix[0].value}</div>
                  </div>
                  <div className="border p-4 bg-red-50 text-center">
                    <div className="text-sm text-gray-500">False Positive</div>
                    <div className="text-2xl font-bold text-red-600">{modelPerformanceData.confusionMatrix[1].value}</div>
                  </div>
                  <div className="border p-4 bg-red-50 text-center">
                    <div className="text-sm text-gray-500">False Negative</div>
                    <div className="text-2xl font-bold text-red-600">{modelPerformanceData.confusionMatrix[2].value}</div>
                  </div>
                  <div className="border p-4 bg-green-50 text-center">
                    <div className="text-sm text-gray-500">True Positive</div>
                    <div className="text-2xl font-bold text-green-600">{modelPerformanceData.confusionMatrix[3].value}</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Total predictions: {modelPerformanceData.confusionMatrix.reduce((sum, item) => sum + item.value, 0)}
                </div>
              </div>
              
              <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Feature Importance</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={featureImportanceData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 0.2]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']} />
                    <Bar dataKey="importance" fill="#8884d8">
                      {featureImportanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#f44336' : index < 6 ? '#ff9800' : '#2196f3'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Model Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Attrition Prediction Model</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Model Type</div>
                      <div className="text-sm font-medium">Gradient Boosting Classifier</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Training Data Size</div>
                      <div className="text-sm font-medium">1,176 employees (80%)</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Test Data Size</div>
                      <div className="text-sm font-medium">294 employees (20%)</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Number of Features</div>
                      <div className="text-sm font-medium">35 (24 original + 11 engineered)</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Cross-Validation</div>
                      <div className="text-sm font-medium">5-fold Stratified CV</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">Last Updated</div>
                      <div className="text-sm font-medium">April 26, 2025</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Retention Decision Model</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Model Type</div>
                      <div className="text-sm font-medium">XGBoost Classifier</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Key Input Features</div>
                      <div className="text-sm font-medium">Attrition Risk, Performance, CTC</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Accuracy</div>
                      <div className="text-sm font-medium">92.5%</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Prediction Classes</div>
                      <div className="text-sm font-medium">Keep (76.5%), Let Go (23.5%)</div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <div className="text-sm text-gray-500">Fairness Audit</div>
                      <div className="text-sm font-medium">Passed (Gender, Age, Ethnicity)</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">Last Updated</div>
                      <div className="text-sm font-medium">April 28, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Workforce Intelligence Dashboard • Data as of April 30, 2025</p>
          <p className="mt-1">Powered by Advanced Machine Learning • Model Version: v2.4.1</p>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedTalentAnalyticsDashboard;