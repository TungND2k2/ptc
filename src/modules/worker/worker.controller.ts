import { Controller, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get('active')
  async getActiveWorkers() {
    const workers = await this.workerService.getActiveWorkers();
    return {
      count: workers.length,
      workers: workers.map(w => ({
        id: w.id,
        socketId: w.socketId,
        type: w.type,
        username: w.username,
        ipAddress: w.ipAddress,
        connectedAt: w.connectedAt,
      })),
    };
  }
}
