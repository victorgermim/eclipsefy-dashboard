const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function patchSchema() {
    try {
        console.log('Checking User table for new fields...');

        // Add phone column
        try {
            await prisma.$executeRaw`ALTER TABLE User ADD COLUMN phone VARCHAR(191)`;
            console.log('Added phone column to User.');
        } catch (e) {
            console.log('User.phone might already exist:', e.message);
        }

        // Add cpf_cnpj column
        try {
            await prisma.$executeRaw`ALTER TABLE User ADD COLUMN cpf_cnpj VARCHAR(191)`;
            console.log('Added cpf_cnpj column to User.');
        } catch (e) {
            console.log('User.cpf_cnpj might already exist:', e.message);
        }

    } catch (e) {
        console.error('Fatal error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

patchSchema();
