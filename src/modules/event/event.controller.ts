import { Controller, Param, Post, Req, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { Patterns } from 'src/common/enums/patterns';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) { }

  @Post('/partner/:partnerId')
  async handleEventFromPartner(
    //@Body() data: CreateCustomerData,
    @Param('partnerId') partnerId: string,
    @Req() req,
  ): Promise<any> {
    const headers = req.headers;
    const queries = req.query;
    const body = req.body;
    return {};
  }

  @MessagePattern('ai.result.ocr')
  async handleOcrResult(@Payload() payload: any) {
    console.log('Received OCR result payload:', JSON.stringify(payload, null, 2));
    return this.handleResultEvent(payload, 'ai.result.ocr');
  }

  @MessagePattern('ai.result.liveness')
  async handleLivenessResult(@Payload() payload: any) {
    console.log('Received Liveness result payload:', JSON.stringify(payload, null, 2));
    return this.handleResultEvent(payload, 'ai.result.liveness');
  }

  @MessagePattern('ai.result.facematch')
  async handleFaceMatchResult(@Payload() payload: any) {
    console.log('Received FaceMatch result payload:', JSON.stringify(payload, null, 2));
    return this.handleResultEvent(payload, 'ai.result.facematch');
  }

  private async handleResultEvent(payload: any, pattern: string) {
    if (!payload || (payload.messageType && payload.messageType !== 'result')) {
      return 'ignored';
    }

    console.log(`Received AI result - Pattern: ${pattern}`);
    return 'ack';
  }
}
