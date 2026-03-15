import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuardApx implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Basic ')) {
      const base64Credentials = authorizationHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii',
      );
      const [appId, appSecret] = credentials.split(':');

      if (appId && appSecret && appId != '' && appSecret != '') {
        console.log('App user', {
          appId: appId,
          appSecret: appSecret,
        });
        request.user = {
          appId: appId,
          appSecret: appSecret,
        };
        return true;
      }
    }
    throw new UnauthorizedException();
  }
}
