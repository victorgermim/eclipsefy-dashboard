const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addMetrics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year, investment_amount, leads_generated, roas, cpa } = req.body;

        const metrics = await prisma.metrics.create({
            data: {
                user_id: parseInt(userId),
                month,
                year,
                investment_amount,
                leads_generated,
                roas,
                cpa,
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
        const metrics = await prisma.metrics.findMany({
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
        const metrics = await prisma.metrics.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        res.json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user metrics' });
    }
};
