import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entity/comment.entity';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserProfileModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}