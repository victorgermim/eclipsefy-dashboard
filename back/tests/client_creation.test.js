const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const BASE_URL = 'http://localhost:3001';

describe('Client Creation & Access Workflow', () => {
    let adminToken;
    let createdUserId;
    const testEmail = `client_${Date.now()}@test.com`;

    beforeAll(async () => {
        // Seed Admin to ensure it exists
        await prisma.user.upsert({
            where: { email: 'admin@eclipsefy.com' },
            update: {},
            create: {
                email: 'admin@eclipsefy.com',
                password_hash: await bcrypt.hash('admin', 10),
                role: 'ADMIN',
                company_name: 'Eclipsefy Admin'
            }
        });

        // Login as Admin
        const loginRes = await request(BASE_URL)
            .post('/api/auth/login')
            .send({
                email: 'admin@eclipsefy.com',
                password: 'admin'
            });

        if (loginRes.status !== 200) {
            console.error('Admin login failed:', loginRes.body);
            throw new Error('Failed to login as admin: ' + JSON.stringify(loginRes.body));
        }
        adminToken = loginRes.body.token;
    });

    it('should create a new client with phone and cpf_cnpj', async () => {
        const res = await request(BASE_URL)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: testEmail,
                password: 'password123',
                company_name: 'Test Company',
                phone: '11999999999',
                cpf_cnpj: '12345678000199'
            });

        expect(res.status).toBe(201);
        expect(res.body.user).toHaveProperty('email', testEmail);
        expect(res.body.user).toHaveProperty('phone', '11999999999');
        expect(res.body.user).toHaveProperty('cpf_cnpj', '12345678000199');

        createdUserId = res.body.user.id;
    });

    it('should fail to create duplicate client', async () => {
        const res = await request(BASE_URL)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: testEmail,
                password: 'password123',
                company_name: 'Test Company'
            });

        expect(res.status).toBe(400);
    });

    it('should send access email (simulated)', async () => {
        const res = await request(BASE_URL)
            .post(`/api/users/${createdUserId}/send-access`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('Access email sent');
    });

    afterAll(async () => {
        // Cleanup
        if (createdUserId) {
            await prisma.user.delete({ where: { id: createdUserId } });
        }
        await prisma.$disconnect();
    });
});
