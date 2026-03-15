import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { StoryReview } from './entity/story-review.entity';

@Injectable()
export class StoryReviewService extends BaseService<StoryReview> {
  constructor(
    @InjectRepository(StoryReview)
    private reviewRepository: MongoRepository<StoryReview>,
  ) {
    super(reviewRepository);
  }

  /**
   * Tạo review (mỗi user chỉ được review 1 lần/truyện)
   */
  async createReview(
    userId: string,
    userDisplayName: string,
    storyId: string,
    rating: number,
    comment: string,
  ): Promise<StoryReview> {
    const existing = await this.reviewRepository.findOne({
      where: { userId, storyId, isDeleted: false } as any,
    });
    if (existing) {
      throw new ConflictException('Bạn đã đánh giá truyện này rồi');
    }

    const review = new StoryReview();
    review.userId = userId;
    review.userDisplayName = userDisplayName;
    review.storyId = storyId;
    review.rating = rating;
    review.comment = comment;

    return await this.reviewRepository.save(review);
  }

  /**
   * Lấy danh sách review của truyện
   */
  async findByStory(storyId: string, page: number = 0, size: number = 20) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { storyId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      data: reviews.map((r) => ({
        id: r.id.toString(),
        userId: r.userId,
        userDisplayName: r.userDisplayName,
        rating: r.rating,
        comment: r.comment,
        likeCount: r.likeCount,
        createdAt: r.createdAt,
      })),
      paging: {
        index: page,
        size,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
    };
  }

  /**
   * Tính trung bình rating của truyện
   */
  async getAverageRating(storyId: string): Promise<{ average: number; total: number }> {
    const reviews = await this.reviewRepository.find({
      where: { storyId, isDeleted: false } as any,
    });

    if (reviews.length === 0) {
      return { average: 0, total: 0 };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      total: reviews.length,
    };
  }
}