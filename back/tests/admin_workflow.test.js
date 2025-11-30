const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const BASE_URL = 'http://localhost:3001';

describe('Admin Workflow Tests', () => {
    let adminToken;
    let createdClientId;

    beforeAll(async () => {
        const adminEmail = 'admin_test_jest@eclipsefy.com';
        const adminPassword = 'adminpassword';

        try {
            await prisma.user.deleteMany({ where: { email: adminEmail } });
        } catch (e) { console.log('Cleanup error (ignored):', e.message); }

        // Seed Admin (Directly in DB because API is protected)
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password_hash: hashedPassword,
                role: 'ADMIN',
                company_name: 'Eclipsefy Admin Jest'
            }
        });

        // Login Admin
        const res = await request(BASE_URL).post('/api/auth/login').send({
            email: adminEmail,
            password: adminPassword
        });

        if (res.status === 200) {
            adminToken = res.body.token;
        } else {
            console.error('Login failed:', res.body);
        }
    }, 30000);

    afterAll(async () => {
        if (createdClientId) {
            await prisma.serviceMetric.deleteMany({ where: { user_id: createdClientId } });
            await prisma.user.delete({ where: { id: createdClientId } });
        }
        await prisma.user.deleteMany({ where: { email: 'admin_test_jest@eclipsefy.com' } });
        await prisma.$disconnect();
    });

    test('1. Admin should create a new Client', async () => {
        if (!adminToken) throw new Error('No admin token');

        const res = await request(BASE_URL)
            .post('/api/auth/register')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'client_test_jest@company.com',
                password: 'clientpassword',
                role: 'CLIENT',
                company_name: 'Test Company Jest'
            });

        expect(res.statusCode).toBe(201);
        createdClientId = res.body.user.id;
    });

    test('2. Admin should list Clients', async () => {
        const res = await request(BASE_URL)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        const client = res.body.find(u => u.id === createdClientId);
        expect(client).toBeDefined();
    });

    test('3. Admin should toggle Services for Client', async () => {
        const services = { ads: true, seo: false, social: true };

        const res = await request(BASE_URL)
            .patch(`/api/users/${createdClientId}/services`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ services });

        expect(res.statusCode).toBe(200);
        expect(res.body.services).toEqual(services);
    });

    test('4. Admin should inject Metrics for a specific Service', async () => {
        const metricData = {
            service_type: 'ads',
            data: { investment: 1000, clicks: 500, roas: 3.5 },
            month: 11,
            year: 2024
        };

        const res = await request(BASE_URL)
            .post(`/api/metrics/${createdClientId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(metricData);

        expect(res.statusCode).toBe(201);
    });

    test('5. Admin should verify Metrics persistence', async () => {
        const res = await request(BASE_URL)
            .get(`/api/metrics/user/${createdClientId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].service_type).toBe('ads');
    });
});
