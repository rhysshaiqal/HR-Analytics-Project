import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, Tooltip as TreemapTooltip
} from 'recharts';
import {
  departmentData, jobRoleData, employeeData, quarterlyPerformance,
  attritionDistribution, featureImportanceData, costSavingsData,
  attritionByFactorsData, attritionRateByAgeBand, satisfactionMatrix,
  modelPerformanceData, departmentTreemap, radarChartData
} from '../data/dashboardData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EnhancedTalentAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [jobRoleFilter, setJobRoleFilter] = useState('All');
  const [riskThreshold, setRiskThreshold] = useState(0.5);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered data based on selected filters
  const filteredEmployees = useMemo(() => {
    return employeeData.filter(emp => {
      const matchesDepartment = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesJobRole = jobRoleFilter === 'All' || emp.jobRole === jobRoleFilter;
      const matchesSearch = searchTerm === '' || 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDepartment && matchesJobRole && matchesSearch;
    });
  }, [departmentFilter, jobRoleFilter, searchTerm]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalEmployees = filteredEmployees.length;
    const highRiskCount = filteredEmployees.filter(emp => emp.attritionRisk >= riskThreshold).length;
    const annualSavings = filteredEmployees
      .filter(emp => emp.retentionDecision === 'Let Go')
      .reduce((sum, emp) => sum + (emp.monthlySalary * 12), 0);
    
    return {
      totalEmployees,
      highRiskCount,
      annualSavings,
      highRiskPercentage: (highRiskCount / totalEmployees * 100).toFixed(1)
    };
  }, [filteredEmployees, riskThreshold]);

  // Render Executive Summary Tab
  const renderExecutiveSummary = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl font-bold">{metrics.totalEmployees}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">High Risk Employees</h3>
          <p className="text-2xl font-bold">{metrics.highRiskCount}</p>
          <p className="text-sm text-gray-600">{metrics.highRiskPercentage}% of workforce</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Projected Annual Savings</h3>
          <p className="text-2xl font-bold">${metrics.annualSavings.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="keep" name="Keep" fill="#00C49F" />
              <Bar dataKey="letGo" name="Let Go" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Attrition Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attritionDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {attritionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Render Attrition Analysis Tab
  const renderAttritionAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Attrition by Factors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attritionByFactorsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="rate" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Attrition Rate by Age Band</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attritionRateByAgeBand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attritionRate" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Satisfaction Matrix</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={satisfactionMatrix}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="low" name="Low" stackId="a" fill="#FF8042" />
            <Bar dataKey="medium" name="Medium" stackId="a" fill="#FFBB28" />
            <Bar dataKey="high" name="High" stackId="a" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render Workforce Optimization Tab
  const renderWorkforceOptimization = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Cost Savings Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costSavingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#00C49F" />
              <Line type="monotone" dataKey="projected" name="Projected" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={departmentTreemap}
              dataKey="size"
              ratio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              <TreemapTooltip />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Feature Importance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureImportanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render Employee Explorer Tab
  const renderEmployeeExplorer = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            className="p-2 border rounded"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            {[...new Set(employeeData.map(emp => emp.department))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={jobRoleFilter}
            onChange={(e) => setJobRoleFilter(e.target.value)}
          >
            <option value="All">All Job Roles</option>
            {[...new Set(employeeData.map(emp => emp.jobRole))].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search employees..."
            className="p-2 border rounded flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Job Role</th>
                <th className="p-2 text-left">Risk Score</th>
                <th className="p-2 text-left">Decision</th>
                <th className="p-2 text-left">Salary</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-t">
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">{emp.jobRole}</td>
                  <td className="p-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          emp.attritionRisk >= riskThreshold ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${emp.attritionRisk * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${
                      emp.retentionDecision === 'Keep' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {emp.retentionDecision}
                    </span>
                  </td>
                  <td className="p-2">${emp.monthlySalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Model Performance Tab
  const renderModelPerformance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Model Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelPerformanceData.accuracies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy" fill="#8884d8" />
              <Bar dataKey="precision" name="Precision" fill="#82ca9d" />
              <Bar dataKey="recall" name="Recall" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ROC Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelPerformanceData.rocCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fpr" />
              <YAxis dataKey="tpr" />
              <Tooltip />
              <Line type="monotone" dataKey="tpr" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Employee Satisfaction Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="High Performers"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="At Risk"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Talent Analytics Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'executive' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('executive')}
          >
            Executive Summary
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'attrition' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('attrition')}
          >
            Attrition Analysis
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'workforce' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('workforce')}
          >
            Workforce Optimization
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'explorer' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('explorer')}
          >
            Employee Explorer
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'model' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('model')}
          >
            Model Performance
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Risk Threshold: {riskThreshold}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={riskThreshold}
          onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {activeTab === 'executive' && renderExecutiveSummary()}
      {activeTab === 'attrition' && renderAttritionAnalysis()}
      {activeTab === 'workforce' && renderWorkforceOptimization()}
      {activeTab === 'explorer' && renderEmployeeExplorer()}
      {activeTab === 'model' && renderModelPerformance()}
    </div>
  );
};

export default EnhancedTalentAnalyticsDashboard; 