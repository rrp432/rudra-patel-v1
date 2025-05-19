import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar, List } from 'lucide-react';
import { useInterviews, useJobs, useCreateInterview, useUpdateInterview, useDeleteInterview } from '../api/queries';
import { Interview, Job } from '../api/types';
import Card from '../components/shared/Card';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';

// Type for views
type ViewType = 'calendar' | 'list';

const Interviews: React.FC = () => {
  const { data: interviews = [], isLoading: interviewsLoading } = useInterviews();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);
  const [viewType, setViewType] = useState<ViewType>('calendar');
  
  const createInterviewMutation = useCreateInterview();
  const updateInterviewMutation = useUpdateInterview();
  const deleteInterviewMutation = useDeleteInterview();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentInterview(null);
    setIsModalOpen(true);
  };

  const handleAddInterview = () => {
    setCurrentInterview(null);
    setIsModalOpen(true);
  };

  const handleEditInterview = (interview: Interview) => {
    setCurrentInterview(interview);
    setIsModalOpen(true);
  };

  const handleDeleteInterview = () => {
    if (currentInterview) {
      deleteInterviewMutation.mutate(currentInterview.id);
      setIsModalOpen(false);
    }
  };

  const handleSubmitInterview = (interview: Interview | Omit<Interview, 'id'>) => {
    if ('id' in interview) {
      updateInterviewMutation.mutate(interview);
    } else {
      createInterviewMutation.mutate(interview);
    }
    setIsModalOpen(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const dayList = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const interviewsOnDate = (date: Date): Interview[] => {
    return interviews.filter((interview) => 
      interview.date && isSameDay(parseISO(interview.date), date)
    );
  };

  const getJobTitle = (jobId: string): string => {
    const job = jobs.find(j => j.id === jobId);
    return job ? `${job.title} at ${job.company}` : 'Unknown Job';
  };

  const dayInterviewCount = (date: Date): number => {
    return interviewsOnDate(date).length;
  };

  if (interviewsLoading || jobsLoading) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interviews</h1>
        
        <div className="flex space-x-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewType('calendar')}
              className={`px-3 py-1.5 rounded-l-md ${
                viewType === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
              aria-label="Calendar view"
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-1.5 rounded-r-md ${
                viewType === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
          
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={handleAddInterview}
          >
            Add Interview
          </Button>
        </div>
      </div>

      {viewType === 'calendar' ? (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {dayList.map((day, i) => {
              const interviewCount = dayInterviewCount(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <button
                  key={i}
                  onClick={() => isCurrentMonth && handleDateClick(day)}
                  className={`
                    h-24 p-1 border rounded-md flex flex-col relative
                    ${isCurrentMonth ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'}
                    ${isToday(day) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    hover:border-primary-300 dark:hover:border-primary-700
                  `}
                  disabled={!isCurrentMonth}
                >
                  <div className={`
                    text-right p-1 font-medium text-sm
                    ${isToday(day) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {interviewCount > 0 && (
                    <div className="overflow-y-auto flex-1 px-1">
                      {interviewsOnDate(day).slice(0, 2).map((interview) => (
                        <div 
                          key={interview.id}
                          className="text-xs p-1 mb-1 truncate rounded bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditInterview(interview);
                          }}
                        >
                          {format(parseISO(interview.date), 'h:mm a')} - {interview.title}
                        </div>
                      ))}
                      
                      {interviewCount > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 p-1">
                          +{interviewCount - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            {interviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {interviews
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((interview) => (
                      <div
                        key={interview.id}
                        onClick={() => handleEditInterview(interview)}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800 cursor-pointer"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{interview.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{getJobTitle(interview.jobId)}</p>
                          </div>
                          <div className="mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                            {format(parseISO(interview.date), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No interviews scheduled</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Click the button below to schedule your first interview
                </p>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onClick={handleAddInterview}
                >
                  Add Interview
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Add/Edit Interview Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        interview={currentInterview}
        selectedDate={selectedDate}
        jobs={jobs}
        onSubmit={handleSubmitInterview}
        onDelete={handleDeleteInterview}
      />
    </motion.div>
  );
};

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
  selectedDate: Date | null;
  jobs: Job[];
  onSubmit: (interview: Interview | Omit<Interview, 'id'>) => void;
  onDelete: () => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  interview,
  selectedDate,
  jobs,
  onSubmit,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Omit<Interview, 'id'>>({
    jobId: '',
    title: '',
    date: new Date().toISOString(),
  });

  // Reset form when modal opens/closes or interview changes
  React.useEffect(() => {
    if (isOpen) {
      if (interview) {
        setFormData({
          jobId: interview.jobId,
          title: interview.title,
          date: interview.date,
        });
      } else {
        setFormData({
          jobId: jobs.length > 0 ? jobs[0].id : '',
          title: '',
          date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        });
      }
    }
  }, [isOpen, interview, jobs, selectedDate]);

  const handleSubmit = () => {
    if (interview) {
      onSubmit({
        id: interview.id,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  // Filter jobs to only include those with status APPLIED or INTERVIEWING
  const eligibleJobs = jobs.filter(job => 
    job.status === 'APPLIED' || job.status === 'INTERVIEWING'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={interview ? 'Edit Interview' : 'Add Interview'}
      footer={
        <div className="flex justify-between">
          <div>
            {interview && (
              <Button
                variant="danger"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!formData.jobId || !formData.title || !formData.date}
            >
              {interview ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job
          </label>
          {eligibleJobs.length > 0 ? (
            <select
              id="jobId"
              value={formData.jobId}
              onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              {eligibleJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} at {job.company}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
              You need to have job applications with status "Applied" or "Interviewing" first.
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Interview Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Technical Interview"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date and Time
          </label>
          <input
            id="date"
            type="datetime-local"
            value={formData.date ? format(parseISO(formData.date), "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              date: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
    </Modal>
  );
};

export default Interviews;