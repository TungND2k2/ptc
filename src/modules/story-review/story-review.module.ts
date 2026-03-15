import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryReviewService } from './story-review.service';
import { StoryReviewController } from './story-review.controller';
import { StoryReview } from './entity/story-review.entity';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoryReview]), UserProfileModule],
  controllers: [StoryReviewController],
  providers: [StoryReviewService],
  exports: [StoryReviewService],
})
export class StoryReviewModule {}