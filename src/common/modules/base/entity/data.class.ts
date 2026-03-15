import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

@Exclude()
export class DataHandler {
  @IsString() @IsOptional() @Expose() orgId = '';
  // appId
  @IsString() @IsOptional() @Expose() appId = '';
  // userId
  @IsString() @IsOptional() @Expose() userId = '';
  // projectId
  @IsString() @IsOptional() @Expose() projectId? = '';
  // staffCode
  @IsString() @IsOptional() @Expose() staffCode? = '';
  // role
  @IsString() @IsOptional() @Expose() role? = '';
  // roles
  @IsArray() @IsOptional() @Expose() roles?: string[] = [];
  // access Token
  @IsString() @IsOptional() @Expose() accessToken? = '';
  // attributes
  @IsString() @IsOptional() @Expose() attributes?: any = {};
  // request
  @IsOptional() @Expose() request?: any = {};
  // response
  @IsOptional() @Expose() response?: any = {};

  @IsOptional() @Expose() preData?: any = {};

  @IsOptional() @Expose() postData?: any = {};
}

@Exclude()
export class DataOwner {
  // orgId
  @IsString() @IsOptional() @Expose() orgId = '';
  // userId
  @IsString() @IsOptional() @Expose() userId = '';
}
