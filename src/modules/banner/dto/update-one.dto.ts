import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { BannerPosition, BannerStatus } from '../entity/banner.entity';

export class UpdateBannerData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Tiêu đề' })
  @IsString() @IsOptional() title?: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsString() @IsOptional() description?: string;

  @ApiPropertyOptional({ description: 'S3 key ảnh' })
  @IsString() @IsOptional() imageKey?: string;

  @ApiPropertyOptional({ description: 'Loại link' })
  @IsString() @IsOptional() linkType?: string;

  @ApiPropertyOptional({ description: 'Giá trị link' })
  @IsString() @IsOptional() linkValue?: string;

  @ApiPropertyOptional({ description: 'Vị trí', enum: BannerPosition })
  @IsEnum(BannerPosition) @IsOptional() position?: string;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsNumber() @IsOptional() sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: BannerStatus })
  @IsEnum(BannerStatus) @IsOptional() status?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu' })
  @IsDate() @IsOptional() startDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày kết thúc' })
  @IsDate() @IsOptional() endDate?: Date;
}

@Exclude()
export class UpdateBannerResult extends BaseUpdateOneResult {
  @Expose() title?: string;
  @Expose() imageKey?: string;
  @Expose() position?: string;
  @Expose() status?: string;
}