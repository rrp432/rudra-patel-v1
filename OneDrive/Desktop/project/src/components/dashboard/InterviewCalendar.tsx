import React, { useState } from 'react';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useInterviews } from '../../api/queries';
import { Interview } from '../../api/types';
import Card from '../shared/Card';
import Modal from '../shared/Modal';

const InterviewCalendar: React.FC = () => {
  const { data: interviews = [], isLoading } = useInterviews();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const dayList = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const interviewsOnDate = (date: Date): Interview[] => {
    return interviews.filter((interview) => 
      interview.date && isSameDay(parseISO(interview.date), date)
    );
  };

  const dayInterviewCount = (date: Date): number => {
    return interviewsOnDate(date).length;
  };

  if (isLoading) {
    return (
      <Card title="Interview Calendar" className="h-full">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Interview Calendar" className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-1 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h4 className="font-medium text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h4>
        
        <button
          onClick={nextMonth}
          className="p-1 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dayList.map((day, i) => {
          const interviewCount = dayInterviewCount(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(day)}
              className={`
                p-1 h-9 flex flex-col items-center justify-center rounded-md relative
                ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
                ${isToday(day) ? 'bg-primary-50 dark:bg-primary-900/20 font-semibold' : ''}
                ${interviewCount > 0 ? 'font-medium' : ''}
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
              `}
              disabled={!isCurrentMonth}
            >
              <span className="text-xs">{format(day, 'd')}</span>
              
              {interviewCount > 0 && (
                <div className="absolute bottom-1 flex space-x-0.5">
                  {Array.from({ length: Math.min(interviewCount, 3) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 h-1 rounded-full bg-primary-500 dark:bg-primary-400"
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Date Interviews Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDate ? `Interviews on ${format(selectedDate, 'MMMM d, yyyy')}` : 'Interviews'}
        size="md"
      >
        {selectedDate && (
          <div className="space-y-4">
            {interviewsOnDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {interviewsOnDate(selectedDate).map((interview) => (
                  <div 
                    key={interview.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{interview.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(parseISO(interview.date), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CalendarDays className="w-12 h-12 text-gray-400 mb-2" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No interviews scheduled</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  There are no interviews scheduled for this date.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default InterviewCalendar;