import React from 'react';
import {
  Heart,
  Trash2,
  Code,
  Calendar,
  Tag,
  RotateCcw,
  Edit3,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../ui/Notification.jsx';
import { motion } from 'framer-motion';

const SnippetCard = ({ snippet, onFavorite, onDelete, onEdit, onHistory, onRestore, isDark, view }) => {
  const formattedDate = format(new Date(snippet.createdAt), 'MMM dd, yyyy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group relative bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#1e1e20] rounded-[24px] p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Top Bar: Language & Actions */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-600/20">
            <Code className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-[#52525b]">
              Language
            </span>
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {snippet.language}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 transition-all duration-300">
          {view !== "Trash" && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(snippet._id, !snippet.isFavorite); }}
              className={`p-2.5 rounded-xl transition-all duration-200 ${snippet.isFavorite ? 'text-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : 'text-gray-400 dark:text-gray-500 hover:text-rose-500 bg-gray-50/50 dark:bg-[#111113] border border-gray-100 dark:border-[#27272a] hover:bg-rose-50/50 dark:hover:bg-rose-900/10'}`}
              title="Favorite"
            >
              <Heart className={`h-4.5 w-4.5 ${snippet.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {view === "Trash" && (
            <button
              onClick={(e) => { e.stopPropagation(); onRestore && onRestore(snippet._id); }}
              className="p-2.5 rounded-xl text-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 transition-all duration-200"
              title="Restore Snippet"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          )}

          {view !== "Trash" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(snippet); }}
                className="p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-500 bg-gray-50/50 dark:bg-[#111113] border border-gray-100 dark:border-[#27272a] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200"
                title="Edit Snippet"
              >
                <Edit3 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onHistory && onHistory(snippet._id); }}
                className="p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:text-amber-500 bg-gray-50/50 dark:bg-[#111113] border border-gray-100 dark:border-[#27272a] hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all duration-200"
                title="Version History"
              >
                <History className="h-4.5 w-4.5" />
              </button>
            </>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(snippet._id); }}
            className="p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:text-red-500 bg-gray-50/50 dark:bg-[#111113] border border-gray-100 dark:border-[#27272a] hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all duration-200"
            title={view === "Trash" ? "Permanently Delete" : "Move to Trash"}
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-[19px] font-bold text-gray-900 dark:text-white line-clamp-1 tracking-tight">
          {snippet.title}
        </h3>
        <p className="text-[14px] text-gray-500 dark:text-[#a1a1aa] line-clamp-2 min-h-[42px] leading-relaxed">
          {snippet.description || "No description provided. Click to view full details and code."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-5 border-t border-gray-100 dark:border-[#1e1e20] flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 dark:text-[#52525b]">
          <Calendar className="h-4 w-4" />
          <span className="text-[12px] font-semibold">{formattedDate}</span>
        </div>

        <div className="flex gap-2">
          {snippet.tags?.slice(0, 2).map((tag, i) => (
            <div
              key={i}
              className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-[#111113] border border-gray-100 dark:border-[#27272a] text-[11px] font-bold text-gray-600 dark:text-gray-400"
            >
              #{tag}
            </div>
          ))}
          {snippet.tags?.length > 2 && (
            <div className="px-2.5 py-1 rounded-lg bg-[#7c3aed] text-[10px] font-black text-white shadow-[0_4px_10px_rgba(124,58,237,0.3)]">
              +{snippet.tags.length - 2}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SnippetCard;
