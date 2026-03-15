import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(
  Strategy,
  'basic-auth',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, appId, appSecret): Promise<any> => {
    console.log(process.env.APP_ID, process.env.APP_SECRET);
    console.log(process.env.APP_ROLE);
    if (process.env.APP_ID === appId && process.env.APP_SECRET === appSecret) {
      const result = {
        userId: '',
        appId,
        orgId: '',
        roles: [],
      };
      if (process.env.APP_ROLE) {
        result.roles.push(process.env.APP_ROLE);
      }
      return result;
    }
    throw new UnauthorizedException();
  };
}
