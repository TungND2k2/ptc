import { Roles } from '../roles';
import { Methods } from '../methods';
import { Services } from '../services';
import { Controllers } from '../controllers';
import { Permission } from '../../types/data';

export const Billing_v2_Permissions: Permission[] = [
  // PRICE
  {
    role: Roles.OrganizationOwner,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_Price,
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
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_Price,
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

  {
    role: Roles.OrganizationCustomer,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_Price,
    method: Methods.CalculatePrice,
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
    role: Roles.OrganizationCustomer,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_Price,
    method: Methods.FindManyWithPaging,
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
  //PRICE

  // LOGS
  {
    role: Roles.OrganizationCustomer,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_SubscriptionLogs,
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
    role: Roles.OrganizationOwner,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_SubscriptionLogs,
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
  // LOGS

  // SUBSCRIPTION
  {
    role: Roles.OrganizationOwner,
    service: Services.Billing_V2,
    controller: Controllers.Billing_v2_Subscription,
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
  // SUBSCRIPTION
  {
    role: Roles.OrganizationOwner,
    service: Services.Billing_V2,
    controller: Controllers.Report,
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
