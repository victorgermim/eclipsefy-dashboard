const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
    const mPrisma = {
        task: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        $disconnect: jest.fn(),
    };
    return {
        PrismaClient: jest.fn(() => mPrisma),
    };
});

// Mock Multer
jest.mock('multer', () => {
    const multer = () => ({
        single: () => (req, res, next) => {
            req.file = { filename: 'test.jpg' };
            next();
        },
    });
    multer.diskStorage = () => { };
    return multer;
});

describe('Task Endpoints', () => {
    let adminToken;
    let clientToken;

    beforeAll(() => {
        process.env.JWT_SECRET = 'testsecret';
        adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, 'testsecret');
        clientToken = jwt.sign({ id: 2, role: 'CLIENT' }, 'testsecret');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/tasks', () => {
        it('should allow admin to create task', async () => {
            const prisma = new PrismaClient();
            prisma.task.create.mockResolvedValue({ id: 1, title: 'New Task' });

            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('user_id', '2')
                .field('title', 'New Task')
                .attach('media', Buffer.from('dummy'), 'test.jpg');

            expect(res.statusCode).toEqual(201);
        });
    });

    describe('PATCH /api/tasks/:id/approve', () => {
        it('should allow client to approve their task', async () => {
            const prisma = new PrismaClient();
            prisma.task.findUnique.mockResolvedValue({ id: 1, user_id: 2 });
            prisma.task.update.mockResolvedValue({ id: 1, status: 'DONE' });

            const res = await request(app)
                .patch('/api/tasks/1/approve')
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ approved: true, feedback: 'Great!' });

            expect(res.statusCode).toEqual(200);
            expect(prisma.task.update).toHaveBeenCalledWith(expect.objectContaining({
                data: { status: 'DONE' }
            }));
        });

        it('should deny client from approving others task', async () => {
            const prisma = new PrismaClient();
            prisma.task.findUnique.mockResolvedValue({ id: 1, user_id: 3 }); // Different user

            const res = await request(app)
                .patch('/api/tasks/1/approve')
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ approved: true });

            expect(res.statusCode).toEqual(403);
        });
    });
});
