import mongoose, { Schema, Document } from "mongoose";

export type ExpenseCategory = 
    | "Food"
    | "Transport"
    | "Shopping"
    | "Bills"
    | "Entertainment"
    | "Health"
    | "Education"
    | "Other";

export type PaymentMethod = "Cash" | "Card" | "bKash" | "Nagad" | "Upay" | "Rocket" | "Bank Transfer";

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    description?: string;
    date: Date;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0.01, "Amount must be greater than 0"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            maxlength: [50, "Category cannot exceed 50 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, "Description cannot exceed 200 characters"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Card", "bKash", "Nagad", "Upay", "Rocket", "Bank Transfer"],
            default: "Cash",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, date: 1, category: 1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
