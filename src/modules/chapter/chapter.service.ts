import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Chapter } from './entity/chapter.entity';
import { StorageService } from '../upload/storage.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChapterService extends BaseService<Chapter> {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: MongoRepository<Chapter>,
    private readonly storageService: StorageService,
  ) {
    super(chapterRepository);
  }

  /**
   * Danh sách chương của truyện (không trả audio URL, chỉ metadata)
   */
  async findByStory(storyId: string, page: number = 0, size: number = 50) {
    const [chapters, total] = await this.chapterRepository.findAndCount({
      where: { storyId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { chapterNumber: 'ASC' } as any,
    });

    return {
      data: chapters.map((ch) => ({
        id: ch.id.toString(),
        chapterNumber: ch.chapterNumber,
        title: ch.title,
        chapterType: ch.chapterType,
        duration: ch.duration,
        price: ch.price,
        isFree: ch.isFree,
        viewCount: ch.viewCount,
        status: ch.status,
        createdAt: ch.createdAt,
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
   * Đọc/nghe chương - trả về nội dung + audio URL nếu đã mua hoặc miễn phí
   * hasPurchased: được kiểm tra ở controller thông qua PurchaseService
   */
  async getChapterContent(chapterId: string, hasPurchased: boolean) {
    const chapter = await this.chapterRepository.findOne({
      where: { _id: new ObjectId(chapterId) } as any,
    });

    if (!chapter) {
      throw new NotFoundException('Không tìm thấy chương');
    }

    // Nếu chương trả phí và chưa mua → chỉ trả metadata
    if (!chapter.isFree && !hasPurchased) {
      return {
        id: chapter.id.toString(),
        storyId: chapter.storyId,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        chapterType: chapter.chapterType,
        duration: chapter.duration,
        price: chapter.price,
        isFree: chapter.isFree,
        locked: true,
      };
    }

    // Đã mua hoặc miễn phí → trả full content
    let audioUrl = null;
    if (chapter.audioKey) {
      audioUrl = await this.storageService.generatePresignedDownloadUrl(
        chapter.audioKey,
        1800, // 30 phút
      );
    }

    // Tăng view count
    chapter.viewCount = (chapter.viewCount || 0) + 1;
    await this.chapterRepository.save(chapter);

    return {
      id: chapter.id.toString(),
      storyId: chapter.storyId,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      audioUrl,
      chapterType: chapter.chapterType,
      duration: chapter.duration,
      price: chapter.price,
      isFree: chapter.isFree,
      viewCount: chapter.viewCount,
      locked: false,
    };
  }

  /**
   * Đếm tổng số chương của truyện
   */
  async countByStory(storyId: string): Promise<number> {
    return await this.chapterRepository.count({
      where: { storyId, isDeleted: false } as any,
    });
  }
}