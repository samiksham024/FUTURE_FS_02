import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar, isDark, toggleTheme }) => {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New lead "John Smith" assigned to you.', time: '2 min ago', read: false },
        { id: 2, text: 'Weekly report is ready to download.', time: '1 hour ago', read: false },
        { id: 3, text: 'Welcome to NexusCRM!', time: '1 day ago', read: true }
    ]);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllread = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <header className="h-16 glass z-40 sticky top-0 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="p-2 mr-4 lg:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
                    Hello, {user?.name || 'Admin'}
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
                    >
                        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                    <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllread} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                            No notifications
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative group ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                >
                                                    <div className="pr-6">
                                                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                            {notification.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                    </div>
                                                    {!notification.read && (
                                                        <span className="absolute top-4 right-4 text-blue-500">
                                                            ●
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => deleteNotification(notification.id, e)}
                                                        className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-gray-800">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
