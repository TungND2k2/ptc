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
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { StoryReviewService } from './story-review.service';
import { CreateStoryReviewData, CreateStoryReviewResult } from './dto/create.dto';
import { UpdateStoryReviewData, UpdateStoryReviewResult } from './dto/update-one.dto';
import { FindStoryReviewByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { StoryReview } from './entity/story-review.entity';
import { UserProfileService } from '../user-profile/user-profile.service';

@ApiTags('Story Reviews')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_REVIEW)
@Controller(Controllers.PTC_REVIEW)
export class StoryReviewController extends BaseController {
  constructor(
    private readonly storyReviewService: StoryReviewService,
    private readonly userProfileService: UserProfileService,
  ) {
    super(storyReviewService);
  }

  @Post()
  @ApiOperation({
    summary: 'Đánh giá truyện',
    description: 'Mỗi user chỉ được đánh giá 1 lần/truyện. Muốn sửa thì dùng PATCH.',
  })
  @ApiResponse({ status: 201, description: 'Đánh giá thành công', type: CreateStoryReviewResult })
  @ApiResponse({ status: 409, description: 'Đã đánh giá truyện này rồi' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createReview(@Body() data: CreateStoryReviewData, @Req() req): Promise<CreateStoryReviewResult> {
    const userId = req.user?.userId || req.user?.id || '';
    const profile = await this.userProfileService.getOrCreateProfile(userId);

    const review = await this.storyReviewService.createReview(
      userId,
      profile.displayName,
      data.storyId,
      data.rating,
      data.comment || '',
    );

    return review as any;
  }

  @Get('story/:storyId')
  @ApiOperation({ summary: 'Danh sách đánh giá của truyện' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Danh sách đánh giá' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findByStory(
    @Param('storyId') storyId: string,
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
  ) {
    return await this.storyReviewService.findByStory(storyId, page, size);
  }

  @Get('story/:storyId/rating')
  @ApiOperation({ summary: 'Rating trung bình của truyện' })
  @ApiResponse({ status: 200, description: '{ average: 4.5, total: 120 }' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async getAverageRating(@Param('storyId') storyId: string) {
    return await this.storyReviewService.getAverageRating(storyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy review theo ID' })
  @ApiResponse({ status: 200, type: FindStoryReviewByIdResult })
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Req() req): Promise<FindStoryReviewByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách review (phân trang)' })
  @ApiResponse({ status: 200, type: FindAllResult })
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(@Query() queries: string, @Req() req): Promise<FindAllResult<StoryReview>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa đánh giá' })
  @ApiResponse({ status: 200, type: UpdateStoryReviewResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(@Param('id') id: string, @Body() data: UpdateStoryReviewData, @Req() req): Promise<UpdateStoryReviewResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá đánh giá (soft delete)' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}