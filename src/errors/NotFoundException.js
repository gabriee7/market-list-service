import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError.js';

export default class NotFoundException extends HttpError {
  constructor(message = 'Not Found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}