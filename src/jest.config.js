/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.', // Cambiar si estás dentro de src
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'], // Ajusta según tu estructura
  transformIgnorePatterns: ['node_modules/'],
};
