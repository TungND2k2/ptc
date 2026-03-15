import { IsString, IsDate } from 'class-validator';

export class UpdateOneData {}
export class UpdateOneResult {
  @IsString()
  id = '';

  @IsDate()
  changedAt: Date;
}
