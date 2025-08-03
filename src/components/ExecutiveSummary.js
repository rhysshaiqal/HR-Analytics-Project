import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Line,
  AreaChart, Area
} from 'recharts';

const ExecutiveSummary = ({
  totalEmployees,
  highRiskCount,
  recommendedForLetGo,
  avgAttritionRisk,
  annualSavings,
  totalMonthlyCost,
  quarterlyPerformance,
  departmentData,
  attritionDistribution,
  costSavingsData,
  featureImportanceData,
  PIE_COLORS
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Key Metrics Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Employees</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold text-gray-800">{totalEmployees}</div>
            <div className="text-green-500 text-sm ml-2 mb-1">+3.2% YoY</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">Across {departmentData.length} departments</div>
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
        {/* Performance Metrics Chart */}
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

        {/* Department Overview Chart */}
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
        {/* Attrition Distribution Chart */}
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

        {/* Cost Savings Projection Chart */}
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

        {/* Key Risk Factors Chart */}
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
  );
};

export default ExecutiveSummary; 