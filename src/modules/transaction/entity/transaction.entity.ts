import { Entity, Column, Index } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDate,
  IsObject,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { TransactionType, TransactionStatus, PaymentProvider } from '../enum/transaction.enum';

@Entity(Controllers.PTC_TRANSACTION)
export class Transaction extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @IsEnum(TransactionType)
  type: string; // deposit, purchase, refund

  @Column()
  @IsNumber()
  amount: number; // dương = nạp, âm = mua

  @Column()
  @IsString()
  description: string = '';

  @Column()
  @IsEnum(TransactionStatus)
  status: string = TransactionStatus.PENDING;

  @Column()
  @IsString()
  provider: string = ''; // vnpay, momo, zalopay

  @Column()
  @IsString()
  providerTransactionId: string = ''; // mã GD từ cổng thanh toán

  @Column()
  @IsString()
  referenceId: string = ''; // purchase ID hoặc deposit ID

  @Column()
  @IsString()
  referenceType: string = ''; // purchase, deposit

  @Column()
  @IsNumber()
  balanceBefore: number = 0; // số dư trước GD

  @Column()
  @IsNumber()
  balanceAfter: number = 0; // số dư sau GD

  @Column()
  @IsObject()
  providerData: { [key: string]: any } = {}; // raw data từ cổng thanh toán
}