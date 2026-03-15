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
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileData, CreateUserProfileResult } from './dto/create.dto';
import { UpdateUserProfileData, UpdateUserProfileResult } from './dto/update-one.dto';
import { FindUserProfileByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { UserProfile } from './entity/user-profile.entity';

@ApiTags('User Profiles')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_USER_PROFILE)
@Controller(Controllers.PTC_USER_PROFILE)
export class UserProfileController extends BaseController {
  constructor(private readonly userProfileService: UserProfileService) {
    super(userProfileService);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Lấy profile của user hiện tại',
    description: 'Tự động tạo profile nếu chưa có. Trả về kèm avatar URL.',
  })
  @ApiResponse({ status: 200, description: 'Thông tin profile kèm avatarUrl' })
  @UseGuards(AuthGuard, RolesGuard)
  async getMyProfile(@Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.userProfileService.getProfileWithAvatar(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật profile của user hiện tại' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMyProfile(@Body() data: UpdateUserProfileData, @Req() req) {
    const userId = req.user?.userId || req.user?.id || '';
    const profile = await this.userProfileService.getOrCreateProfile(userId);
    return await super.updateOne(profile.id.toString(), data, req);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo user profile (admin)' })
  @ApiResponse({ status: 201, type: CreateUserProfileResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(@Body() data: CreateUserProfileData, @Req() req): Promise<CreateUserProfileResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy profile theo ID' })
  @ApiResponse({ status: 200, type: FindUserProfileByIdResult })
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Req() req): Promise<FindUserProfileByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách user profiles (admin)' })
  @ApiResponse({ status: 200, type: FindAllResult })
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(@Query() queries: string, @Req() req): Promise<FindAllResult<UserProfile>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật profile (admin)' })
  @ApiResponse({ status: 200, type: UpdateUserProfileResult })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(@Param('id') id: string, @Body() data: UpdateUserProfileData, @Req() req): Promise<UpdateUserProfileResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá profile (admin, soft delete)' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}