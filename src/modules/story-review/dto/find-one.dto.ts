import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindStoryReviewByIdResult extends BaseFindOneResult {
  @Expose() userId: string;
  @Expose() userDisplayName: string;
  @Expose() storyId: string;
  @Expose() rating: number;
  @Expose() comment: string;
  @Expose() likeCount: number;
}