import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { ChapterStatus, ChapterType } from '../enum/chapter.enum';

export class UpdateChapterData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Tiêu đề chương' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Nội dung text' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'S3 object key file audio' })
  @IsString()
  @IsOptional()
  audioKey?: string;

  @ApiPropertyOptional({ description: 'Loại chương', enum: ChapterType })
  @IsEnum(ChapterType)
  @IsOptional()
  chapterType?: string;

  @ApiPropertyOptional({ description: 'Thời lượng audio (giây)' })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Giá (coin)' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Chương miễn phí' })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: ChapterStatus })
  @IsEnum(ChapterStatus)
  @IsOptional()
  status?: string;
}

@Exclude()
export class UpdateChapterResult extends BaseUpdateOneResult {
  @Expose()
  storyId?: string;

  @Expose()
  chapterNumber?: number;

  @Expose()
  title?: string;

  @Expose()
  chapterType?: string;

  @Expose()
  duration?: number;

  @Expose()
  price?: number;

  @Expose()
  isFree?: boolean;

  @Expose()
  status?: string;
}