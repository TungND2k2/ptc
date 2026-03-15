import { Entity, Column, Index } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { StoryStatus, StoryPublishStatus } from '../enum/story.enum';

@Entity(Controllers.PTC_STORY)
export class Story extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Column()
  @IsString()
  description: string = '';

  @Column()
  @IsString()
  coverImageKey: string = ''; // S3 object key

  @Column()
  @IsString()
  authorId: string = ''; // userId của tác giả

  @Column()
  @IsString()
  authorName: string = '';

  @Column()
  @IsArray()
  categoryIds: string[] = []; // danh sách category IDs

  @Column()
  @IsEnum(StoryStatus)
  storyStatus: string = StoryStatus.ONGOING;

  @Column()
  @IsEnum(StoryPublishStatus)
  publishStatus: string = StoryPublishStatus.DRAFT;

  @Column()
  @IsNumber()
  totalChapters: number = 0;

  @Column()
  @IsNumber()
  totalViews: number = 0;

  @Column()
  @IsNumber()
  totalPurchases: number = 0;

  @Column()
  @IsNumber()
  averageRating: number = 0;

  @Column()
  @IsNumber()
  totalReviews: number = 0;

  @Column()
  @IsBoolean()
  isFeatured: boolean = false;

  @Column()
  @IsBoolean()
  isPublished: boolean = false;

  @Column()
  @IsArray()
  tags: string[] = [];
}