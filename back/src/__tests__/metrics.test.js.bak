process.env.JWT_SECRET = 'testsecret';
adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, 'testsecret');
clientToken = jwt.sign({ id: 2, role: 'CLIENT' }, 'testsecret');
    });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('POST /api/metrics/:userId', () => {
    it('should allow admin to add metrics', async () => {
        const prisma = new PrismaClient();
        prisma.metrics.create.mockResolvedValue({ id: 1, investment_amount: 1000 });

        const res = await request(app)
            .post('/api/metrics/2')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                month: 1,
                year: 2023,
                investment_amount: 1000,
                leads_generated: 50,
                roas: 5.0,
                cpa: 20.0,
            });

        expect(res.statusCode).toEqual(201);
    });

    it('should deny client from adding metrics', async () => {
        const res = await request(app)
            .post('/api/metrics/2')
            .set('Authorization', `Bearer ${clientToken}`)
            .send({});

        expect(res.statusCode).toEqual(403);
    });
});

describe('GET /api/metrics/my-metrics', () => {
    it('should return metrics for the logged in client', async () => {
        const prisma = new PrismaClient();
        prisma.metrics.findMany.mockResolvedValue([{ id: 1, investment_amount: 1000 }]);

        const res = await request(app)
            .get('/api/metrics/my-metrics')
            .set('Authorization', `Bearer ${clientToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(prisma.metrics.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { user_id: 2 }
        }));
    });
});
});
