import { Entity, Column, Index } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { ChapterStatus, ChapterType } from '../enum/chapter.enum';

@Entity(Controllers.PTC_CHAPTER)
export class Chapter extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  storyId: string; // MongoDB ObjectId as string

  @Column()
  @IsNumber()
  chapterNumber: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  content: string = ''; // nội dung text

  @Column()
  @IsString()
  audioKey: string = ''; // S3 object key cho file audio

  @Column()
  @IsEnum(ChapterType)
  chapterType: string = ChapterType.AUDIO;

  @Column()
  @IsNumber()
  duration: number = 0; // thời lượng audio (giây)

  @Column()
  @IsNumber()
  price: number = 0; // giá (coin), 0 = miễn phí

  @Column()
  @IsBoolean()
  isFree: boolean = false;

  @Column()
  @IsNumber()
  viewCount: number = 0;

  @Column()
  @IsNumber()
  purchaseCount: number = 0;

  @Column()
  @IsEnum(ChapterStatus)
  status: string = ChapterStatus.DRAFT;
}