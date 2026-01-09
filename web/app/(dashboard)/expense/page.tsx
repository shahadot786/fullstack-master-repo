"use client";

import { useState } from "react";
import {
  useExpenses,
  useExpenseStats,
  useCreateExpense,
  useDeleteExpense,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/use-expenses";
import dynamic from "next/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Plus,
  Trash2,
  CreditCard,
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Gamepad2,
  Receipt,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { PaymentMethod, ExpenseCategory } from "@/types";

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Card", "bKash", "Nagad", "Upay", "Rocket", "Bank Transfer"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Bills: <Zap className="w-4 h-4" />,
  Entertainment: <Gamepad2 className="w-4 h-4" />,
  Health: <Heart className="w-4 h-4" />,
  Education: <GraduationCap className="w-4 h-4" />,
  Other: <MoreHorizontal className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Shopping: "bg-pink-500",
  Bills: "bg-yellow-500",
  Entertainment: "bg-purple-500",
  Health: "bg-red-500",
  Education: "bg-green-500",
  Other: "bg-gray-500",
};

// Gradient colors for custom categories
const GRADIENT_CLASSES = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-cyan-500 to-blue-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-amber-500 to-orange-500",
  "bg-gradient-to-br from-violet-500 to-indigo-500",
  "bg-gradient-to-br from-rose-500 to-pink-500",
  "bg-gradient-to-br from-teal-500 to-cyan-500",
];

const getGradientForCategory = (category: string): string => {
  const index = category.charCodeAt(0) % GRADIENT_CLASSES.length;
  return GRADIENT_CLASSES[index];
};

const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || getGradientForCategory(category);
};

const getCategoryIcon = (category: string): React.ReactNode | null => {
  return CATEGORY_ICONS[category] || null;
};

export default function ExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const currentDate = new Date();
  const { data: categoriesData, refetch: refetchCategories } = useCategories();
  const { data: expenses, isLoading } = useExpenses({
    category: filterCategory !== "all" ? filterCategory : undefined,
  });
  const { data: statsData } = useExpenseStats(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );
  const createMutation = useCreateExpense();
  const deleteMutation = useDeleteExpense();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Get categories from API or fallback to defaults
  // We map defaults to objects if API is loading or fails
  const defaultCategoryObjects: ExpenseCategory[] = DEFAULT_CATEGORIES.map(name => ({
    _id: name,
    name,
    userId: null,
    isDefault: true,
    createdAt: "",
    updatedAt: ""
  }));

  const CATEGORIES = categoriesData?.data || defaultCategoryObjects;
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    if (!selectedEmoji) {
      toast.error("Please select an icon/emoji");
      return;
    }
    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        emoji: selectedEmoji || undefined
      });
      setCategory(newCategoryName.trim());
      setNewCategoryName("");
      setSelectedEmoji(null);
      setShowAddModal(false);
      refetchCategories();
      toast.success("Category added!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the "${name}" category?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        if (category === name) {
          setCategory("Food");
        }
        toast.success("Category deleted");
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete category");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await createMutation.mutateAsync({
        amount: parseFloat(amount),
        category,
        description: description || undefined,
        date: date || undefined,
        paymentMethod,
      });
      setAmount("");
      setDescription("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      toast.success("Expense added successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add expense");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Expense deleted!");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const stats = statsData?.data;
  const topCategories = stats?.byCategory?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Add Custom Category</h3>
            <div className="flex gap-2 mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-12 h-10 p-0 shrink-0">
                    {selectedEmoji ? (
                      <span className="text-xl">{selectedEmoji}</span>
                    ) : (
                      <Smile className="w-5 h-5 text-gray-500" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-none shadow-none" align="start">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => setSelectedEmoji(emojiData.emoji)}
                    width={300}
                    height={400}
                  />
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowAddModal(false); setNewCategoryName(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Expense Tracker
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Track your spending and manage your budget effectively
            </p>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs md:text-sm font-medium opacity-90">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-xl md:text-3xl font-bold">
                    ৳{stats?.total?.toLocaleString() || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs md:text-sm font-medium opacity-90">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-xl md:text-3xl font-bold">{stats?.count || 0}</span>
                </div>
              </CardContent>
            </Card>

            {topCategories.map((cat) => (
              <Card
                key={cat.category}
                className="border-none shadow-md bg-white dark:bg-gray-900"
              >
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-2">
                    <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getCategoryColor(cat.category)}`}></span>
                    {cat.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                    ৳{cat.total.toLocaleString()}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Expense Form */}
          <Card className="border-none shadow-xl bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Add New Expense
              </CardTitle>
              <CardDescription className="text-sm">
                Record your daily expenses to track spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat.name
                          ? `${cat.color || getCategoryColor(cat.name)} text-white`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        style={category === cat.name && cat.color ? { backgroundColor: cat.color } : {}}
                      >
                        {cat.emoji ? (
                          <span className="text-lg leading-none">{cat.emoji}</span>
                        ) : (
                          CATEGORY_ICONS[cat.name]
                        )}
                        <span className="hidden sm:inline">{cat.name}</span>
                        {!cat.isDefault && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCategory(e, cat._id, cat.name)}
                            className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </button>
                    ))}
                    {/* Add Custom Button */}
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>

                {/* Amount & Description Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-11 bg-gray-50 dark:bg-gray-800"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Description
                    </label>
                    <Input
                      type="text"
                      placeholder="What did you spend on?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="h-11 bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Date & Payment Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Payment Method
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === method
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Expense
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Recent Expenses</CardTitle>
                <CardDescription>Your expense history</CardDescription>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
              ) : !expenses?.data || expenses.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Wallet className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg font-medium text-gray-500">No expenses recorded</p>
                  <p className="text-sm text-gray-400">Add your first expense above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.data.map((expense) => {
                    const icon = getCategoryIcon(expense.category);
                    const colorClass = getCategoryColor(expense.category);
                    const initial = expense.category.charAt(0).toUpperCase();

                    return (
                      <div
                        key={expense._id}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shrink-0 ${colorClass}`}>
                          {/* Use category object lookup if available to find icon */}
                          {(() => {
                            const catObj = CATEGORIES.find(c => c.name === expense.category);
                            if (catObj?.emoji) return <span className="text-xl">{catObj.emoji}</span>;
                            return icon || <span className="text-lg font-bold">{initial}</span>;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{expense.category}</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                              {expense.paymentMethod}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {expense.description || format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ৳{expense.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(expense.date), "MMM d")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500 shrink-0"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
