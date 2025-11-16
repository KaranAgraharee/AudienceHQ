// components/AssignModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (userId: string) => void;
}

export default function AssignModal({ open, onClose, onAssign }: AssignModalProps) {
  const [userId, setUserId] = useState("");
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assign message</h3>
            <div className="mt-3">
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="agent userId (e.g. user_1)"
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 border dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={() => {
                  onAssign(userId);
                  onClose();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded transition-colors"
              >
                Assign
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
