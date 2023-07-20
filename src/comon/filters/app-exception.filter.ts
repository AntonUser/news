import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { TypeORMError } from 'typeorm';
import { JsonResponse } from '../interfaces/json-response.interface';
import { getReasonPhrase } from 'http-status-codes';
// import httpStatus from 'http-status';

interface ExceptionResponse {
  statusCode: number;
  message: string;
  error?: string;
}

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost as HttpAdapterHost;
    const ctx = host.switchToHttp();

    const body: JsonResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: getReasonPhrase(500),
    };

    if (exception instanceof HttpException) {
      const code = exception.getStatus();
      const exceptionRes = exception.getResponse();
      const exceptionResObj = (
        isObject(exceptionRes) ? exceptionRes : {}
      ) as ExceptionResponse;

      body.code = code;
      body.success = code < HttpStatus.BAD_REQUEST;
      body.message = exceptionResObj.error
        ? exceptionResObj.message
        : getReasonPhrase(code);

      if (exception.name === 'ValidationException') {
        body.errors = (exceptionRes || []) as JsonResponse['errors'];
      }
    } else if (exception instanceof TypeORMError) {
      if (exception.name === 'EntityNotFoundError') {
        body.code = HttpStatus.NOT_FOUND;
        body.message = 'Entity not found';
      } else if (
        exception.name === 'QueryFailedError' &&
        exception.message.includes('duplicate')
      ) {
        body.code = HttpStatus.CONFLICT;
        body.message = 'This entity already exists';
      }
    } else {
      return super.catch(exception, host);
    }

    this.logger.error(exception.message, exception.stack);

    httpAdapter.reply(ctx.getResponse(), body, body.code);
  }
}
