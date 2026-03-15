import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';
const commonResponse = {
  isDeleted: null,
  deletedBy: null,
  deletedAt: null,
  createdBy: null,
  changedBy: null,
};

export const RSM_Permissions: Permission[] = [
  // ========================
  // Keystone (Identity service - User, Role, Project)
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_User,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Role,
    method: Methods.FindManyWithPaging,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Domain,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Domain,
    method: Methods.FindOne,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Project,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Nova (Compute - Server, Flavor, Keypair)
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Server,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Availability_Zone,
    method: Methods.FindManyWithPaging,
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Availability_Zone,
    method: Methods.FindOne,
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Flavor,
    method: Methods.FindManyWithPaging,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Flavor,
    method: Methods.FindOne,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Keypair,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ServerGroup,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Glance (Image service)
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Image,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Cinder (Block Storage - Volume, Snapshot)
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Volume,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Snapshot,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Neutron (Networking - Network, Subnet, Router, Port, Floating IP, SG, SG Rule)
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Network,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Subnet,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Port,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Router,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Floating_IP,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_SecurityGroup,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_SecurityGroupRule,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Trove
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_Instance,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_Database,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_Config,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_Backup,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_Datastore,
    method: Methods.Any,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_DB_User,
    method: Methods.Any,
    request: {},
    response: commonResponse,
  },

  // ========================
  // Report
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.Report,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  // ========================
  // Abstract Layer: Lb
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_LoadBalancer,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Listener,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Pool,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Member,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_HealthMonitor,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  // ========================
  // Abstract Layer: Resource
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Resource,
    method: Methods.FindManyWithPaging,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Resource,
    method: Methods.FindOne,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  // ========================
  // Share File Storage
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareNetwork,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareGroup,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Share,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareType,
    method: Methods.FindManyWithPaging,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareType,
    method: Methods.FindOne,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareGroupType,
    method: Methods.FindManyWithPaging,
    request: {},
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_ShareGroupType,
    method: Methods.FindOne,
    request: {},
    response: commonResponse,
  },
  // ========================
  // Common response filter
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_IntegrationService,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },

  // ========================
  // Object Storage
  // ========================
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Swift_User,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
  {
    role: Roles.OrganizationOwner,
    service: Services.RSM,
    controller: Controllers.RSM_Swift_Bucket,
    method: Methods.Any,
    request: {
      where: {
        'owner.orgId': '{{orgId}}',
      },
    },
    response: commonResponse,
  },
];
