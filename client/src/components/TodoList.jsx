import { useState, useEffect } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const TodoList = () => {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('dashboard_todos');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: 'Follow up with new leads', completed: false },
            { id: 2, text: 'Review monthly report', completed: true }
        ];
    });
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        localStorage.setItem('dashboard_todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newItem, completed: false }]);
        setNewItem('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center justify-between">
                My Tasks
                <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {todos.filter(t => !t.completed).length} pending
                </span>
            </h2>

            <form onSubmit={addTodo} className="mb-4 relative">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white text-sm"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1"
                >
                    <Plus size={18} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-64">
                <AnimatePresence initial={false}>
                    {todos.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 text-sm">No tasks yet. Enjoy your day!</div>
                    ) : (
                        todos.map(todo => (
                            <div
                                key={todo.id}
                                className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <button
                                        onClick={() => toggleTodo(todo.id)}
                                        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {todo.completed && <Check size={12} />}
                                    </button>
                                    <span className={`text-sm truncate ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                        {todo.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TodoList;
