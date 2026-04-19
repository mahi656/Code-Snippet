import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Type, AlignLeft } from 'lucide-react';
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full max-w-md rounded-[28px] overflow-hidden border backdrop-blur-xl transition-all duration-300 ${isDark
                ? 'bg-neutral-900/80 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]'
                : 'bg-white border-neutral-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]'
                }`}>
                <div className="flex items-center justify-between px-8 pt-8 pb-6 bg-gradient-to-b from-transparent to-transparent/5">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#d6c7b0]/10 text-[#d6c7b0]' : 'bg-[#efe6d5] text-[#8a7a66]'}`}>
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                New Milestone
                            </h2>
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                {format(selectedDate, "MMMM do, yyyy")}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-all active:scale-90 ${isDark ? 'hover:bg-white/5 text-neutral-500 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                    <div className="space-y-2.5">
                        <label className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] ml-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                            }`}>
                            <Type size={12} className="opacity-70" /> Title
                        </label>
                        <div className="relative group">
                            <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What's the big goal?"
                                className={`w-full h-14 px-5 rounded-[18px] border transition-all duration-200 outline-none font-medium ${isDark
                                    ? 'bg-neutral-950/40 border-white/5 text-white placeholder:text-neutral-500 focus:border-[#d6c7b0]/50 focus:ring-4 focus:ring-[#d6c7b0]/10'
                                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:border-[#d6c7b0]/50 focus:ring-4 focus:ring-[#d6c7b0]/5'
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] ml-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                            }`}>
                            <AlignLeft size={12} className="opacity-70" /> Description
                        </label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add some details..."
                            className={`w-full p-5 rounded-[18px] border transition-all duration-200 outline-none font-medium resize-none ${isDark
                                ? 'bg-neutral-950/40 border-white/5 text-white placeholder:text-neutral-500 focus:border-[#d6c7b0]/50 focus:ring-4 focus:ring-[#d6c7b0]/10'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:border-[#d6c7b0]/50 focus:ring-4 focus:ring-[#d6c7b0]/5'
                                }`}
                        />
                    </div>

                    <div className="pt-2 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 h-13 rounded-[18px] font-bold text-sm transition-all active:scale-95 ${isDark
                                ? 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 h-13 rounded-[18px] font-bold text-sm shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isDark
                                ? 'bg-[#d6c7b0] text-black hover:bg-[#c5b4a0] shadow-[#d6c7b0]/10'
                                : 'bg-[#8a7a66] text-white hover:bg-[#7a6a56] shadow-[#8a7a66]/20'
                                }`}
                        >
                            {isLoading ? 'Creating...' : 'Create Milestone'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMilestoneModal;
