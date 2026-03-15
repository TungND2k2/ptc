import { CloudResources } from '../enums/cloud-services';

export type CloudServiceConfig = {
  productCode: string;
  resource: CloudResources;
  queueName: string;
};
