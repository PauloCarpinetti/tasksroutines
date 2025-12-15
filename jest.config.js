export const preset = "ts-jest";
export const testEnvironment = "node";
export const setupFilesAfterEnv = ["<rootDir>/jest.setup.ts"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};
