import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { ListeningHistory } from './entity/listening-history.entity';

@Injectable()
export class ListeningHistoryService extends BaseService<ListeningHistory> {
  constructor(
    @InjectRepository(ListeningHistory)
    private historyRepository: MongoRepository<ListeningHistory>,
  ) {
    super(historyRepository);
  }

  /**
   * Cập nhật tiến trình nghe (upsert theo userId + chapterId)
   */
  async updateProgress(
    userId: string,
    data: {
      storyId: string;
      chapterId: string;
      lastPosition: number;
      listenedDuration: number;
      totalDuration?: number;
      storyTitle?: string;
      chapterNumber?: number;
      chapterTitle?: string;
    },
  ): Promise<ListeningHistory> {
    let history = await this.historyRepository.findOne({
      where: { userId, chapterId: data.chapterId, isDeleted: false } as any,
    });

    if (!history) {
      history = new ListeningHistory();
      history.userId = userId;
      history.storyId = data.storyId;
      history.chapterId = data.chapterId;
      history.startedAt = new Date();
    }

    history.lastPosition = data.lastPosition;
    history.listenedDuration = (history.listenedDuration || 0) + data.listenedDuration;
    history.lastListenedAt = new Date();

    if (data.totalDuration) {
      history.totalDuration = data.totalDuration;
      history.progressPercent = Math.min(
        100,
        Math.round((data.lastPosition / data.totalDuration) * 100),
      );
      history.completed = history.progressPercent >= 95;
    }

    if (data.storyTitle) history.storyTitle = data.storyTitle;
    if (data.chapterNumber) history.chapterNumber = data.chapterNumber;
    if (data.chapterTitle) history.chapterTitle = data.chapterTitle;

    return await this.historyRepository.save(history);
  }

  /**
   * Lịch sử nghe của user (gom theo truyện, lấy chương mới nhất)
   */
  async getUserHistory(userId: string, page: number = 0, size: number = 20) {
    const [histories, total] = await this.historyRepository.findAndCount({
      where: { userId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { lastListenedAt: 'DESC' } as any,
    });

    return {
      data: histories.map((h) => ({
        id: h.id.toString(),
        storyId: h.storyId,
        storyTitle: h.storyTitle,
        chapterId: h.chapterId,
        chapterNumber: h.chapterNumber,
        chapterTitle: h.chapterTitle,
        lastPosition: h.lastPosition,
        totalDuration: h.totalDuration,
        progressPercent: h.progressPercent,
        completed: h.completed,
        lastListenedAt: h.lastListenedAt,
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
   * Lấy tiến trình nghe của 1 chương cụ thể
   */
  async getChapterProgress(userId: string, chapterId: string) {
    const history = await this.historyRepository.findOne({
      where: { userId, chapterId, isDeleted: false } as any,
    });

    if (!history) {
      return { lastPosition: 0, progressPercent: 0, completed: false };
    }

    return {
      lastPosition: history.lastPosition,
      progressPercent: history.progressPercent,
      completed: history.completed,
      listenedDuration: history.listenedDuration,
    };
  }
}