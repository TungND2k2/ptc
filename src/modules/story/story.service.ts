import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Story } from './entity/story.entity';
import { StorageService } from '../upload/storage.service';

@Injectable()
export class StoryService extends BaseService<Story> {
  constructor(
    @InjectRepository(Story)
    private storyRepository: MongoRepository<Story>,
    private readonly storageService: StorageService,
  ) {
    super(storyRepository);
  }

  /**
   * Tìm truyện theo slug, kèm presigned URL cho ảnh bìa
   */
  async findBySlug(slug: string) {
    const story = await this.storyRepository.findOne({
      where: { slug, isDeleted: false } as any,
    });
    if (!story) {
      throw new NotFoundException(`Không tìm thấy truyện với slug: ${slug}`);
    }

    let coverImageUrl = null;
    if (story.coverImageKey) {
      coverImageUrl = await this.storageService.generatePresignedDownloadUrl(story.coverImageKey);
    }

    return { ...story, coverImageUrl };
  }

  /**
   * Lấy danh sách truyện nổi bật
   */
  async findFeatured(limit: number = 10) {
    const stories = await this.storyRepository.find({
      where: { isFeatured: true, isPublished: true, isDeleted: false } as any,
      take: limit,
      order: { totalViews: 'DESC' } as any,
    });

    return Promise.all(
      stories.map(async (story) => {
        let coverImageUrl = null;
        if (story.coverImageKey) {
          coverImageUrl = await this.storageService.generatePresignedDownloadUrl(story.coverImageKey);
        }
        return { ...story, coverImageUrl };
      }),
    );
  }

  /**
   * Lấy truyện theo category
   */
  async findByCategory(categoryId: string, page: number = 0, size: number = 20) {
    const [stories, total] = await this.storyRepository.findAndCount({
      where: { categoryIds: categoryId, isPublished: true, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      data: await Promise.all(
        stories.map(async (story) => {
          let coverImageUrl = null;
          if (story.coverImageKey) {
            coverImageUrl = await this.storageService.generatePresignedDownloadUrl(story.coverImageKey);
          }
          return { ...story, coverImageUrl };
        }),
      ),
      paging: {
        index: page,
        size,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
    };
  }

  /**
   * Tăng lượt xem
   */
  async incrementViews(storyId: string): Promise<void> {
    const story = await this.storyRepository.findOne({
      where: { _id: storyId } as any,
    });
    if (story) {
      story.totalViews = (story.totalViews || 0) + 1;
      await this.storyRepository.save(story);
    }
  }

  /**
   * Cập nhật totalChapters
   */
  async updateChapterCount(storyId: string, count: number): Promise<void> {
    const story = await this.storyRepository.findOne({
      where: { _id: storyId } as any,
    });
    if (story) {
      story.totalChapters = count;
      await this.storyRepository.save(story);
    }
  }
}