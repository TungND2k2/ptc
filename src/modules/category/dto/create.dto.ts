import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { CategoryStatus } from '../enum/category.enum';

export class CreateCategoryData extends BaseCreateData {
  @ApiProperty({ description: 'Tên thể loại', example: 'Tiên Hiệp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Slug URL-friendly', example: 'tien-hiep' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả thể loại', example: 'Truyện tu tiên, tiên hiệp' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Icon thể loại', example: 'icon-tien-hiep' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', example: 1 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: CategoryStatus, example: CategoryStatus.ACTIVE })
  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: string;
}

@Exclude()
export class CreateCategoryResult extends BaseCreateResult {
  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  icon: string;

  @Expose()
  storyCount: number;

  @Expose()
  sortOrder: number;

  @Expose()
  status: string;
}