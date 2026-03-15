import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([]),
    TypeOrmModule.forFeature([]),
    WorkerModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventGateway],
  exports: [EventService, EventGateway],
})
export class EventModule {}
