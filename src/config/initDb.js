import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

async function runInitSql() {
  try {
    const filePath = path.resolve(process.cwd(), 'init.sql');
    const sql = await fs.readFile(filePath, 'utf8');
    if (!sql || !sql.trim()) {
      console.log('No init.sql found or file empty — skipping DB init');
      return;
    }
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 3306;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });
    if (dbName) {
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await conn.query(`USE \`${dbName}\`;`);
    }
    await conn.query(sql);
    await conn.end();
  } catch (err) {
    console.warn('Failed to run init.sql:', err.message);
  }
}

export default runInitSql;