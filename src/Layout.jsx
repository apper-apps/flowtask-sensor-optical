import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-surface-900">FlowTask</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-surface-600" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-50 border-r border-surface-200 flex-col z-40">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-surface-900">FlowTask</h1>
                <p className="text-sm text-surface-500">Visual Task Manager</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                      }
                    `}
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5" />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial="closed"
              animate="open"
              variants={sidebarVariants}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-surface-200 z-50 overflow-y-auto"
            >
              <nav className="p-4">
                <ul className="space-y-2">
                  {routeArray.map((route) => (
                    <li key={route.id}>
                      <NavLink
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
                            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                          }
                        `}
                      >
                        <ApperIcon name={route.icon} className="w-5 h-5" />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}

        {/* Bottom Navigation for Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-50">
          <div className="flex">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-surface-500 hover:text-surface-700'
                  }
                `}
              >
                <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{route.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;