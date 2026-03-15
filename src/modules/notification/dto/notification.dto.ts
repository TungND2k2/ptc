import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { NotificationType } from '../entity/notification.entity';

export class CreateNotificationData extends BaseCreateData {
  @ApiProperty({ description: 'User ID (rỗng = broadcast)', example: 'user_123' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Loại thông báo', enum: NotificationType, example: NotificationType.NEW_CHAPTER })
  @IsEnum(NotificationType)
  type: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Chương mới: Đấu Phá Thương Khung - Chương 100' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung chi tiết' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ description: 'Loại link: story, chapter, transaction' })
  @IsString()
  @IsOptional()
  linkType?: string;

  @ApiPropertyOptional({ description: 'Giá trị link' })
  @IsString()
  @IsOptional()
  linkValue?: string;
}

@Exclude()
export class CreateNotificationResult extends BaseCreateResult {
  @Expose() userId: string;
  @Expose() type: string;
  @Expose() title: string;
  @Expose() message: string;
  @Expose() linkType: string;
  @Expose() linkValue: string;
  @Expose() isRead: boolean;
}

export class NotificationItemDto {
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiProperty() title: string;
  @ApiProperty() message: string;
  @ApiProperty() linkType: string;
  @ApiProperty() linkValue: string;
  @ApiProperty() isRead: boolean;
  @ApiProperty() createdAt: Date;
}