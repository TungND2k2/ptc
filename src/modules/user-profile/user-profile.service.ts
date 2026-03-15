import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { UserProfile } from './entity/user-profile.entity';
import { StorageService } from '../upload/storage.service';

@Injectable()
export class UserProfileService extends BaseService<UserProfile> {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: MongoRepository<UserProfile>,
    private readonly storageService: StorageService,
  ) {
    super(userProfileRepository);
  }

  /**
   * Lấy hoặc tạo profile cho user (auto-create khi đăng nhập lần đầu)
   */
  async getOrCreateProfile(userId: string, displayName?: string): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { userId, isDeleted: false } as any,
    });

    if (!profile) {
      profile = new UserProfile();
      profile.userId = userId;
      profile.displayName = displayName || `User_${userId.slice(-6)}`;
      profile.lastActiveAt = new Date();
      profile = await this.userProfileRepository.save(profile);
    }

    return profile;
  }

  /**
   * Lấy profile kèm avatar URL
   */
  async getProfileWithAvatar(userId: string) {
    const profile = await this.getOrCreateProfile(userId);

    let avatarUrl = null;
    if (profile.avatarKey) {
      avatarUrl = await this.storageService.generatePresignedDownloadUrl(profile.avatarKey);
    }

    return { ...profile, avatarUrl };
  }

  /**
   * Cập nhật thời gian hoạt động
   */
  async updateLastActive(userId: string): Promise<void> {
    const profile = await this.userProfileRepository.findOne({
      where: { userId, isDeleted: false } as any,
    });
    if (profile) {
      profile.lastActiveAt = new Date();
      await this.userProfileRepository.save(profile);
    }
  }

  /**
   * Cộng thời gian nghe
   */
  async addListeningTime(userId: string, seconds: number): Promise<void> {
    const profile = await this.userProfileRepository.findOne({
      where: { userId, isDeleted: false } as any,
    });
    if (profile) {
      profile.totalListeningTime = (profile.totalListeningTime || 0) + seconds;
      await this.userProfileRepository.save(profile);
    }
  }
}