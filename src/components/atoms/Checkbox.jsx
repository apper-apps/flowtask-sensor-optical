import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const checkboxVariants = {
    checked: {
      backgroundColor: '#6366F1',
      borderColor: '#6366F1',
      scale: 1
    },
    unchecked: {
      backgroundColor: '#ffffff',
      borderColor: '#D1D5DB',
      scale: 1
    },
    hover: {
      scale: 1.1
    }
  };

  const checkmarkVariants = {
    checked: {
      pathLength: 1,
      opacity: 1
    },
    unchecked: {
      pathLength: 0,
      opacity: 0
    }
  };

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <motion.div
          className={`
            ${sizes[size]} border-2 rounded-md flex items-center justify-center
            transition-colors duration-200
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          variants={checkboxVariants}
          animate={checked ? 'checked' : 'unchecked'}
          whileHover={!disabled ? 'hover' : ''}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.svg
            className="w-3 h-3 text-white"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M2 8L6 12L14 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
              animate={checked ? 'checked' : 'unchecked'}
              transition={{ duration: 0.2 }}
            />
          </motion.svg>
        </motion.div>
        
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
      </div>
      
      {label && (
        <span className={`text-sm font-medium ${checked ? 'line-through text-surface-500' : 'text-surface-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;