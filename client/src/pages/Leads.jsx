import { useState, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List, Download } from 'lucide-react';
import api from '../api/axios';
import LeadTable from '../components/LeadTable';
import KanbanBoard from '../components/KanbanBoard';
import LeadModal from '../components/LeadModal';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

import { useLocation } from 'react-router-dom';

const Leads = () => {
    const location = useLocation();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLead, setCurrentLead] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Initialize filter from navigation state if available
    const [statusFilter, setStatusFilter] = useState(location.state?.status || 'All');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load leads');
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await api.post('/leads', data);
            toast.success('Lead created successfully');
            fetchLeads();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to create lead');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await api.put(`/leads/${currentLead._id}`, data);
            toast.success('Lead updated successfully');
            fetchLeads();
            setIsModalOpen(false);
            setCurrentLead(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update lead');
        }
    };

    const handleStatusChange = async (leadId, newStatus) => {
        // Optimistic update handled by Kanban component visual, but here we do API
        const lead = leads.find(l => l._id === leadId);
        if (lead.status === newStatus) return;

        try {
            await api.put(`/leads/${leadId}`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchLeads(); // Sync with server for history etc
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
            fetchLeads(); // Revert
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await api.delete(`/leads/${id}`);
                toast.success('Lead deleted');
                setLeads(leads.filter(lead => lead._id !== id));
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete lead');
            }
        }
    };

    const handleStar = async (id, isStarred) => {
        try {
            // Optimistic update
            const updatedLeads = leads.map(l => l._id === id ? { ...l, isStarred } : l);
            setLeads(updatedLeads);

            await api.put(`/leads/${id}`, { isStarred });
            toast.success(isStarred ? 'Lead starred' : 'Lead unstarred');
            fetchLeads();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update star');
            fetchLeads(); // Revert
        }
    };

    const exportCSV = () => {
        const csvData = leads.map(lead => ({
            Name: lead.name,
            Email: lead.email,
            Phone: lead.phone,
            Status: lead.status,
            Source: lead.source,
            Notes: lead.notes,
            Date: new Date(lead.createdAt).toLocaleDateString()
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Leads exported to CSV');
    };

    const openEditModal = (lead) => {
        setCurrentLead(lead);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentLead(null);
        setIsModalOpen(true);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leads Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Download size={20} className="mr-2" />
                        Export
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-blue-500/30"
                    >
                        <Plus size={20} className="mr-2" />
                        Add New Lead
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none dark:text-white"
                        >
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                            title="Table View"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                            title="Kanban View"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    {viewMode === 'table' ? (
                        <LeadTable leads={filteredLeads} onEdit={openEditModal} onDelete={handleDelete} onStar={handleStar} />
                    ) : (
                        <KanbanBoard leads={filteredLeads} onStatusChange={handleStatusChange} onEdit={openEditModal} />
                    )}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <LeadModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={currentLead ? handleUpdate : handleCreate}
                        lead={currentLead}
                        isEditing={!!currentLead}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leads;
