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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { TransactionService } from './transaction.service';
import {
  CreateDepositDto,
  CreateDepositResponseDto,
  PaymentCallbackDto,
  WalletBalanceResponseDto,
} from './dto/transaction.dto';

@ApiTags('Transactions & Wallet')
@ApiBearerAuth()
@ServiceInfo(Services.PTC)
@ControllerInfo(Controllers.PTC_TRANSACTION)
@Controller(Controllers.PTC_TRANSACTION)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('wallet/balance')
  @ApiOperation({ summary: 'Lấy số dư ví coin' })
  @ApiResponse({ status: 200, description: 'Thông tin ví', type: WalletBalanceResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  async getBalance(@Req() req): Promise<WalletBalanceResponseDto> {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.transactionService.getBalance(userId);
  }

  @Post('wallet/deposit')
  @ApiOperation({
    summary: 'Tạo lệnh nạp tiền',
    description:
      '**Gói nạp:**\n' +
      '- 10.000 VNĐ = 100 coin\n' +
      '- 20.000 VNĐ = 210 coin (+10 bonus)\n' +
      '- 50.000 VNĐ = 550 coin (+50 bonus)\n' +
      '- 100.000 VNĐ = 1.150 coin (+150 bonus)\n' +
      '- 200.000 VNĐ = 2.400 coin (+400 bonus)\n' +
      '- 500.000 VNĐ = 6.200 coin (+1.200 bonus)\n\n' +
      'Trả về paymentUrl → redirect user đến cổng thanh toán.',
  })
  @ApiBody({
    type: CreateDepositDto,
    examples: {
      vnpay50k: {
        summary: 'Nạp 50k qua VNPay',
        value: { amount: 50000, provider: 'vnpay' },
      },
      momo100k: {
        summary: 'Nạp 100k qua MoMo',
        value: { amount: 100000, provider: 'momo' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Lệnh nạp đã tạo', type: CreateDepositResponseDto })
  @ApiResponse({ status: 400, description: 'Số tiền nạp không hợp lệ' })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createDeposit(
    @Body() data: CreateDepositDto,
    @Req() req,
  ): Promise<CreateDepositResponseDto> {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.transactionService.createDeposit(userId, data.amount, data.provider);
  }

  @Post('wallet/callback/:provider')
  @ApiOperation({
    summary: 'Webhook callback từ cổng thanh toán',
    description: 'Endpoint nhận callback từ VNPay/MoMo/ZaloPay khi thanh toán hoàn tất.',
  })
  @ApiParam({ name: 'provider', enum: ['vnpay', 'momo', 'zalopay'] })
  @ApiResponse({ status: 200, description: 'Callback xử lý thành công' })
  async paymentCallback(
    @Param('provider') provider: string,
    @Body() data: PaymentCallbackDto,
  ) {
    return await this.transactionService.handlePaymentCallback(
      data.transactionId,
      data.status,
      data.providerTransactionId,
      data.data,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Lịch sử giao dịch' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Lịch sử giao dịch' })
  @UseGuards(AuthGuard, RolesGuard)
  async getTransactionHistory(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.id || '';
    return await this.transactionService.getTransactionHistory(userId, page, size);
  }
}