import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { StoryStatus, StoryPublishStatus } from '../enum/story.enum';

export class CreateStoryData extends BaseCreateData {
  @ApiProperty({ description: 'Tên truyện', example: 'Đấu Phá Thương Khung' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Slug URL-friendly', example: 'dau-pha-thuong-khung' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả truyện', example: 'Truyện tu tiên hấp dẫn...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'S3 object key ảnh bìa (lấy từ Upload API)', example: 'stories/covers/uuid.jpg' })
  @IsString()
  @IsOptional()
  coverImageKey?: string;

  @ApiPropertyOptional({ description: 'Tên tác giả', example: 'Thiên Tằm Thổ Đậu' })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiPropertyOptional({
    description: 'Danh sách category IDs',
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Trạng thái truyện', enum: StoryStatus, example: StoryStatus.ONGOING })
  @IsEnum(StoryStatus)
  @IsOptional()
  storyStatus?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xuất bản', enum: StoryPublishStatus, example: StoryPublishStatus.DRAFT })
  @IsEnum(StoryPublishStatus)
  @IsOptional()
  publishStatus?: string;

  @ApiPropertyOptional({ description: 'Truyện nổi bật', example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Tags', example: ['tiên hiệp', 'huyền huyễn'], type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

@Exclude()
export class CreateStoryResult extends BaseCreateResult {
  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  coverImageKey: string;

  @Expose()
  authorId: string;

  @Expose()
  authorName: string;

  @Expose()
  categoryIds: string[];

  @Expose()
  storyStatus: string;

  @Expose()
  publishStatus: string;

  @Expose()
  totalChapters: number;

  @Expose()
  totalViews: number;

  @Expose()
  isFeatured: boolean;

  @Expose()
  isPublished: boolean;

  @Expose()
  tags: string[];
}