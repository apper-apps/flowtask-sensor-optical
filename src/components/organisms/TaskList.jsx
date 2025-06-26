import { motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';

const TaskList = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  onCreateTask,
  showDate = true,
  emptyMessage = "No tasks found",
  emptyDescription = "Create your first task to get started"
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="CheckSquare"
        title={emptyMessage}
        description={emptyDescription}
        actionLabel="Create Task"
        onAction={onCreateTask}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {tasks.map((task) => (
        <motion.div
          key={task.Id}
          variants={itemVariants}
          transition={{ duration: 0.3 }}
        >
          <TaskCard
            task={task}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
            showDate={showDate}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TaskList;