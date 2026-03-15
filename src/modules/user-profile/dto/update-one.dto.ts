import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateUserProfileData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Tên hiển thị' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'S3 key avatar' })
  @IsString()
  @IsOptional()
  avatarKey?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Thể loại yêu thích', type: [String] })
  @IsArray()
  @IsOptional()
  favoriteCategories?: string[];
}

@Exclude()
export class UpdateUserProfileResult extends BaseUpdateOneResult {
  @Expose() userId?: string;
  @Expose() displayName?: string;
  @Expose() email?: string;
  @Expose() phone?: string;
  @Expose() avatarKey?: string;
  @Expose() bio?: string;
  @Expose() favoriteCategories?: string[];
}