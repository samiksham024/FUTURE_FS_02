import { useState } from 'react'; // Add useState
import { X, Clock, CheckCircle, AlertCircle, Mail, FileText, Send } from 'lucide-react'; // Add icons


const LeadModal = ({ isOpen, onClose, onSubmit, lead, isEditing }) => {
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'email'

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const subject = formData.get('subject');

        // Construct history entry
        const historyEntry = {
            text: `Sent Email: ${subject}`,
            date: new Date()
        };

        // Submit only index/history
        onSubmit({ history: historyEntry });
        // Optional: Close or switch tab? Let's switch back to details or stay.
        e.target.reset();
        setActiveTab('details');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-lg font-semibold dark:text-white flex items-center">
                        {isEditing ? `Edit ${lead.name}` : 'Add New Lead'}
                        {isEditing && <span className={`ml-3 px-2 py-0.5 text-xs rounded-full border ${lead.status === 'Converted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{lead.status}</span>}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                {isEditing && (
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <FileText size={16} className="mr-2" /> Details
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${activeTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Mail size={16} className="mr-2" /> Send Email
                        </button>
                    </div>
                )}

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Form Section */}
                    {activeTab === 'details' ? (
                        <div className="flex-1 p-6 overflow-y-auto">
                            <form id="leadForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input
                                        name="name"
                                        defaultValue={lead?.name}
                                        required
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={lead?.email}
                                        required
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                        <input
                                            name="phone"
                                            defaultValue={lead?.phone}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                        <select
                                            name="status"
                                            defaultValue={lead?.status || 'New'}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Converted">Converted</option>
                                            <option value="Lost">Lost</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                    <textarea
                                        name="notes"
                                        defaultValue={lead?.notes}
                                        rows="4"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 p-6 overflow-y-auto">
                            <form id="emailForm" onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200">
                                    <p>Sending email to: <strong>{lead?.email}</strong></p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                    <input
                                        name="subject"
                                        required
                                        placeholder="e.g. Follow up on your request"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        rows="8"
                                        required
                                        placeholder="Write your email content here..."
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* History Section (Only show when editing) */}
                    {isEditing && lead?.history && (
                        <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-800/50 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto hidden md:block">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Clock size={16} className="mr-2" /> Activity Timeline
                            </h3>
                            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:w-px before:h-full before:bg-gray-200 dark:before:bg-gray-700">
                                {lead.history.slice().reverse().map((item, idx) => (
                                    <div key={idx} className="relative pl-8 animate-fadeIn">
                                        <div className={`absolute top-1 left-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 z-10 ${item.text.startsWith('Sent Email') ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                                {new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {lead.history.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No activity recorded yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    {activeTab === 'details' ? (
                        <button
                            type="submit"
                            form="leadForm"
                            className="px-6 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            {isEditing ? 'Save Changes' : 'Create Lead'}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            form="emailForm"
                            className="px-6 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all flex items-center"
                        >
                            <Send size={16} className="mr-2" /> Send Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
