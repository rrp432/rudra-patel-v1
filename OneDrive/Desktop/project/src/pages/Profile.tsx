import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyTarget: user?.dailyTarget || 3,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyTarget' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send the updated user data to the backend
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="dailyTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Daily Application Target
                  </label>
                  <input
                    id="dailyTarget"
                    name="dailyTarget"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.dailyTarget}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="text-gray-400 mr-3" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</div>
                    <div className="text-gray-900 dark:text-white">{user.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</div>
                    <div className="text-gray-900 dark:text-white">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <BarChart2 className="text-gray-400 mr-3" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Application Target</div>
                    <div className="text-gray-900 dark:text-white">{user.dailyTarget} applications</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 rounded-full mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.currentStreak}</h3>
              <p className="text-gray-500 dark:text-gray-400">Day Streak</p>
              <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Apply to <span className="font-semibold">{user.dailyTarget}</span> jobs daily to maintain your streak!
                </p>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Premium Status</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Upgrade to Premium to access networking events and advanced analytics.
              </p>
              <Button variant="primary" fullWidth>
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;