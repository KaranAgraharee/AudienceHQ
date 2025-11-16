import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET() {
  try {
    await connectDB();

    const agentStats = await Message.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          assigned: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          },
          avgResolutionTime: { $avg: "$resolutionTime" },
          avgResponseTime: { $avg: "$responseTime" }
        }
      }
    ]);

    return NextResponse.json(agentStats);
  } catch (err) {
    console.error("Agent Stats Error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
