import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { NotificationService } from './notification.service';
import { CreateNotificationData, CreateNotificationResult } from './dto/notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_NOTIFICATION)
@Controller(Controllers.PTC_NOTIFICATION)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thông báo của user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  @UseGuards(AuthGuard, RolesGuard)
  async getUserNotifications(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.notificationService.getUserNotifications(userId, page, size);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Đếm số thông báo chưa đọc' })
  @ApiResponse({ status: 200, description: '{ count: 5 }' })
  @UseGuards(AuthGuard, RolesGuard)
  async countUnread(@Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    const count = await this.notificationService.countUnread(userId);
    return { count };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Đánh dấu đã đọc 1 thông báo' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async markAsRead(@Param('id') id: string, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    await this.notificationService.markAsRead(id, userId);
    return { success: true };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu tất cả thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async markAllAsRead(@Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo (admin/system)' })
  @ApiResponse({ status: 201, type: CreateNotificationResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createNotification(@Body() data: CreateNotificationData): Promise<CreateNotificationResult> {
    const result = await this.notificationService.createNotification(data);
    return result as any;
  }
}