module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // TypeScript files will be handled by ts-jest
      '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel-jest.config.js' }], // JS/JSX files will be handled by babel-jest
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Maps @/ to src/
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
  };
  