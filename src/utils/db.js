import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '1234oficina',
  database: 'menu_digital',
  port: '3306'
});

export default db;