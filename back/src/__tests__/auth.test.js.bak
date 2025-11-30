const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');

// Minimal mock to prevent crash if app uses it
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => ({
            user: { findUnique: jest.fn() },
            $disconnect: jest.fn(),
        })),
    };
});

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('Auth Endpoints Debug', () => {
    it('should pass sanity check', () => {
        expect(true).toBe(true);
    });

    // Uncomment to test app import
    it('should have app defined', () => {
        expect(app).toBeDefined();
    });
});
