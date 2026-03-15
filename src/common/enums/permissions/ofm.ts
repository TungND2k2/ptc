import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const OFM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.OFM,
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
    role: Roles.OrganizationSIMPartner,
    service: Services.OFM,
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
    role: Roles.OrganizationOwner,
    service: Services.OFM,
    controller: Controllers.OFM_OTP,
    method: Methods.Any,
    request: {
      where: {
        orgId: '{{orgId}}',
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
    role: Roles.OrganizationSIMPartner,
    service: Services.OFM,
    controller: Controllers.OFM_OTP,
    method: Methods.Any,
    request: {
      where: {
        orgId: '{{orgId}}',
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
    service: Services.OFM,
    controller: Controllers.OFM_OTP,
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
    role: Roles.OrganizationOwner,
    service: Services.OFM,
    controller: Controllers.OFM_OTPRequest,
    method: Methods.Any,
    request: {
      where: {
        orgId: '{{orgId}}',
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
    role: Roles.OrganizationSIMPartner,
    service: Services.OFM,
    controller: Controllers.OFM_OTPRequest,
    method: Methods.Any,
    request: {
      where: {
        orgId: '{{orgId}}',
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
    service: Services.OFM,
    controller: Controllers.OFM_OTPRequest,
    method: Methods.Any,
    request: {
      where: {
        orgId: '{{orgId}}',
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
    service: Services.OFM,
    controller: Controllers.OFM_Utils,
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
    role: Roles.OrganizationFarmer,
    service: Services.OFM,
    controller: Controllers.Any,
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
