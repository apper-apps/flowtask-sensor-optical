import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday 
} from 'date-fns';
import taskService from '@/services/api/taskService';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import TaskModal from '@/components/organisms/TaskModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      // Set the selected date as the due date if creating from calendar
      const newTaskData = {
        ...taskData,
        dueDate: selectedDate ? selectedDate.toISOString() : taskData.dueDate
      };
      
      const newTask = await taskService.create(newTaskData);
      setTasks(prev => [...prev, newTask]);
      setShowTaskModal(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowTaskModal(true);
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = [];
  let day = startDate;
  
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded-lg w-64 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadTasks}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
              Calendar View
            </h1>
            <p className="text-surface-600">
              Visualize your tasks across time
            </p>
          </div>
          
          <Button
            onClick={() => setShowTaskModal(true)}
            icon="Plus"
            className="shadow-lg"
          >
            Add Task
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-2xl text-surface-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateMonth('prev')}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateMonth('next')}
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-surface-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-surface-700 bg-surface-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = isSameDay(day, selectedDate);
                const isDayToday = isToday(day);
                
                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      min-h-[120px] p-2 border-r border-b border-surface-200 cursor-pointer
                      transition-all duration-200 hover:bg-surface-50
                      ${!isCurrentMonth ? 'bg-surface-25 text-surface-400' : 'bg-white'}
                      ${isSelected ? 'bg-primary/5 border-primary' : ''}
                      ${isDayToday ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`
                        text-sm font-medium
                        ${isDayToday ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}
                        ${isSelected ? 'text-primary font-bold' : ''}
                      `}>
                        {format(day, 'd')}
                      </span>
                      
                      {dayTasks.length > 0 && (
                        <Badge variant="primary" size="sm">
                          {dayTasks.length}
                        </Badge>
                      )}
                    </div>

                    {/* Task Dots */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.Id}
                          className={`
                            w-full h-2 rounded-full ${getPriorityColor(task.priority)}
                            ${task.completed ? 'opacity-50' : ''}
                          `}
                          title={task.title}
                        />
                      ))}
                      
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-surface-500 text-center">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Hover Preview */}
                    {hoveredDate && isSameDay(hoveredDate, day) && dayTasks.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 bg-white border border-surface-300 rounded-lg shadow-lg p-3 mt-2 min-w-48"
                      >
                        <h4 className="font-semibold text-sm mb-2">
                          {format(day, 'MMM d')} Tasks
                        </h4>
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task) => (
                            <div key={task.Id} className="text-xs text-surface-600">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getPriorityColor(task.priority)}`} />
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-surface-500">
                              +{dayTasks.length - 3} more tasks
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ))}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskCreate}
      />
    </div>
  );
};

export default CalendarView;