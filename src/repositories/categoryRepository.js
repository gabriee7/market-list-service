import poolDefault from '#config/database.js';
const TABLE = 'categories';

export class CategoryRepository {
  constructor(pool = poolDefault) {
    this.pool = pool;
  }

  async create({ id, name }) {
    const sql = `INSERT INTO ${TABLE} (id, name) VALUES (?, ?)`;
    await this.pool.execute(sql, [id, name]);
    return { id, name };
  }

  async getAll() {
    const sql = `SELECT * FROM ${TABLE} ORDER BY name ASC`;
    const [rows] = await this.pool.execute(sql);
    return rows;
  }

  async getById(id) {
    const sql = `SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`;
    const [rows] = await this.pool.execute(sql, [id]);
    return rows[0] || null;
  }

  async update({ id, name }) {
    const sql = `UPDATE ${TABLE} SET name = ? WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [name, id]);
    return result.affectedRows > 0 ? { id, name } : null;
  }

  async delete(id) {
    const sql = `DELETE FROM ${TABLE} WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new CategoryRepository();
