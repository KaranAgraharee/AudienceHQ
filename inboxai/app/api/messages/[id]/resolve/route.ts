import { NextResponse } from "next/server";
import Message from "@/models/Message";
import {connectDB} from "@/lib/mongodb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  await connectDB();
  const resolvedParams = params instanceof Promise ? await params : params;
  const msg = await Message.findById(resolvedParams.id);
  if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  msg.status = "RESOLVED";
  msg.resolvedAt = new Date();
  msg.history.push({
    type: "resolved",
    payload: {},
    timestamp: new Date(),
  });

  await msg.save();

  return NextResponse.json({ ok: true });
}
