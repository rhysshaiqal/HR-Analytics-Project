import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Sample data (would be replaced with the actual data from retention_dashboard_data.csv)
const sampleEmployees = [
  { id: 1, name: "John Smith", department: "R&D", jobRole: "Research Scientist", attritionRisk: 0.15, retentionDecision: "Keep", performance: 4, monthlySalary: 5400, ctc: 78000, satisfactionScore: 3.8 },
  { id: 2, name: "Maria Garcia", department: "Sales", jobRole: "Sales Executive", attritionRisk: 0.82, retentionDecision: "Let Go", performance: 2, monthlySalary: 4800, ctc: 68000, satisfactionScore: 2.1 },
  { id: 3, name: "Robert Chen", department: "HR", jobRole: "Human Resources", attritionRisk: 0.35, retentionDecision: "Keep", performance: 3, monthlySalary: 4200, ctc: 56000, satisfactionScore: 3.2 },
  { id: 4, name: "James Wilson", department: "R&D", jobRole: "Research Director", attritionRisk: 0.08, retentionDecision: "Keep", performance: 5, monthlySalary: 12500, ctc: 190000, satisfactionScore: 4.1 },
  { id: 5, name: "Sarah Johnson", department: "Sales", jobRole: "Sales Representative", attritionRisk: 0.91, retentionDecision: "Let Go", performance: 2, monthlySalary: 3200, ctc: 45000, satisfactionScore: 1.8 },
  { id: 6, name: "Michael Brown", department: "R&D", jobRole: "Laboratory Technician", attritionRisk: 0.64, retentionDecision: "Let Go", performance: 2, monthlySalary: 3100, ctc: 42000, satisfactionScore: 2.3 },
  { id: 7, name: "Jennifer Lee", department: "R&D", jobRole: "Research Scientist", attritionRisk: 0.22, retentionDecision: "Keep", performance: 4, monthlySalary: 5100, ctc: 72000, satisfactionScore: 3.5 },
  { id: 8, name: "David Miller", department: "Sales", jobRole: "Sales Executive", attritionRisk: 0.75, retentionDecision: "Let Go", performance: 3, monthlySalary: 4600, ctc: 65000, satisfactionScore: 2.4 }
];

const departmentData = [
  { name: 'R&D', keep: 145, letGo: 45 },
  { name: 'Sales', keep: 97, letGo: 63 },
  { name: 'HR', keep: 43, letGo: 17 }
];

const attritionData = [
  { name: 'Job Level 1', attritionRate: 24 },
  { name: 'Job Level 2', attritionRate: 18 },
  { name: 'Job Level 3', attritionRate: 12 },
  { name: 'Job Level 4', attritionRate: 6 },
  { name: 'Job Level 5', attritionRate: 3 }
];

const featureImportanceData = [
  { name: 'OverTime', importance: 0.18 },
  { name: 'MonthlyIncome', importance: 0.15 },
  { name: 'Age', importance: 0.12 },
  { name: 'JobSatisfaction', importance: 0.11 },
  { name: 'DistanceFromHome', importance: 0.09 },
  { name: 'YearsAtCompany', importance: 0.08 },
  { name: 'WorkLifeBalance', importance: 0.07 }
];

const scatterData = sampleEmployees.map(emp => ({
  performance: emp.performance,
  ctc: emp.ctc / 1000, // Display in thousands for better visibility
  retentionDecision: emp.retentionDecision,
  department: emp.department,
  name: emp.name
}));

const pieData = [
  { name: 'Keep', value: 1125 },
  { name: 'Let Go', value: 345 }
];

const COLORS = ['#0088FE', '#FF8042'];

