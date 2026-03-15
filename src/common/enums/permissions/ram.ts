import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Ram_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.Ram,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
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
    role: Roles.UniverseOwner,
    service: Services.Ram,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {},
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
];
