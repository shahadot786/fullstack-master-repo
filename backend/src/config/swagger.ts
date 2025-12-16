import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Nexus API",
            version: "1.0.0",
            description: "API documentation for Nexus - Your Digital Nexus platform",
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
