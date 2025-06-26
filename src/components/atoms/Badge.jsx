import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    high: 'bg-gradient-to-r from-priority-high-from to-priority-high-to text-white',
    medium: 'bg-gradient-to-r from-priority-medium-from to-priority-medium-to text-white',
    low: 'bg-gradient-to-r from-priority-low-from to-priority-low-to text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  const badgeClasses = `
    inline-flex items-center gap-1 font-medium rounded-full
    ${variants[variant]} ${sizes[size]} ${className}
  `;

  return (
    <motion.span
      className={badgeClasses}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3" />}
      {children}
    </motion.span>
  );
};

export default Badge;