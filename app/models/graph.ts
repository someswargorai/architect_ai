import mongoose, { Schema } from "mongoose";

const GraphSchema = new Schema({
  projectId: {type: Schema.Types.ObjectId, required: true, unique: true, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
});

export default mongoose.models.Graph || mongoose.model("Graph", GraphSchema);