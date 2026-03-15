import { Methods } from '../enums/methods';
import { Roles } from '../enums/roles';
import { Services } from '../enums/services';
import { Controllers } from 'src/common/enums/controllers';

export type BasicObject = { [key: string]: number | Date | string | boolean };
export type MixedObject = { [key: string]: any };
export type Permission = {
  role: Roles;
  service: Services;
  controller: string;
  method: string;
  request?: any;
  response?: any;
};

export type Methods = {
  [key: string]: string;
};
