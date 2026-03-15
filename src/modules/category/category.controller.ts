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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { CategoryService } from './category.service';
import { CreateCategoryData, CreateCategoryResult } from './dto/create.dto';
import { UpdateCategoryData, UpdateCategoryResult } from './dto/update-one.dto';
import { FindCategoryByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { Category } from './entity/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_CATEGORY)
@Controller(Controllers.PTC_CATEGORY)
export class CategoryController extends BaseController {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thể loại mới' })
  @ApiResponse({ status: 201, description: 'Tạo thể loại thành công', type: CreateCategoryResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateCategoryData,
    @Req() req,
  ): Promise<CreateCategoryResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thể loại theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin thể loại', type: FindCategoryByIdResult })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindCategoryByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách thể loại (phân trang)' })
  @ApiResponse({ status: 200, description: 'Danh sách thể loại', type: FindAllResult })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<Category>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thể loại theo slug' })
  @ApiResponse({ status: 200, description: 'Thông tin thể loại' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  @Public()
  @UseGuards(AuthGuard, RolesGuard)
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thể loại' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: UpdateCategoryResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateCategoryData,
    @Req() req,
  ): Promise<UpdateCategoryResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá thể loại (soft delete)' })
  @ApiResponse({ status: 200, description: 'Xoá thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}