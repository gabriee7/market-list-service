import { StatusCodes } from 'http-status-codes';
import { HttpError } from '#errors/index.js';

export default async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new HttpError('Authorization token missing', 401);
  const authServiceBase = process.env.AUTH_SERVICE_URL;
  if (!authServiceBase)
    throw new HttpError(
      'AUTH_SERVICE_URL not configured; token verification must be performed by the auth microservice',
      500
    );
  const verifyPath = '/api/auth/verify';
  let verifyUrl;
  try {
    const baseUrl = new URL(authServiceBase);
    verifyUrl = new URL(verifyPath, baseUrl).toString();
  } catch {
    throw new HttpError('Invalid AUTH_SERVICE_URL configured', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    const resp = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (resp.status === StatusCodes.OK) {
      const body = await resp.json();
      const userId = body?.payload?.id;
      if (!userId) throw new HttpError('Invalid verify response', StatusCodes.INTERNAL_SERVER_ERROR);
      req.user = { id: userId };
      return next();
    }
    if (resp.status === StatusCodes.UNAUTHORIZED ||
      resp.status === StatusCodes.FORBIDDEN
    ) 
      throw new HttpError('Invalid or expired token', StatusCodes.UNAUTHORIZED);

    throw new HttpError('Token verification failed', StatusCodes.UNAUTHORIZED);
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError('Auth service unreachable', StatusCodes.BAD_GATEWAY);
  }
}