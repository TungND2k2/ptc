import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';

@Entity('wallets')
export class Wallet extends Base {
  @Column()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @IsNumber()
  balance: number = 0; // số coin hiện tại

  @Column()
  @IsNumber()
  totalDeposited: number = 0; // tổng coin đã nạp

  @Column()
  @IsNumber()
  totalSpent: number = 0; // tổng coin đã chi
}