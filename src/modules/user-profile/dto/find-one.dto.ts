import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindUserProfileByIdResult extends BaseFindOneResult {
  @Expose() userId: string;
  @Expose() displayName: string;
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() avatarKey: string;
  @Expose() bio: string;
  @Expose() role: string;
  @Expose() status: string;
  @Expose() favoriteCategories: string[];
  @Expose() totalStoriesRead: number;
  @Expose() totalListeningTime: number;
  @Expose() lastActiveAt: Date;
}