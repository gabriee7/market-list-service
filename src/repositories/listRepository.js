import poolDefault from '#config/database.js';

const TABLE_LISTS = 'shopping_lists';
const TABLE_ITEMS = 'items';

export class ListRepository {
  constructor(pool = poolDefault) {
    this.pool = pool;
  }

  async createList({ id, user_id, name }) {
    const sql = `INSERT INTO ${TABLE_LISTS} (id, user_id, name) VALUES (?, ?, ?)`;
    await this.pool.execute(sql, [id, user_id, name]);
    return { id, user_id, name };
  }

  async addItem({ id, list_id, product_name, quantity, unit_price }) {
    const sql = `INSERT INTO ${TABLE_ITEMS} (id, list_id, product_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)`;
    await this.pool.execute(sql, [id, list_id, product_name, quantity, unit_price]);
    return { id, list_id, product_name, quantity, unit_price };
  }

  async getListsByUserId(userId) {
    const sql = `
      SELECT l.id as list_id, l.name as list_name, l.user_id, l.created_at,
             i.id as item_id, i.product_name, i.quantity, i.unit_price
      FROM ${TABLE_LISTS} l
      LEFT JOIN ${TABLE_ITEMS} i ON l.id = i.list_id
      WHERE l.user_id = ?
      ORDER BY l.created_at ASC
    `;
    const [rows] = await this.pool.execute(sql, [userId]);
    return rows;
  }

  async getListById(listId) {
    const sql = `SELECT * FROM ${TABLE_LISTS} WHERE id = ? LIMIT 1`;
    const [rows] = await this.pool.execute(sql, [listId]);
    return rows[0] || null;
  }

  async updateList({ id, name }) {
    const sql = `UPDATE ${TABLE_LISTS} SET name = ? WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [name, id]);
    return result.affectedRows > 0 ? { id, name } : null;
  }

  async deleteList(id) {
    const sql = `DELETE FROM ${TABLE_LISTS} WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new ListRepository();