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
import { BookmarkService } from './bookmark.service';
import { AddBookmarkDto, UpdateReadingProgressDto } from './dto/bookmark.dto';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_BOOKMARK)
@Controller(Controllers.PTC_BOOKMARK)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('toggle')
  @ApiOperation({
    summary: 'Thêm/xoá bookmark truyện (toggle)',
    description: 'Nếu chưa bookmark → thêm. Nếu đã bookmark → xoá. Trả về trạng thái mới.',
  })
  @ApiResponse({ status: 200, description: '{ bookmarked: true/false }' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async toggleBookmark(@Body() data: AddBookmarkDto, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.bookmarkService.toggleBookmark(
      userId,
      data.storyId,
      data.storyTitle,
      data.storyCoverKey,
    );
  }

  @Post('progress')
  @ApiOperation({
    summary: 'Cập nhật tiến trình nghe',
    description: 'Lưu vị trí nghe dở (chương + giây). Auto tạo bookmark nếu chưa có.',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật tiến trình thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateProgress(@Body() data: UpdateReadingProgressDto, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.bookmarkService.updateProgress(
      userId,
      data.storyId,
      data.lastChapterId,
      data.lastChapterNumber,
      data.lastPosition,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách truyện đã bookmark' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách bookmark kèm tiến trình nghe' })
  @UseGuards(AuthGuard, RolesGuard)
  async getUserBookmarks(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.bookmarkService.getUserBookmarks(userId, page, size);
  }

  @Get('check/:storyId')
  @ApiOperation({ summary: 'Kiểm tra đã bookmark truyện chưa' })
  @ApiParam({ name: 'storyId' })
  @ApiResponse({ status: 200, description: '{ bookmarked: true/false }' })
  @UseGuards(AuthGuard, RolesGuard)
  async isBookmarked(@Param('storyId') storyId: string, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    const bookmarked = await this.bookmarkService.isBookmarked(userId, storyId);
    return { bookmarked };
  }
}