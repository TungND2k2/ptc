import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.PTC_REVIEW)
export class StoryReview extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @IsString()
  userDisplayName: string = ''; // cache tên user

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number; // 1-5 sao

  @Column()
  @IsString()
  comment: string = '';

  @Column()
  @IsNumber()
  likeCount: number = 0; // số lượt thích review này
}