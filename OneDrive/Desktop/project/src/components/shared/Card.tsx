import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  fullHeight?: boolean;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', fullHeight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${fullHeight ? 'h-full' : ''} ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </motion.div>
  );
};

export default Card;