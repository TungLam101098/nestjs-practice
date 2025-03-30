import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: [
    'main.ts',
    '.entity.ts',
    '.module.ts',
    '.e2e-spec.ts',
    '.dto.ts',
    '.config.ts',
    '.constant.ts',
    '.decorator.ts',
    '.enum.ts',
    'index.ts',
    '.pipe.ts',
    '.schema.ts',
    '.validation.ts',
    'scripts/',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/../test-setup.ts'],
};

export default config;
