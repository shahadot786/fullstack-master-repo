import request from "supertest";
import app from "../../app";

describe("TODO E2E Tests", () => {
    let token: string;
    let todoId: string;

    beforeEach(async () => {
        // Register and login to get token
        const response = await request(app).post("/api/auth/register").send({
            email: "todo@example.com",
            password: "Test1234",
            name: "TODO User",
        });
        token = response.body.data.tokens.accessToken;
    });

    describe("POST /api/todos", () => {
        it("should create a new todo", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Test TODO",
                    description: "Test description",
                    priority: "high",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe("Test TODO");
            todoId = response.body.data._id;
        });

        it("should fail without authentication", async () => {
            const response = await request(app)
                .post("/api/todos")
                .send({
                    title: "Test TODO",
                });

            expect(response.status).toBe(401);
        });

        it("should fail without title", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    description: "No title",
                });

            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/todos", () => {
        beforeEach(async () => {
            await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "TODO 1", priority: "low" });

            await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "TODO 2", priority: "high", completed: true });
        });

        it("should get all todos for authenticated user", async () => {
            const response = await request(app)
                .get("/api/todos")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2);
            expect(response.body.pagination).toBeDefined();
        });

        it("should filter todos by completed status", async () => {
            const response = await request(app)
                .get("/api/todos?completed=true")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].completed).toBe(true);
        });

        it("should filter todos by priority", async () => {
            const response = await request(app)
                .get("/api/todos?priority=high")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].priority).toBe("high");
        });
    });

    describe("PUT /api/todos/:id", () => {
        beforeEach(async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Update Test" });
            todoId = response.body.data._id;
        });

        it("should update a todo", async () => {
            const response = await request(app)
                .put(`/api/todos/${todoId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Updated TODO",
                    completed: true,
                });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("Updated TODO");
            expect(response.body.data.completed).toBe(true);
        });

        it("should fail to update non-existent todo", async () => {
            const response = await request(app)
                .put("/api/todos/507f1f77bcf86cd799439011")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated" });

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /api/todos/:id", () => {
        beforeEach(async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Delete Test" });
            todoId = response.body.data._id;
        });

        it("should delete a todo", async () => {
            const response = await request(app)
                .delete(`/api/todos/${todoId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it("should fail to delete non-existent todo", async () => {
            const response = await request(app)
                .delete("/api/todos/507f1f77bcf86cd799439011")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
