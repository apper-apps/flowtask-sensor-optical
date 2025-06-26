import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  icon = 'Package',
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  className = ''
}) => {
  const iconVariants = {
    animate: {
      y: [0, -10, 0]
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        variants={iconVariants}
        animate="animate"
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      
      <h3 className="font-display font-semibold text-xl text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button onClick={onAction} icon="Plus">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;