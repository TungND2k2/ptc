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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { PurchaseService } from './purchase.service';
import { TransactionService } from '../transaction/transaction.service';
import { ChapterService } from '../chapter/chapter.service';
import {
  PurchaseChapterDto,
  PurchaseChapterResponseDto,
  CheckPurchaseResponseDto,
} from './dto/purchase.dto';

@ApiTags('Purchases')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_PURCHASE)
@Controller(Controllers.PTC_PURCHASE)
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly transactionService: TransactionService,
    private readonly chapterService: ChapterService,
  ) {}

  @Post('chapter')
  @ApiOperation({
    summary: 'Mua chương truyện',
    description:
      '**Flow mua chương:**\n\n' +
      '1. Kiểm tra đã mua chưa\n' +
      '2. Kiểm tra chương tồn tại và có phí\n' +
      '3. Kiểm tra số dư ví >= giá chương\n' +
      '4. Trừ coin từ ví + tạo purchase record + tạo transaction\n' +
      '5. Trả về kết quả mua',
  })
  @ApiBody({ type: PurchaseChapterDto })
  @ApiResponse({ status: 200, description: 'Mua thành công', type: PurchaseChapterResponseDto })
  @ApiResponse({ status: 400, description: 'Không đủ coin / Chương miễn phí' })
  @ApiResponse({ status: 409, description: 'Đã mua chương này rồi' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async purchaseChapter(
    @Body() data: PurchaseChapterDto,
    @Req() req,
  ): Promise<PurchaseChapterResponseDto> {
    const userId = req.user?.userId || req.user?.id || '';

    // Lấy thông tin chương
    const chapter = await this.chapterService.findOne(data.chapterId, req.user);
    if (!chapter) {
      throw new BadRequestException('Không tìm thấy chương');
    }

    if ((chapter as any).isFree || (chapter as any).price === 0) {
      throw new BadRequestException('Chương này miễn phí, không cần mua');
    }

    // Kiểm tra đã mua chưa
    const alreadyPurchased = await this.purchaseService.hasPurchased(userId, data.chapterId);
    if (alreadyPurchased) {
      throw new BadRequestException('Bạn đã mua chương này rồi');
    }

    const chapterPrice = (chapter as any).price;

    // Kiểm tra số dư và trừ tiền
    const walletResult = await this.transactionService.deductBalance(userId, chapterPrice);

    // Tạo purchase record
    const purchase = await this.purchaseService.createPurchase(
      userId,
      data.chapterId,
      (chapter as any).storyId,
      chapterPrice,
    );

    // Tạo transaction record (type: purchase)
    await this.transactionService.createTransaction({
      userId,
      type: 'purchase',
      amount: -chapterPrice,
      description: `Mua chương: ${(chapter as any).title}`,
      referenceId: purchase.id.toString(),
      referenceType: 'purchase',
    });

    return {
      success: true,
      purchaseId: purchase.id.toString(),
      amount: chapterPrice,
      remainingBalance: walletResult.newBalance,
      purchasedAt: purchase.purchasedAt,
    };
  }

  @Get('check/:chapterId')
  @ApiOperation({ summary: 'Kiểm tra đã mua chương chưa' })
  @ApiParam({ name: 'chapterId', description: 'Chapter ID' })
  @ApiResponse({ status: 200, description: 'Kết quả kiểm tra', type: CheckPurchaseResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  async checkPurchase(
    @Param('chapterId') chapterId: string,
    @Req() req,
  ): Promise<CheckPurchaseResponseDto> {
    const userId = req.user?.userId || req.user?.id || '';
    const purchased = await this.purchaseService.hasPurchased(userId, chapterId);
    return { purchased };
  }

  @Get('history')
  @ApiOperation({ summary: 'Lịch sử mua chương' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Lịch sử mua chương' })
  @UseGuards(AuthGuard, RolesGuard)
  async getPurchaseHistory(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.purchaseService.getPurchaseHistory(userId, page, size);
  }

  @Get('story/:storyId')
  @ApiOperation({ summary: 'Danh sách chương đã mua của truyện' })
  @ApiParam({ name: 'storyId', description: 'Story ID' })
  @ApiResponse({ status: 200, description: 'Danh sách chapter IDs đã mua' })
  @UseGuards(AuthGuard, RolesGuard)
  async getPurchasedChapters(
    @Param('storyId') storyId: string,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    const chapterIds = await this.purchaseService.getPurchasedChapterIds(userId, storyId);
    return { chapterIds };
  }
}