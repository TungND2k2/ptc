import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Purchase } from './entity/purchase.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PurchaseService extends BaseService<Purchase> {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: MongoRepository<Purchase>,
  ) {
    super(purchaseRepository);
  }

  /**
   * Kiểm tra user đã mua chương chưa
   */
  async hasPurchased(userId: string, chapterId: string): Promise<boolean> {
    const purchase = await this.purchaseRepository.findOne({
      where: { userId, chapterId, isDeleted: false } as any,
    });
    return !!purchase;
  }

  /**
   * Tạo purchase record khi mua chương thành công
   */
  async createPurchase(
    userId: string,
    chapterId: string,
    storyId: string,
    amount: number,
  ): Promise<Purchase> {
    // Kiểm tra đã mua chưa
    const existing = await this.purchaseRepository.findOne({
      where: { userId, chapterId, isDeleted: false } as any,
    });
    if (existing) {
      throw new ConflictException('Bạn đã mua chương này rồi');
    }

    const purchase = new Purchase();
    purchase.userId = userId;
    purchase.chapterId = chapterId;
    purchase.storyId = storyId;
    purchase.amount = amount;
    purchase.paymentMethod = 'wallet';
    purchase.purchasedAt = new Date();

    return await this.purchaseRepository.save(purchase);
  }

  /**
   * Lịch sử mua của user
   */
  async getPurchaseHistory(userId: string, page: number = 0, size: number = 20) {
    const [purchases, total] = await this.purchaseRepository.findAndCount({
      where: { userId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { purchasedAt: 'DESC' } as any,
    });

    return {
      data: purchases.map((p) => ({
        id: p.id.toString(),
        storyId: p.storyId,
        chapterId: p.chapterId,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        purchasedAt: p.purchasedAt,
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
   * Lấy danh sách chương đã mua của user cho 1 truyện
   */
  async getPurchasedChapterIds(userId: string, storyId: string): Promise<string[]> {
    const purchases = await this.purchaseRepository.find({
      where: { userId, storyId, isDeleted: false } as any,
    });
    return purchases.map((p) => p.chapterId);
  }
}