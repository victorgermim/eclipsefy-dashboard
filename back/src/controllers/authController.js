const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
    console.log('Login request received:', req.body.email);
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('Login failed: User not found', email);
            return res.status(401).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            console.log('Login failed: Invalid password for', email);
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email, services: user.services },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company_name: user.company_name,
                avatar_url: user.avatar_url,
                permissions: user.permissions,
                services: user.services,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, role, company_name, permissions } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role: role || 'CLIENT',
                company_name,
                permissions,
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company_name: user.company_name,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
