export enum CommonStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum CommonActionStatus {
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE',
  SUSPEND = 'SUSPEND',
  CANCEL = 'CANCEL',
  CREATE = 'CREATE',
  DESTROY = 'DESTROY',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}
