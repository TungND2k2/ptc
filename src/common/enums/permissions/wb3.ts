import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const WB3_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.WB3,
    controller: Controllers.WB3_Transaction,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
        'owner.userId': '{{userId}}',
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
  {
    role: Roles.OrganizationOwner,
    service: Services.WB3,
    controller: Controllers.Util,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
        'owner.userId': '{{userId}}',
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
