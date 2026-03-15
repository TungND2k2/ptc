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
import { Public } from 'src/common/decorators/public.decorator';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { ChapterService } from './chapter.service';
import { CreateChapterData, CreateChapterResult } from './dto/create.dto';
import { UpdateChapterData, UpdateChapterResult } from './dto/update-one.dto';
import { FindChapterByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { Chapter } from './entity/chapter.entity';
import { PurchaseService } from '../purchase/purchase.service';

@ApiTags('Chapters')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_CHAPTER)
@Controller(Controllers.PTC_CHAPTER)
export class ChapterController extends BaseController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly purchaseService: PurchaseService,
  ) {
    super(chapterService);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo chương mới',
    description: 'Admin/Author tạo chương mới cho truyện. audioKey lấy từ Upload API (POST /upload/presign-put).',
  })
  @ApiResponse({ status: 201, description: 'Tạo chương thành công', type: CreateChapterResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateChapterData,
    @Req() req,
  ): Promise<CreateChapterResult> {
    return await super.createOne(data, req);
  }

  @Get('story/:storyId')
  @ApiOperation({ summary: 'Danh sách chương của truyện' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Danh sách chương' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findByStory(
    @Param('storyId') storyId: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 50,
  ) {
    return await this.chapterService.findByStory(storyId, page, size);
  }

  @Get(':id/content')
  @ApiOperation({
    summary: 'Đọc/nghe nội dung chương',
    description: 'Trả về nội dung text + audio URL (presigned 30 phút) nếu đã mua hoặc miễn phí. ' +
                 'Nếu chưa mua chương trả phí → trả metadata + locked: true.',
  })
  @ApiResponse({ status: 200, description: 'Nội dung chương (locked: false nếu đã mua)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương' })
  @UseGuards(AuthGuard, RolesGuard)
  async getChapterContent(
    @Param('id') id: string,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    const hasPurchased = await this.purchaseService.hasPurchased(userId, id);
    return await this.chapterService.getChapterContent(id, hasPurchased);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chương theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin chương', type: FindChapterByIdResult })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindChapterByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách chương (phân trang)' })
  @ApiResponse({ status: 200, description: 'Danh sách chương', type: FindAllResult })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<Chapter>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chương' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: UpdateChapterResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateChapterData,
    @Req() req,
  ): Promise<UpdateChapterResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá chương (soft delete)' })
  @ApiResponse({ status: 200, description: 'Xoá thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}