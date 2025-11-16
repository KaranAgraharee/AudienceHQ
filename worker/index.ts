import "dotenv/config";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import classifyMessage from "./classify";

if (!process.env.REDIS_URL) {
  console.error("REDIS_URL is missing!");
  process.exit(1);
}

const redisUrl = process.env.REDIS_URL;
const useTLS = redisUrl.startsWith("rediss://");

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis retry attempt ${times}, waiting ${delay}ms...`);
    return delay;
  },
  connectTimeout: 10000,
  ...(useTLS && { tls: {} }),
});

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

connection.on("close", () => {
  console.log("Redis connection closed");
});

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const worker = new Worker(
  "messageProcessing",
  async job => {
    if (job.name === "classify") {
      console.log("Worker: classify", job.data.messageId);
      try {
        await classifyMessage(job.data.messageId);
      } catch (err) {
        console.error("Classification error:", err);
        throw err; // Re-throw to mark job as failed
      }
    }
  },
  { connection }
);

worker.on("completed", job => console.log("Job done", job?.id));
worker.on("failed", (job, err) => console.error("Job failed", job?.id, err));

console.log("Worker started and listening for jobs...");
