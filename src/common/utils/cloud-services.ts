import * as geoip from 'geoip-lite';
import { BadRequestException } from '@nestjs/common';
import { cloudServiceConfigs } from '../const/cloud-services';
import { CloudServiceConfig } from '../types/cloud-services';

export const getCloudServiceConfig = (
  productCode: string,
): CloudServiceConfig | undefined => {
  return cloudServiceConfigs.find(
    (c) => c.productCode.toLowerCase() === productCode.toLowerCase(),
  );
};
export const getLocationFromIP = async (ip: string) => {
  const geo = geoip.lookup(ip);
  return geo ? { latitude: geo.ll[0], longitude: geo.ll[1] } : null;
};
export const convertToMB = (capacity) => {
  const { value, unit } = capacity;

  switch (unit.toUpperCase()) {
    case 'GB':
      return value * 1024; // 1 GB = 1024 MB
    case 'TB':
      return value * 1024 * 1024; // 1 TB = 1024 * 1024 MB
    default:
      throw new BadRequestException('Unsupported unit. Please use GB or TB.');
  }
};
