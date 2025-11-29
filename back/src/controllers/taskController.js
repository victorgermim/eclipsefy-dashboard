const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
    try {
        const { user_id, title, description } = req.body;
        const file = req.file;

        const task = await prisma.task.create({
            data: {
                user_id: parseInt(user_id),
                title,
                description,
                media_url: file ? `/uploads/${file.filename}` : null,
                status: 'BACKLOG',
            },
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.userRole;

        let whereClause = {};
        if (userRole === 'CLIENT') {
            whereClause = { user_id: userId };
        } else if (req.query.userId) {
            whereClause = { user_id: parseInt(req.query.userId) };
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, company_name: true } } }
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

exports.approveTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved, feedback } = req.body;
        const userId = req.userId;

        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                status: approved ? 'DONE' : 'IN_PROGRESS', // Or another status for rejection
                client_feedback: feedback,
            },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
