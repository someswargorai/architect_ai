import { Schema, model, Types } from "mongoose";

const NoteSchema = new Schema(
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
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Note = model("Note", NoteSchema);
