import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Mail, ShieldCheck, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

// User settings interface
interface Settings {
  darkMode: boolean;
  notifications: boolean;
  emailNotifications: boolean;
  changePassword: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  dailyTarget: number;
  premium: boolean;
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState<Settings>({
    darkMode: theme === 'dark',
    notifications: true,
    emailNotifications: true,
    changePassword: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    dailyTarget: 3,
    premium: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleToggleDarkMode = () => {
    toggleTheme();
    setSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      changePassword: {
        ...settings.changePassword,
        [name]: value,
      },
    });
  };

  const validatePassword = () => {
    let valid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!settings.changePassword.currentPassword) {
      errors.currentPassword = 'Current password is required';
      valid = false;
    }

    if (!settings.changePassword.newPassword) {
      errors.newPassword = 'New password is required';
      valid = false;
    } else if (settings.changePassword.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      valid = false;
    }

    if (settings.changePassword.newPassword !== settings.changePassword.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setPasswordErrors(errors);
    return valid;
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      console.log('Password changed successfully');
      // Reset form
      setSettings({
        ...settings,
        changePassword: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      });
    }
  };

  const handleDailyTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setSettings({ ...settings, dailyTarget: value });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Appearance">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              {settings.darkMode ? (
                <Moon className="text-gray-700 dark:text-gray-300 mr-3" size={20} />
              ) : (
                <Sun className="text-gray-700 dark:text-gray-300 mr-3" size={20} />
              )}
              <span className="text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Bell className="text-gray-700 dark:text-gray-300 mr-3" size={20} />
                <span className="text-gray-900 dark:text-white">App Notifications</span>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Mail className="text-gray-700 dark:text-gray-300 mr-3" size={20} />
                <span className="text-gray-900 dark:text-white">Email Notifications</span>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card title="Security">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={settings.changePassword.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                placeholder="••••••••"
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={settings.changePassword.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                placeholder="••••••••"
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={settings.changePassword.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                placeholder="••••••••"
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<ShieldCheck size={16} />}
            >
              Change Password
            </Button>
          </form>
        </Card>

        <Card title="Application Goals">
          <div className="space-y-4">
            <div>
              <label htmlFor="dailyTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Application Target
              </label>
              <input
                id="dailyTarget"
                type="number"
                min="1"
                max="20"
                value={settings.dailyTarget}
                onChange={handleDailyTargetChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set a daily target for job applications to stay on track.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => console.log('Saved daily target:', settings.dailyTarget)}
            >
              Save Goal
            </Button>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card title="Premium Plan">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-lg border border-primary-100 dark:border-primary-800">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Upgrade to JobVault Premium
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get access to networking events, advanced analytics, and AI-powered job matching.
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="h-4 w-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Networking events calendar
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="h-4 w-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced analytics and reports
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="h-4 w-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI-powered job recommendations
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$9.99</span>
                <Button
                  variant="primary"
                  leftIcon={<CreditCard size={16} />}
                  onClick={() => handleToggle('premium')}
                >
                  {settings.premium ? 'Manage Subscription' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;