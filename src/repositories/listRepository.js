import poolDefault from '#config/database.js';

const TABLE_LISTS = 'shopping_lists';
const TABLE_ITEMS = 'items';

export class ListRepository {
  constructor(pool = poolDefault) {
    this.pool = pool;
  }

  async createList({ id, user_id, name }) {
    const sql = `INSERT INTO ${TABLE_LISTS} (id, user_id, name, has_price) VALUES (?, ?, ?, ?)`;
    const has_price = arguments[0].has_price ? 1 : 0;
    await this.pool.execute(sql, [id, user_id, name, has_price]);
    return { id, user_id, name, has_price };
  }

  async addItem({ id, list_id, product_name, quantity, unit_price, checked, category_id }) {
    const sql = `INSERT INTO ${TABLE_ITEMS} (id, list_id, product_name, quantity, unit_price, checked, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const checkedVal = checked ? 1 : 0;
    await this.pool.execute(sql, [id, list_id, product_name, quantity, unit_price, checkedVal, category_id || null]);
    return { id, list_id, product_name, quantity, unit_price, checked: checkedVal, category_id: category_id || null };
  }

  async getListsByUserId(userId) {
    const sql = `
            SELECT l.id as list_id, l.name as list_name, l.user_id, l.created_at, l.has_price,
              i.id as item_id, i.product_name, i.quantity, i.unit_price, i.checked, i.category_id, c.name as category_name
      FROM ${TABLE_LISTS} l
      LEFT JOIN ${TABLE_ITEMS} i ON l.id = i.list_id
      LEFT JOIN categories c ON i.category_id = c.id
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

  async getItemById(itemId) {
    const sql = `SELECT i.*, c.name as category_name FROM ${TABLE_ITEMS} i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = ? LIMIT 1`;
    const [rows] = await this.pool.execute(sql, [itemId]);
    return rows[0] || null;
  }

  async getItemsByListId(listId) {
    const sql = `SELECT i.*, c.name as category_name FROM ${TABLE_ITEMS} i LEFT JOIN categories c ON i.category_id = c.id WHERE i.list_id = ? ORDER BY i.created_at ASC`;
    const [rows] = await this.pool.execute(sql, [listId]);
    return rows;
  }

  async updateList({ id, name, has_price }) {
    const sql = `UPDATE ${TABLE_LISTS} SET name = ?, has_price = ? WHERE id = ?`;
    const hasPriceVal = has_price ? 1 : 0;
    const [result] = await this.pool.execute(sql, [name, hasPriceVal, id]);
    return result.affectedRows > 0 ? { id, name, has_price: hasPriceVal } : null;
  }

  async updateItem({ id, list_id, product_name, quantity, unit_price, checked, category_id }) {
    const parts = [];
    const params = [];
    if (product_name !== undefined) { parts.push('product_name = ?'); params.push(product_name); }
    if (quantity !== undefined) { parts.push('quantity = ?'); params.push(quantity); }
    if (unit_price !== undefined) { parts.push('unit_price = ?'); params.push(unit_price); }
    if (checked !== undefined) { parts.push('checked = ?'); params.push(checked ? 1 : 0); }
    if (category_id !== undefined) { parts.push('category_id = ?'); params.push(category_id); }
    if (parts.length === 0) return null;
    const sql = `UPDATE ${TABLE_ITEMS} SET ${parts.join(', ')} WHERE id = ? AND list_id = ?`;
    params.push(id, list_id);
    const [result] = await this.pool.execute(sql, params);
    return result.affectedRows > 0 ? { id, list_id, product_name, quantity, unit_price, checked, category_id } : null;
  }

  async deleteItem(id) {
    const sql = `DELETE FROM ${TABLE_ITEMS} WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async deleteList(id) {
    const sql = `DELETE FROM ${TABLE_LISTS} WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}

export default new ListRepository();