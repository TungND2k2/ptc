import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateReportData extends BaseCreateData {
  @ApiProperty({ description: 'Report year' })
  @IsNumber()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 10)
  @IsNotEmpty()
  year;

  @ApiProperty({ description: 'Report month' })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month;

  @ApiProperty({ description: 'Total bot time out count' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalBotTimeOut = 0;

  @ApiProperty({ description: 'Total bot idle count' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalBotIdle = 0;

  @ApiProperty({ description: 'Total bot on task count' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalBotOnTask = 0;

  @ApiProperty({ description: 'Total bot count' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalBot = 0;
}
@Exclude()
export class CreateReportResult extends BaseCreateResult {
  @Expose()
  year;

  @Expose()
  month;

  @Expose()
  totalBot;

  @Expose()
  totalBotOnTask;

  @Expose()
  totalBotIdle;

  @Expose()
  totalBotTimeOut;
}
