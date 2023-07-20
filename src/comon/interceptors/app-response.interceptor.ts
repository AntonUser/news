import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { JsonResponse } from '../interfaces/json-response.interface';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<JsonResponse> {
    return next.handle().pipe(
      map((v) => ({
        code: v ? HttpStatus.OK : HttpStatus.NO_CONTENT,
        success: true,
        message: 'Ok',
        ...(v && {
          data: v,
        }),
      })),
    );
  }
}
