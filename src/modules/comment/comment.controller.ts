import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CommentService } from './comment.service';
import { CreateCommentData, CreateCommentResult, UpdateCommentData, UpdateCommentResult } from './dto/comment.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { UserProfileService } from '../user-profile/user-profile.service';

@ApiTags('Comments')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_COMMENT)
@Controller(Controllers.PTC_COMMENT)
export class CommentController extends BaseController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userProfileService: UserProfileService,
  ) {
    super(commentService);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo bình luận',
    description: 'Bình luận vào chương. Để reply, truyền parentId = ID comment cha.',
  })
  @ApiResponse({ status: 201, description: 'Bình luận thành công', type: CreateCommentResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createComment(@Body() data: CreateCommentData, @Req() req): Promise<CreateCommentResult> {
    const userId = req.user?.userId || req.user?.id || '';
    const profile = await this.userProfileService.getOrCreateProfile(userId);

    const comment = await this.commentService.createComment(
      userId,
      profile.displayName,
      profile.avatarKey || '',
      data,
    );

    return comment as any;
  }

  @Get('chapter/:chapterId')
  @ApiOperation({ summary: 'Danh sách bình luận của chương' })
  @ApiParam({ name: 'chapterId' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận (root comments)' })
  @UseGuards(AuthGuard, RolesGuard)
  async findByChapter(
    @Param('chapterId') chapterId: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.commentService.findByChapter(chapterId, page, size);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Danh sách reply của comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách reply' })
  @UseGuards(AuthGuard, RolesGuard)
  async findReplies(
    @Param('id') id: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.commentService.findReplies(id, page, size);
  }

  @Get('chapter/:chapterId/count')
  @ApiOperation({ summary: 'Đếm số bình luận của chương' })
  @ApiResponse({ status: 200, description: '{ count: 42 }' })
  @UseGuards(AuthGuard, RolesGuard)
  async countByChapter(@Param('chapterId') chapterId: string) {
    const count = await this.commentService.countByChapter(chapterId);
    return { count };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa bình luận (chỉ chủ comment)' })
  @ApiResponse({ status: 200, type: UpdateCommentResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(@Param('id') id: string, @Body() data: UpdateCommentData, @Req() req): Promise<UpdateCommentResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá bình luận (soft delete)' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}