import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || 50);
    const status = url.searchParams.get("status") || undefined;

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
