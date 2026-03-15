export enum CommonCurrency {
  USD = 'USD',
  EUR = 'EUR',
  VND = 'VND',
}

export enum CommonChargeType {
  PREPAID = 'PREPAID',
  POSTPAID = 'POSTPAID',
}

export enum CommonInterval {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum CommonUsageType {
  METERED = 'METERED',
  LICENSED = 'LICENSED',
}

export enum CommonPaymentFrequency {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
}

export enum CancellationReasons {
  CANCELLATION_REQUESTED = 'CANCELLATION_REQUESTED',
  PAYMENT_DISPUTED = 'PAYMENT_DISPUTED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum CancellationFeedbacks {
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  UNUSED = 'UNUSED',
  LOW_QUALITY = 'LOW_QUALITY',
  MISSING_FEATURES = 'MISSING_FEATURES',
  OTHER = 'OTHER',
  SWITCH_SERVICE = 'SWITCH_SERVICE',
  TOO_COMPLEX = 'TOO_COMPLEX',
  TOO_EXPENSIVE = 'TOO_EXPENSIVE',
}
