module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDit>/src/main/*.ts",
    "!<rootDir>/src/**/protocols/*.ts",
    "!<rootDir>/src/**/*-protocols.ts",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-node",
  preset: "@shelf/jest-mongodb",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
