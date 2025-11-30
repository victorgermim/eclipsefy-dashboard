const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');

exports.createClient = async (req, res) => {
    try {
        const { email, password, company_name, phone, cpf_cnpj } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Use raw query to insert with new fields if Prisma Client is outdated
        // But try standard create first if fields are recognized, fallback to raw if needed.
        // Given previous issues, let's use raw query for safety or try standard.
        // Actually, let's try standard create. If it fails due to missing fields in client, we catch and use raw.

        let user;
        try {
            user = await prisma.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    role: 'CLIENT',
                    company_name,
                    phone,
                    cpf_cnpj,
                    services: {}, // Default empty services
                    permissions: {}
                }
            });
        } catch (prismaError) {
            console.warn('Prisma create failed (likely outdated client), trying raw SQL...', prismaError.message);
            await prisma.$executeRaw`
                INSERT INTO User (email, password_hash, role, company_name, phone, cpf_cnpj, services, permissions, createdAt, updatedAt)
                VALUES (${email}, ${hashedPassword}, 'CLIENT', ${company_name}, ${phone}, ${cpf_cnpj}, '{}', '{}', NOW(), NOW())
            `;
            const users = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email}`;
            user = users[0];
        }

        res.status(201).json({ message: 'Client created successfully', user });
    } catch (error) {
        console.error('Create Client Error:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
};

exports.sendAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body; // Admin provides the password to send, or we generate a reset link (but user asked for password sending)

        // Fetch user email
        const users = await prisma.$queryRaw`SELECT email FROM User WHERE id = ${id}`;
        const user = users[0];

        if (!user) return res.status(404).json({ error: 'User not found' });

        await emailService.sendAccessEmail(user.email, password);

        res.json({ message: 'Access email sent successfully' });
    } catch (error) {
        console.error('Send Access Error:', error);
        res.status(500).json({ error: 'Failed to send access email' });
    }
};

exports.listUsers = async (req, res) => {
    try {
        // Use raw query to bypass outdated Prisma Client definition
        const users = await prisma.$queryRaw`
            SELECT id, email, company_name, avatar_url, permissions, services, createdAt 
            FROM User 
            WHERE role = 'CLIENT'
        `;

        // Parse JSON fields if they are strings
        const parsedUsers = users.map(user => ({
            ...user,
            permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions,
            services: typeof user.services === 'string' ? JSON.parse(user.services) : user.services,
        }));

        res.json(parsedUsers);
    } catch (error) {
        console.error('List Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

exports.updateUserServices = async (req, res) => {
    try {
        const { id } = req.params;
        const { services } = req.body;

        // Use executeRaw for update
        await prisma.$executeRaw`
            UPDATE User 
            SET services = ${services} 
            WHERE id = ${id}
        `;

        // Fetch updated user to return
        const updatedUser = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${id}`;
        const user = updatedUser[0];

        if (user) {
            user.services = typeof user.services === 'string' ? JSON.parse(user.services) : user.services;
            user.permissions = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user services' });
    }
};
