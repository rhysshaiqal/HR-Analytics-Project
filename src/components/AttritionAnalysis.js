import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, Treemap, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const AttritionAnalysis = ({
  department,
  jobRole,
  departments,
  jobRoles,
  attritionByFactorsData,
  departmentTreemap,
  attritionRateByAgeBand,
  satisfactionMatrix,
  featureImportanceData,
  radarChartData
}) => {
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={department}
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
            >
              {jobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
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
        {/* Attrition by Key Factors */}
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.rate > 25 ? '#f44336' : entry.rate > 20 ? '#ff9800' : '#4caf50'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Risk Distribution by Department */}
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
            Size = Number of employees, Color = Attrition rate (Red {'>'} 20%, Orange {'>'} 15%, Green ≤ 15%)
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Attrition by Age Group */}
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.attritionRate > 20 ? '#f44336' : entry.attritionRate > 15 ? '#ff9800' : '#4caf50'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Satisfaction vs Attrition */}
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
        
        {/* Stay vs Leave Comparison */}
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
      
      {/* Feature Importance */}
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
  );
};

export default AttritionAnalysis; 