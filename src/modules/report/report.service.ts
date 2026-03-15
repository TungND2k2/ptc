import { ObjectId } from 'mongodb';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Report } from './entity/bot.entity';

@Injectable()
export class ReportService extends BaseService<Report> {
  constructor(
    @InjectRepository(Report)
    private readonly reportService: MongoRepository<Report>,
  ) {
    super(reportService);
  }

  // async aggregateVM(pipeline): Promise<any[]> {
  //   const aggrResult = [];
  //   const arr = await this.tasksRepo.aggregate(pipeline);
  //   let aggrItem = undefined;
  //   do {
  //     aggrItem = await arr.next();
  //     if (aggrItem) {
  //       delete aggrItem._id;
  //       aggrResult.push(aggrItem);
  //     }
  //   } while (aggrItem != null);
  //   return aggrResult;
  // }

  // async revenueByProducts(
  //   year: number,
  //   month: number,
  //   handler: DataHandler,
  // ): Promise<any> {
  //   return [];
  // }
}
