import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

@Injectable()
export class UtilService {
  constructor() {
    console.log('');
  }
  async getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async customLogger(functionName: string, data?: any, typeLogLevel?: string) {
    const currentDateTime = await this.getCurrentDateTime();
    let info = data || '';
    switch (typeLogLevel) {
      case 'info':
        console.log(`[${currentDateTime}] [${functionName}] -`, info);
        break;
      case 'error':
        console.log(`[${currentDateTime}] [${functionName}] - `, info);
        break;
      default:
        console.log(`[${currentDateTime}] [${functionName}] - `, info);
        break;
    }
  }
}
