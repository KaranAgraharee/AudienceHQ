// models/Channel.ts
import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.models.Channel || mongoose.model("Channel", ChannelSchema);
