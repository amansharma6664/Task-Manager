import mongoose, { Schema, model, models } from "mongoose";
// Interface with userId added
export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  userId: string; // mandatory for associating task with user
}

// const TaskSchema = new Schema<ITask>({
//   title: { type: String, required: true },
//   description: String,
//   status: {
//     type: String,
//     enum: ["pending", "in-progress", "completed"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
//   userId: { type: String, required: true }, // link task to user
// });
const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "Pending" }, // default pending
  userId: { type: String, required: true },
}, { timestamps: true });

const Task = models.Task || model("Task", TaskSchema);

export default Task;
