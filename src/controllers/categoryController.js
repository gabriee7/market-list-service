import categoryService from '#services/categoryService.js';

export class CategoryController {
  constructor(service = categoryService) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const created = await this.service.create({ name });
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const items = await this.service.list();
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;
      const found = await this.service.get(id);
      if (!found) return res.sendStatus(404);
      return res.json(found);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updated = await this.service.update({ id, name });
      if (!updated) return res.sendStatus(404);
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const ok = await this.service.remove(id);
      if (!ok) return res.sendStatus(404);
      return res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default new CategoryController();
