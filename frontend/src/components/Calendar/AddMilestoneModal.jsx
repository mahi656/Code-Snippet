import React, { useState } from 'react';
import { X, Calendar, Type, AlignLeft } from 'lucide-react';
import { Button } from '../ui/button';
import calendarApi from '../../api/calendarApi';
import { format } from 'date-fns';

const AddMilestoneModal = ({ isOpen, onClose, selectedDate, onSave, isDark }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            const response = await calendarApi.createEvent({
                title,
                description,
                date: selectedDate
            });
            onSave(response.data.data.event);
            setTitle('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Error creating milestone:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-[32px] overflow-hidden border ${isDark ? 'bg-neutral-900 border-neutral-800 shadow-2xl shadow-black/50' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/50'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">New Milestone</h2>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                            {format(selectedDate, "MMMM do, yyyy")}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                            <Type size={14} /> Title
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Complete UI Redesign"
                            className="w-full h-12 px-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What are the key goals for today?"
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="ghost"
                            className="flex-1 h-12 rounded-2xl font-black text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 h-12 rounded-2xl font-black text-sm shadow-xl transition-all ${isDark ? 'bg-white text-black hover:bg-gray-100 shadow-white/5' : 'bg-black text-white hover:bg-gray-800 shadow-black/10'}`}
                        >
                            {isLoading ? 'Creating...' : 'Create Milestone'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMilestoneModal;
