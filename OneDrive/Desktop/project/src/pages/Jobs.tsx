import React from 'react';
import { motion } from 'framer-motion';
import JobBoard from '../components/jobs/JobBoard';

const Jobs: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Applications</h1>
      <JobBoard />
    </motion.div>
  );
};

export default Jobs;