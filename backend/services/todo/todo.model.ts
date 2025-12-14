import mongoose, { Schema, Document } from "mongoose";

export type TodoPriority = "low" | "medium" | "high";

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
