import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

@Controller()
export class WorkerSendEvent {
  private interval;
  private intervalBot;
  private intervalReport;
  constructor() {}
  async terminate() {
    console.log(`Worker is terminating...`);
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.intervalBot) {
      clearInterval(this.intervalBot);
    }
    if (this.intervalReport) {
      clearInterval(this.intervalReport);
    }
  }

  async init(): Promise<void> {
    await this.start();
  }

  async start() {
    this.intervalBot = setInterval(async () => {}, 600000);
  }
}
