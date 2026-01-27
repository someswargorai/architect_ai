import mongoose, { Schema } from "mongoose";

export interface IProject  {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
}

const ProjectSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  name: { type: String, required: true },
  description:{type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.models.project ||  mongoose.model("Project", ProjectSchema);

export default Project;
