import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const TalentAnalyticsDashboard = () => {
  // Sample data - replace with your actual data
  const performanceData = [
    { name: 'Q1', performance: 85 },
    { name: 'Q2', performance: 92 },
    { name: 'Q3', performance: 78 },
    { name: 'Q4', performance: 88 }
  ];

  const attritionData = [
    { name: 'Voluntary', value: 30 },
    { name: 'Involuntary', value: 20 },
    { name: 'Retirement', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="dashboard">
      <h1>Talent Analytics Dashboard</h1>
      
      <div className="chart-container">
        <h2>Employee Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Attrition Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={attritionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {attritionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TalentAnalyticsDashboard; 