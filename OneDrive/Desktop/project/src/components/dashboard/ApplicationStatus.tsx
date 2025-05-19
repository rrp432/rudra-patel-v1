import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { StatusCount } from '../../api/types';

interface ApplicationStatusProps {
  data: StatusCount[];
  isLoading: boolean;
}

// Status colors for the donut chart
const STATUS_COLORS = {
  SAVED: '#94a3b8', // Slate
  APPLIED: '#3b82f6', // Blue
  INTERVIEWING: '#f59e0b', // Amber
  OFFER: '#10b981', // Emerald
  REJECTED: '#ef4444', // Red
};

// Status display names
const STATUS_NAMES = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ data, isLoading }) => {
  // Calculate total applications
  const totalApplications = data.reduce((sum, item) => sum + item.count, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{STATUS_NAMES[data.status as keyof typeof STATUS_NAMES]}</p>
          <p>Count: {data.count}</p>
          <p>Percentage: {Math.round((data.count / totalApplications) * 100)}%</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card title="Application Status" className="h-full">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Application Status" className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64 relative"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#8884d8'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text showing total */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalApplications}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Applications</span>
        </div>
      </motion.div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.status} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#8884d8' }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {STATUS_NAMES[item.status as keyof typeof STATUS_NAMES]}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ApplicationStatus;