import { Schema, model, Types } from "mongoose";

const DrawSchema = new Schema(
  {
    projectId: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      default: { elements: [], appState: {}, files: {} },
    },
  },
  {
    timestamps: true,
  },
);

export const Draw = model("Draw", DrawSchema);
