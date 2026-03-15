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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { StoryService } from './story.service';
import { CreateStoryData, CreateStoryResult } from './dto/create.dto';
import { UpdateStoryData, UpdateStoryResult } from './dto/update-one.dto';
import { FindStoryByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { Story } from './entity/story.entity';

@ApiTags('Stories')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_STORY)
@Controller(Controllers.PTC_STORY)
export class StoryController extends BaseController {
  constructor(private readonly storyService: StoryService) {
    super(storyService);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo truyện mới',
    description: 'Admin/Author tạo truyện mới. coverImageKey lấy từ Upload API (POST /upload/presign-put).',
  })
  @ApiResponse({ status: 201, description: 'Tạo truyện thành công', type: CreateStoryResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateStoryData,
    @Req() req,
  ): Promise<CreateStoryResult> {
    return await super.createOne(data, req);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Danh sách truyện nổi bật' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng tối đa', example: 10 })
  @ApiResponse({ status: 200, description: 'Danh sách truyện nổi bật' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findFeatured(@Query('limit') limit: number = 10) {
    return await this.storyService.findFeatured(limit);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Danh sách truyện theo thể loại' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách truyện theo thể loại' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.storyService.findByCategory(categoryId, page, size);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy truyện theo slug' })
  @ApiResponse({ status: 200, description: 'Chi tiết truyện kèm coverImageUrl' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy truyện' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findBySlug(@Param('slug') slug: string) {
    return await this.storyService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy truyện theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết truyện', type: FindStoryByIdResult })
  @ApiResponse({ status: 404, description: 'Không tìm thấy truyện' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindStoryByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách truyện (phân trang)' })
  @ApiResponse({ status: 200, description: 'Danh sách truyện', type: FindAllResult })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<Story>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật truyện' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: UpdateStoryResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateStoryData,
    @Req() req,
  ): Promise<UpdateStoryResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá truyện (soft delete)' })
  @ApiResponse({ status: 200, description: 'Xoá thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}