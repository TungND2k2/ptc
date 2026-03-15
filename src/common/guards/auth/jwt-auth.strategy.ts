import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = process.env.JWT_SECRET || '';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    let defaultRole = '';
    if (Array.isArray(payload?.roles)) {
      if (payload.roles.length > 0) {
        defaultRole = payload.roles[0];
      }
    }

    if (payload.sub && payload.realm_access.roles) {
      payload.user = {
        attributes: {},
      };
      payload.user.id = payload.sub;
      payload.user.fullname = payload.name;
      payload.user.attributes.id = payload.sub;
      payload.user.attributes.email = payload.email;
      payload.user.attributes.phone = payload.phone || '';
      payload.user.attributes.address = payload.address || '';
      payload.roles = payload.realm_access.roles.find(
        (role) => role == `${process.env.APP_ROLE_UNI_OWNER}`,
      );
      console.log(payload.roles);
      if (!payload.roles) {
        payload.roles =
          payload.realm_access.roles.find(
            (role) => role == `${process.env.APP_ROLE_OWNER}`,
          ) ||
          payload.realm_access.roles.find(
            (role) => role == `${process.env.APP_ROLE_CUSTOMER}`,
          ) ||
          ' ';
      }
      payload.user.orgId = payload.orgId || ' ';
    }
    return {
      userId: payload.user.id,
      appId: '',
      orgId: payload.user.orgId,
      refOrgId: payload.customerId,
      role: defaultRole,
      roles: [payload.roles],
      staffCode: payload.user.staffCode || '',
      attributes: payload.user?.attributes || {},
    };
  }
}
