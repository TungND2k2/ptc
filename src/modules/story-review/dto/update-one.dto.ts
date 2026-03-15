import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateStoryReviewData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Đánh giá (1-5 sao)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'Nhận xét' })
  @IsString()
  @IsOptional()
  comment?: string;
}

@Exclude()
export class UpdateStoryReviewResult extends BaseUpdateOneResult {
  @Expose() rating?: number;
  @Expose() comment?: string;
}