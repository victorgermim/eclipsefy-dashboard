const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Tentando conectar ao banco de dados...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
    // Don't log the password

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('\x1b[32m%s\x1b[0m', 'SUCESSO: Conexão nativa funcionou!');
        await connection.end();
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', 'FALHA: Não foi possível conectar.');
        console.error('Detalhes do erro:');
        console.error(`Code: ${err.code}`);
        console.error(`Syscall: ${err.syscall}`);
        console.error(`Address: ${err.address}`);
        console.error(`Port: ${err.port}`);
        console.error(`Message: ${err.message}`);
    }
}

testConnection();
