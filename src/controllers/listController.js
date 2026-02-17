import listService from '#services/listService.js';
import { mapListResponse } from '#dtos/listMappers.js';

const listController = {
  async createList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { name, hasPrice } = req.body;
      const created = await listService.createList({ userId, name, has_price: hasPrice });
      return res.status(201).json(mapListResponse({ ...created, items: [], total: 0 }));
    } catch (err) {
      next(err);
    }
  },

  async addItem(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId } = req.params;
      const { productName, quantity, unitPrice, checked } = req.body;
      const item = await listService.addItem({ userId, listId, product_name: productName, quantity, unit_price: unitPrice, checked });
      return res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },

  async updateList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId } = req.params;
      const { name } = req.body;
      const updated = await listService.updateList({ userId, listId, name });
      return res.status(200).json(mapListResponse({ ...updated, items: [], total: 0 }));
    } catch (err) {
      next(err);
    }
  },

  async updateItem(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId, itemId } = req.params;
      const { productName, quantity, unitPrice, checked } = req.body;
      const item = await listService.updateItem({ userId, listId, itemId, product_name: productName, quantity, unit_price: unitPrice, checked });
      return res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },

  async deleteItem(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId, itemId } = req.params;
      await listService.deleteItem({ userId, listId, itemId });
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async deleteList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId } = req.params;
      await listService.deleteList({ userId, listId });
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getLists(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const lists = await listService.getListsByUserId(userId);
      const mapped = lists.map(mapListResponse);
      return res.status(200).json(mapped);
    } catch (err) {
      next(err);
    }
  }
,

  async getList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId } = req.params;
      const list = await listService.getList({ userId, listId });
      return res.status(200).json(mapListResponse(list));
    } catch (err) {
      next(err);
    }
  },

  async getItems(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      const { id: listId } = req.params;
      const items = await listService.getItemsByListId({ userId, listId });
      return res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }
};

export default listController;
