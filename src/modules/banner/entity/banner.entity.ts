import { Entity, Column } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

export enum BannerPosition {
  HOME_TOP = 'home_top',
  HOME_MIDDLE = 'home_middle',
  CATEGORY_TOP = 'category_top',
  STORY_DETAIL = 'story_detail',
} 

export enum BannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled',
}

@Entity(Controllers.PTC_BANNER)
export class Banner extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  description: string = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  imageKey: string; // S3 object key

  @Column()
  @IsString()
  linkType: string = ''; // story, category, url

  @Column()
  @IsString()
  linkValue: string = ''; // storyId, categoryId, hoặc URL

  @Column()
  @IsEnum(BannerPosition)
  position: string = BannerPosition.HOME_TOP;

  @Column()
  @IsNumber()
  sortOrder: number = 0;

  @Column()
  @IsEnum(BannerStatus)
  status: string = BannerStatus.ACTIVE;

  @Column()
  @IsDate()
  startDate: Date;

  @Column()
  @IsDate()
  endDate: Date;

  @Column()
  @IsNumber()
  clickCount: number = 0;

  @Column()
  @IsNumber()
  viewCount: number = 0;
}