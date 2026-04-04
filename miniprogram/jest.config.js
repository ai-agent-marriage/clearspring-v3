module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['./__tests__/setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(echarts)/)'
  ],
  collectCoverage: false,
  verbose: true,
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'pages/**/*.js',
    'utils/**/*.js',
    'components/**/*.js'
  ]
}
