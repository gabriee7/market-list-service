import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError.js';

export default class ConflictException extends HttpError {
  constructor(message = 'Conflict') {
    super(message, StatusCodes.CONFLICT);
  }
}