import React, { useState, useEffect } from 'react';
import {
  History,
  X,
  Clock,
  ChevronRight,
  RotateCcw,
  FileCode,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import api from '../../api/api';
import { toast } from '../ui/Notification.jsx';
import Editor from '@monaco-editor/react';

const VersionHistory = ({ snippetId, isOpen, onClose, onRestore, isDark }) => {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (isOpen && snippetId) {
      fetchVersions();
    }
  }, [isOpen, snippetId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/versions/snippets/${snippetId}`);
      if (response.data && response.data.data) {
        setVersions(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedVersion(response.data.data[0]);
        }
      }
    } catch (err) {
      toast("Failed to load versions", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (version) => {
    try {
      // Logic: Restore updates the current snippet's code with the version's code
      // We pass the code back to the dashboard to refresh state
      onRestore(version.code);
      toast("Version restored successfully", "success");
      onClose();
    } catch (err) {
      toast("Failed to restore version", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Side Panel Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-xl h-full bg-slate-50 dark:bg-[#0c0c0e] border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg">
                  <History className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">Version History</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Full audit trail for this snippet</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 relative scrollbar-hide">
              {/* Vertical Timeline Line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-zinc-900 animate-pulse border border-slate-200 dark:border-zinc-800" />
                  ))}
                </div>
              ) : versions.length > 0 ? (
                <div className="space-y-1">
                  {versions.map((version, index) => (
                    <div key={version._id} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute left-[5px] top-[14px] w-2.5 h-2.5 rounded-full border-2 z-10 hidden sm:block ${selectedVersion?._id === version._id ? 'bg-violet-600 border-white dark:border-[#0c0c0e]' : 'bg-slate-200 dark:bg-zinc-800 border-white dark:border-[#0c0c0e]'}`} />

                      <div
                        className={`ml-0 sm:ml-8 mb-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${selectedVersion?._id === version._id
                          ? 'bg-white dark:bg-[#121214] border-violet-500/30 ring-1 ring-violet-500/10 shadow-md'
                          : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-white/5'}`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${index === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                              {index === 0 ? "CURRENT" : index === versions.length - 1 ? "ORIGINAL" : `VERSION ${versions.length - index}`}
                            </span>
                            <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                              {format(new Date(version.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                            {format(new Date(version.createdAt), 'HH:mm')}
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5 text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                          <MessageSquare className="h-3.5 w-3.5 mt-1 shrink-0 text-slate-400" />
                          <p className="line-clamp-2 italic">{version.changeNote || "Standard update"}</p>
                        </div>

                        {selectedVersion?._id === version._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50 space-y-4"
                          >
                            <div className="h-72 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 bg-[#1e1e1e]">
                              <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                value={version.code}
                                options={{
                                  readOnly: true,
                                  minimap: { enabled: false },
                                  fontSize: 12,
                                  lineHeight: 18,
                                  fontFamily: "'JetBrains Mono', monospace",
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                  renderLineHighlight: 'none',
                                  padding: { top: 12, bottom: 12 }
                                }}
                              />
                            </div>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleRestore(version); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] shadow-lg shadow-black/10"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Restore to this state
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 px-10">
                  <div className="p-4 bg-slate-100 dark:bg-zinc-900 rounded-2xl mb-4 border border-slate-200 dark:border-zinc-800">
                    <History className="h-10 w-10 text-slate-300 dark:text-zinc-700" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Initialize History</h3>
                  <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed italic">Changes will appear as a connected timeline. Start editing to track your progress.</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VersionHistory;
