import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindChapterByIdResult extends BaseFindOneResult {
  @Expose()
  storyId: string;

  @Expose()
  chapterNumber: number;

  @Expose()
  title: string;

  @Expose()
  chapterType: string;

  @Expose()
  duration: number;

  @Expose()
  price: number;

  @Expose()
  isFree: boolean;

  @Expose()
  viewCount: number;

  @Expose()
  status: string;
}