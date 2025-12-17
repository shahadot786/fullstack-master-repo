import request from "supertest";
import app from "../../app";
import User from "../../src/services/auth/auth.model";

describe("Auth E2E Tests", () => {
    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    password: "Test1234",
                    name: "Test User",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe("test@example.com");
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });

        it("should fail with invalid email", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "invalid-email",
                    password: "Test1234",
                    name: "Test User",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should fail with duplicate email", async () => {
            await User.create({
                email: "existing@example.com",
                password: "Test1234",
                name: "Existing User",
            });

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "existing@example.com",
                    password: "Test1234",
                    name: "Test User",
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send({
                email: "login@example.com",
                password: "Test1234",
                name: "Login User",
            });
        });

        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "Test1234",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });

        it("should fail with incorrect password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "WrongPassword",
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/auth/me", () => {
        let token: string;

        beforeEach(async () => {
            const response = await request(app).post("/api/auth/register").send({
                email: "me@example.com",
                password: "Test1234",
                name: "Me User",
            });
            token = response.body.data.tokens.accessToken;
        });

        it("should get current user with valid token", async () => {
            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe("me@example.com");
        });

        it("should fail without token", async () => {
            const response = await request(app).get("/api/auth/me");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
