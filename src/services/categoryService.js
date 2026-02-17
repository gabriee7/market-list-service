import categoryRepository from '#repositories/categoryRepository.js';
import { v4 as uuidv4 } from 'uuid';

export class CategoryService {
  constructor(repo = categoryRepository) {
    this.repo = repo;
  }

  async create({ name }) {
    const id = uuidv4();
    return this.repo.create({ id, name });
  }

  async list() {
    const rows = await this.repo.getAll();
    return rows.map((r) => ({ id: r.id, name: r.name }));
  }

  async get(id) {
    const row = await this.repo.getById(id);
    if (!row) return null;
    return { id: row.id, name: row.name };
  }

  async update({ id, name }) {
    return this.repo.update({ id, name });
  }

  async remove(id) {
    return this.repo.delete(id);
  }
}

export default new CategoryService();
