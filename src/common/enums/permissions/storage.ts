import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Storage_Permissions: Permission[] = [
  {
    role: Roles.OrganizationManager,
    service: Services.Storage,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
];
