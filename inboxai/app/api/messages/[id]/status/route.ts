// app/api/messages/[id]/status/route.ts
import {connectDB} from "@/lib/mongodb";
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
  const { status, note, userId } = body;
  if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

  const msg = await Message.findByIdAndUpdate(id, {
    $set: { status },
    $push: { history: { type: "status_change", payload: { status, note }, userId, timestamp: new Date() } }
  }, { new: true });

  if (!msg) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, message: msg });
}
