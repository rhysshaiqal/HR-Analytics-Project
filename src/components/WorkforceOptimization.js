import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Line, ComposedChart
} from 'recharts';

const WorkforceOptimization = ({
  department,
  departments,
  filteredEmployees,
  departmentData,
  jobRoleData,
  jobRole,
  jobRoles,
  riskThreshold,
  setRiskThreshold,
  totalMonthlyCost,
  optimizedMonthlyCost,
  annualSavings,
  DECISION_COLORS
}) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Filter</label>
            <select 
              className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={department}
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
        {/* Performance vs Cost Distribution */}
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
                formatter={(value, name) => [
                  name === 'monthlySalary' ? `$${value}` : value, 
                  name === 'monthlySalary' ? 'Monthly Salary' : 'Performance Rating'
                ]} 
              />
              <Legend />
              <Scatter 
                name="Keep" 
                data={filteredEmployees.filter(e => e.retentionDecision === 'Keep')} 
                fill={DECISION_COLORS['Keep']}
                shape="circle"
              />
              <Scatter 
                name="Let Go" 
                data={filteredEmployees.filter(e => e.retentionDecision === 'Let Go')} 
                fill={DECISION_COLORS['Let Go']}
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Each point represents an employee. Hover for details.
          </div>
        </div>
        
        {/* Optimization Summary */}
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
                <div className="text-xl font-bold text-gray-800">214</div>
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
        {/* Optimization by Department */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Optimization by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
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
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Job Role Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Job Role Analysis</h2>
          <div className="mb-4">
            <select 
              className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={jobRole}
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
  );
};

export default WorkforceOptimization; 