"use client";

import { motion } from "framer-motion";
import PriorityBadge from "./PriorityBadge";
import TagBadge from "./TagBadge";

interface MessageCardProps {
  msg: {
    _id: string;
    channelName?: string;
    createdAt?: string | Date;
    subject?: string;
    body?: string;
    tags?: string[];
    priority?: string;
    [key: string]: unknown;
  };
  onAssign: (id: string) => void;
  index?: number;
}

export default function MessageCard({ msg, onAssign, index = 0 }: MessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className="p-4 bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 rounded-lg flex justify-between transition-colors"
    >
      <div className="space-y-1 flex-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {msg.channelName || "Unknown"} • {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Unknown date"}
        </div>

        <div className="font-semibold text-gray-900 dark:text-white">
          {msg.subject || (msg.body ? msg.body.slice(0, 60) : "No subject")}
        </div>

        <div className="text-gray-700 dark:text-gray-300 text-sm">{msg.body ? msg.body.slice(0, 200) : ""}</div>

        <div className="flex flex-wrap gap-2 pt-2">
          {msg.tags?.map((tag: string) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {msg.priority && <PriorityBadge priority={msg.priority} />}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 ml-4">
        <motion.button
          onClick={() => onAssign(msg._id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded transition-colors"
        >
          Assign
        </motion.button>

        <motion.a
          href={`/message/${msg._id}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 border dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Details
        </motion.a>
      </div>
    </motion.div>
  );
}
