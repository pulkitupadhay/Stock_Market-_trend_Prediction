import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Format data for chart
  const chartData = data.map(item => ({
    date: new Date(item.Date).toLocaleDateString(),
    close: item.Close,
    open: item.Open,
    high: item.High,
    low: item.Low,
    volume: item.Volume / 1000000 // Convert to millions
  }));

  // Take last 90 days for better visualization
  const recentData = chartData.slice(-90);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={recentData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.7)"
          tick={{ fontSize: 12 }}
          interval={Math.floor(recentData.length / 10)}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          tick={{ fontSize: 12 }}
          domain={['auto', 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(26, 31, 58, 0.95)', 
            border: '1px solid rgba(102, 126, 234, 0.5)',
            borderRadius: '8px'
          }}
          formatter={(value) => `₹${value.toFixed(2)}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="close" 
          stroke="#667eea" 
          strokeWidth={2}
          dot={false}
          name="Close Price"
        />
        <Line 
          type="monotone" 
          dataKey="high" 
          stroke="#4caf50" 
          strokeWidth={1}
          dot={false}
          name="High"
          strokeDasharray="5 5"
        />
        <Line 
          type="monotone" 
          dataKey="low" 
          stroke="#f44336" 
          strokeWidth={1}
          dot={false}
          name="Low"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;

