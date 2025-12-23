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

const PredictionChart = ({ predictions }) => {
  if (!predictions || !predictions.dates) return null;

  // Format data for chart
  const chartData = predictions.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString(),
    actual: predictions.actual_prices[index],
    predicted: predictions.predicted_prices[index]
  }));

  // Take last 60 days for better visualization
  const recentData = chartData.slice(-60);

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
          dataKey="actual" 
          stroke="#4caf50" 
          strokeWidth={2}
          dot={false}
          name="Actual Price"
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="#ff9800" 
          strokeWidth={2}
          dot={false}
          name="Predicted Price"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PredictionChart;

