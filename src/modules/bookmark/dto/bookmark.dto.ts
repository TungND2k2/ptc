import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class AddBookmarkDto {
  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiPropertyOptional({ description: 'Tên truyện (cache)', example: 'Đấu Phá Thương Khung' })
  @IsString()
  @IsOptional()
  storyTitle?: string;

  @ApiPropertyOptional({ description: 'S3 key ảnh bìa (cache)' })
  @IsString()
  @IsOptional()
  storyCoverKey?: string;
}

export class UpdateReadingProgressDto {
  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiProperty({ description: 'Chapter ID đang nghe', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  lastChapterId: string;

  @ApiProperty({ description: 'Số chương', example: 5 })
  @IsNumber()
  lastChapterNumber: number;

  @ApiPropertyOptional({ description: 'Vị trí audio (giây)', example: 360 })
  @IsNumber()
  @IsOptional()
  lastPosition?: number;
}

export class BookmarkResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() storyId: string;
  @ApiProperty() storyTitle: string;
  @ApiProperty() storyCoverKey: string;
  @ApiProperty() lastChapterId: string;
  @ApiProperty() lastChapterNumber: number;
  @ApiProperty() lastPosition: number;
  @ApiProperty() lastReadAt: Date;
}