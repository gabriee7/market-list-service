import { jest, describe, it, expect, beforeEach, beforeAll, afterEach } from '@jest/globals';
let authMiddleware;
let HttpError;

beforeAll(async () => {
  const mod = await import('#middlewares/authMiddleware.js');
  authMiddleware = mod.default;
  const errs = await import('#errors/index.js');
  HttpError = errs.HttpError;
});

beforeEach(() => {
  jest.resetAllMocks();
  process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
});

afterEach(() => {
  delete process.env.AUTH_VERIFY_PATH;
});

describe('authMiddleware', () => {
  it('throws 401 when Authorization header missing', async () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();
    const call = authMiddleware(req, res, next);
    await expect(call).rejects.toThrow(HttpError);
    await expect(call).rejects.toHaveProperty('statusCode', 401);
  });

  it('throws 500 when AUTH_SERVICE_URL not configured', async () => {
    delete process.env.AUTH_SERVICE_URL;
    const req = { headers: { authorization: 'Bearer tok' } };
    const res = {};
    const next = jest.fn();
    const call = authMiddleware(req, res, next);
    await expect(call).rejects.toThrow(HttpError);
    await expect(call).rejects.toHaveProperty('statusCode', 500);
  });

  it('calls next and sets req.user on successful verify (payload.id)', async () => {
    const fakeResp = { status: 200, json: async () => ({ payload: { id: 'u-1' } }) };
    global.fetch = jest.fn().mockResolvedValue(fakeResp);

    const req = { headers: { authorization: 'Bearer tok' } };
    const res = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(global.fetch).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('u-1');
  });

  it('throws 401 when auth service returns 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    const req = { headers: { authorization: 'Bearer tok' } };
    const res = {};
    const next = jest.fn();
    const call = authMiddleware(req, res, next);
    await expect(call).rejects.toThrow(HttpError);
    await expect(call).rejects.toHaveProperty('statusCode', 401);
  });

  it('throws 502 when fetch rejects (network error)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('connect ECONNREFUSED'));
    const req = { headers: { authorization: 'Bearer tok' } };
    const res = {};
    const next = jest.fn();
    const call = authMiddleware(req, res, next);
    await expect(call).rejects.toThrow(HttpError);
    await expect(call).rejects.toHaveProperty('statusCode', 502);
  });

  it('throws 500 when verify returns 200 but payload missing id', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200, json: async () => ({}) });
    const req = { headers: { authorization: 'Bearer tok' } };
    const res = {};
    const next = jest.fn();
    const call = authMiddleware(req, res, next);
    await expect(call).rejects.toThrow(HttpError);
    await expect(call).rejects.toHaveProperty('statusCode', 500);
  });
});