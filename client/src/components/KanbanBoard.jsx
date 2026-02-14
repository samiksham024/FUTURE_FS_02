import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { MoreVertical, Phone, Mail, Clock } from 'lucide-react';

const KanbanBoard = ({ leads, onStatusChange, onEdit }) => {
    const [columns, setColumns] = useState({
        'New': [],
        'Contacted': [],
        'Converted': [],
        'Lost': []
    });

    useEffect(() => {
        const newColumns = {
            'New': leads.filter(l => l.status === 'New'),
            'Contacted': leads.filter(l => l.status === 'Contacted'),
            'Converted': leads.filter(l => l.status === 'Converted'),
            'Lost': leads.filter(l => l.status === 'Lost'),
        };
        setColumns(newColumns);
    }, [leads]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic UI Update
        const sourceCol = [...columns[source.droppableId]];
        const destCol = [...columns[destination.droppableId]];
        const [movedItem] = sourceCol.splice(source.index, 1);

        // Update item status locally
        const updatedItem = { ...movedItem, status: destination.droppableId };
        destCol.splice(destination.index, 0, updatedItem);

        const newColumns = {
            ...columns,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol
        };

        setColumns(newColumns);

        // Trigger generic status change
        onStatusChange(draggableId, destination.droppableId);
    };

    const getColumnColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
            case 'Contacted': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800';
            case 'Converted': return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800';
            case 'Lost': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
            default: return 'bg-gray-50';
        }
    };

    const getTitleColor = (status) => {
        switch (status) {
            case 'New': return 'text-blue-700 dark:text-blue-300';
            case 'Contacted': return 'text-yellow-700 dark:text-yellow-300';
            case 'Converted': return 'text-green-700 dark:text-green-300';
            case 'Lost': return 'text-red-700 dark:text-red-300';
            default: return 'text-gray-700';
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 h-[calc(100vh-240px)] min-h-[500px]">
                {Object.keys(columns).map(status => (
                    <div key={status} className={`flex-1 min-w-[300px] rounded-xl border ${getColumnColor(status)} flex flex-col max-h-full`}>
                        <div className={`p-4 font-semibold flex justify-between items-center ${getTitleColor(status)} border-b border-gray-200 dark:border-gray-700/50`}>
                            <span>{status}</span>
                            <span className="bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md text-xs">
                                {columns[status].length}
                            </span>
                        </div>

                        <Droppable droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`p-3 flex-1 overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                >
                                    {columns[status].map((lead, index) => (
                                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => onEdit(lead)}
                                                    className="group cursor-grab active:cursor-grabbing"
                                                    style={{ ...provided.draggableProps.style }}
                                                >
                                                    <motion.div
                                                        layoutId={lead._id}
                                                        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative ${snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-blue-500/50' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium text-gray-900 dark:text-white truncate pr-6">{lead.name}</h4>
                                                            {/* <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-opacity absolute top-2 right-2">
                                                                <MoreVertical size={16} className="text-gray-400" />
                                                            </button> */}
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                                <Mail size={12} className="mr-1.5" />
                                                                <span className="truncate">{lead.email}</span>
                                                            </div>
                                                            {lead.phone && (
                                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                                    <Phone size={12} className="mr-1.5" />
                                                                    <span>{lead.phone}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                                                <Clock size={12} className="mr-1.5" />
                                                                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
