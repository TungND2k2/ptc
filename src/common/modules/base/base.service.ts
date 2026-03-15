import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { getTypeOf } from 'src/common/utils/object-helper';
import { MongoRepository, FindManyOptions } from 'typeorm';
import { Filter } from './constant/base.const';
import { FindManyFilter, FindAllResult } from './dto/find-many.dto';
import { DataHandler } from './entity/data.class';
import { logInfo } from 'src/common/utils/log-helper';

//
export interface ObjectLiteral {
  [key: string]: any;
}

@Injectable()
export class BaseService<T> {
  private _repo: MongoRepository<T>;
  constructor(repo) {
    this._repo = repo;
  }
  async findOne(id: string, handler: DataHandler): Promise<any> {
    if (handler)
      if (ObjectId.isValid(id)) {
        const item: any = await this._repo.findOneBy({
          _id: ObjectId.createFromHexString(id),
        });
        if (item === undefined || item === null || item.isDeleted === true) {
          throw new NotFoundException(`Resource id '${id}' not found!`);
        }
        // Handle check owner by permission
        if (typeof handler.request === 'object') {
          if (typeof handler.request.owner === 'object') {
            let isOwner = true;
            if (handler.request.owner.orgId === '{{orgId}}') {
              isOwner =
                item.owner !== undefined && item.owner.orgId === handler.orgId;
            }
            if (handler.request.owner.userId === '{{userId}}') {
              isOwner =
                item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '');
            }
            if (handler.roles[0] != process.env.APP_ROLE_UNI_OWNER) {
              if (!isOwner) {
                throw new ForbiddenException(
                  `You are not allow to access this resource id '${id}'`,
                );
              }
            }
          }
        }

        // Handle response transform by permission
        if (typeof handler.response === 'object') {
          for (const key in handler.response) {
            if (handler.response[key] === null) {
              delete item[key];
            }
          }
        }
        return item;
      } else {
        throw new NotFoundException(`Invalid id '${id}'`);
      }
  }

  async findOneByField(
    field: string,
    value: string,
    handler: DataHandler,
  ): Promise<any> {
    if (handler) {
      const item: any = await this._repo.findOneBy({ [field]: value });
      if (item === undefined || item.isDeleted === true) {
        throw new NotFoundException(
          `Resource with ${field} = '${value}' not found!`,
        );
      }
      // Handle check owner by permission
      if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          let isOwner = true;
          if (handler.request.owner.orgId === '{{orgId}}') {
            isOwner =
              item.owner !== undefined && item.owner.orgId === handler.orgId;
          }
          if (handler.request.owner.userId === '{{userId}}') {
            isOwner =
              item.owner !== undefined && item.owner.userId === handler.userId;
          }
          if (!isOwner) {
            throw new ForbiddenException(
              `You are not allow to access this resource with ${field} = '${value}'`,
            );
          }
        }
      }
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (const key in handler.response) {
          if (handler.response[key] === null) {
            delete item[key];
          }
        }
      }
      return item;
    }
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<T>> {
    const findManyOptions: FindManyOptions = {
      where: { isDeleted: { $in: [false, null] } },
      order: {},
      take: 0,
      skip: 0,
    };
    const findManyResult = new FindAllResult<T>();
    if (filter.where) {
      delete (filter.where as any).isDeleted;
      const queryKeyPattern =
        /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.(gte-date|lte-date|gte-number|lte-number|regex)$/;
      logInfo('', 'Filter.where :', filter.where);
      for (const key in filter.where) {
        if (filter.where.hasOwnProperty(key)) {
          const queryValue = filter.where[key];
          if (queryKeyPattern.test(key)) {
            const queryParts = key.split('.');
            const queryOperator = queryParts.pop();
            const queryName = queryParts.join('.');

            if (!findManyOptions.where[queryName]) {
              findManyOptions.where[queryName] = {};
            }

            switch (queryOperator) {
              case 'gte-date':
                findManyOptions.where[queryName]['$gte'] = new Date(queryValue);
                break;
              case 'lte-date':
                findManyOptions.where[queryName]['$lte'] = new Date(queryValue);
                break;
              case 'gte-number':
                findManyOptions.where[queryName]['$gte'] = parseInt(queryValue);
                break;
              case 'lte-number':
                findManyOptions.where[queryName]['$lte'] = parseInt(queryValue);
                break;
              case 'regex':
                findManyOptions.where[queryName]['$regex'] = new RegExp(
                  queryValue,
                  'i',
                ); // Thêm flag 'i'
                break;
              default:
                throw new BadRequestException(
                  `Unknown query operator "${queryOperator}" in "${key}"`,
                );
            }
          } else {
            if (Object.prototype.hasOwnProperty.call(filter.where, key)) {
              const value = filter.where[key];
              if (value !== '') {
                if (value === 'true') {
                  findManyOptions.where[key] = true;
                } else if (value === 'false') {
                  findManyOptions.where[key] = false;
                } else {
                  findManyOptions.where[key] = value;
                }
              }
            }
          }
        }
      }
    }
    if (filter.order) {
      findManyOptions.order = filter.order;
    }

    // Handle filter by permission
    if (filter.isShare != true) {
      if (handler.request) {
        if (typeof handler.request.where === 'object') {
          for (const key in handler.request.where) {
            if (
              Object.prototype.hasOwnProperty.call(handler.request.where, key)
            ) {
              const value = handler.request.where[key];
              const dataType = getTypeOf(value);
              const varRegex = /{{(userId|appId|orgId)}}/;
              const replaceVar = (str, handler) =>
                str
                  .replace('{{orgId}}', handler.orgId)
                  .replace('{{appId}}', handler.appId)
                  .replace('{{userId}}', handler.userId);

              switch (dataType) {
                case 'object':
                case 'array': {
                  const valueString = JSON.stringify(value);
                  if (varRegex.test(valueString)) {
                    findManyOptions.where[key] = JSON.parse(
                      replaceVar(valueString, handler),
                    );
                  } else {
                    findManyOptions.where[key] = value;
                  }
                  break;
                }
                case 'string': {
                  if (varRegex.test(value)) {
                    findManyOptions.where[key] = replaceVar(value, handler);
                  } else {
                    findManyOptions.where[key] = value;
                  }
                  break;
                }
                default: {
                  findManyOptions.where[key] = value;
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (filter.paging.index < 0) {
      filter.paging.index = Filter.PageIndex;
    }
    if (filter.paging.size <= 0 || filter.paging.size > Filter.MaxPageSize) {
      filter.paging.size = Filter.PageSize;
    }
    findManyResult.paging.index = filter.paging.index;
    findManyResult.paging.size = filter.paging.size;
    findManyOptions.take = findManyResult.paging.size;
    findManyOptions.skip =
      findManyResult.paging.index * findManyResult.paging.size;
    findManyResult.paging.totalItems = await this._repo.count(
      findManyOptions.where,
    );
    findManyResult.paging.totalPages = Math.ceil(
      findManyResult.paging.totalItems / findManyResult.paging.size,
    );
    if (filter.select) {
      findManyOptions.select = filter.select;
    }
    if (handler) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      logInfo(
        `*`,
        `baseService.findManyWithPaging -> findManyOptions`,
        findManyOptions,
      );
      const items = await this._repo.find(findManyOptions);
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          for (const key in handler.response) {
            if (handler.response[key] === null) {
              delete item[key];
            }
          }
        }
      }
      findManyResult.data = items;
    }
    return findManyResult;
  }

  async createOne(data: any, handler: DataHandler): Promise<any> {
    logInfo('Data createOne :', data);
    data.createdBy = JSON.parse(JSON.stringify(handler));
    data.createdAt = new Date();
    data.isDeleted = false;

    // Delete roles, request, response to not store on createdAt
    delete data.createdBy.roles;
    delete data.createdBy.request;
    delete data.createdBy.response;
    delete data.createdBy.accessToken;

    // Set owner default value
    if (data.owner === undefined) {
      data.owner = {
        orgId: '',
        userId: '',
      };
    }

    // Handle request transform by permission
    if (typeof handler.request === 'object') {
      if (typeof handler.request.owner === 'object') {
        if (handler.request.owner.orgId === null) {
          data.owner.orgId = '';
        }
        if (handler.request.owner.userId === null) {
          data.owner.userId = '';
        }
        if (handler.request.owner.orgId === '{{orgId}}') {
          data.owner.orgId = handler.orgId;
        }
        if (handler.request.owner.userId === '{{userId}}') {
          data.owner.userId = handler.userId;
        }
      }
    }
    if (
      data.owner.orgId === undefined ||
      data.owner.orgId === '' ||
      data.owner.userId === undefined ||
      data.owner.userId === ''
    ) {
      throw new BadRequestException(`Owner of resource is not defined!`);
    }

    try {
      const createDataResult = await this._repo.save(data);
      // Handle response transform by permission
      if (typeof handler.response === 'object') {
        for (const key in handler.response) {
          if (handler.response[key] === null) {
            delete createDataResult[key];
          }
        }
      }
      return createDataResult;
    } catch (error) {
      let errorMessage = 'Error in create new data!';
      switch (error.code) {
        case 11000: {
          errorMessage = `Duplicate key`;
          // TODO: Xử lý hiển thị field và value bị duplicate ra message.
          break;
        }
      }
      /* for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          const element = error[key];
          console.log(`${key}:`, element);
        }
      } */
      throw new BadRequestException(errorMessage);
    }
  }

  async createMany(data: any[], handler: DataHandler): Promise<any> {
    const createManyResult: {
      successCount: number;
      failureCount: number;
    } = {
      successCount: 0,
      failureCount: 0,
    };
    const items: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      item.createdBy = JSON.parse(JSON.stringify(handler));
      item.createdAt = new Date();
      item.isDeleted = false;

      // Delete roles, request, response to not store on createdAt
      delete item.createdBy.roles;
      delete item.createdBy.request;
      delete item.createdBy.response;

      // Set owner default value
      if (item.owner === undefined) {
        item.owner = {
          orgId: '',
          userId: '',
        };
      }

      // Handle request transform by permission
      if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          if (handler.request.owner.orgId === null) {
            item.owner.orgId = '';
          }
          if (handler.request.owner.userId === null) {
            item.owner.userId = '';
          }
          if (handler.request.owner.orgId === '{{orgId}}') {
            item.owner.orgId = handler.orgId;
          }
          if (handler.request.owner.userId === '{{userId}}') {
            item.owner.userId = handler.userId;
          }
        }
      }
      if (
        item.owner.orgId === undefined ||
        item.owner.orgId === '' ||
        item.owner.userId === undefined ||
        item.owner.userId === ''
      ) {
        //throw new BadRequestException(`Owner of resource is not defined!`);
        createManyResult.failureCount++;
      } else {
        items.push(item);
      }
    }

    if (items.length > 0) {
      try {
        const createDataResult = await this._repo.save(items);
        createManyResult.successCount = createDataResult.length;
      } catch (error) {
        createManyResult.failureCount = data.length;
      }
    }

    return createManyResult;
  }

  async updateOne(id: string, data: any, handler: DataHandler): Promise<any> {
    if (ObjectId.isValid(id)) {
      const item: any = await this._repo.findOneBy({
        _id: ObjectId.createFromHexString(id),
      });
      if (item === undefined || item === null || item.isDeleted === true) {
        throw new NotFoundException(`Resource id '${id}' not found!`);
      }
      console.log(handler);
      handler.preData = item;
      // Handle check owner by permission
      if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          let isOwner = true;
          if (handler.request.owner.orgId === '{{orgId}}') {
            isOwner =
              (item.owner !== undefined &&
                item.owner.orgId === handler.orgId) ||
              item.owner === undefined;
          }
          if (handler.request.owner.userId === '{{userId}}') {
            isOwner =
              (item.owner !== undefined &&
                (item.owner.userId === handler.userId ||
                  item.owner.userId === '')) ||
              item.owner === undefined;
          }
          if (handler.request.isUniOwner === true) {
            isOwner = true;
          }
          if (!isOwner) {
            throw new ForbiddenException(
              `You are not allow to access this resource id '${id}'`,
            );
          }
        }
      }
      data.changedAt = new Date();
      data.changedBy = JSON.parse(JSON.stringify(handler));

      // Delete roles, request, response to not store on changedBy
      delete data.changedBy.roles;
      delete data.changedBy.request;
      delete data.changedBy.response;
      delete data.changedBy.accessToken;

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          item[key] = value;
        }
      }
      try {
        const updateResult = await this._repo.update(id, data);
        if (updateResult.affected) {
          // Handle response transform by permission
          if (typeof handler.response === 'object') {
            for (const key in handler.response) {
              if (handler.response[key] === null) {
                delete item[key];
              }
            }
          }
          return item;
        } else {
          throw new InternalServerErrorException(
            `Update item id '${id}' failed!`,
          );
        }
      } catch (error) {
        let errorMessage = 'Error in create new data!';
        switch (error.code) {
          case 11000: {
            errorMessage = `Duplicate key`;
            // TODO: Xử lý hiển thị field và value bị duplicate ra message.
            break;
          }
        }
        /* for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          const element = error[key];
          console.log(`${key}:`, element);
        }
      } */
        throw new BadRequestException(errorMessage);
      }
    } else {
      throw new NotFoundException(`Invalid id '${id}'`);
    }
  }

  async updateMany(
    condition: { [key: string]: any },
    data: any,
    handler: DataHandler,
  ): Promise<{
    modifiedCount: number;
    upsertedCount: number;
    matchedCount: number;
  }> {
    delete handler.accessToken;

    console.log(handler.request);
    data.changedAt = new Date();
    data.changedBy = JSON.parse(JSON.stringify(handler));

    // Delete roles, request, response to not store on changedBy
    delete data.changedBy.roles;
    delete data.changedBy.request;
    delete data.changedBy.response;

    try {
      const updateOptions = {
        $set: { ...data },
      };
      const updateResult = await this._repo.updateMany(
        condition,
        updateOptions,
      );
      const result = {
        modifiedCount: updateResult.modifiedCount || 0,
        upsertedCount: updateResult.upsertedCount || 0,
        matchedCount: updateResult.matchedCount || 0,
      };
      return result;
    } catch (error) {
      let errorMessage = 'Error in update many data!';
      switch (error.code) {
        default: {
          errorMessage = ``;
          break;
        }
      }
      throw new BadRequestException(errorMessage);
    }
  }

  async deleteOne(id: string, handler: DataHandler): Promise<any> {
    if (ObjectId.isValid(id)) {
      const item: any = await this._repo.findOneBy({
        _id: ObjectId.createFromHexString(id),
      });
      const data: any = {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: JSON.parse(JSON.stringify(handler)),
      };

      // Delete roles, request, response to not store on changedBy
      delete data.deletedBy.roles;
      delete data.deletedBy.request;
      delete data.deletedBy.response;

      if (item === undefined || item === null || item.isDeleted === true) {
        throw new NotFoundException(`Resource id '${id}' not found!`);
      }
      // Handle check owner by permission
      if (typeof handler.request === 'object') {
        if (typeof handler.request.owner === 'object') {
          let isOwner = true;
          if (handler.request.owner.orgId === '{{orgId}}') {
            isOwner =
              item.owner !== undefined && item.owner.orgId === handler.orgId;
          }
          if (handler.request.owner.userId === '{{userId}}') {
            isOwner =
              item.owner !== undefined &&
              (item.owner.userId === handler.userId ||
                item.owner.userId === '');
          }
          if (!isOwner) {
            throw new ForbiddenException(
              `You are not allow to access this resource id '${id}'`,
            );
          }
        }
      }

      try {
        console.log(`🔄 Before update - item.isDeleted: ${item.isDeleted}`);
        console.log(`🔄 Data to apply:`, data);
        console.log(
          `🔄 Attempting to soft delete item ,${id}...`,
          { _id: ObjectId.createFromHexString(id) },
          { $set: data },
        );
        // Thử cách updateOne trực tiếp
        const updateResult = await this._repo.updateOne(
          { _id: ObjectId.createFromHexString(id) },
          { $set: data },
        );

        console.log(`🔄 UpdateOne result:`, {
          acknowledged: updateResult.acknowledged,
          modifiedCount: updateResult.modifiedCount,
          matchedCount: updateResult.matchedCount,
        });

        // Verify lại bằng cách query từ database
        const verifyItem: any = await this._repo.findOneBy({
          _id: ObjectId.createFromHexString(id),
        });
        console.log(
          `🔍 Verify from DB after updateOne - verifyItem.isDeleted: ${verifyItem?.isDeleted}`,
        );
        console.log(`🔍 Verify from DB - deletedAt: ${verifyItem?.deletedAt}`);

        if (updateResult.modifiedCount > 0 && verifyItem?.isDeleted === true) {
          console.log(
            `✅ Successfully soft deleted item ${id} using updateOne`,
          );
          return {
            id,
            deletedAt: verifyItem.deletedAt,
          };
        } else {
          throw new InternalServerErrorException(
            `Delete item id '${id}' failed! Modified count: ${updateResult.modifiedCount}, DB isDeleted: ${verifyItem?.isDeleted}`,
          );
        }
      } catch (error) {
        console.error(`❌ Error deleting item ${id}:`, error.message);
        throw new InternalServerErrorException(
          `Delete item id '${id}' failed: ${error.message}`,
        );
      }
    } else {
      throw new NotFoundException(`Invalid id '${id}'`);
    }
  }
}
