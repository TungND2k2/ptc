import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsEnum,
  IsObject,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateBotData extends UpdateOneData {
  @ApiPropertyOptional({ description: 'Target value' })
  @IsOptional()
  @IsNumber()
  target;

  @ApiPropertyOptional({ description: 'Note' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  note;
}
export class UpdateBotResult extends UpdateOneResult {
  @Expose()
  year;

  @Expose()
  month;

  @Expose()
  type;

  @Expose()
  target;

  @Expose()
  data;

  @Expose()
  percentage;

  @Expose()
  note;
}
