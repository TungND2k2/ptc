import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';
import { CommonStatus } from '../status';

export const APIX_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Connection,
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
      createdAt: null,
      changedAt: null,
      note: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Service,
    method: Methods.FindManyWithPaging,
    response: {
      isDeleted: null,
      deletedBy: null,
      deletedAt: null,
      createdBy: null,
      changedBy: null,
      definition: null,
      configs: null,
      owner: null,
      createdAt: null,
      changedAt: null,
      attributes: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Apx,
    method: Methods.FindOne,
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
    service: Services.API,
    controller: Controllers.APIX_Apx,
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
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Apx,
    method: Methods.FindOne,
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
    service: Services.API,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Usage,
    method: Methods.FindOne,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Usage,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Transaction,
    method: Methods.FindOne,
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
      connectionRequest: null,
      connectionResponse: null,
      appRequest: null,
      appResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Transaction,
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
      connectionRequest: null,
      connectionResponse: null,
      appRequest: null,
      appResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Route,
    method: Methods.FindOne,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Route,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Connection,
    method: Methods.FindOne,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Connection,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_ExportFile,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Configs,
    method: Methods.UpdateOne,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Configs,
    method: Methods.FindOne,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Configs,
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
      connectionRequest: null,
      connectionResponse: null,
    },
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.API,
    controller: Controllers.APIX_Ip,
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
