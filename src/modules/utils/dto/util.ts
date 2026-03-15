import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestMobileNumberData {
  @ApiProperty({ description: 'Application code' })
  @IsString()
  @IsNotEmpty()
  appCode: string;

  @ApiProperty({ description: 'Client ID' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Request ID' })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ description: 'Request token' })
  @IsString()
  @IsNotEmpty()
  requestToken: string;
}

export class GetCodeData {
  @ApiProperty({ description: 'Client ID' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Request ID' })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ description: 'Request token' })
  @IsString()
  @IsNotEmpty()
  requestToken: string;
}

export class RequestMobileNumbersResult {
  @Expose()
  id = '';

  @Expose()
  requestId = '';

  @Expose()
  clientId = '';

  @Expose()
  appCode = '';

  @Expose()
  number = '';

  @Expose()
  requestAt;

  @Expose()
  status;
}

export class GetCodeResult {
  @Expose()
  requestId = '';

  @Expose()
  clientId = '';

  @Expose()
  appCode = '';

  @Expose()
  number = '';

  @Expose()
  content = '';

  @Expose()
  requestAt;

  @Expose()
  receivedAt;

  @Expose()
  status;
}
