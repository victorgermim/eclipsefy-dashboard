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
                services: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.updateUserServices = async (req, res) => {
    try {
        const { id } = req.params;
        const { services } = req.body;

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { services },
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user services' });
    }
};
