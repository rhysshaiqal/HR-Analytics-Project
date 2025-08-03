import Papa from 'papaparse';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load CSV data
export async function loadCsvData(filePath) {
  try {
    const absolutePath = resolve(__dirname, filePath);
    const csvText = await readFile(absolutePath, 'utf-8');
    
    const result = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    return result.data;
  } catch (error) {
    console.error("Error loading CSV data:", error);
    return [];
  }
}

// Transform raw data into dashboard format
export function processEmployeeData(rawData, attritionPredictions, retentionDecisions) {
  return rawData.map((employee, index) => {
    // Get prediction results for this employee
    const attritionRisk = attritionPredictions[index] || 0.1;
    const retentionDecision = retentionDecisions[index] || 'Keep';
    
    // Determine risk category
    let attritionCategory;
    if (attritionRisk < 0.3) attritionCategory = 'Low Risk';
    else if (attritionRisk < 0.6) attritionCategory = 'Medium Risk';
    else attritionCategory = 'High Risk';
    
    // Return transformed employee object
    return {
      id: employee.EmployeeNumber,
      name: `Employee ${employee.EmployeeNumber}`, // Your CSV doesn't have names
      department: employee.Department,
      jobRole: employee.JobRole,
      age: employee.Age,
      gender: employee.Gender,
      attritionRisk: attritionRisk,
      attritionCategory: attritionCategory,
      retentionDecision: retentionDecision,
      performance: employee.PerformanceRating,
      monthlySalary: employee.MonthlyIncome,
      satisfactionScore: calculateSatisfactionScore(employee),
      workLifeBalance: employee.WorkLifeBalance,
      yearsAtCompany: employee.YearsAtCompany,
      jobLevel: employee.JobLevel,
      overtime: employee.OverTime,
      distanceFromHome: employee.DistanceFromHome
    };
  });
}

// Helper function to calculate satisfaction score
function calculateSatisfactionScore(employee) {
  const scores = [
    employee.JobSatisfaction || 0,
    employee.EnvironmentSatisfaction || 0,
    employee.RelationshipSatisfaction || 0,
    employee.WorkLifeBalance || 0
  ];
  
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Create department data from employee data
export function createDepartmentData(employeeData) {
  const departments = {};
  
  // Group by department
  employeeData.forEach(emp => {
    if (!departments[emp.department]) {
      departments[emp.department] = {
        name: emp.department,
        employees: [],
        keep: 0,
        letGo: 0,
        totalSalary: 0,
        satisfactionTotal: 0,
        performanceTotal: 0
      };
    }
    
    const dept = departments[emp.department];
    dept.employees.push(emp);
    dept.totalSalary += emp.monthlySalary || 0;
    dept.satisfactionTotal += emp.satisfactionScore || 0;
    dept.performanceTotal += emp.performance || 0;
    
    if (emp.retentionDecision === 'Keep') {
      dept.keep++;
    } else {
      dept.letGo++;
    }
  });
  
  // Calculate metrics for each department
  return Object.values(departments).map(dept => {
    const total = dept.employees.length;
    const attritionCount = dept.employees.filter(e => e.attritionRisk >= 0.5).length;
    
    return {
      name: dept.name,
      keep: dept.keep,
      letGo: dept.letGo,
      attritionRate: (attritionCount / total * 100).toFixed(1) * 1,
      avgSatisfaction: (dept.satisfactionTotal / total).toFixed(1) * 1,
      avgPerformance: (dept.performanceTotal / total).toFixed(1) * 1,
      costSavings: dept.employees
        .filter(e => e.retentionDecision === 'Let Go')
        .reduce((sum, e) => sum + (e.monthlySalary * 12), 0)
    };
  });
}

// Create job role data from employee data
export function createJobRoleData(employeeData) {
  const jobRoles = {};
  
  // Group by job role
  employeeData.forEach(emp => {
    if (!jobRoles[emp.jobRole]) {
      jobRoles[emp.jobRole] = {
        name: emp.jobRole,
        employees: [],
        count: 0,
        totalSalary: 0,
        attritionCount: 0
      };
    }
    
    const role = jobRoles[emp.jobRole];
    role.employees.push(emp);
    role.count++;
    role.totalSalary += emp.monthlySalary || 0;
    if (emp.attritionRisk >= 0.5) {
      role.attritionCount++;
    }
  });
  
  // Calculate metrics for each job role
  return Object.values(jobRoles).map(role => {
    const total = role.employees.length;
    const avgSalary = role.totalSalary / total;
    const riskScore = role.attritionCount / total;
    
    return {
      name: role.name,
      count: role.count,
      attritionRate: (role.attritionCount / total * 100).toFixed(1) * 1,
      avgSalary: Math.round(avgSalary),
      riskScore: riskScore
    };
  });
}

// Create quarterly performance data
export function createQuarterlyPerformanceData(employeeData) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentQuarter = new Date().getMonth() / 3;
  
  return quarters.map((quarter, index) => {
    const isCurrentQuarter = index === Math.floor(currentQuarter);
    const performance = isCurrentQuarter ? 
      employeeData.reduce((sum, emp) => sum + emp.performance, 0) / employeeData.length :
      Math.random() * 10 + 80; // Simulated historical data
    
    const attrition = isCurrentQuarter ?
      employeeData.filter(emp => emp.attritionRisk >= 0.5).length / employeeData.length * 100 :
      Math.random() * 5 + 15; // Simulated historical data
    
    const engagement = isCurrentQuarter ?
      employeeData.reduce((sum, emp) => sum + emp.satisfactionScore, 0) / employeeData.length * 20 :
      Math.random() * 10 + 70; // Simulated historical data
    
    const satisfaction = isCurrentQuarter ?
      employeeData.reduce((sum, emp) => sum + emp.satisfactionScore, 0) / employeeData.length * 20 :
      Math.random() * 10 + 65; // Simulated historical data
    
    return {
      quarter,
      performance: performance.toFixed(1) * 1,
      attrition: attrition.toFixed(1) * 1,
      engagement: engagement.toFixed(1) * 1,
      satisfaction: satisfaction.toFixed(1) * 1
    };
  });
}

// Create feature importance data
export function createFeatureImportanceData() {
  return [
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
} 