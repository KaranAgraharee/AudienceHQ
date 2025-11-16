// models/Message.ts
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'tagged','assigned','status_change','note'
  payload: { type: Object, default: {} },
  userId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const MessageSchema = new mongoose.Schema(
  {
    channelId: String,
    externalId: String,

    subject: String,
    body: String,
    sender: String,

    tags: [String],
    priority: String,
    summary: String,

    assignedTo: { type: String, default: null },
    status: { type: String, default: "OPEN" },

    createdAt: { type: Date, default: Date.now },
    firstActionAt: { type: Date },   // When agent replies/acts
    resolvedAt: { type: Date },      // When resolved

    history: [
      {
        type: { type: String },
        payload: mongoose.Schema.Types.Mixed,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
