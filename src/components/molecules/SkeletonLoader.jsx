import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmerVariants = {
    animate: {
      x: [-100, 100],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-surface-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="relative overflow-hidden mb-3">
            <div className="h-6 bg-surface-200 rounded-lg w-3/4"></div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden">
              <div className="h-6 bg-surface-200 rounded-full w-16"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </div>
            
            <div className="relative overflow-hidden">
              <div className="h-4 bg-surface-200 rounded w-24"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-200">
      <div className="w-5 h-5 bg-surface-200 rounded"></div>
      <div className="flex-1">
        <div className="relative overflow-hidden mb-2">
          <div className="h-4 bg-surface-200 rounded w-3/4"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="h-3 bg-surface-200 rounded w-1/2"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </div>
      </div>
    </div>
  );

  const SkeletonComponent = type === 'card' ? CardSkeleton : ListSkeleton;

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;