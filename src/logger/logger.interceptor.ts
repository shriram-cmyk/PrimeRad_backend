import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    const startTime = Date.now();

    console.log(`➡️  Request started: ${url}`);

    return next.handle().pipe(
      tap(() => {
        const totalTime = Date.now() - startTime;
        console.log(`⬅️  Request finished: ${url} | Total: ${totalTime} ms`);
      }),
    );
  }
}
