/** @type {import('ts-jest').JestConfigWithTsJest} */
const preset = 'ts-jest';
const testEnvironment = 'node';
const testPathIgnorePatterns = ['dist', 'node_modules/supertest/lib/test'];
const resolver = 'jest-ts-webcompat-resolver';
const coveragePathIgnorePatterns = [
    'src/entities',
    'node_modules/supertest/lib/test',
];
export default {
    preset,
    testEnvironment,
    testPathIgnorePatterns,
    resolver,
    coveragePathIgnorePatterns,
};
