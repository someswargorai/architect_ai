// models/Project.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface for Project
export interface IProject extends Document {
  user: mongoose.Types.ObjectId; // reference to User model
  name: string;
  createdAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // added user
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid recompiling model if it already exists
const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
