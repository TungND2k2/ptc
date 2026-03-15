import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { BannerPosition, BannerStatus } from '../entity/banner.entity';

export class CreateBannerData extends BaseCreateData {
  @ApiProperty({ description: 'Tiêu đề banner', example: 'Truyện hot tháng 3' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'S3 key ảnh banner', example: 'banners/1710000000_banner.jpg' })
  @IsString()
  @IsNotEmpty()
  imageKey: string;

  @ApiPropertyOptional({ description: 'Loại link: story, category, url', example: 'story' })
  @IsString()
  @IsOptional()
  linkType?: string;

  @ApiPropertyOptional({ description: 'Giá trị link (storyId, categoryId, URL)', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsOptional()
  linkValue?: string;

  @ApiPropertyOptional({ description: 'Vị trí hiển thị', enum: BannerPosition })
  @IsEnum(BannerPosition)
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', example: 1 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: BannerStatus })
  @IsEnum(BannerStatus)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu hiển thị' })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày kết thúc hiển thị' })
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

@Exclude()
export class CreateBannerResult extends BaseCreateResult {
  @Expose() title: string;
  @Expose() description: string;
  @Expose() imageKey: string;
  @Expose() linkType: string;
  @Expose() linkValue: string;
  @Expose() position: string;
  @Expose() sortOrder: number;
  @Expose() status: string;
  @Expose() startDate: Date;
  @Expose() endDate: Date;
}