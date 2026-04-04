module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['./__tests__/setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(echarts)/)'
  ],
  collectCoverage: true,
  verbose: true,
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^wx-xlsx$': '<rootDir>/__tests__/__mocks__/wx-xlsx.js'
  },
  collectCoverageFrom: [
    'utils/*.js',
    'pages/**/*.{js}',
    '!**/__tests__/**',
    '!app.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  }
};
