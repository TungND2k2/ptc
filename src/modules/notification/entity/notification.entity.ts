import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

export enum NotificationType {
  NEW_CHAPTER = 'new_chapter',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

@Entity(Controllers.PTC_NOTIFICATION)
export class Notification extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string; // '' = broadcast cho tất cả

  @Column()
  @IsEnum(NotificationType)
  type: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  message: string = '';

  @Column()
  @IsString()
  linkType: string = ''; // story, chapter, transaction

  @Column()
  @IsString()
  linkValue: string = ''; // ID tương ứng

  @Column()
  @IsBoolean()
  isRead: boolean = false;

  @Column()
  @IsDate()
  readAt: Date;
}