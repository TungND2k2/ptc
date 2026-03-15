import { Result, SubscriptionActions } from '../enums/billing-management';
import {
  AccessProtocols,
  CloudResources,
  ContainerPortValueTypes as ContainerConfigValueTypes,
  DataUnits,
} from '../enums/cloud-services';

export type BaseMessagePayload = {
  requestAt: number;
  org?: {
    id: string;
    attributes?: {
      customerId: string;
      [key: string]: any;
    };
  };
  customerId?: string;
  user: {
    id: string;
    username?: string;
    email?: string;
    [key: string]: number | string | boolean;
  };
  transaction?: {
    id: string;
    code?: string;
    balances?: any[];
    paymentGateway?: {
      id: string;
      type: string;
      accountNumber?: string;
      [key: string]: number | string | boolean;
    };
    type?: string;
    totalAmount?: number;
    currency?: string;
    status?: string;
    createdAt?: Date;
  };
  subscription?: {
    id: string;
    action: SubscriptionActions;
    productCode: string;
    packageCode: string;
    createdAt: Date;
    expiredAt: Date;
    originalAmount: number;
    remainAmount?: number; // todo
    vatAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
  package?: {
    id: string;
    code: string;
    name: string;
    attributes: any;
  };
  service?: {
    resource: CloudResources;
    name: string;
    // Container Service
    containerId?: string;
    volumeId?: string;
    image?: string;
    ports?: {
      protocol: AccessProtocols;
      internalPort: string;
      publicPort: string | ContainerConfigValueTypes;
    }[];
    envs?: {
      name: string;
      value: string | ContainerConfigValueTypes;
    }[];
    volume?: {
      packageCode?: string;
      mapPath: string;
      capacity: {
        value: number;
        unit: string;
      };
    };
    cpu?: {
      value: number;
      unit: DataUnits;
    };
    ram?:
      | number
      | {
          value: number;
          unit: DataUnits;
        };
    gpu?: {
      code: string;
      value: number;
      unit: string;
    };
    // Object Storage & Container volume
    capacity?:
      | number
      | {
          value: number;
          unit: DataUnits;
        };
    [key: string]: any;
  };
  update?;
  result?: Result;
  [key: string]: any;
};

export type NotificationMessagePayload = {
  userId: string;
  customerId: string;
  to?: string | string[];
  toEmails?: string | string[];
  isMute?: any;
  template: string;
  data: {
    user?: {
      id: string;
      [key: string]: any;
    };
    org?: {
      id: string;
      [key: string]: any;
    };
    hideOnApp?: boolean; // Hide notification on Web App (Not display snackbar)
    [key: string]: any;
  };
};

export type UserKeycloakPayload = {
  phone?: string;
  username: string;
  owner: {
    userId: string;
    orgId: string;
  };
  code?: string;
  password?: string;
  module: string;
};
