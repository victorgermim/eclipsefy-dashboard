const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
