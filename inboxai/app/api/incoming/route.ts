// app/api/incoming/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Channel from "@/models/Channel";
import Message from "@/models/Message";
import { enqueueMessage } from "@/lib/queue";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json().catch(() => null);
  if (!body || !body.body) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

  const { channel = "email", externalId, subject, body: text, sender, rawPayload } = body;

  // upsert channel
  const ch = await Channel.findOneAndUpdate({ name: channel }, { $setOnInsert: { name: channel, meta: {} } }, { upsert: true, new: true });

  const msg = await Message.create({
    channelId: ch._id.toString(),
    externalId,
    subject,
    body: text,
    sender,
    rawPayload,
    history: [{ type: "created", payload: { rawPayload }, timestamp: new Date() }]
  });

  // enqueue for classification
  await enqueueMessage(msg._id.toString());

  return NextResponse.json({ ok: true, id: msg._id.toString() });
}
