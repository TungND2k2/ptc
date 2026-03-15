import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.PTC_COMMENT)
export class Comment extends Base {
  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Column()
  @IsString()
  userDisplayName: string = '';

  @Column()
  @IsString()
  userAvatarKey: string = '';

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Column()
  @IsString()
  parentId: string = ''; // reply comment (empty = root comment)

  @Column()
  @IsNumber()
  likeCount: number = 0;

  @Column()
  @IsNumber()
  replyCount: number = 0;
}