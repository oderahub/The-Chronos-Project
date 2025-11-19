'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ErrorModalProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  const displayMessage = message || 'The Loom is unreachable at the moment. Please try again soon.';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-black/95 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/20 max-w-md w-[90%] p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v2M7 9h10M7 13h10M7 17h10"
                  />
                </svg>
              </motion.div>

              {/* Title */}
              <h2 className="text-xl font-light text-center text-frost/90 mb-3">
                The Loom is Dreaming
              </h2>

              {/* Message */}
              <p className="text-center text-frost/70 font-light text-sm leading-relaxed mb-8">
                {displayMessage}
              </p>

              {/* Subtext */}
              <p className="text-center text-ash/60 font-light text-xs mb-8">
                The archive weaving system is temporarily unavailable. Your memory will be preserved soon.
              </p>

              {/* Action Button */}
              <motion.button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-300 font-light rounded-lg hover:from-emerald-500/30 hover:to-teal-500/30 hover:border-emerald-500 transition-all text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                UNDERSTOOD
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
