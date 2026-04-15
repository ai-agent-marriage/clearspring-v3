export default {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'utils/**/*.js',
        'components/**/*.js',
        'pages/**/*.js'
      ],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.js',
        '**/*.test.ts'
      ]
    }
  }
}
