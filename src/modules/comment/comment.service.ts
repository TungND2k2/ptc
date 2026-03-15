import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: MongoRepository<Comment>,
  ) {
    super(commentRepository);
  }

  /**
   * Tạo comment
   */
  async createComment(
    userId: string,
    userDisplayName: string,
    userAvatarKey: string,
    data: { chapterId: string; storyId: string; content: string; parentId?: string },
  ): Promise<Comment> {
    const comment = new Comment();
    comment.userId = userId;
    comment.userDisplayName = userDisplayName;
    comment.userAvatarKey = userAvatarKey;
    comment.chapterId = data.chapterId;
    comment.storyId = data.storyId;
    comment.content = data.content;
    comment.parentId = data.parentId || '';

    const saved = await this.commentRepository.save(comment);

    // Nếu là reply, tăng replyCount của comment cha
    if (data.parentId) {
      const parent = await this.commentRepository.findOne({
        where: { _id: data.parentId } as any,
      });
      if (parent) {
        parent.replyCount = (parent.replyCount || 0) + 1;
        await this.commentRepository.save(parent);
      }
    }

    return saved;
  }

  /**
   * Danh sách comment của chương (root comments)
   */
  async findByChapter(chapterId: string, page: number = 0, size: number = 20) {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { chapterId, parentId: '', isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      data: comments.map((c) => ({
        id: c.id.toString(),
        userId: c.userId,
        userDisplayName: c.userDisplayName,
        userAvatarKey: c.userAvatarKey,
        content: c.content,
        likeCount: c.likeCount,
        replyCount: c.replyCount,
        createdAt: c.createdAt,
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
   * Danh sách reply của 1 comment
   */
  async findReplies(parentId: string, page: number = 0, size: number = 20) {
    const [replies, total] = await this.commentRepository.findAndCount({
      where: { parentId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'ASC' } as any,
    });

    return {
      data: replies.map((c) => ({
        id: c.id.toString(),
        userId: c.userId,
        userDisplayName: c.userDisplayName,
        userAvatarKey: c.userAvatarKey,
        content: c.content,
        likeCount: c.likeCount,
        createdAt: c.createdAt,
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
   * Đếm số comment của chương
   */
  async countByChapter(chapterId: string): Promise<number> {
    return await this.commentRepository.count({
      where: { chapterId, isDeleted: false } as any,
    });
  }
}