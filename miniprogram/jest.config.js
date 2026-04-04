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
    '**/*.js',
    '!__tests__/**',
    '!app.js',
    '!node_modules/**',
    '!coverage/**',
    '!pages/admin/**',
    '!utils/cache-optimized.js',
    '!utils/export.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
