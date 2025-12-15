module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    moduleNameMapper: {
        "^@common/(.*)$": "<rootDir>/src/common/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
    },
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
