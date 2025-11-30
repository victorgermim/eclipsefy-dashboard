const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const BASE_URL = 'http://127.0.0.1:3001';

async function runTest() {
    try {
        console.log('--- Starting Client Flow Test (Supertest) ---');

        // 1. Seed Admin
        console.log('Seeding Admin...');
        const hashedPassword = await bcrypt.hash('admin', 10);
        await prisma.user.upsert({
            where: { email: 'admin@eclipsefy.com' },
            update: {
                password_hash: hashedPassword
            },
            create: {
                email: 'admin@eclipsefy.com',
                password_hash: hashedPassword,
                role: 'ADMIN',
                company_name: 'Eclipsefy Admin'
            }
        });

        // 2. Login
        console.log('Logging in...');
        const loginRes = await request(BASE_URL)
            .post('/api/auth/login')
            .send({
                email: 'admin@eclipsefy.com',
                password: 'admin'
            });

        if (loginRes.status !== 200) {
            console.error('Login Failed:', loginRes.body);
            return;
        }
        const token = loginRes.body.token;
        console.log('Login successful, token obtained.');

        // 3. Create Client
        const testEmail = `client_${Date.now()}@test.com`;
        console.log(`Creating client: ${testEmail}`);

        const createRes = await request(BASE_URL)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: testEmail,
                password: 'password123',
                company_name: 'Test Company',
                phone: '11999999999',
                cpf_cnpj: '12345678000199'
            });

        console.log('Create response status:', createRes.status);
        console.log('Created User:', createRes.body.user);

        if (createRes.status !== 201) {
            console.error('Create Failed:', createRes.body);
            return;
        }

        if (createRes.body.user.phone !== '11999999999') {
            console.error('FAIL: Phone mismatch. Got:', createRes.body.user.phone);
        } else {
            console.log('PASS: Phone matches');
        }
        if (createRes.body.user.cpf_cnpj !== '12345678000199') {
            console.error('FAIL: CPF/CNPJ mismatch. Got:', createRes.body.user.cpf_cnpj);
        } else {
            console.log('PASS: CPF/CNPJ matches');
        }

        const createdUserId = createRes.body.user.id;

        // 4. Send Access Email
        console.log('Sending access email...');
        const emailRes = await request(BASE_URL)
            .post(`/api/users/${createdUserId}/send-access`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'password123'
            });

        console.log('Email response status:', emailRes.status);
        console.log('Email response body:', emailRes.body);

        if (emailRes.status === 200) {
            console.log('PASS: Email sent successfully');
        } else {
            console.error('FAIL: Email sending failed');
        }

        // Cleanup
        await prisma.user.delete({ where: { id: createdUserId } });
        console.log('Cleanup successful.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
