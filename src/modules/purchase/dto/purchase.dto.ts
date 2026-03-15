import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PurchaseChapterDto {
  @ApiProperty({
    description: 'Chapter ID cần mua',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  chapterId: string;
}

export class PurchaseChapterResponseDto {
  @ApiProperty({ description: 'Mua thành công', example: true })
  success: boolean;

  @ApiProperty({ description: 'Purchase ID', example: '507f1f77bcf86cd799439012' })
  purchaseId: string;

  @ApiProperty({ description: 'Số coin đã trừ', example: 5 })
  amount: number;

  @ApiProperty({ description: 'Số dư còn lại', example: 95 })
  remainingBalance: number;

  @ApiProperty({ description: 'Thời gian mua' })
  purchasedAt: Date;
}

export class CheckPurchaseResponseDto {
  @ApiProperty({ description: 'Đã mua chưa', example: true })
  purchased: boolean;

  @ApiPropertyOptional({ description: 'Thời gian mua (nếu đã mua)' })
  purchasedAt?: Date;
}

export class PurchaseHistoryItemDto {
  @ApiProperty({ description: 'Purchase ID' })
  id: string;

  @ApiProperty({ description: 'Story ID' })
  storyId: string;

  @ApiProperty({ description: 'Chapter ID' })
  chapterId: string;

  @ApiProperty({ description: 'Số coin đã trả' })
  amount: number;

  @ApiProperty({ description: 'Thời gian mua' })
  purchasedAt: Date;
}