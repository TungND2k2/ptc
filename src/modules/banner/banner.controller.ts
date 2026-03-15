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
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { BannerService } from './banner.service';
import { CreateBannerData, CreateBannerResult } from './dto/create.dto';
import { UpdateBannerData, UpdateBannerResult } from './dto/update-one.dto';
import { FindBannerByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { Banner } from './entity/banner.entity';

@ApiTags('Banners')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_BANNER)
@Controller(Controllers.PTC_BANNER)
export class BannerController extends BaseController {
  constructor(private readonly bannerService: BannerService) {
    super(bannerService);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Lấy banners đang hiển thị',
    description: 'Trả về danh sách banners active kèm imageUrl (presigned). Dùng cho trang chủ.',
  })
  @ApiQuery({ name: 'position', required: false, enum: ['home_top', 'home_middle', 'category_top', 'story_detail'] })
  @ApiResponse({ status: 200, description: 'Danh sách banners active kèm imageUrl' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async getActiveBanners(@Query('position') position?: string) {
    return await this.bannerService.getActiveBanners(position);
  }

  @Post(':id/click')
  @ApiOperation({ summary: 'Track click banner' })
  @UseGuards(AuthGuard, RolesGuard)
  async trackClick(@Param('id') id: string) {
    await this.bannerService.trackClick(id);
    return { success: true };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo banner (admin)' })
  @ApiResponse({ status: 201, type: CreateBannerResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(@Body() data: CreateBannerData, @Req() req): Promise<CreateBannerResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy banner theo ID' })
  @ApiResponse({ status: 200, type: FindBannerByIdResult })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Req() req): Promise<FindBannerByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách banners (admin, phân trang)' })
  @ApiResponse({ status: 200, type: FindAllResult })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(@Query() queries: string, @Req() req): Promise<FindAllResult<Banner>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật banner (admin)' })
  @ApiResponse({ status: 200, type: UpdateBannerResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(@Param('id') id: string, @Body() data: UpdateBannerData, @Req() req): Promise<UpdateBannerResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá banner (admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}