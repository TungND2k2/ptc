import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Banner, BannerStatus } from './entity/banner.entity';
import { StorageService } from '../upload/storage.service';

@Injectable()
export class BannerService extends BaseService<Banner> {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: MongoRepository<Banner>,
    private readonly storageService: StorageService,
  ) {
    super(bannerRepository);
  }

  /**
   * Lấy banners đang active theo vị trí, kèm imageUrl
   */
  async getActiveBanners(position?: string) {
    const now = new Date();
    const where: any = {
      status: BannerStatus.ACTIVE,
      isDeleted: false,
    };

    if (position) {
      where.position = position;
    }

    const banners = await this.bannerRepository.find({
      where,
      order: { sortOrder: 'ASC' } as any,
    });

    return Promise.all(
      banners.map(async (b) => {
        let imageUrl = null;
        if (b.imageKey) {
          imageUrl = await this.storageService.generatePresignedDownloadUrl(b.imageKey);
        }
        return {
          id: b.id.toString(),
          title: b.title,
          description: b.description,
          imageUrl,
          linkType: b.linkType,
          linkValue: b.linkValue,
          position: b.position,
          sortOrder: b.sortOrder,
        };
      }),
    );
  }

  /**
   * Tăng click count
   */
  async trackClick(bannerId: string): Promise<void> {
    const banner = await this.bannerRepository.findOne({
      where: { _id: bannerId } as any,
    });
    if (banner) {
      banner.clickCount = (banner.clickCount || 0) + 1;
      await this.bannerRepository.save(banner);
    }
  }
}