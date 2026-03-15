import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Notification } from './entity/notification.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: MongoRepository<Notification>,
  ) {
    super(notificationRepository);
  }

  /**
   * Tạo notification cho user
   */
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    linkType?: string;
    linkValue?: string;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId;
    notification.type = data.type;
    notification.title = data.title;
    notification.message = data.message || '';
    notification.linkType = data.linkType || '';
    notification.linkValue = data.linkValue || '';
    notification.isRead = false;

    return await this.notificationRepository.save(notification);
  }

  /**
   * Tạo notification cho nhiều user (chương mới)
   */
  async broadcastNotification(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    linkType?: string,
    linkValue?: string,
  ): Promise<number> {
    const notifications = userIds.map((userId) => {
      const n = new Notification();
      n.userId = userId;
      n.type = type;
      n.title = title;
      n.message = message;
      n.linkType = linkType || '';
      n.linkValue = linkValue || '';
      n.isRead = false;
      return n;
    });

    const result = await this.notificationRepository.save(notifications);
    return result.length;
  }

  /**
   * Danh sách notification của user
   */
  async getUserNotifications(userId: string, page: number = 0, size: number = 20) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      data: notifications.map((n) => ({
        id: n.id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        linkType: n.linkType,
        linkValue: n.linkValue,
        isRead: n.isRead,
        createdAt: n.createdAt,
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
   * Đánh dấu đã đọc
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { _id: new ObjectId(notificationId), userId } as any,
    });
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date();
      await this.notificationRepository.save(notification);
    }
  }

  /**
   * Đánh dấu tất cả đã đọc
   */
  async markAllAsRead(userId: string): Promise<void> {
    const unread = await this.notificationRepository.find({
      where: { userId, isRead: false, isDeleted: false } as any,
    });

    for (const n of unread) {
      n.isRead = true;
      n.readAt = new Date();
    }

    if (unread.length > 0) {
      await this.notificationRepository.save(unread);
    }
  }

  /**
   * Đếm số chưa đọc
   */
  async countUnread(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, isRead: false, isDeleted: false } as any,
    });
  }
}