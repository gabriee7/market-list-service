import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { BadRequestException } from '#errors/index.js';

let ListService;
beforeAll(async () => {
  const mod = await import('#services/listService.js');
  ListService = mod.ListService;
});

describe('ListService (unit)', () => {
  let mockRepo;
  let svc;

  beforeEach(() => {
    const sut = makeSut();
    mockRepo = sut.mockRepo;
    svc = sut.sut;
  });

  it('createList calls repo and returns created object', async () => {
    // Arrange
    mockRepo.createList.mockResolvedValue({ id: 'l1', user_id: 'u1', name: 'Lista' });
    // Action
    const result = await svc.createList({ userId: 'u1', name: 'Lista' });
    // Assert
    expect(mockRepo.createList).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String), user_id: 'u1', name: 'Lista' }));
    expect(result).toEqual({ id: 'l1', user_id: 'u1', name: 'Lista' });
  });

  it('addItem returns item with subtotal when owner', async () => {
    // Arrange
    mockRepo.getListById.mockResolvedValue({ id: 'l1', user_id: 'u1' });
    mockRepo.addItem.mockResolvedValue({ id: 'it1', list_id: 'l1', product_name: 'P', quantity: 2, unit_price: 5 });
    // Action
    const result = await svc.addItem({ userId: 'u1', listId: 'l1', product_name: 'P', quantity: 2, unit_price: 5 });
    // Assert
    expect(mockRepo.getListById).toHaveBeenCalledWith('l1');
    expect(mockRepo.addItem).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String), list_id: 'l1' }));
    expect(result).toHaveProperty('subtotal', 10);
  });

  it('addItem throws when not owner', async () => {
    // Arrange
    mockRepo.getListById.mockResolvedValue({ id: 'l1', user_id: 'other' });
    // Action
    const call = svc.addItem({ userId: 'u1', listId: 'l1', product_name: 'P', quantity: 1, unit_price: 1 });
    // Assert
    await expect(call).rejects.toThrow(BadRequestException);
  });

  it('getListsByUserId groups items and computes totals', async () => {
    // Arrange
    const rows = [
      { list_id: 'l1', list_name: 'A', user_id: 'u1', created_at: 't', item_id: 'i1', product_name: 'P', quantity: 2, unit_price: 5 },
      { list_id: 'l1', list_name: 'A', user_id: 'u1', created_at: 't', item_id: 'i2', product_name: 'Q', quantity: 1, unit_price: 3 }
    ];
    mockRepo.getListsByUserId.mockResolvedValue(rows);
    // Action
    const lists = await svc.getListsByUserId('u1');

    // Assert
    expect(mockRepo.getListsByUserId).toHaveBeenCalledWith('u1');
    expect(lists).toHaveLength(1);
    expect(lists[0]).toHaveProperty('total', 13);
  });

  it('updateList enforces ownership and returns updated', async () => {
    // Arrange
    mockRepo.getListById.mockResolvedValue({ id: 'l1', user_id: 'u1' });
    mockRepo.updateList.mockResolvedValue({ id: 'l1', name: 'Nova' });
    // Action
    const result = await svc.updateList({ userId: 'u1', listId: 'l1', name: 'Nova' });
    // Assert
    expect(mockRepo.getListById).toHaveBeenCalledWith('l1');
    expect(mockRepo.updateList).toHaveBeenCalledWith({ id: 'l1', name: 'Nova' });
    expect(result).toHaveProperty('name', 'Nova');
  });

  it('deleteList enforces ownership and returns true', async () => {
    // Arrange
    mockRepo.getListById.mockResolvedValue({ id: 'l1', user_id: 'u1' });
    mockRepo.deleteList.mockResolvedValue(true);
    // Action
    const result = await svc.deleteList({ userId: 'u1', listId: 'l1' });
    // Assert
    expect(mockRepo.deleteList).toHaveBeenCalledWith('l1');
    expect(result).toBe(true);
  });
});

// Helper: makeSut kept at the bottom of the file
function makeSut(overrides = {}) {
  const mockRepo = {
    createList: jest.fn(),
    getListById: jest.fn(),
    addItem: jest.fn(),
    getListsByUserId: jest.fn(),
    updateList: jest.fn(),
    deleteList: jest.fn(),
    ...(overrides.repo || {})
  };
  const sut = new ListService(mockRepo);
  return { sut, mockRepo };
}