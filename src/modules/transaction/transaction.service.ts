import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { Transaction } from './entity/transaction.entity';
import { Wallet } from './entity/wallet.entity';
import { TransactionStatus, TransactionType } from './enum/transaction.enum';
import { CreateTransactionInput } from './dto/transaction.dto';

// Tỉ giá VNĐ → Coin
const COIN_RATE: { [key: number]: number } = {
  10000: 100,
  20000: 210,
  50000: 550,
  100000: 1150,
  200000: 2400,
  500000: 6200,
};

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: MongoRepository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: MongoRepository<Wallet>,
  ) {
    super(transactionRepository);
  }

  /**
   * Lấy hoặc tạo ví cho user
   */
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { userId, isDeleted: false } as any,
    });

    if (!wallet) {
      wallet = new Wallet();
      wallet.userId = userId;
      wallet.balance = 0;
      wallet.totalDeposited = 0;
      wallet.totalSpent = 0;
      wallet = await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  /**
   * Lấy số dư ví
   */
  async getBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      balance: wallet.balance,
      totalDeposited: wallet.totalDeposited,
      totalSpent: wallet.totalSpent,
    };
  }

  /**
   * Tạo lệnh nạp tiền → trả về payment URL
   */
  async createDeposit(userId: string, amount: number, provider: string) {
    const coinAmount = COIN_RATE[amount];
    if (!coinAmount) {
      const validAmounts = Object.keys(COIN_RATE).join(', ');
      throw new BadRequestException(
        `Số tiền nạp không hợp lệ. Các mệnh giá: ${validAmounts} VNĐ`,
      );
    }

    const wallet = await this.getOrCreateWallet(userId);

    // Tạo transaction pending
    const transaction = new Transaction();
    transaction.userId = userId;
    transaction.type = TransactionType.DEPOSIT;
    transaction.amount = coinAmount;
    transaction.description = `Nạp ${coinAmount} coin (${amount.toLocaleString()} VNĐ)`;
    transaction.status = TransactionStatus.PENDING;
    transaction.provider = provider;
    transaction.balanceBefore = wallet.balance;
    transaction.balanceAfter = wallet.balance + coinAmount;

    const saved = await this.transactionRepository.save(transaction);

    // TODO: Tích hợp cổng thanh toán thực tế (VNPay, MoMo, ZaloPay)
    // Hiện tại trả về placeholder URL
    const paymentUrl = `https://payment.example.com/${provider}?txn=${saved.id}&amount=${amount}`;

    return {
      transactionId: saved.id.toString(),
      paymentUrl,
      coinAmount,
      moneyAmount: amount,
    };
  }

  /**
   * Xử lý callback từ cổng thanh toán
   */
  async handlePaymentCallback(
    transactionId: string,
    status: string,
    providerTransactionId?: string,
    providerData?: any,
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: { _id: transactionId } as any,
    });

    if (!transaction) {
      throw new NotFoundException('Không tìm thấy giao dịch');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Giao dịch đã được xử lý');
    }

    if (status === 'success') {
      // Cộng coin vào ví
      const wallet = await this.getOrCreateWallet(transaction.userId);
      wallet.balance += transaction.amount;
      wallet.totalDeposited += transaction.amount;
      await this.walletRepository.save(wallet);

      // Cập nhật transaction
      transaction.status = TransactionStatus.COMPLETED;
      transaction.providerTransactionId = providerTransactionId || '';
      transaction.providerData = providerData || {};
      transaction.balanceAfter = wallet.balance;
    } else {
      transaction.status = TransactionStatus.FAILED;
      transaction.providerData = providerData || {};
    }

    await this.transactionRepository.save(transaction);

    return {
      success: status === 'success',
      transactionId: transaction.id.toString(),
      status: transaction.status,
    };
  }

  /**
   * Trừ coin từ ví (khi mua chương)
   */
  async deductBalance(
    userId: string,
    amount: number,
  ): Promise<{ newBalance: number }> {
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException(
        `Không đủ coin. Số dư: ${wallet.balance}, cần: ${amount}`,
      );
    }

    wallet.balance -= amount;
    wallet.totalSpent += amount;
    await this.walletRepository.save(wallet);

    return { newBalance: wallet.balance };
  }

  /**
   * Tạo transaction record
   */
  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(input.userId);

    const transaction = new Transaction();
    transaction.userId = input.userId;
    transaction.type = input.type;
    transaction.amount = input.amount;
    transaction.description = input.description;
    transaction.status = TransactionStatus.COMPLETED;
    transaction.referenceId = input.referenceId || '';
    transaction.referenceType = input.referenceType || '';
    transaction.balanceBefore = wallet.balance - input.amount; // trước khi trừ
    transaction.balanceAfter = wallet.balance;

    return await this.transactionRepository.save(transaction);
  }

  /**
   * Lịch sử giao dịch của user
   */
  async getTransactionHistory(userId: string, page: number = 0, size: number = 20) {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { userId, isDeleted: false } as any,
      skip: page * size,
      take: size,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      data: transactions.map((t) => ({
        id: t.id.toString(),
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        provider: t.provider,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        createdAt: t.createdAt,
      })),
      paging: {
        index: page,
        size,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
    };
  }
}