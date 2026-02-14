import { Edit, Trash2, Phone, Mail, MoreVertical, Star, Trophy } from 'lucide-react';


const LeadTable = ({ leads, onEdit, onDelete, onStar }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Contacted': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Converted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'Lost': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        if (score >= 50) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    };

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <table className="w-full whitespace-nowrap">
                <thead>
                    <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <th className="px-6 py-4 w-12"></th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4">Contact Info</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {leads.map((lead) => (
                        <tr
                            key={lead._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onStar && onStar(lead._id, !lead.isStarred)}
                                    className={`focus:outline-none transition-transform active:scale-90 ${lead.isStarred ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'}`}
                                >
                                    <Star size={18} fill={lead.isStarred ? "currentColor" : "none"} />
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(lead.score || 0)}`}>
                                    <Trophy size={12} className="mr-1" />
                                    {lead.score || 0}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center mb-1">
                                        <Mail size={14} className="mr-2" />
                                        {lead.email}
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-2" />
                                        {lead.phone || 'N/A'}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {lead.source}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(lead.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => onEdit(lead)}
                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(lead._id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {leads.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-gray-500">
                                No leads found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LeadTable;
