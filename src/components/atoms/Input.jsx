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
          type={type}
          value={value || ''}
          onChange={onChange}
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