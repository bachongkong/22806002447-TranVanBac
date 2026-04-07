import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const JobsChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      name: key.toUpperCase(),
      Jobs: value
    }));
  }, [data]);

  if (chartData.length === 0) return <p style={{ color: 'var(--color-text-muted)' }}>Không có dữ liệu Jobs.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: 'none', borderRadius: '8px', color: '#fff' }} 
          />
          <Bar dataKey="Jobs" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobsChart;
