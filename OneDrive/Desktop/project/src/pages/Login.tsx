import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/shared/ThemeToggle';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="py-4 px-6 flex justify-end">
        <ThemeToggle />
      </header>
      
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-success-50 text-success-700 rounded-md border border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800"
            >
              {message}
            </motion.div>
          )}
          
          <LoginForm />
        </div>
      </div>
      
      <footer className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} JobVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;