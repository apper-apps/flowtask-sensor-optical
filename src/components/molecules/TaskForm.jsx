import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parse } from 'date-fns';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  // Utility function to format datetime for display
  const formatDateTimeForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    dueDate: formatDateTimeForDisplay(initialData?.dueDate),
    priority: initialData?.priority || 'medium',
    checklist: initialData?.checklist || []
  });
  
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        checklist: formData.checklist.map(item => ({
          ...item,
          id: item.id || `cl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }))
      };
      
      await onSubmit(taskData);
    } finally {
      setLoading(false);
    }
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [
          ...prev.checklist,
          {
            id: `cl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: newChecklistItem.trim(),
            checked: false,
            checkedAt: null
          }
        ]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'from-priority-low-from to-priority-low-to' },
    { value: 'medium', label: 'Medium', color: 'from-priority-medium-from to-priority-medium-to' },
    { value: 'high', label: 'High', color: 'from-priority-high-from to-priority-high-to' }
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        error={errors.title}
        icon="FileText"
        required
      />

<div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Due Date & Time
          <span className="text-xs text-surface-500 ml-1">(Select date and time)</span>
        </label>
        <Input
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          error={errors.dueDate}
          icon="Calendar"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">
          Priority Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
              className={`
                p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${formData.priority === option.value
                  ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg`
                  : 'bg-white text-surface-700 border-surface-300 hover:border-surface-400'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">
          Checklist Items
        </label>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add checklist item"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addChecklistItem}
            disabled={!newChecklistItem.trim()}
            icon="Plus"
            variant="secondary"
          >
            Add
          </Button>
        </div>

        {formData.checklist.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {formData.checklist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
              >
                <span className="text-sm text-surface-700">{item.text}</span>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

export default TaskForm;