import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindOneResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindStoryByIdResult extends BaseFindOneResult {
  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  coverImageKey: string;

  @Expose()
  authorId: string;

  @Expose()
  authorName: string;

  @Expose()
  categoryIds: string[];

  @Expose()
  storyStatus: string;

  @Expose()
  publishStatus: string;

  @Expose()
  totalChapters: number;

  @Expose()
  totalViews: number;

  @Expose()
  totalPurchases: number;

  @Expose()
  averageRating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  isFeatured: boolean;

  @Expose()
  isPublished: boolean;

  @Expose()
  tags: string[];
}