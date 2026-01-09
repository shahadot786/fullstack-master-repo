import mongoose, { Schema, Document } from "mongoose";

export interface IExpenseCategory extends Document {
    name: string;
    userId: mongoose.Types.ObjectId | null; // null = default/system category
    icon?: string;   // For system icons (Lucide/Ionicons name)
    emoji?: string;  // For custom emojis
    color?: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseCategorySchema = new Schema<IExpenseCategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        emoji: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index: same user can't have duplicate category names
ExpenseCategorySchema.index({ name: 1, userId: 1 }, { unique: true });

// Default categories (seeded on first use)
export const DEFAULT_CATEGORIES = [
    { name: "Food", icon: "fast-food", color: "#f97316", isDefault: true },
    { name: "Transport", icon: "car", color: "#3b82f6", isDefault: true },
    { name: "Shopping", icon: "cart", color: "#ec4899", isDefault: true },
    { name: "Bills", icon: "flash", color: "#eab308", isDefault: true },
    { name: "Entertainment", icon: "game-controller", color: "#8b5cf6", isDefault: true },
    { name: "Health", icon: "heart", color: "#ef4444", isDefault: true },
    { name: "Education", icon: "school", color: "#22c55e", isDefault: true },
    { name: "Other", icon: "ellipsis-horizontal", color: "#6b7280", isDefault: true },
];

export default mongoose.model<IExpenseCategory>("ExpenseCategory", ExpenseCategorySchema);
