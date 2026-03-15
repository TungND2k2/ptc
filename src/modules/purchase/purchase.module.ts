import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './entity/purchase.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { ChapterModule } from '../chapter/chapter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    TransactionModule,
    forwardRef(() => ChapterModule),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}