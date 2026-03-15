import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateStoryReviewData extends BaseCreateData {
  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiProperty({ description: 'Đánh giá (1-5 sao)', example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Nhận xét', example: 'Truyện hay, nội dung hấp dẫn!' })
  @IsString()
  @IsOptional()
  comment?: string;
}

@Exclude()
export class CreateStoryReviewResult extends BaseCreateResult {
  @Expose() userId: string;
  @Expose() userDisplayName: string;
  @Expose() storyId: string;
  @Expose() rating: number;
  @Expose() comment: string;
}