export enum TransactionType {
  DEPOSIT = 'deposit',
  PURCHASE = 'purchase',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentProvider {
  VNPAY = 'vnpay',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  MANUAL = 'manual',
}