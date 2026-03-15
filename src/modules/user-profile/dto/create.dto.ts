import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { UserRole } from '../entity/user-profile.entity';

export class CreateUserProfileData extends BaseCreateData {
  @ApiProperty({ description: 'User ID (từ hệ thống auth)', example: 'user_123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tên hiển thị', example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({ description: 'Email', example: 'user@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0901234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'S3 key avatar', example: 'users/avatars/uuid.jpg' })
  @IsString()
  @IsOptional()
  avatarKey?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử', example: 'Tôi thích đọc tiên hiệp' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Thể loại yêu thích', type: [String] })
  @IsArray()
  @IsOptional()
  favoriteCategories?: string[];
}

@Exclude()
export class CreateUserProfileResult extends BaseCreateResult {
  @Expose() userId: string;
  @Expose() displayName: string;
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() avatarKey: string;
  @Expose() bio: string;
  @Expose() role: string;
  @Expose() status: string;
  @Expose() favoriteCategories: string[];
}