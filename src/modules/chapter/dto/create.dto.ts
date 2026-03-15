import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ChapterStatus, ChapterType } from '../enum/chapter.enum';

export class CreateChapterData extends BaseCreateData {
  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiProperty({ description: 'Số thứ tự chương', example: 1 })
  @IsNumber()
  chapterNumber: number;

  @ApiProperty({ description: 'Tiêu đề chương', example: 'Chương 1: Khởi đầu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung text', example: 'Nội dung chương 1...' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'S3 object key file audio (lấy từ Upload API)',
    example: 'chapters/audio/storyId/1/uuid.mp3',
  })
  @IsString()
  @IsOptional()
  audioKey?: string;

  @ApiPropertyOptional({ description: 'Loại chương', enum: ChapterType, example: ChapterType.AUDIO })
  @IsEnum(ChapterType)
  @IsOptional()
  chapterType?: string;

  @ApiPropertyOptional({ description: 'Thời lượng audio (giây)', example: 1800 })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Giá (coin), 0 = miễn phí', example: 5 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Chương miễn phí', example: false })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional({ description: 'Trạng thái chương', enum: ChapterStatus, example: ChapterStatus.DRAFT })
  @IsEnum(ChapterStatus)
  @IsOptional()
  status?: string;
}

@Exclude()
export class CreateChapterResult extends BaseCreateResult {
  @Expose()
  storyId: string;

  @Expose()
  chapterNumber: number;

  @Expose()
  title: string;

  @Expose()
  chapterType: string;

  @Expose()
  duration: number;

  @Expose()
  price: number;

  @Expose()
  isFree: boolean;

  @Expose()
  status: string;
}