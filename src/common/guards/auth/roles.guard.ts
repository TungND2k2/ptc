import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CONTROLLER_KEY,
  SERVICE_KEY,
} from 'src/common/decorators/service-info';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Services } from 'src/common/enums/services';
import { Permissions } from '../../enums/permissions';
import { logData, logInfo } from 'src/common/utils/log-helper';
import { Permission } from 'src/common/types/data';
import { Methods } from 'src/common/enums/methods';
import { Controllers } from 'src/common/enums/controllers';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip permission check for public endpoints
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const service = this.reflector.getAllAndOverride<Services>(SERVICE_KEY, [
      context.getClass(),
    ]);
    const controller = this.reflector.getAllAndOverride<string>(
      CONTROLLER_KEY,
      [context.getClass()],
    );
    const request = context.switchToHttp().getRequest();
    const auth: DataHandler = request.user;
    const method = context.getHandler().name;
    const projectId =
      request.headers.projectId || request.headers.projectid || '';
    auth.accessToken = request.headers.authorization || '';
    auth.projectId = projectId;
    logInfo(`*`, `RolesGuards -> auth`, {
      userId: auth.userId,
      appId: '',
      orgId: auth.orgId,
      roles: auth.roles,
    });
    logInfo(`*`, `RolesGuards -> service`, service);
    logInfo(`*`, `RolesGuards -> controller`, controller);
    logInfo(`*`, `RolesGuards -> method`, method);
    let permission = Permissions.find((p: Permission) => {
      return (
        p.service === service &&
        p.controller === controller &&
        p.method === method &&
        auth.roles.indexOf(p.role) >= 0
      );
    });

    if (permission === undefined) {
      permission = Permissions.find((p: Permission) => {
        return (
          p.service === service &&
          p.controller === controller &&
          p.method === Methods.Any &&
          auth.roles.indexOf(p.role) >= 0
        );
      });
      if (permission === undefined) {
        permission = Permissions.find((p: Permission) => {
          return (
            p.service === service &&
            p.controller === Controllers.Any &&
            p.method === Methods.Any &&
            auth.roles.indexOf(p.role) >= 0
          );
        });
        if (permission === undefined) {
          permission = Permissions.find((p: Permission) => {
            return (
              p.service === Services.Any &&
              p.controller === Controllers.Any &&
              p.method === Methods.Any &&
              auth.roles.indexOf(p.role) >= 0
            );
          });
        }
      }
    }
    if (permission) {
      auth.request = permission.request;
      auth.response = permission.response;
    }
    logInfo(`*`, `RolesGuads -> permission`, permission);
    request.contexts = {
      service: service,
      controller: controller,
      method: method,
      permission: permission,
    };
    return permission !== undefined;
  }
}
