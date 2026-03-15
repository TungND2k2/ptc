import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { StoryStatus, StoryPublishStatus } from '../enum/story.enum';

export class UpdateStoryData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Tên truyện' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Slug URL-friendly' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Mô tả truyện' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'S3 object key ảnh bìa' })
  @IsString()
  @IsOptional()
  coverImageKey?: string;

  @ApiPropertyOptional({ description: 'Tên tác giả' })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiPropertyOptional({ description: 'Danh sách category IDs', type: [String] })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Trạng thái truyện', enum: StoryStatus })
  @IsEnum(StoryStatus)
  @IsOptional()
  storyStatus?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xuất bản', enum: StoryPublishStatus })
  @IsEnum(StoryPublishStatus)
  @IsOptional()
  publishStatus?: string;

  @ApiPropertyOptional({ description: 'Truyện nổi bật' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Đã xuất bản' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

@Exclude()
export class UpdateStoryResult extends BaseUpdateOneResult {
  @Expose()
  title?: string;

  @Expose()
  slug?: string;

  @Expose()
  description?: string;

  @Expose()
  coverImageKey?: string;

  @Expose()
  authorName?: string;

  @Expose()
  categoryIds?: string[];

  @Expose()
  storyStatus?: string;

  @Expose()
  publishStatus?: string;

  @Expose()
  isFeatured?: boolean;

  @Expose()
  isPublished?: boolean;

  @Expose()
  tags?: string[];
}