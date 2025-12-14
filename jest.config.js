module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/server/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/**/*.test.js',
    '!server/config/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  forceExit: true,
  clearMocks: true
};