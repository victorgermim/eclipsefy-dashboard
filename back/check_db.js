const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to DB...');
        await prisma.$connect();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
