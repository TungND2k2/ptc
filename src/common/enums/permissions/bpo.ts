import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const BPO_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.BPO,
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
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    controller: Controllers.BPO_Product,
    method: Methods.FindManyWithPaging,
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
      attributes: null,
      costPrice: null,
      partnerCode: null,
      status: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    controller: Controllers.BPO_Order,
    method: Methods.FindManyWithPaging,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    controller: Controllers.BPO_Order,
    method: Methods.CreateOne,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
  {
    role: Roles.OrganizationSale,
    service: Services.BPO,
    controller: Controllers.OFM_Report,
    method: Methods.StatisticsOrder,
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
      partnerCode: null,
      partnerAPIResponse: null,
    },
  },
];
