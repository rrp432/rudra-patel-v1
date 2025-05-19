import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMetrics } from '../api/queries';
import ApplicationStatus from '../components/dashboard/ApplicationStatus';
import ApplicationsPerDay from '../components/dashboard/ApplicationsPerDay';
import FavoritePortals from '../components/dashboard/FavoritePortals';
import InterviewCalendar from '../components/dashboard/InterviewCalendar';
import NetworkingEvents from '../components/dashboard/NetworkingEvents';
import JobBoard from '../components/jobs/JobBoard';

const Dashboard: React.FC = () => {
  const [metricsRange, setMetricsRange] = useState<'7d' | '1m' | 'max'>('7d');
  const { data: metrics, isLoading: metricsLoading } = useMetrics(metricsRange);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ApplicationStatus 
            data={metrics?.statusCounts || []} 
            isLoading={metricsLoading} 
          />
          <ApplicationsPerDay 
            data={metrics?.dailyCounts || []} 
            isLoading={metricsLoading}
            onRangeChange={setMetricsRange}
            currentRange={metricsRange}
          />
          <FavoritePortals />
          <InterviewCalendar />
        </div>
        
        <div className="mb-6">
          <NetworkingEvents />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Applications</h2>
          <JobBoard />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;