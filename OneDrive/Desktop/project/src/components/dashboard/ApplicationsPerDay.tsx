import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { DailyCount } from '../../api/types';

interface ApplicationsPerDayProps {
  data: DailyCount[];
  isLoading: boolean;
  onRangeChange: (range: '7d' | '1m' | 'max') => void;
  currentRange: '7d' | '1m' | 'max';
}

const ApplicationsPerDay: React.FC<ApplicationsPerDayProps> = ({ 
  data, 
  isLoading, 
  onRangeChange,
  currentRange 
}) => {
  // Format data for chart display
  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), 'MMM dd'),
    count: item.count,
    originalDate: item.date,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = payload[0]?.payload?.originalDate
        ? format(parseISO(payload[0].payload.originalDate), 'MMM dd, yyyy')
        : label;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{date}</p>
          <p>Applications: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Range buttons
  const ranges = [
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: 'All Time', value: 'max' },
  ];

  if (isLoading) {
    return (
      <Card title="Applications Per Day" className="h-full">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Applications Per Day" className="h-full">
      <div className="flex justify-end mb-4 space-x-2">
        {ranges.map((range) => (
          <Button
            key={range.value}
            size="sm"
            variant={currentRange === range.value ? 'primary' : 'outline'}
            onClick={() => onRangeChange(range.value as '7d' | '1m' | 'max')}
          >
            {range.label}
          </Button>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickMargin={10} 
              stroke="#9ca3af"
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fontSize: 12 }} 
              tickMargin={10} 
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6, fill: '#1d4ed8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default ApplicationsPerDay;