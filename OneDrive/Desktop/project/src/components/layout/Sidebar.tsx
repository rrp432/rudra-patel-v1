import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Briefcase,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';

interface SidebarProps {
  isMobile: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Jobs', icon: <Briefcase size={20} />, path: '/jobs' },
    { name: 'Interviews', icon: <Calendar size={20} />, path: '/interviews' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '72px' },
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className={`
        h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        flex flex-col z-30 overflow-y-auto overflow-x-hidden shadow-sm
        transition-all duration-300 ease-in-out
        ${isMobile ? 'fixed left-0 top-0 bottom-0' : 'sticky top-0'}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-xl text-primary-600 dark:text-primary-400"
            >
              JobVault
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>
      
      {user && (
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) => `
                  flex items-center py-2 px-3 rounded-md transition-colors
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Theme
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <button
          onClick={() => logout()}
          className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        >
          <LogOut size={20} />
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-3 text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;