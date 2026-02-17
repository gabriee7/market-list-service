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
    const result = await this.repo.createList({ id, user_id: userId, name, has_price: arguments[0].has_price });
    return result;
  }

  async addItem({ userId, listId, product_name, quantity, unit_price, checked }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) 
      throw new BadRequestException('Cannot add items to a list you do not own');
    const id = uuidv4();
    const q = parseInt(quantity, 10) || 0;
    const price = unit_price !== undefined ? parseFloat(unit_price) : 0;
    const item = await this.repo.addItem({ id, list_id: listId, product_name, quantity: q, unit_price: price, checked });
    return { id: item.id, productName: item.product_name, quantity: q, unitPrice: price, subtotal: Number((q * price).toFixed(2)), checked: !!item.checked };
  }

  async updateItem({ userId, listId, itemId, product_name, quantity, unit_price, checked }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId)
      throw new BadRequestException('Cannot modify items of a list you do not own');

    const existing = await this.repo.getItemById(itemId);
    if (!existing) throw new NotFoundException('Item not found');
    if (existing.list_id !== listId) throw new BadRequestException('Item does not belong to the specified list');

    const q = quantity !== undefined ? parseInt(quantity, 10) : Number(existing.quantity || 0);
    const price = unit_price !== undefined ? parseFloat(unit_price) : Number(existing.unit_price || 0);
    const checkedVal = checked !== undefined ? !!checked : (existing.checked ? !!existing.checked : false);

    const updated = await this.repo.updateItem({ id: itemId, list_id: listId, product_name: product_name ?? existing.product_name, quantity: q, unit_price: price, checked: checkedVal });
    if (!updated) throw new Error('Failed to update item');
    return { id: itemId, productName: updated.product_name, quantity: q, unitPrice: price, subtotal: Number((q * price).toFixed(2)), checked: checkedVal };
  }

  async deleteItem({ userId, listId, itemId }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId)
      throw new BadRequestException('Cannot delete items of a list you do not own');

    const existing = await this.repo.getItemById(itemId);
    if (!existing) throw new NotFoundException('Item not found');
    if (existing.list_id !== listId) throw new BadRequestException('Item does not belong to the specified list');

    const ok = await this.repo.deleteItem(itemId);
    if (!ok) throw new Error('Failed to delete item');
    return true;
  }

  async getListsByUserId(userId) {
    const rows = await this.repo.getListsByUserId(userId);
    const map = new Map();
    for (const r of rows) {
      const listId = r.list_id;
      if (!map.has(listId)) {
        map.set(listId, { id: listId, name: r.list_name, user_id: r.user_id, created_at: r.created_at, items: [], has_price: !!r.has_price });
      }
      if (r.item_id) {
        const item = {
          id: r.item_id,
          product_name: r.product_name,
          quantity: Number(r.quantity),
          unit_price: this._toNumber(r.unit_price),
          checked: !!r.checked
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

  async getList({ userId, listId }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) throw new BadRequestException('Cannot view a list you do not own');

    const items = await this.repo.getItemsByListId(listId);
    const mappedItems = (items || []).map((it) => ({
      id: it.id,
      productName: it.product_name,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      subtotal: Number((Number(it.quantity) * Number(it.unit_price || 0)).toFixed(2)),
      checked: !!it.checked
    }));
    const total = mappedItems.reduce((acc, it) => acc + (Number(it.quantity) * Number(it.unit_price || 0)), 0);
    return { id: list.id, name: list.name, user_id: list.user_id, created_at: list.created_at, items: mappedItems, total: Number(total.toFixed(2)), has_price: !!list.has_price };
  }

  async getItemsByListId({ userId, listId }) {
    const list = await this.repo.getListById(listId);
    if (!list) throw new NotFoundException('List not found');
    if (list.user_id !== userId) throw new BadRequestException('Cannot view items of a list you do not own');

    const items = await this.repo.getItemsByListId(listId);
    return (items || []).map((it) => ({
      id: it.id,
      productName: it.product_name,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      subtotal: Number((Number(it.quantity) * Number(it.unit_price || 0)).toFixed(2)),
      checked: !!it.checked
    }));
  }

  _toNumber(value) {
    if (value === null || value === undefined) return 0;
    return Number(value);
  }
}

export default new ListService();
