import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import taskService from '@/services/api/taskService';
import { toast } from 'react-toastify';

const TaskCard = ({ task, onUpdate, onDelete, showDate = true }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const priorityConfig = {
    high: { variant: 'high', icon: 'AlertTriangle' },
    medium: { variant: 'medium', icon: 'Clock' },
    low: { variant: 'low', icon: 'ArrowDown' }
  };

  const completedItems = task.checklist?.filter(item => item.checked).length || 0;
  const totalItems = task.checklist?.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleChecklistToggle = async (itemId, checked) => {
    setLoading(true);
    try {
      const updatedTask = await taskService.updateChecklistItem(task.Id, itemId, checked);
      onUpdate(updatedTask);
      
      if (updatedTask.completed) {
        toast.success('🎉 Task completed!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to update checklist item');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskService.completeTask(task.Id);
      onUpdate(updatedTask);
      toast.success('🎉 Task completed!');
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await taskService.delete(task.Id);
        onDelete(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }
  };

  const checklistVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 }
  };

  return (
    <motion.div
      className={`
        bg-white rounded-2xl p-6 shadow-md border border-surface-200
        ${task.completed ? 'opacity-75' : ''}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!task.completed ? "hover" : ""}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-semibold text-lg mb-2 ${task.completed ? 'line-through text-surface-500' : 'text-surface-900'}`}>
            {task.title}
          </h3>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant={priorityConfig[task.priority].variant}
              icon={priorityConfig[task.priority].icon}
              size="sm"
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {showDate && (
              <div className="flex items-center gap-1 text-sm text-surface-600">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                {format(new Date(task.dueDate), 'MMM d, h:mm a')}
              </div>
            )}
            
            {totalItems > 0 && (
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span>{completedItems}/{totalItems}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {totalItems > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={expanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setExpanded(!expanded)}
              disabled={loading}
            />
          )}
          
          {!task.completed && (
            <Button
              variant="ghost"
              size="sm"
              icon="Check"
              onClick={handleCompleteTask}
              disabled={loading}
              className="text-green-600 hover:text-green-700"
            />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDeleteTask}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && totalItems > 0 && (
          <motion.div
            variants={checklistVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-200 pt-4 space-y-3">
              {task.checklist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                    label={item.text}
                    disabled={loading}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;