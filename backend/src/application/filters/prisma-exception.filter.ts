import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'An error occurred';
    let error = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Unique constraint failed';
        message = `Duplicate value for ${exception.meta?.target}. Please use a different value.`;
        break;
      case 'P2014':
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Invalid relation';
        message = `Invalid ID: ${exception.meta?.target}.`;
        break;
      case '2003':
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Foreign key constraint failed';
        message = `Invalid foreign key on the field`;
        break;
      case 'P2025':
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'Record not found';
        message =
          'The record you are trying to access does not exist or has been removed.';
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        error =
          'Internal server error. Please try again later or contact support if the issue persists.';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
