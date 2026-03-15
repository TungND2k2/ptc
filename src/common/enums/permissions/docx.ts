import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

export const Document_Permissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.Docx,
    controller: Controllers.Docx_Document,
    method: Methods.Any,
    request: {
      where: {
        status: 'published',
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
    service: Services.Docx,
    controller: Controllers.Docx_Document,
    method: 'findOneSlug',
    request: {
      where: {
        status: 'published',
      },
      owner: {},
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
