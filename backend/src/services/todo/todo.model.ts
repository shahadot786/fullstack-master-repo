import mongoose, { Schema, Document } from "mongoose";

export type TodoPriority = "low" | "medium" | "high";

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user-specific queries
TodoSchema.index({ userId: 1, createdAt: -1 });
TodoSchema.index({ userId: 1, completed: 1 });

// Unique index to prevent duplicate titles per user (case-insensitive)
TodoSchema.index(
  { userId: 1, title: 1 },
  { 
    unique: true,
    collation: { locale: 'en', strength: 2 } // Case-insensitive collation
  }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
