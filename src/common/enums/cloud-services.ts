export enum DataUnits {
  Byte = 'byte',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}

export enum CloudResources {
  ObjectStorage = 'object-storage',
  PersonalStorage = 'personal-storage',
  Container = 'container',
  ContainerVolume = 'container-volume',
  BareMetal = 'bare-metal',
  Api = 'api',
}

export enum ContainerPortValueTypes {
  HostManaged = 'host-managed',
  RandomNumber = 'random-number',
  Random = 'random',
}

export enum AccessProtocols {
  TCP = 'tcp',
  UDP = 'udp',
  HTTP = 'http',
  SSH = 'ssh',
}
