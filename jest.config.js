// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "**/__tests__/**/*.test.ts",
        "**/?(*.)+(spec|test).ts",
      ],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/dist/'
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    verbose: true,
    testTimeout: 30000,        // Global timeout 30 seconds
    detectOpenHandles: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
  };