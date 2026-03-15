import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.PTC_PURCHASE)
export class Purchase extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @Column()
  @IsNumber()
  amount: number; // số coin đã trả

  @Column()
  @IsString()
  paymentMethod: string = 'wallet'; // wallet, promo, gift

  @Column()
  @IsDate()
  purchasedAt: Date;
}