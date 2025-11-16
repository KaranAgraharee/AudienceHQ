"use client";

import useSWR from "swr";
import { useContext } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { ThemeContext } from "@/components/ThemeProvider";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea"];

export default function AnalyticsPage() {
    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.theme === "dark";
    
    const { data, error } = useSWR("/api/analytics", fetcher, {
        refreshInterval: 3000,
    });

    // Chart styling based on theme
    const axisColor = isDark ? "#9ca3af" : "#374151";
    const gridColor = isDark ? "#374151" : "#e5e7eb";
    const textColor = isDark ? "#f3f4f6" : "#111827";

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

    if (!data) return <div className="p-6 text-gray-900 dark:text-white">Loading analytics...</div>;
    
    if (error || data.error) {
        return (
            <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {data?.error || "Failed to load analytics data"}
            </div>
        </div>
        );
    }

    // Ensure all required properties exist with defaults
    const priorityCount = data.priorityCount || [];
    const tagsCount = data.tagsCount || [];
    const agentStats = data.agentStats || [];
    const dailyMessages = data.dailyMessages || [];
    const response = data.response || { avgResponseTime: 0, avgResolutionTime: 0 };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 space-y-10"
        >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</motion.h1>

            {/* Priority Breakdown */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg transition-colors"
            >
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Messages by Priority</h2>
                <BarChart width={600} height={300} data={priorityCount}>
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
            </motion.div>

            {/* Tags Breakdown */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg transition-colors"
            >
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Messages by Tags</h2>
                <PieChart width={500} height={300}>
                    <Pie
                        data={tagsCount}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={true}
                    >
                        {tagsCount.map((_: { _id: string; count: number }, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                            color: textColor
                        }}
                        labelStyle={{ color: textColor }}
                    />
                </PieChart>
            </motion.div>
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg transition-colors"
            >
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Agent Performance</h2>
                <BarChart width={600} height={300} data={agentStats}>
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
                    <Bar dataKey="assigned" fill="#2563eb" name="Assigned" />
                    <Bar dataKey="resolved" fill="#16a34a" name="Resolved" />
                </BarChart>
            </motion.div>
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg transition-colors"
            >
                <h2 className="text-xl font-semibold mb-3 text-gray-500 dark:text-white">Response Times</h2>
                <LineChart width={600} height={300} data={[
                    {
                        type: "avg response time",
                        value: response.avgResponseTime / 1000 / 60
                    },
                    {
                        type: "avg resolution time",
                        value: response.avgResolutionTime / 1000 / 60
                    }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="type" stroke={axisColor} tick={{ fill: textColor }} />
                    <YAxis stroke={axisColor} tick={{ fill: textColor }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                            color: textColor
                        }}
                        labelStyle={{ color: textColor }}
                    />
                    <Line dataKey="value" stroke="#dc2626" />
                </LineChart>
            </motion.div>

            {/* Daily Messages */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg transition-colors"
            >
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Daily Message Volume</h2>
                <LineChart width={700} height={300} data={dailyMessages}>
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
                    <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
            </motion.div>
        </motion.div>
    );
}
