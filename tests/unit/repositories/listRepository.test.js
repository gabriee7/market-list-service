import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
const mockExecute = jest.fn();
const mockPool = { execute: mockExecute };
jest.unstable_mockModule('#config/database.js', () => ({ default: mockPool }));

let ListRepository;
beforeAll(async () => {
  const mod = await import('#repositories/listRepository.js');
  ListRepository = mod.ListRepository;
});

let repo;
beforeEach(() => {
  const sut = makeSut();
  repo = sut.repo;
});

describe('ListRepository', () => {
  it('createList inserts a row and returns object', async () => {
    // Arrange
    mockExecute.mockResolvedValue([{}, undefined]);
    const payload = { id: 'id-1', user_id: 'user-1', name: 'Minha lista' };
    // Action
    const result = await repo.createList(payload);
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), [payload.id, payload.user_id, payload.name]);
    expect(result).toEqual(payload);
  });

  it('addItem inserts item and returns item', async () => {
    // Arrange
    mockExecute.mockResolvedValue([{}, undefined]);
    const item = { id: 'item-1', list_id: 'id-1', product_name: 'Arroz', quantity: 2, unit_price: 10 };
    // Action
    const result = await repo.addItem(item);
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), [item.id, item.list_id, item.product_name, item.quantity, item.unit_price]);
    expect(result).toEqual(item);
  });

  it('getListsByUserId returns rows as-is', async () => {
    // Arrange
    const rows = [{ list_id: 'l1' }, { list_id: 'l2' }];
    mockExecute.mockResolvedValue([rows, undefined]);
    // Action
    const result = await repo.getListsByUserId('user-1');
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['user-1']);
    expect(result).toEqual(rows);
  });

  it('getListById returns single row or null', async () => {
    // Arrange
    mockExecute.mockResolvedValue([[{ id: 'l1' }], undefined]);
    // Action
    const result = await repo.getListById('l1');
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['l1']);
    expect(result).toEqual({ id: 'l1' });
  });

  it('updateList returns updated object when affectedRows>0', async () => {
    // Arrange
    mockExecute.mockResolvedValue([{ affectedRows: 1 }, undefined]);
    // Action
    const result = await repo.updateList({ id: 'l1', name: 'Novo' });
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['Novo', 'l1']);
    expect(result).toEqual({ id: 'l1', name: 'Novo' });
  });

  it('deleteList returns boolean based on affectedRows', async () => {
    // Arrange
    mockExecute.mockResolvedValue([{ affectedRows: 1 }, undefined]);
    // Action
    const result = await repo.deleteList('l1');
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['l1']);
    expect(result).toBe(true);
  });
});

function makeSut(overrides = {}) {
  const execute = (overrides.pool && overrides.pool.execute) ? overrides.pool.execute : mockExecute;
  const pool = { execute, ...overrides.pool };
  const repo = new ListRepository(pool);
  return { repo, mockPool: pool, mockExecute: execute };
}