module.exports = {
  rootDir: "src",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!lbh-frontend|@mtfh)"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules"],
  testPathIgnorePatterns: ["test-utils.ts"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
    "@hackney/mtfh-test-utils",
    "./test-utils.ts",
  ],
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: ["test-utils.ts"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
