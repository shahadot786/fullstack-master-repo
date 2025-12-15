# Creating a New Service

This guide walks you through creating a new service using the TODO service as a reference.

## Step 1: Create Service Directory

```bash
mkdir -p src/services/your-service
```

## Step 2: Create Model

Create `your-service.model.ts`:

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface IYourService extends Document {
  userId: mongoose.Types.ObjectId;
  // Add your fields here
  createdAt: Date;
  updatedAt: Date;
}

const YourServiceSchema = new Schema<IYourService>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Define your schema fields
  },
  {
    timestamps: true,
  }
);

// Add indexes for performance
YourServiceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IYourService>("YourService", YourServiceSchema);
```

## Step 3: Create Validation Schemas

Create `your-service.validation.ts`:

```typescript
import { z } from "zod";

export const createYourServiceSchema = z.object({
  // Define validation rules
});

export const updateYourServiceSchema = z.object({
  // Define validation rules
});

export const createYourServiceValidation = z.object({
  body: createYourServiceSchema,
});

export const updateYourServiceValidation = z.object({
  body: updateYourServiceSchema,
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
  }),
});
```

## Step 4: Create Service Layer

Create `your-service.service.ts`:

```typescript
import YourService, { IYourService } from "./your-service.model";
import { NotFoundError } from "@common/errors";

export const create = async (
  userId: string,
  data: Partial<IYourService>
): Promise<IYourService> => {
  return YourService.create({ ...data, userId });
};

export const getAll = async (userId: string): Promise<IYourService[]> => {
  return YourService.find({ userId }).sort({ createdAt: -1 });
};

export const getById = async (
  userId: string,
  id: string
): Promise<IYourService> => {
  const item = await YourService.findOne({ _id: id, userId });
  if (!item) {
    throw new NotFoundError("Item not found");
  }
  return item;
};

export const update = async (
  userId: string,
  id: string,
  data: Partial<IYourService>
): Promise<IYourService> => {
  const item = await YourService.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true, runValidators: true }
  );
  if (!item) {
    throw new NotFoundError("Item not found");
  }
  return item;
};

export const remove = async (userId: string, id: string): Promise<void> => {
  const item = await YourService.findOneAndDelete({ _id: id, userId });
  if (!item) {
    throw new NotFoundError("Item not found");
  }
};
```

## Step 5: Create Controller

Create `your-service.controller.ts`:

```typescript
import { Response } from "express";
import * as service from "./your-service.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const item = await service.create(userId, req.body);
  sendSuccess(res, item, "Created successfully", HTTP_STATUS.CREATED);
});

export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const items = await service.getAll(userId);
  sendSuccess(res, items);
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const item = await service.getById(userId, req.params.id);
  sendSuccess(res, item);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const item = await service.update(userId, req.params.id, req.body);
  sendSuccess(res, item, "Updated successfully");
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  await service.remove(userId, req.params.id);
  sendSuccess(res, null, "Deleted successfully", HTTP_STATUS.NO_CONTENT);
});
```

## Step 6: Create Routes

Create `your-service.routes.ts`:

```typescript
import { Router } from "express";
import * as controller from "./your-service.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validation.middleware";
import {
  createYourServiceValidation,
  updateYourServiceValidation,
} from "./your-service.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/your-service:
 *   post:
 *     summary: Create new item
 *     tags: [YourService]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post("/", validate(createYourServiceValidation), controller.create);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", validate(updateYourServiceValidation), controller.update);
router.delete("/:id", controller.remove);

export default router;
```

## Step 7: Register Routes in app.ts

Add to `app.ts`:

```typescript
import yourServiceRoutes from "@services/your-service/your-service.routes";

// ... other code

app.use("/api/your-service", yourServiceRoutes);
```

## Step 8: Update Swagger Config

Add tag to `src/config/swagger.ts`:

```typescript
tags: [
  // ... existing tags
  {
    name: "YourService",
    description: "Your service endpoints",
  },
],
```

## Step 9: Add Shared Types (Optional)

If you need shared types, add to `shared/src/types/index.ts`:

```typescript
export interface YourServiceItem {
  _id: string;
  userId: string;
  // Add fields
  createdAt: Date;
  updatedAt: Date;
}
```

## Step 10: Write Tests

Create `__tests__/e2e/your-service.e2e.test.ts` following the pattern in `todo.e2e.test.ts`.

## Checklist

- [ ] Create model with userId field
- [ ] Add validation schemas
- [ ] Implement service layer
- [ ] Create controller with asyncHandler
- [ ] Setup routes with authentication
- [ ] Register routes in app.ts
- [ ] Add Swagger documentation
- [ ] Create E2E tests
- [ ] Update shared types if needed
- [ ] Test all endpoints

## Best Practices

1. **Always scope by userId** - Ensure all queries include userId for multi-tenancy
2. **Use validation middleware** - Validate all inputs with Zod
3. **Handle errors properly** - Use custom error classes
4. **Add indexes** - Index frequently queried fields
5. **Write tests** - Cover all CRUD operations
6. **Document with Swagger** - Add JSDoc comments for API docs
7. **Use TypeScript** - Define proper types and interfaces
8. **Follow naming conventions** - Use consistent file and function names
