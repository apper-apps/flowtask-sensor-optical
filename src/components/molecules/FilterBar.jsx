import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const priorityOptions = [
    { value: 'high', label: 'High', variant: 'high' },
    { value: 'medium', label: 'Medium', variant: 'medium' },
    { value: 'low', label: 'Low', variant: 'low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const handlePriorityToggle = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const handleStatusChange = (status) => {
    onFiltersChange({ ...filters, status });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priority.length > 0) count++;
    if (filters.status !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white border-b border-surface-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            icon="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'text-primary' : ''}
          >
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="primary" size="sm" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-6 py-4">
          {/* Status Filter */}
          <div>
            <h4 className="font-medium text-surface-900 mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${filters.status === option.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="font-medium text-surface-900 mb-3">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePriorityToggle(option.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border-2
                    ${filters.priority.includes(option.value)
                      ? `bg-gradient-to-r from-priority-${option.value}-from to-priority-${option.value}-to text-white border-transparent`
                      : 'bg-white text-surface-700 border-surface-300 hover:border-surface-400'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {filters.priority.includes(option.value) && (
                      <ApperIcon name="Check" className="w-3 h-3" />
                    )}
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;