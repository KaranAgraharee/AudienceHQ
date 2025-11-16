// lib/queue.ts
import { Queue } from "bullmq";
import IORedis from "ioredis";

if (!process.env.REDIS_URL) throw new Error("REDIS_URL missing");

const connection = new IORedis(process.env.REDIS_URL, {maxRetriesPerRequest: null,});

export const messageQueue = new Queue("messageProcessing", { connection });

export async function enqueueMessage(messageId: string) {
  await messageQueue.add("classify", { messageId }, { attempts: 3, backoff: { type: "exponential", delay: 2000 }});
}
