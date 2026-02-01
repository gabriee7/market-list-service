import { v4 as uuidv4 } from 'uuid';
import { ListRepository } from '#repositories/listRepository.js';
import { NotFoundException, BadRequestException } from '#errors/index.js';

export class ListService {
  constructor(listRepository = new ListRepository()) {
    this.repo = listRepository;
  }

  async createList({ userId, name }) {
    if (!userId) throw new BadRequestException('Missing user id');
    const id = uuidv4();
    const result = await this.repo.createList({ id, user_id: userId, name });
    return result;
  }

  async addItem({ userId, listId, product_name, quantity, unit_price }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) 
      throw new BadRequestException('Cannot add items to a list you do not own');
    const id = uuidv4();
    const q = parseInt(quantity, 10) || 0;
    const price = parseFloat(unit_price) || 0;
    const item = await this.repo.addItem(
      {
        id,
        list_id: listId,
        product_name,
        quantity: q,
        unit_price: price
      }
    );
    return { ...item, subtotal: Number((q * price).toFixed(2)) };
  }

  async getListsByUserId(userId) {
    const rows = await this.repo.getListsByUserId(userId);
    const map = new Map();
    for (const r of rows) {
      const listId = r.list_id;
      if (!map.has(listId)) {
        map.set(listId, {
          id: listId,
          name: r.list_name,
          user_id: r.user_id,
          created_at: r.created_at,
          items: []
        });
      }
      if (r.item_id) {
        const item = {
          id: r.item_id,
          product_name: r.product_name,
          quantity: Number(r.quantity),
          unit_price: this._toNumber(r.unit_price)
        };
        map.get(listId).items.push(item);
      }
    }
    const lists = Array.from(map.values()).map((l) => {
      const total = l.items.reduce((acc, it) => acc + (Number(it.quantity) * Number(it.unit_price || 0)), 0);
      return { ...l, total: Number(total.toFixed(2)) };
    });
    return lists;
  }

  async updateList({ userId, listId, name }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) 
      throw new BadRequestException('Cannot modify a list you do not own');
    const updated = await this.repo.updateList({ id: listId, name });
    if (!updated) throw new Error('Failed to update list');
    return { id: listId, name, user_id: list.user_id };
  }

  async deleteList({ userId, listId }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) 
      throw new BadRequestException('Cannot delete a list you do not own');
    const ok = await this.repo.deleteList(listId);
    if (!ok) throw new Error('Failed to delete list');
    return true;
  }

  _toNumber(value) {
    if (value === null || value === undefined) return 0;
    return Number(value);
  }
}

export default new ListService();
