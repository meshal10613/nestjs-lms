import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map(
                (data: {
                    message?: string;
                    data?: any;
                    access_token?: string;
                }) => ({
                    success: true,
                    statusCode: response.statusCode,
                    ...data,
                }),
            ),
        );
    }
}
