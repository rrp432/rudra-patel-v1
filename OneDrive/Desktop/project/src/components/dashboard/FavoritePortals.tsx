import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortals, useCreatePortal, useDeletePortal } from '../../api/queries';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

const FavoritePortals: React.FC = () => {
  const { data: portals = [], isLoading } = usePortals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPortal, setNewPortal] = useState({ domain: '', customLogoUrl: '' });
  const createPortalMutation = useCreatePortal();
  const deletePortalMutation = useDeletePortal();

  const handleAddPortal = () => {
    createPortalMutation.mutate({
      domain: newPortal.domain,
      customLogoUrl: newPortal.customLogoUrl || undefined,
    });
    setNewPortal({ domain: '', customLogoUrl: '' });
    setIsModalOpen(false);
  };

  const handleDeletePortal = (domain: string) => {
    deletePortalMutation.mutate(domain);
  };

  if (isLoading) {
    return (
      <Card title="Favorite Job Portals" className="h-full">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Favorite Job Portals" className="h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {portals.map((portal) => (
          <motion.div
            key={portal.domain}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <a
              href={`https://${portal.domain}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {portal.customLogoUrl ? (
                  <img
                    src={portal.customLogoUrl}
                    alt={portal.domain}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-800 dark:text-primary-200 font-bold">
                    {portal.domain.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs text-center text-gray-700 dark:text-gray-300 truncate w-full">
                {portal.domain}
              </span>
            </a>
            <button
              onClick={() => handleDeletePortal(portal.domain)}
              className="absolute -top-2 -right-2 bg-white dark:bg-gray-900 text-error-600 dark:text-error-400 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${portal.domain}`}
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors h-full"
        >
          <div className="w-10 h-10 mb-2 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <Plus size={24} />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Add Portal</span>
        </motion.button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Job Portal"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddPortal}
              disabled={!newPortal.domain}
            >
              Add Portal
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Domain
            </label>
            <input
              id="domain"
              type="text"
              value={newPortal.domain}
              onChange={(e) => setNewPortal({ ...newPortal, domain: e.target.value })}
              placeholder="e.g., linkedin.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL (optional)
            </label>
            <input
              id="logoUrl"
              type="text"
              value={newPortal.customLogoUrl}
              onChange={(e) => setNewPortal({ ...newPortal, customLogoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default FavoritePortals;