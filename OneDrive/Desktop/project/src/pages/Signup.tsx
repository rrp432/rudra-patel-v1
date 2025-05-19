import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/shared/ThemeToggle';
import SignupForm from '../components/auth/SignupForm';

const Signup: React.FC = () => {
  const { user } = useAuth();

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
          <SignupForm />
        </div>
      </div>
      
      <footer className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} JobVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Signup;