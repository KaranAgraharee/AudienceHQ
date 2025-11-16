import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const data = await Message.aggregate([
    {
      $project: {
        createdAt: 1,
        firstActionAt: 1,
        resolvedAt: 1,
        responseTime: {
          $cond: [
            { $ifNull: ["$firstActionAt", false] },
            { $subtract: ["$firstActionAt", "$createdAt"] },
            null
          ]
        },
        resolutionTime: {
          $cond: [
            { $ifNull: ["$resolvedAt", false] },
            { $subtract: ["$resolvedAt", "$createdAt"] },
            null
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: "$responseTime" },
        avgResolutionTime: { $avg: "$resolutionTime" },
        minResponseTime: { $min: "$responseTime" },
        maxResponseTime: { $max: "$responseTime" }
      }
    }
    ]);

    return NextResponse.json(data[0] || {
    avgResponseTime: 0,
    avgResolutionTime: 0,
    minResponseTime: 0,
    maxResponseTime: 0
  });
  } catch (error) {
    console.error("Response stats error:", error);
    return NextResponse.json(
      { error: "Failed to load response statistics" },
      { status: 500 }
    );
  }
}
