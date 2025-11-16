// app/api/messages/[id]/assign/route.ts
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  await connectDB();
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;
  const body = await req.json().catch(() => ({}));
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const msg = await Message.findByIdAndUpdate(id, {
    $set: { assignedTo: userId, status: "IN_PROGRESS" },
    $push: { history: { type: "assigned", payload: { userId }, userId, timestamp: new Date() } }
  }, { new: true });

  if (!msg) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, message: msg });
}
