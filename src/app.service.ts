import { Injectable } from '@nestjs/common';
import { App } from './app.entity';
import { Services } from './common/enums/services';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  app: App;
  constructor() {
    // Change App Id, App Name
    const appId = Services.EKYC;
    const appName = 'eKYC Backend API Service';
    this.app = new App(appId, appName);
  }

  getInfo(): App {
    return this.app;
  }
}
