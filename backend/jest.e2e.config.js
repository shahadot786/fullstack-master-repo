module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/__tests__/e2e/**/*.test.ts"],
    moduleNameMapper: {
        "^@common/(.*)$": "<rootDir>/src/common/$1",
        "^@services/(.*)$": "<rootDir>/src/services/$1",
        "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@shared/(.*)$": "<rootDir>/../shared/src/$1",
    },
    testTimeout: 30000,
};
