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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { ListeningHistoryService } from './listening-history.service';
import { UpdateListeningProgressDto } from './dto/listening-history.dto';

@ApiTags('Listening History')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_LISTENING_HISTORY)
@Controller(Controllers.PTC_LISTENING_HISTORY)
export class ListeningHistoryController {
  constructor(private readonly historyService: ListeningHistoryService) {}

  @Post('progress')
  @ApiOperation({
    summary: 'Cập nhật tiến trình nghe',
    description: 'Client gọi định kỳ (mỗi 30s) để lưu vị trí nghe. Auto tạo record nếu chưa có.',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật tiến trình thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateProgress(@Body() data: UpdateListeningProgressDto, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.historyService.updateProgress(userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Lịch sử nghe của user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách lịch sử nghe' })
  @UseGuards(AuthGuard, RolesGuard)
  async getUserHistory(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.historyService.getUserHistory(userId, page, size);
  }

  @Get('chapter/:chapterId')
  @ApiOperation({ summary: 'Tiến trình nghe của 1 chương' })
  @ApiParam({ name: 'chapterId' })
  @ApiResponse({ status: 200, description: '{ lastPosition, progressPercent, completed }' })
  @UseGuards(AuthGuard, RolesGuard)
  async getChapterProgress(@Param('chapterId') chapterId: string, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.historyService.getChapterProgress(userId, chapterId);
  }
}