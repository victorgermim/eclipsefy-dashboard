const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addMetrics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { service_type, data, month, year } = req.body;

        const metrics = await prisma.serviceMetric.create({
            data: {
                user_id: parseInt(userId),
                service_type,
                data, // JSON
                month,
                year,
            },
        });

        res.status(201).json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add metrics' });
    }
};

exports.getClientMetrics = async (req, res) => {
    try {
        const userId = req.userId;
        const metrics = await prisma.serviceMetric.findMany({
            where: { user_id: userId },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};

exports.getMetricsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const metrics = await prisma.serviceMetric.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        res.json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user metrics' });
    }
};
