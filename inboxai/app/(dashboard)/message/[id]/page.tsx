// app/(dashboard)/message/[id]/page.tsx
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import PriorityBadge from "@/components/PriorityBadge";
import TagBadge from "@/components/TagBadge";

interface MessageHistory {
  type: string;
  payload: Record<string, unknown>;
  userId?: string | null;
  timestamp: Date;
}

interface MessageDoc {
  _id: string;
  subject?: string | null;
  body: string;
  sender?: string | null;
  priority: string;
  tags?: string[];
  history?: MessageHistory[];
  createdAt: Date;
}

export default async function MessagePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  await connectDB();
  const resolvedParams = params instanceof Promise ? await params : params;
  const msg = await Message.findById(resolvedParams.id).lean() as MessageDoc | null;
  if (!msg) return <div className="p-6 text-gray-900 dark:text-white">Not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{msg.subject ?? "Message"}</h1>
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">From: {msg.sender} • Created: {new Date(msg.createdAt).toLocaleString()}</div>
      <div className="mb-4">
        <PriorityBadge priority={msg.priority} />
        <div className="mt-2">{msg.tags?.map((t: string) => <TagBadge key={t} tag={t} />)}</div>
      </div>
      <div className="p-4 border dark:border-gray-700 rounded mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors">{msg.body}</div>

      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">History</h2>
      <div className="space-y-2">
        {msg.history?.map((h: MessageHistory, idx: number) => (
          <div key={idx} className="p-3 border dark:border-gray-700 rounded overflow-clip bg-white dark:bg-gray-800 transition-colors">
            <div className="text-sm text-gray-500 dark:text-gray-400">{h.type} • {new Date(h.timestamp).toLocaleString()}</div>
            <pre className="text-xs mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded text-gray-900 dark:text-gray-100">{JSON.stringify(h.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
