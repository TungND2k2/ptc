import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Default_Permissions: Permission[] = [
  // Start: UniverseOwner
  // {
  //   role: Roles.UniverseOwner,
  //   service: Services.Any,
  //   controller: Controllers.Any,
  //   method: Methods.FindOne || Methods.FindManyWithPaging,
  // },
  {
    role: Roles.UniverseOwner,
    service: Services.Any,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
      isUniOwner: true,
      owner: {
        userId: '{{userId}}',
        orgId: '{{orgId}}',
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
    service: Services.WebBot,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
  },

  // End: UniverseOwner
  // {
  //   role: Roles.OrganizationOwner,
  //   service: Services.Any,
  //   controller: Controllers.Any,
  //   method: Methods.Any,
  //   request: {
  //     where: {
  //       'owner.orgId': '{{orgId}}',
  //     },
  //     owner: {
  //       orgId: '{{orgId}}',
  //       userId: '{{userId}}',
  //     },
  //   },
  //   response: {
  //     isDeleted: null,
  //     deletedBy: null,
  //     deletedAt: null,
  //     createdBy: null,
  //     changedBy: null,
  //   },
  // },
];
