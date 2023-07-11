import mysql from 'mysql2/promise';

const databaseName: string = 'tests';
const connectionData = {
    host: 'localhost',
    port: 3306,
    user: 'victor',
    password: '123',
    database: databaseName
};

const connection: mysql.Pool = mysql.createPool(connectionData);

export { databaseName, connection };
