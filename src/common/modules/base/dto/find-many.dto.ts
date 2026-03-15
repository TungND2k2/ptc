import { IsArray, IsBoolean, IsObject, Matches } from 'class-validator';
import { Filter } from '../constant/base.const';

export class FindManyFilter {
  @IsArray()
  select: string[] = [];

  @IsObject()
  where: {
    [key: string]: any;
  } = {};

  @IsObject()
  order: {
    [key: string]: any;
  } = {};

  @IsBoolean()
  isShare: boolean = false;

  @IsObject()
  paging: {
    index: number;
    size: number;
  } = {
    index: Filter.PageIndex,
    size: Filter.PageSize,
  };
}

export class FindAllResult<T> {
  @IsArray()
  data: T[] = [];

  @IsObject()
  paging: {
    index: number;
    size: number;
    totalPages: number;
    totalItems: number;
  } = {
    index: Filter.PageIndex,
    size: Filter.PageSize,
    totalPages: 0,
    totalItems: 0,
  };
}

export class FindTopData<T> {
  @IsArray()
  data: T[] = [];
}

export class QueriesDto {
  [key: string]: number | Date | string | boolean;
}
