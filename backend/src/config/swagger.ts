import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Fullstack Master API",
            version: "1.0.0",
            description: "API documentation for Fullstack Master multi-service application",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            {
                name: "Auth",
                description: "Authentication endpoints",
            },
            {
                name: "Todos",
                description: "TODO management endpoints",
            },
        ],
    },
    apis: ["./src/services/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
