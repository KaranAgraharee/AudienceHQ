import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not available");
        }
        const messages = db.collection("messages");

        // ---------- 1️⃣ COUNT BY PRIORITY ----------
        const priorityCount = await messages.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]).toArray();

        // ---------- 2️⃣ COUNT BY TAG ----------
        const tagsCount = await messages.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } }
        ]).toArray();


        // ---------- 3️⃣ AGENT STATS ----------
        const agentStats = await messages.aggregate([
            {
                $group: {
                    _id: "$assignedTo",
                    assigned: { $sum: 1 },
                    resolved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "resolved"] }, 1, 0]
                        }
                    }
                }
            }
        ]).toArray();


        // ---------- 4️⃣ AVERAGE RESPONSE & RESOLUTION TIME ----------
        const responseStats = await messages.aggregate([
            {
                $group: {
                    _id: null,
                    avgResponseTime: { $avg: "$responseTime" },
                    avgResolutionTime: { $avg: "$resolutionTime" }
                }
            }
        ]).toArray();

        const response = responseStats[0] || {
            avgResponseTime: 0,
            avgResolutionTime: 0
        };


        // ---------- 5️⃣ DAILY MESSAGE COUNT ----------
        const dailyMessages = await messages.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();


        return NextResponse.json({
            priorityCount,
            tagsCount,
            agentStats,
            response: {
                avgResponseTime: response.avgResponseTime ?? 0,
                avgResolutionTime: response.avgResolutionTime ?? 0
            },
            dailyMessages
        });

    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }
}
