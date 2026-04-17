import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

let toastListeners = [];

export const toast = (message, type = 'success') => {
  const id = Math.random().toString(36).substring(2, 9);
  toastListeners.forEach((listener) => listener({ id, message, type }));
};

const TOAST_DURATION = 4000;

export const Notification = () => {
  const [toasts, setToasts] = useState([]);
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup', '/qr-login', '/qr-verify'].includes(location.pathname);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleToast = ({ id, message, type }) => {
      setToasts((prev) => [{ id, message, type }, ...prev].slice(0, 3));
      setTimeout(() => removeToast(id), TOAST_DURATION);
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleToast);
    };
  }, [removeToast]);

  return (
    <div className={`fixed right-8 z-[99999] flex flex-col items-end gap-3 pointer-events-none transition-all duration-500 ${isAuthPage ? 'top-8 flex-col' : 'bottom-8 flex-col-reverse'
      }`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((t, index) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: isAuthPage ? -20 : 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1 - index * 0.05,
              zIndex: 100 - index,
              filter: 'blur(0px)'
            }}
            exit={{ opacity: 0, scale: 0.9, y: isAuthPage ? -20 : 20, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className={`
              group relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 min-w-[280px]
              bg-zinc-900/80 backdrop-blur-2xl border-white/10
            `}>
              {/* Type Indicator Dot */}
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_2px_rgba(0,0,0,0.2)] ${t.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-red-500 shadow-red-500/40'
                }`} />

              <p className="text-[13px] font-medium text-zinc-100 tracking-tight flex-1">
                {t.message}
              </p>

              <button
                onClick={() => removeToast(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-all"
              >
                <X size={14} />
              </button>

              {/* Minimal Progress Line */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
                className={`absolute bottom-[2px] left-6 right-6 h-[1px] rounded-full opacity-20 ${t.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
