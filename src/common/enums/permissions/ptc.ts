import { Roles } from '../roles';
import { Methods } from '../methods';
import { Controllers } from '../controllers';
import { Services } from '../services';
import { Permission } from 'src/common/types/data';

/**
 * PTC - Web Nghe Truyện Permissions
 *
 * Roles:
 * - UniverseOwner: Super admin, toàn quyền
 * - OrganizationOwner: Admin tổ chức, quản lý truyện + user
 * - OrganizationAdmin: Quản lý nội dung (duyệt truyện, banner)
 * - OrganizationStaff: Author/Editor (tạo truyện, chương)
 * - OrganizationCustomer: User thường (đọc, mua, comment)
 */

// === Response filter chung: ẩn các field internal ===
const adminResponse = {
  deletedBy: null,
  createdBy: null,
  changedBy: null,
};

const customerResponse = {
  isDeleted: null,
  deletedBy: null,
  deletedAt: null,
  createdBy: null,
  changedBy: null,
  owner: null,
};

// =====================================================
// UNIVERSE OWNER - Toàn quyền tất cả PTC modules
// =====================================================
const universeOwnerPermissions: Permission[] = [
  {
    role: Roles.UniverseOwner,
    service: Services.PTC,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
    response: adminResponse,
  },
];

// =====================================================
// ORGANIZATION OWNER - Admin org, toàn quyền trong org
// =====================================================
const orgOwnerPermissions: Permission[] = [
  {
    role: Roles.OrganizationOwner,
    service: Services.PTC,
    controller: Controllers.Any,
    method: Methods.Any,
    request: {
      owner: {
        orgId: '{{orgId}}',
        userId: '{{userId}}',
      },
    },
    response: adminResponse,
  },
];

// =====================================================
// ORGANIZATION ADMIN - Quản lý nội dung
// =====================================================
const orgAdminPermissions: Permission[] = [
  // Admin quản lý: Category, Story, Chapter, Banner, Notification, Upload
  ...[
    Controllers.PTC_CATEGORY,
    Controllers.PTC_STORY,
    Controllers.PTC_CHAPTER,
    Controllers.PTC_BANNER,
    Controllers.PTC_NOTIFICATION,
    Controllers.PTC_UPLOAD,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationAdmin,
      service: Services.PTC,
      controller,
      method: Methods.Any,
      request: {
        owner: {
          orgId: '{{orgId}}',
          userId: '{{userId}}',
        },
      },
      response: adminResponse,
    }),
  ),
  // Admin xem: Review, Comment, UserProfile, Transaction, Purchase
  ...[
    Controllers.PTC_REVIEW,
    Controllers.PTC_COMMENT,
    Controllers.PTC_USER_PROFILE,
    Controllers.PTC_TRANSACTION,
    Controllers.PTC_PURCHASE,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationAdmin,
      service: Services.PTC,
      controller,
      method: Methods.Any,
      request: {
        owner: {
          orgId: '{{orgId}}',
          userId: '{{userId}}',
        },
      },
      response: adminResponse,
    }),
  ),
];

// =====================================================
// ORGANIZATION STAFF - Author/Editor
// =====================================================
const orgStaffPermissions: Permission[] = [
  // Staff CRUD: Story, Chapter, Upload
  ...[
    Controllers.PTC_STORY,
    Controllers.PTC_CHAPTER,
    Controllers.PTC_UPLOAD,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationStaff,
      service: Services.PTC,
      controller,
      method: Methods.Any,
      request: {
        owner: {
          orgId: '{{orgId}}',
          userId: '{{userId}}',
        },
      },
      response: adminResponse,
    }),
  ),
  // Staff read-only: Category, Banner
  ...[
    Controllers.PTC_CATEGORY,
    Controllers.PTC_BANNER,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationStaff,
      service: Services.PTC,
      controller,
      method: Methods.FindManyWithPaging,
      request: {
        owner: {
          orgId: '{{orgId}}',
          userId: '{{userId}}',
        },
      },
      response: customerResponse,
    }),
  ),
  ...[
    Controllers.PTC_CATEGORY,
    Controllers.PTC_BANNER,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationStaff,
      service: Services.PTC,
      controller,
      method: Methods.FindOne,
      request: {
        owner: {
          orgId: '{{orgId}}',
          userId: '{{userId}}',
        },
      },
      response: customerResponse,
    }),
  ),
];

// =====================================================
// ORGANIZATION CUSTOMER - User đọc truyện
// =====================================================
const orgCustomerPermissions: Permission[] = [
  // Customer read-only: Category, Story, Chapter, Banner
  ...[
    Controllers.PTC_CATEGORY,
    Controllers.PTC_STORY,
    Controllers.PTC_CHAPTER,
    Controllers.PTC_BANNER,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationCustomer,
      service: Services.PTC,
      controller,
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
      response: customerResponse,
    }),
  ),
  ...[
    Controllers.PTC_CATEGORY,
    Controllers.PTC_STORY,
    Controllers.PTC_CHAPTER,
    Controllers.PTC_BANNER,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationCustomer,
      service: Services.PTC,
      controller,
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
      response: customerResponse,
    }),
  ),
  // Customer full access: UserProfile, Bookmark, ListeningHistory, Purchase, Transaction, Notification
  ...[
    Controllers.PTC_USER_PROFILE,
    Controllers.PTC_BOOKMARK,
    Controllers.PTC_LISTENING_HISTORY,
    Controllers.PTC_PURCHASE,
    Controllers.PTC_TRANSACTION,
    Controllers.PTC_NOTIFICATION,
    Controllers.PTC_AUTH,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationCustomer,
      service: Services.PTC,
      controller,
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
      response: customerResponse,
    }),
  ),
  // Customer create: Review, Comment
  ...[
    Controllers.PTC_REVIEW,
    Controllers.PTC_COMMENT,
  ].map(
    (controller): Permission => ({
      role: Roles.OrganizationCustomer,
      service: Services.PTC,
      controller,
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
      response: customerResponse,
    }),
  ),
];

// =====================================================
// EXPORT
// =====================================================
export const PTC_Permissions: Permission[] = [
  ...universeOwnerPermissions,
  ...orgOwnerPermissions,
  ...orgAdminPermissions,
  ...orgStaffPermissions,
  ...orgCustomerPermissions,
];