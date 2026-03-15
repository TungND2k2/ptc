import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindBannerByIdResult extends BaseFindOneResult {
  @Expose() title: string;
  @Expose() description: string;
  @Expose() imageKey: string;
  @Expose() linkType: string;
  @Expose() linkValue: string;
  @Expose() position: string;
  @Expose() sortOrder: number;
  @Expose() status: string;
  @Expose() startDate: Date;
  @Expose() endDate: Date;
  @Expose() clickCount: number;
  @Expose() viewCount: number;
}