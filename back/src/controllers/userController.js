const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            select: {
                id: true,
                email: true,
                company_name: true,
                avatar_url: true,
                permissions: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
