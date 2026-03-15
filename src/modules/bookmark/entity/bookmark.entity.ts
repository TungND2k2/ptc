import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.PTC_BOOKMARK)
export class Bookmark extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @Column()
  @IsString()
  storyTitle: string = ''; // cache

  @Column()
  @IsString()
  storyCoverKey: string = ''; // cache

  @Column()
  @IsString()
  lastChapterId: string = ''; // chương đang nghe dở

  @Column()
  @IsNumber()
  lastChapterNumber: number = 0;

  @Column()
  @IsNumber()
  lastPosition: number = 0; // vị trí audio (giây)

  @Column()
  @IsDate()
  lastReadAt: Date; // lần nghe cuối
}