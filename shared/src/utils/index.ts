// ============================================
// Date Utilities
// ============================================

export const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatDateTime = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const isDatePast = (date: Date | string): boolean => {
    return new Date(date) < new Date();
};

export const getDaysUntil = (date: Date | string): number => {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// String Utilities
// ============================================

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
};

export const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

// ============================================
// Type Guards
// ============================================

export const isString = (value: unknown): value is string => {
    return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
    return typeof value === "number" && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === "boolean";
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
    return Array.isArray(value);
};

// ============================================
// Validation Helpers
// ============================================

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ============================================
// Object Utilities
// ============================================

export const omit = <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};

// ============================================
// Array Utilities
// ============================================

export const unique = <T>(arr: T[]): T[] => {
    return Array.from(new Set(arr));
};

export const groupBy = <T>(
    arr: T[],
    key: keyof T
): Record<string, T[]> => {
    return arr.reduce((acc, item) => {
        const group = String(item[key]);
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};
