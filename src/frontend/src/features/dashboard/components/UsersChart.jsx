import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9'];

const UsersChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => {
      const parts = key.split('_');
      const label = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      return { name: label, value };
    }).filter(item => item.value > 0);
  }, [data]);

  if (chartData.length === 0) return <p style={{ color: 'var(--color-text-muted)' }}>Không có dữ liệu Users.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      {/* 
        ResponsiveContainer dynamically scales graphs within its flex parent. 
        Will only evaluate natively upon Suspense lazy trigger resolution.
      */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: 'none', borderRadius: '8px' }} 
            itemStyle={{ color: '#fff' }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersChart;
