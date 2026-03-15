import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.PTC_LISTENING_HISTORY)
export class ListeningHistory extends Base {
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
  storyTitle: string = '';

  @Column()
  @Index()
  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @Column()
  @IsNumber()
  chapterNumber: number;

  @Column()
  @IsString()
  chapterTitle: string = '';

  @Column()
  @IsNumber()
  listenedDuration: number = 0; // thời gian đã nghe (giây)

  @Column()
  @IsNumber()
  totalDuration: number = 0; // tổng thời lượng chương (giây)

  @Column()
  @IsNumber()
  lastPosition: number = 0; // vị trí dừng (giây)

  @Column()
  @IsNumber()
  progressPercent: number = 0; // 0-100

  @Column()
  @IsDate()
  startedAt: Date;

  @Column()
  @IsDate()
  lastListenedAt: Date;

  @Column()
  completed: boolean = false; // đã nghe xong chương chưa
}