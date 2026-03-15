import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindReportByIdResult extends BaseFindByIdResult {
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
