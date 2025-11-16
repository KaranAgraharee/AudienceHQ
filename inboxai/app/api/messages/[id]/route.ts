// app/api/messages/[id]/route.ts
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  await connectDB();
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;
  const msg = await Message.findById(id).lean();
  if (!msg) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ message: msg });
}
