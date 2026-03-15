import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateListeningProgressDto {
  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiProperty({ description: 'Chapter ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty({ description: 'Vị trí hiện tại (giây)', example: 360 })
  @IsNumber()
  lastPosition: number;

  @ApiProperty({ description: 'Thời gian đã nghe session này (giây)', example: 120 })
  @IsNumber()
  listenedDuration: number;

  @ApiPropertyOptional({ description: 'Tổng thời lượng chương (giây)', example: 1800 })
  @IsNumber()
  @IsOptional()
  totalDuration?: number;

  @ApiPropertyOptional({ description: 'Tên truyện (cache)' })
  @IsString()
  @IsOptional()
  storyTitle?: string;

  @ApiPropertyOptional({ description: 'Số chương' })
  @IsNumber()
  @IsOptional()
  chapterNumber?: number;

  @ApiPropertyOptional({ description: 'Tên chương (cache)' })
  @IsString()
  @IsOptional()
  chapterTitle?: string;
}

export class ListeningHistoryItemDto {
  @ApiProperty() id: string;
  @ApiProperty() storyId: string;
  @ApiProperty() storyTitle: string;
  @ApiProperty() chapterId: string;
  @ApiProperty() chapterNumber: number;
  @ApiProperty() chapterTitle: string;
  @ApiProperty() lastPosition: number;
  @ApiProperty() totalDuration: number;
  @ApiProperty() progressPercent: number;
  @ApiProperty() completed: boolean;
  @ApiProperty() lastListenedAt: Date;
}