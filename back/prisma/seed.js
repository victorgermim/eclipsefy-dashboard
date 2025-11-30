const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@eclipsefy.com';
    const password = 'adminpassword'; // Change this in production!
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email: email },
        update: {
            password_hash: hashedPassword,
        },
        create: {
            email: email,
            password_hash: hashedPassword,
            role: 'ADMIN',
            company_name: 'Eclipsefy HQ',
            permissions: { all: true },
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
