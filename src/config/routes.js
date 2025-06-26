import Dashboard from '@/components/pages/Dashboard';
import Tasks from '@/components/pages/Tasks';
import CalendarView from '@/components/pages/CalendarView';
import Completed from '@/components/pages/Completed';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarView
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle2',
    component: Completed
  }
};

export const routeArray = Object.values(routes);
export default routes;