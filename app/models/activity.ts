import mongoose, { Schema } from "mongoose";

const activity = new Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    require: true,
  },
  log: {
    type: String,
    require: true,
  },
  action:{
    type: String,
    enum:["CREATE","UPDATE","INVITE","DELETE"]
  },
  email: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Activity", activity);
