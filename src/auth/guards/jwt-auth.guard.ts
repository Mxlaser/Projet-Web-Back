import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): { user?: { userId: string } } {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { userId: string } }>();
    return req;
  }
}
