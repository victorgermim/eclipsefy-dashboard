const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSchema() {
    try {
        console.log('Checking User table...');
        try {
            await prisma.$executeRaw`ALTER TABLE User ADD COLUMN services JSON`;
            console.log('Added services column to User.');
        } catch (e) {
            console.log('User.services might already exist:', e.message);
        }

        console.log('Checking ServiceMetric table...');
        try {
            await prisma.$executeRaw`
                CREATE TABLE IF NOT EXISTS ServiceMetric (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    service_type VARCHAR(191) NOT NULL,
                    data JSON NOT NULL,
                    month INT NOT NULL,
                    year INT NOT NULL,
                    createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
                    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
                ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            `;
            console.log('ServiceMetric table ensured.');
        } catch (e) {
            console.log('ServiceMetric creation failed:', e.message);
        }

    } catch (e) {
        console.error('Fatal error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fixSchema();
