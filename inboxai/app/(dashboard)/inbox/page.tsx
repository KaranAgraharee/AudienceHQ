"use client";

import useSWR from "swr";
import { useState, useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MessageCard from "@/components/MessageCard";
import AssignModal from "@/components/AssignModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "@/components/ThemeProvider";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardOverview() {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === "dark";
  
  const { data: messagesData, mutate } = useSWR("/api/messages?limit=10", fetcher, {
    refreshInterval: 2000,
  });
  const { data: analyticsData } = useSWR("/api/analytics", fetcher, {
    refreshInterval: 5000,
  });

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Chart styling based on theme
  const axisColor = isDark ? "#9ca3af" : "#374151";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#f3f4f6" : "#111827";

  const openAssign = (id: string) => {
    setSelectedMessage(id);
    setAssignOpen(true);
  };

  const assignUser = async (userId: string) => {
    if (!selectedMessage) return;
    await fetch(`/api/messages/${selectedMessage}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    mutate();
    setAssignOpen(false);
  };

  // Calculate stats
  interface Message {
    _id: string;
    status?: string;
    priority?: string;
  }

  const totalMessages = messagesData?.messages?.length || 0;
  const openMessages = messagesData?.messages?.filter((m: Message) => m.status === "OPEN").length || 0;
  const inProgressMessages = messagesData?.messages?.filter((m: Message) => m.status === "IN_PROGRESS").length || 0;
  const resolvedMessages = messagesData?.messages?.filter((m: Message) => m.status === "RESOLVED").length || 0;

  const highPriorityCount = messagesData?.messages?.filter((m: Message) => m.priority === "HIGH" || m.priority === "URGENT").length || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/analytics"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            View Full Analytics
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
              <motion.p
                key={totalMessages}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mt-2"
              >
                {totalMessages}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <motion.p
                key={openMessages}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2"
              >
                {openMessages}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <motion.p
                key={inProgressMessages}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2"
              >
                {inProgressMessages}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <motion.p
                key={resolvedMessages}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2"
              >
                {resolvedMessages}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        {analyticsData?.priorityCount && (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Messages by Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.priorityCount}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="_id" stroke={axisColor} tick={{ fill: textColor }} />
                <YAxis stroke={axisColor} tick={{ fill: textColor }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                    color: textColor
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* High Priority Alert */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Priority Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-300">High Priority Messages</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Requires immediate attention</p>
              </div>
              <motion.div
                key={highPriorityCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-red-600 dark:text-red-400"
              >
                {highPriorityCount}
              </motion.div>
            </div>
            {analyticsData?.tagsCount && analyticsData.tagsCount.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Top Tags</p>
                <div className="flex flex-wrap gap-2">
                  {analyticsData.tagsCount.slice(0, 5).map((tag: { _id: string; count: number }) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {tag._id} ({tag.count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Messages */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors"
      >
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Messages</h2>
          <Link
            href="/inbox"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="p-6">
          {!messagesData?.messages?.length ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>No messages yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messagesData.messages.slice(0, 5).map((msg: Message & Record<string, unknown>, index: number) => (
                <MessageCard key={msg._id} msg={msg} onAssign={openAssign} index={index} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssign={assignUser}
      />
    </motion.div>
  );
}
