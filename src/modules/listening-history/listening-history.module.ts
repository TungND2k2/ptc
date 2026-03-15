import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningHistoryService } from './listening-history.service';
import { ListeningHistoryController } from './listening-history.controller';
import { ListeningHistory } from './entity/listening-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningHistory])],
  controllers: [ListeningHistoryController],
  providers: [ListeningHistoryService],
  exports: [ListeningHistoryService],
})
export class ListeningHistoryModule {}