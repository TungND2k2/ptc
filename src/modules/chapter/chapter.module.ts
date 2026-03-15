import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { Chapter } from './entity/chapter.entity';
import { UploadModule } from '../upload/upload.module';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter]),
    UploadModule,
    forwardRef(() => PurchaseModule),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}