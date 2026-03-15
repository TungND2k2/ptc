import { CloudResources } from '../enums/cloud-services';
import { QueueNames } from '../enums/queues';
import { Services } from '../enums/services';
import { CloudServiceConfig } from '../types/cloud-services';

export const cloudServiceConfigs: CloudServiceConfig[] = [
  {
    productCode: 'gpu-container',
    resource: CloudResources.Container,
    queueName:
      process.env.RABBITMQ_CSM || QueueNames.CSM_SERVICE || Services.CSM,
  },
  {
    productCode: 'cpu-container',
    resource: CloudResources.Container,
    queueName:
      process.env.RABBITMQ_CSM || QueueNames.CSM_SERVICE || Services.CSM,
  },
  {
    productCode: 'container-volume',
    resource: CloudResources.ContainerVolume,
    queueName:
      process.env.RABBITMQ_CSM || QueueNames.CSM_SERVICE || Services.CSM,
  },
  {
    productCode: 'object-storage',
    resource: CloudResources.ObjectStorage,
    queueName:
      process.env.RABBITMQ_SSM || QueueNames.SSM_SERVICE || Services.SSM,
  },
];
