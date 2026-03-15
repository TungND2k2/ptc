import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindCategoryByIdResult extends BaseFindOneResult {
  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  icon: string;

  @Expose()
  storyCount: number;

  @Expose()
  sortOrder: number;

  @Expose()
  status: string;
}