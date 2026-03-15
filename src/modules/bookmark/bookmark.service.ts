import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Bookmark } from './entity/bookmark.entity';

@Injectable()
export class BookmarkService extends BaseService<Bookmark> {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: MongoRepository<Bookmark>,
  ) {
    super(bookmarkRepository);
  }

  /**
   * Thêm/xoá bookmark (toggle)
   */
  async toggleBookmark(
    userId: string,
    storyId: string,
    storyTitle?: string,
    storyCoverKey?: string,
  ): Promise<{ bookmarked: boolean }> {
    const existing = await this.bookmarkRepository.findOne({
      where: { userId, storyId, isDeleted: false } as any,
    });

    if (existing) {
      existing.isDeleted = true;
      existing.deletedAt = new Date();
      await this.bookmarkRepository.save(existing);
      return { bookmarked: false };
    }

    const bookmark = new Bookmark();
    bookmark.userId = userId;
    bookmark.storyId = storyId;
    bookmark.storyTitle = storyTitle || '';
    bookmark.storyCoverKey = storyCoverKey || '';
    bookmark.lastReadAt = new Date();
    await this.bookmarkRepository.save(bookmark);
    return { bookmarked: true };
  }

  /**
   * Cập nhật tiến trình nghe
   */
  async updateProgress(
    userId: string,
    storyId: string,
    lastChapterId: string,
    lastChapterNumber: number,
    lastPosition: number = 0,
  ): Promise<Bookmark> {
    let bookmark = await this.bookmarkRepository.findOne({
      where: { userId, storyId, isDeleted: false } as any,
    });

    if (!bookmark) {
      bookmark = new Bookmark();
      bookmark.userId = userId;
      bookmark.storyId = storyId;
    }

    bookmark.lastChapterId = lastChapterId;
    bookmark.lastChapterNumber = lastChapterNumber;
    bookmark.lastPosition = lastPosition;
    bookmark.lastReadAt = new Date();

    return await this.bookmarkRepository.save(bookmark);
  }

  /**
   * Danh sách bookmark của user
   */
  async getUserBookmarks(userId: string, page: number = 0, size: number = 20) {
    const [bookmarks, total] = await this.bookmarkRepository.findAndCount({
      where: { userId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { lastReadAt: 'DESC' } as any,
    });

    return {
      data: bookmarks.map((b) => ({
        id: b.id.toString(),
        storyId: b.storyId,
        storyTitle: b.storyTitle,
        storyCoverKey: b.storyCoverKey,
        lastChapterId: b.lastChapterId,
        lastChapterNumber: b.lastChapterNumber,
        lastPosition: b.lastPosition,
        lastReadAt: b.lastReadAt,
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
   * Kiểm tra đã bookmark chưa
   */
  async isBookmarked(userId: string, storyId: string): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { userId, storyId, isDeleted: false } as any,
    });
    return !!bookmark;
  }
}