// Dashboard component
const TalentAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [department, setDepartment] = useState('All');
  const [threshold, setThreshold] = useState(0.5);
  const [searchText, setSearchText] = useState('');
  
  // Filtered employees based on search and department
  const filteredEmployees = sampleEmployees
    .filter(emp => department === 'All' || emp.department === department)
    .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()));
  
  // Calculate savings
  const totalCost = sampleEmployees.reduce((sum, emp) => sum + emp.ctc, 0);
  const retainedCost = sampleEmployees
    .filter(emp => emp.retentionDecision === "Keep")
    .reduce((sum, emp) => sum + emp.ctc, 0);
  const savings = totalCost - retainedCost;
  const savingsPercentage = (savings / totalCost * 100).toFixed(1);
  
  return (
    <div className="bg-gray-100 p-6 max-w-full">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Talent Analytics: Workforce Optimization Dashboard</h1>
        <p className="text-gray-600">Strategic workforce planning and attrition management</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-300">
        <button 
          className={`mr-2 py-2 px-4 rounded-t-lg border border-gray-300 ${activeTab === 'executive' ? 'bg-blue-50 border-b-0' : 'bg-white'}`}
          onClick={() => setActiveTab('executive')}
        >
          Executive Summary
        </button>
        <button 
          className={`mr-2 py-2 px-4 rounded-t-lg border border-gray-300 ${activeTab === 'attrition' ? 'bg-blue-50 border-b-0' : 'bg-white'}`}
          onClick={() => setActiveTab('attrition')}
        >
          Attrition Risk Analysis
        </button>
        <button 
          className={`mr-2 py-2 px-4 rounded-t-lg border border-gray-300 ${activeTab === 'workforce' ? 'bg-blue-50 border-b-0' : 'bg-white'}`}
          onClick={() => setActiveTab('workforce')}
        >
          Workforce Optimization
        </button>
        <button 
          className={`py-2 px-4 rounded-t-lg border border-gray-300 ${activeTab === 'employee' ? 'bg-blue-50 border-b-0' : 'bg-white'}`}
          onClick={() => setActiveTab('employee')}
        >
          Employee Explorer
        </button>
      </div>
      
      {/* Executive Summary Tab Content */}
      {activeTab === 'executive' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Annual Cost Savings</h2>
              <div className="text-3xl font-bold text-green-600">${savings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{savingsPercentage}% of total workforce cost</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Workforce Optimization</h2>
              <div className="text-3xl font-bold text-blue-600">1,125 / 1,470</div>
              <div className="text-sm text-gray-600">Employees recommended to keep</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Current Attrition Risk</h2>
              <div className="text-3xl font-bold text-orange-600">16.3%</div>
              <div className="text-sm text-gray-600">Employees at high risk of leaving</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Retention by Department</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={departmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="keep" name="Keep" fill="#0088FE" />
                  <Bar dataKey="letGo" name="Let Go" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Top Attrition Factors</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="importance" name="Importance" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Attrition Risk Analysis Tab Content */}
      {activeTab === 'attrition' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Attrition Rate by Job Level</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={attritionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attritionRate" name="Attrition Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Retention Recommendations</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Satisfaction vs. Attrition Risk</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="text-lg font-semibold">High Satisfaction</div>
                <div className="text-3xl font-bold">437</div>
                <div className="text-sm">4.3% attrition risk</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <div className="text-lg font-semibold">Medium-High</div>
                <div className="text-3xl font-bold">512</div>
                <div className="text-sm">8.7% attrition risk</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <div className="text-lg font-semibold">Medium-Low</div>
                <div className="text-3xl font-bold">358</div>
                <div className="text-sm">17.2% attrition risk</div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-lg font-semibold">Low Satisfaction</div>
                <div className="text-3xl font-bold">163</div>
                <div className="text-sm">42.8% attrition risk</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Workforce Optimization Tab Content */}
      {activeTab === 'workforce' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Performance vs. Cost Distribution</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Filter:</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="R&D">Research & Development</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="performance" name="Performance Rating" unit="" domain={[1, 5]} />
                  <YAxis type="number" dataKey="ctc" name="Annual Cost (k$)" unit="k" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if (name === 'ctc') return [`$${value}k`, 'Annual Cost'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Scatter 
                    name="Keep" 
                    data={scatterData.filter(d => d.retentionDecision === 'Keep')} 
                    fill="#0088FE" 
                  />
                  <Scatter 
                    name="Let Go" 
                    data={scatterData.filter(d => d.retentionDecision === 'Let Go')} 
                    fill="#FF8042" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Cost Savings Simulator</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attrition Risk Threshold: {threshold}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Current Annual Cost:</div>
                  <div className="text-lg font-bold">${totalCost.toLocaleString()}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Optimized Annual Cost:</div>
                  <div className="text-lg font-bold">${retainedCost.toLocaleString()}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Potential Savings:</div>
                  <div className="text-xl font-bold text-green-600">${savings.toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-500">
                  * Adjust threshold to simulate different scenarios
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Critical Role Retention</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Satisfaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attrition Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention Priority</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Research Director</td>
                    <td className="px-6 py-4 whitespace-nowrap">12</td>
                    <td className="px-6 py-4 whitespace-nowrap">4.1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">5.8%</td>
                    <td className="px-6 py-4 whitespace-nowrap">Very High</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Manufacturing Director</td>
                    <td className="px-6 py-4 whitespace-nowrap">28</td>
                    <td className="px-6 py-4 whitespace-nowrap">3.8</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">7.2%</td>
                    <td className="px-6 py-4 whitespace-nowrap">High</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Research Scientist</td>
                    <td className="px-6 py-4 whitespace-nowrap">85</td>
                    <td className="px-6 py-4 whitespace-nowrap">3.6</td>
                    <td className="px-6 py-4 whitespace-nowrap text-yellow-600">12.3%</td>
                    <td className="px-6 py-4 whitespace-nowrap">Medium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Employee Explorer Tab Content */}
      {activeTab === 'employee' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Employee Search</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="Search by employee name..." 
                  className="w-full border border-gray-300 rounded p-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div>
                <select 
                  className="w-full border border-gray-300 rounded p-2"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="R&D">Research & Development</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Employee Analytics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attrition Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.jobRole}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.performance}/5</td>
                      <td className="px-6 py-4 whitespace-nowrap">${employee.monthlySalary}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.attritionRisk < 0.3 
                            ? 'bg-green-100 text-green-800' 
                            : employee.attritionRisk < 0.7 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {(employee.attritionRisk * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
          </div>
        </div>
      )}
      
      <div className="text-right text-xs text-gray-500 mt-4">
        Powered by Machine Learning • Last updated: April 28, 2025
      </div>
    </div>
  );
};

export default TalentAnalyticsDashboard;