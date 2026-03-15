import { Entity, Column, Index } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { CategoryStatus } from '../enum/category.enum';

@Entity(Controllers.PTC_CATEGORY)
export class Category extends Base {
  @Column()
  @Index({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  icon: string = '';

  @Column()
  @IsNumber()
  storyCount: number = 0;

  @Column()
  @IsNumber()
  sortOrder: number = 0;

  @Column()
  @IsEnum(CategoryStatus)
  status: string = CategoryStatus.ACTIVE;
}