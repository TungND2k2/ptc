import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
  private readonly validPassword =
    process.env.BASIC_AUTH_PASSWORD || 'admin@123';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const authParts = authHeader.split(' ');

    if (authParts.length !== 2 || authParts[0] !== 'Basic') {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const [username, password] = Buffer.from(authParts[1], 'base64')
      .toString()
      .split(':');

    if (username !== this.validUsername || password !== this.validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
