import mongoose, { Schema } from "mongoose";

export interface IProject {
  user: mongoose.Types.ObjectId;
  permissbleArray: {
    user: mongoose.Types.ObjectId;
    permission: "read" | "write";
    _id?: mongoose.Types.ObjectId; 
  }[];
  name: string;
  description: string;
  priority: "high" | "medium" | "low";
  appearance: "public" | "private";
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  permissbleArray: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      permission: {
        type: String,
        enum: ["read", "write"],
        default: "read",
        required: true,
      },
    },
  ],

  name: { type: String, required: true },

  description: { type: String, required: true },

  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
    required: true,
  },

  appearance: {
    type: String,
    enum: ["public", "private"],
    default: "private",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
