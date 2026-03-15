import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { CategoryStatus } from '../enum/category.enum';

export class UpdateCategoryData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Tên thể loại', example: 'Tiên Hiệp' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Slug URL-friendly', example: 'tien-hiep' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Mô tả thể loại' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Icon thể loại' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: CategoryStatus })
  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: string;
}

@Exclude()
export class UpdateCategoryResult extends BaseUpdateOneResult {
  @Expose()
  name?: string;

  @Expose()
  slug?: string;

  @Expose()
  description?: string;

  @Expose()
  icon?: string;

  @Expose()
  storyCount?: number;

  @Expose()
  sortOrder?: number;

  @Expose()
  status?: string;
}