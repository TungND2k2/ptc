import { SetMetadata } from '@nestjs/common';
import { Services } from '../enums/services';

//
export const SERVICE_KEY = 'service';
export const CONTROLLER_KEY = 'controller';
// eslint-disable-next-line prettier/prettier
export const ServiceInfo = (name: Services) => SetMetadata(SERVICE_KEY, name);
export const ControllerInfo = (name: string) =>
  SetMetadata(CONTROLLER_KEY, name);
