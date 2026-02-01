import { StatusCodes } from 'http-status-codes';

export default class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}