import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PaymentProvider } from '../enum/transaction.enum';

export class CreateDepositDto {
  @ApiProperty({
    description: 'Số tiền nạp (VNĐ)',
    example: 50000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Cổng thanh toán',
    enum: PaymentProvider,
    example: PaymentProvider.VNPAY,
  })
  @IsEnum(PaymentProvider)
  provider: string;
}

export class CreateDepositResponseDto {
  @ApiProperty({ description: 'Transaction ID', example: '507f1f77bcf86cd799439011' })
  transactionId: string;

  @ApiProperty({ description: 'URL chuyển hướng đến cổng thanh toán', example: 'https://pay.vnpay.vn/...' })
  paymentUrl: string;

  @ApiProperty({ description: 'Số coin sẽ nhận', example: 500 })
  coinAmount: number;

  @ApiProperty({ description: 'Số tiền (VNĐ)', example: 50000 })
  moneyAmount: number;
}

export class PaymentCallbackDto {
  @ApiProperty({ description: 'Mã giao dịch từ cổng thanh toán' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: 'Trạng thái thanh toán' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch provider' })
  @IsString()
  @IsOptional()
  providerTransactionId?: string;

  @ApiPropertyOptional({ description: 'Dữ liệu thêm từ provider' })
  @IsOptional()
  data?: any;
}

export class WalletBalanceResponseDto {
  @ApiProperty({ description: 'Số coin hiện tại', example: 500 })
  balance: number;

  @ApiProperty({ description: 'Tổng coin đã nạp', example: 1000 })
  totalDeposited: number;

  @ApiProperty({ description: 'Tổng coin đã chi', example: 500 })
  totalSpent: number;
}

export class CreateTransactionInput {
  userId: string;
  type: string;
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
}
