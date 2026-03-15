import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const CSM_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.CSM,
    controller: Controllers.CSM_Container,
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
    service: Services.CSM,
    controller: Controllers.CSM_Host,
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
    service: Services.CSM,
    controller: Controllers.CSM_Template,
    method: Methods.FindOne,
    request: {},
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
    service: Services.CSM,
    controller: Controllers.CSM_Template,
    method: Methods.FindManyWithPaging,
    request: {},
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
    service: Services.CSM,
    controller: Controllers.CSM_TemplateCategories,
    method: Methods.FindOne,
    request: {},
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
    service: Services.CSM,
    controller: Controllers.CSM_TemplateCategories,
    method: Methods.FindManyWithPaging,
    request: {},
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
    service: Services.CSM,
    controller: Controllers.CSM_Volume,
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
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.CSM,
    controller: Controllers.CSM_SetupGuide,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        status: 'active',
      },
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.CSM,
    controller: Controllers.CSM_SetupGuide,
    method: Methods.FindOne,
    request: {
      where: {
        status: 'active',
      },
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.CSM,
    controller: Controllers.Report,
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
    service: Services.CSM,
    controller: Controllers.Util,
    method: Methods.Any,
    // request: {
    //   // where: {
    //   //   'owner.orgId': '{{orgId}}',
    //   // },
    //   // owner: {
    //   //   orgId: '{{orgId}}',
    //   //   userId: '{{userId}}',
    //   // },
    // },
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
    },
  },
];
