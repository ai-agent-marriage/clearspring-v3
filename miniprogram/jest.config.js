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
  testTimeout: 30000, // 增加超时时间到 30 秒（性能优化）
  maxWorkers: 4, // 限制并发 worker 数量为 4（性能优化）
  workerIdleMemoryLimit: 0.5, // 限制 worker 内存使用为 50%（性能优化）
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
