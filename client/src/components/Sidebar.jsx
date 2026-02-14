import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    // Theme toggle Logic - Simplified for this component or passed as props
    // Assuming global theme state or handled in layout.

    return (
        <AnimatePresence>
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r bg-white/80 dark:bg-gray-900/80 transform lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NexusCRM</span>
                    <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X size={20} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : ''}`}
                    >
                        <LayoutDashboard size={20} className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/leads"
                        className={({ isActive }) => `flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : ''}`}
                    >
                        <Users size={20} className="mr-3" />
                        Leads
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : ''}`}
                    >
                        <Settings size={20} className="mr-3" />
                        Settings
                    </NavLink>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default Sidebar;
