module.exports = {
  moduleDirectories: [
    "node_modules",
    ".",
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
  ],
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: [
    '.d.ts',
    'main.ts',
    '.module.ts',
    '.mock.ts',
    '.options.ts',
    'migrations.ts',
  ],
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      "statements": 90,
      "branches": 90,
      "functions": 90,
      "lines": 90,
    }
  }
}
