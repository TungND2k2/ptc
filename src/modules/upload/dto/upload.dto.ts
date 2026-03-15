import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class PresignPutDto {
  @ApiProperty({
    description: 'Thư mục lưu trữ trên S3',
    example: 'stories/covers',
    enum: ['stories/covers', 'stories/thumbnails', 'chapters/audio', 'chapters/content', 'users/avatars'],
  })
  @IsString()
  @IsNotEmpty()
  folder: string;

  @ApiProperty({
    description: 'Tên file gốc',
    example: 'cover.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Content type của file',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiPropertyOptional({
    description: 'Kích thước file (bytes)',
    example: 1024000,
  })
  @IsNumber()
  @IsOptional()
  size?: number;
}

export class PresignPutResponseDto {
  @ApiProperty({
    description: 'Presigned URL để upload file (PUT)',
    example: 'https://s3.xorcloud.net/ptc-stories/stories/covers/1710000000_cover.jpg?...',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'S3 object key (lưu vào DB khi tạo story/chapter)',
    example: 'stories/covers/1710000000_cover.jpg',
  })
  fileKey: string;

  @ApiProperty({
    description: 'HTTP method',
    example: 'PUT',
  })
  method: string;

  @ApiProperty({
    description: 'Headers cần gửi kèm khi upload',
    example: { 'Content-Type': 'image/jpeg' },
  })
  headers: any;

  @ApiProperty({
    description: 'Thời gian URL hết hạn (giây)',
    example: 600,
  })
  expiresIn: number;
}

export class PresignGetDto {
  @ApiProperty({
    description: 'S3 object key cần lấy URL download',
    example: 'chapters/audio/storyId/1/uuid.mp3',
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiPropertyOptional({
    description: 'Thời hạn URL (giây), mặc định 3600',
    example: 3600,
  })
  @IsNumber()
  @IsOptional()
  expiresIn?: number;
}

export class PresignGetResponseDto {
  @ApiProperty({
    description: 'Presigned URL để download/view file (GET)',
    example: 'https://s3.xorcloud.net/ptc-stories/chapters/audio/...?...',
  })
  downloadUrl: string;

  @ApiProperty({
    description: 'Thời gian URL hết hạn (giây)',
    example: 3600,
  })
  expiresIn: number;
}