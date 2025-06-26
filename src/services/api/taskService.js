import taskData from '../mockData/tasks.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demo
let tasks = [...taskData];

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      checklist: taskData.checklist || []
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[index], ...updates };
    // Don't allow Id modification
    delete updatedTask.Id;
    tasks[index] = { ...tasks[index], ...updatedTask };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async updateChecklistItem(taskId, itemId, checked) {
    await delay(200);
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId, 10));
    if (taskIndex === -1) throw new Error('Task not found');
    
    const task = tasks[taskIndex];
    const itemIndex = task.checklist.findIndex(item => item.id === itemId);
    if (itemIndex === -1) throw new Error('Checklist item not found');
    
    task.checklist[itemIndex].checked = checked;
    task.checklist[itemIndex].checkedAt = checked ? new Date().toISOString() : null;
    
    // Check if all items are completed
    const allCompleted = task.checklist.length > 0 && task.checklist.every(item => item.checked);
    if (allCompleted && !task.completed) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
    } else if (!allCompleted && task.completed) {
      task.completed = false;
      task.completedAt = null;
    }
    
    return { ...task };
  },

  async completeTask(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index].completed = true;
    tasks[index].completedAt = new Date().toISOString();
    // Mark all checklist items as completed
    tasks[index].checklist.forEach(item => {
      item.checked = true;
      item.checkedAt = new Date().toISOString();
    });
    
    return { ...tasks[index] };
  },

  async reopenTask(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index].completed = false;
    tasks[index].completedAt = null;
    
    return { ...tasks[index] };
  }
};

export default taskService;