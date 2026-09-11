import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item?',
  itemName,
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  isDanger = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-border flex flex-col relative scale-100 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center flex flex-col items-center">
          {/* Alert Icon */}
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-sm">
            {isDanger ? <Trash2 className="w-7 h-7 animate-pulse" /> : <AlertTriangle className="w-7 h-7" />}
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            {title}
          </h3>

          {itemName && (
            <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 max-w-full truncate">
              {itemName}
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-dark-border text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
