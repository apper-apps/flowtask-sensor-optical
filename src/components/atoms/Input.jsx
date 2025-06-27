import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  // Utility functions for 12-hour format conversion
  const formatTo12Hour = (dateTimeValue) => {
    if (!dateTimeValue || type !== 'datetime-local') return dateTimeValue;
    
    try {
      const date = new Date(dateTimeValue);
      if (isNaN(date.getTime())) return dateTimeValue;
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const displayHours = String(hours).padStart(2, '0');
      
      return `${year}-${month}-${day}T${displayHours}:${minutes} ${ampm}`;
    } catch {
      return dateTimeValue;
    }
  };

  const parseFrom12Hour = (displayValue) => {
    if (!displayValue || type !== 'datetime-local') return displayValue;
    
    try {
      const match = displayValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return displayValue;
      
      const [, year, month, day, hours, minutes, ampm] = match;
      let hour24 = parseInt(hours, 10);
      
      if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      return `${year}-${month}-${day}T${String(hour24).padStart(2, '0')}:${minutes}`;
    } catch {
      return displayValue;
    }
  };

  const handleInputChange = (e) => {
    if (type === 'datetime-local') {
      const parsed24Hour = parseFrom12Hour(e.target.value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: parsed24Hour
        }
      };
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  const displayValue = type === 'datetime-local' ? formatTo12Hour(value) : (value || '');

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 transition-colors ${
                focused ? 'text-primary' : 'text-surface-400'
              }`} 
            />
          </div>
        )}
        
<input
          type={type === 'datetime-local' ? 'text' : type}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 text-surface-900 bg-white border rounded-xl
            transition-all duration-200 focus:outline-none focus:ring-2
            ${icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : focused 
                ? 'border-primary focus:border-primary focus:ring-primary/20'
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-50 cursor-not-allowed' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: focused || hasValue ? '0.5rem' : '50%',
              fontSize: focused || hasValue ? '0.75rem' : '1rem',
              color: error ? '#DC2626' : focused ? '#6366F1' : '#6B7280'
            }}
            transition={{ duration: 0.2 }}
            className={`
              absolute left-4 transform -translate-y-1/2 bg-white px-2 pointer-events-none
              ${icon ? 'left-12' : 'left-4'}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;