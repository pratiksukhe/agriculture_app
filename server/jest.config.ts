import type { Config } from 'jest';

const config: Config = {
    // Use ts-jest to handle TypeScript + ESM
    preset: 'ts-jest/presets/default-esm',

    // Node environment for backend testing
    testEnvironment: 'node',

    // Test file location
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],

    // ESM support — ts-jest needs this to resolve .js extensions in TS imports
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // Increase timeout for integration tests (mongodb-memory-server startup)
    testTimeout: 30_000,

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/__tests__/**',
        '!src/index.ts',
        '!src/scripts/**',
    ],
    coverageDirectory: 'coverage',

    // Clear mocks between tests automatically
    clearMocks: true,
    restoreMocks: true,
};

export default config;
