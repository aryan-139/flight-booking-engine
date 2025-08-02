// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test configuration
beforeAll(() => {
    // Setup any global test configuration
});

afterAll(() => {
    // Cleanup after all tests
});

// This is just a setup file, not a test suite
describe('Test Setup', () => {
    it('should load environment variables', () => {
        expect(process.env.NODE_ENV).toBeDefined();
    });
}); 