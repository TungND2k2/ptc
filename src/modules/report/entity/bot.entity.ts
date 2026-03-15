import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.BSM_Report)
export class Report extends Base {
  @Column()
  totalBotTimeOut = 0;

  @Column()
  totalBotIdle = 0;

  @Column()
  totalBotOnTask = 0;

  @Column()
  totalBot = 0;

  @Column()
  lastUpdatedAt = new Date();
}
