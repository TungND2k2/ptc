import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const PCM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.PCM,
    controller: Controllers.PCM_Package,
    method: Methods.FindManyWithPaging,
    request: {
      where: {},
      owner: {
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
    role: Roles.OrganizationCustomer,
    service: Services.PCM,
    controller: Controllers.PCM_Product,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
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
    role: Roles.OrganizationOwner,
    service: Services.PCM,
    controller: Controllers.PCM_Product,
    method: Methods.FindOne,
    request: {
      where: {},
      owner: {
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
    role: Roles.OrganizationCustomer,
    service: Services.PCM,
    controller: Controllers.PCM_Product,
    method: Methods.FindOne,
    request: {
      where: {},
      owner: {
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
    role: Roles.OrganizationCustomer,
    service: Services.PCM,
    controller: Controllers.PCM_Package,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
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
    role: Roles.OrganizationCustomer,
    service: Services.PCM,
    controller: Controllers.PCM_Package,
    method: Methods.FindOne,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
      owner: {
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
];
