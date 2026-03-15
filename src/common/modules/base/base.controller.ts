import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Filter } from './constant/base.const';
import { FindManyFilter } from './dto/find-many.dto';
import { DataHandler } from './entity/data.class';

export class BaseController {
  private _service;
  constructor(service) {
    this._service = service;
  }

  async findOne(id: string, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._service.findOne) {
      return await this._service.findOne(id, handler);
    } else {
      throw new NotFoundException(`Method 'findOne' is not found!`);
    }
  }
  async createOne(data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._service.createOne) {
      return await this._service.createOne(data, handler);
    } else {
      throw new NotFoundException(`Method 'createOne' is not found!`);
    }
  }

  async createMany(data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._service.createMany) {
      return await this._service.createMany(data, handler);
    } else {
      throw new NotFoundException(`Method 'createMany' is not found!`);
    }
  }

  async findManyWithPaging(queries, req): Promise<any> {
    const handler = req.user || new DataHandler();
    const filter = new FindManyFilter();
    filter.order = queries?.orderBy || {};
    filter.paging.index = parseInt(queries?.pageIndex || Filter.PageIndex);
    filter.paging.size = parseInt(queries?.pageSize || Filter.PageSize);

    delete queries?.orderBy;
    delete queries?.pageIndex;
    delete queries?.pageSize;

    filter.where = queries;
    if (this._service.findManyWithPaging) {
      return await this._service.findManyWithPaging(filter, handler);
    } else {
      throw new NotFoundException(`Method 'findManyWithPaging' is not found!`);
    }
  }

  async updateOne(id, data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._service.updateOne) {
      return await this._service.updateOne(id, data, handler);
    } else {
      throw new NotFoundException(`Method 'updateOne' is not found!`);
    }
  }
  async deleteOne(id: string, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._service.deleteOne) {
      return await this._service.deleteOne(id, handler);
    } else {
      throw new NotFoundException(`Method 'deleteOne' is not found!`);
    }
  }
}
