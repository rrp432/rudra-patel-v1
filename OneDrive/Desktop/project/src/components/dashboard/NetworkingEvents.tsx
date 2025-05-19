import React, { useState } from 'react';
import { format, parseISO, isFuture } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Plus, Users, School, Briefcase } from 'lucide-react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../../api/queries';
import { Event, EventType } from '../../api/types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

interface EventTypeInfo {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const EVENT_TYPES: Record<EventType, EventTypeInfo> = {
  JOB_FAIR: {
    icon: <Briefcase size={16} />,
    bgColor: 'bg-primary-100 dark:bg-primary-900/40',
    textColor: 'text-primary-700 dark:text-primary-300',
  },
  MEETUP: {
    icon: <Users size={16} />,
    bgColor: 'bg-warning-100 dark:bg-warning-900/40',
    textColor: 'text-warning-700 dark:text-warning-300',
  },
  WORKSHOP: {
    icon: <School size={16} />,
    bgColor: 'bg-success-100 dark:bg-success-900/40',
    textColor: 'text-success-700 dark:text-success-300',
  },
};

const defaultEvent: Omit<Event, 'id'> = {
  title: '',
  date: new Date().toISOString(),
  location: '',
  description: '',
  type: 'JOB_FAIR',
};

const NetworkingEvents: React.FC = () => {
  const { data: events = [], isLoading } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentEvent, setCurrentEvent] = useState<Event | Omit<Event, 'id'>>(defaultEvent);
  
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const resetForm = () => {
    setCurrentEvent(defaultEvent);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setCurrentEvent(event);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (modalMode === 'create') {
      createEventMutation.mutate(currentEvent as Omit<Event, 'id'>);
    } else {
      updateEventMutation.mutate(currentEvent as Event);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  // Sort events by date, with future events first
  const sortedEvents = [...events].sort((a, b) => {
    // Future events come first
    const aIsFuture = isFuture(parseISO(a.date));
    const bIsFuture = isFuture(parseISO(b.date));
    
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;
    
    // Then sort by date
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  const futureEvents = sortedEvents.filter(event => isFuture(parseISO(event.date)));
  const pastEvents = sortedEvents.filter(event => !isFuture(parseISO(event.date)));

  if (isLoading) {
    return (
      <Card title="Networking Events" className="h-full">
        <div className="h-32 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Networking Events" className="h-full">
      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={handleOpenCreateModal}
        >
          Add Event
        </Button>
      </div>
      
      <div className="space-y-6">
        {futureEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {futureEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={() => handleOpenEditModal(event)}
                  onDelete={() => handleDelete(event.id)}
                />
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Past Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.slice(0, 3).map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  isPast={true}
                  onEdit={() => handleOpenEditModal(event)}
                  onDelete={() => handleDelete(event.id)}
                />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-10">
            <CalendarClock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No networking events</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start creating networking events to boost your job search
            </p>
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleOpenCreateModal}
            >
              Add Your First Event
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add Networking Event' : 'Edit Networking Event'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!currentEvent.title || !currentEvent.date || !currentEvent.location}
            >
              {modalMode === 'create' ? 'Create Event' : 'Update Event'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Title
            </label>
            <input
              id="title"
              type="text"
              value={currentEvent.title}
              onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Tech Career Fair 2024"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Type
            </label>
            <select
              id="type"
              value={currentEvent.type}
              onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value as EventType })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="JOB_FAIR">Job Fair</option>
              <option value="MEETUP">Meetup</option>
              <option value="WORKSHOP">Workshop</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date and Time
            </label>
            <input
              id="date"
              type="datetime-local"
              value={currentEvent.date ? format(parseISO(currentEvent.date), "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => setCurrentEvent({ 
                ...currentEvent, 
                date: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() 
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={currentEvent.location}
              onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Convention Center, San Francisco"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Describe the event..."
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

interface EventCardProps {
  event: Event;
  isPast?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast = false, onEdit, onDelete }) => {
  const typeInfo = EVENT_TYPES[event.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        border rounded-lg overflow-hidden shadow-sm
        ${isPast ? 'border-gray-200 dark:border-gray-700 opacity-75' : 'border-gray-200 dark:border-gray-700'}
      `}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}>
            {typeInfo.icon}
            <span className="ml-1">
              {event.type === 'JOB_FAIR' ? 'Job Fair' : event.type === 'MEETUP' ? 'Meetup' : 'Workshop'}
            </span>
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Edit event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400"
              aria-label="Delete event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
        
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarClock size={16} className="mr-1.5" />
          {format(parseISO(event.date), 'MMM d, yyyy h:mm a')}
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={16} className="mr-1.5" />
          {event.location}
        </div>
        
        {event.description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default NetworkingEvents;