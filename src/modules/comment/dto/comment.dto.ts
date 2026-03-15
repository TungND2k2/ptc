import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';
import {
  UpdateOneData as BaseUpdateOneData,
  UpdateOneResult as BaseUpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class CreateCommentData extends BaseCreateData {
  @ApiProperty({ description: 'Chapter ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty({ description: 'Story ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Chương này hay quá!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'ID comment cha (nếu reply)', example: '' })
  @IsString()
  @IsOptional()
  parentId?: string;
}

@Exclude()
export class CreateCommentResult extends BaseCreateResult {
  @Expose() userId: string;
  @Expose() userDisplayName: string;
  @Expose() chapterId: string;
  @Expose() storyId: string;
  @Expose() content: string;
  @Expose() parentId: string;
}

@Exclude()
export class FindCommentByIdResult extends BaseFindOneResult {
  @Expose() userId: string;
  @Expose() userDisplayName: string;
  @Expose() userAvatarKey: string;
  @Expose() chapterId: string;
  @Expose() storyId: string;
  @Expose() content: string;
  @Expose() parentId: string;
  @Expose() likeCount: number;
  @Expose() replyCount: number;
}

export class UpdateCommentData extends BaseUpdateOneData {
  @ApiPropertyOptional({ description: 'Nội dung bình luận' })
  @IsString()
  @IsOptional()
  content?: string;
}

@Exclude()
export class UpdateCommentResult extends BaseUpdateOneResult {
  @Expose() content?: string;
}