import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const iconVariants = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          variants={iconVariants}
          animate="animate"
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        
        <h1 className="font-display font-bold text-6xl text-surface-900 mb-4">
          404
        </h1>
        
        <h2 className="font-display font-semibold text-2xl text-surface-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            icon="Home"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;