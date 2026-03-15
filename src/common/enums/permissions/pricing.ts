import { Roles } from '../roles';
import { Methods } from '../methods';
import { Services } from '../services';
import { Controllers } from '../controllers';
import { Permission } from '../../types/data';

export const Pricing_Permissions: Permission[] = [
  // PRICE
  {
    role: Roles.OrganizationOwner,
    service: Services.PRICING,
    controller: Controllers.Pricing_Price,
    method: Methods.CalculatePrice,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
        status: 'active',
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
    service: Services.PRICING,
    controller: Controllers.Pricing_Price,
    method: Methods.Any,
    request: {
      where: {},
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
