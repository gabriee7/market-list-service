import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError.js';

export default class BadRequestException extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}