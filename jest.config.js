export const preset = "ts-jest";
export const testEnvironment = "jsdom";
export const setupFiles = ["<rootDir>/jest.polyfills.ts"];
export const setupFilesAfterEnv = ["<rootDir>/jest.setup.ts"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1", // Mapeia o alias @/ para src/
};
