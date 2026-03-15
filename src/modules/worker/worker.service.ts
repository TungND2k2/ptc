import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Worker } from './entity/worker.entity';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private workerRepository: MongoRepository<Worker>,
  ) {}

  /**
   * Deactivate all active workers with same IP address
   * Used to prevent duplicate connections from same IP
   */
  async deactivateWorkersByIP(ipAddress: string): Promise<number> {
    const result = await this.workerRepository.updateMany(
      { ipAddress, isActive: true } as any,
      {
        $set: {
          isActive: false,
          disconnectedAt: new Date(),
        },
      },
    );
    const modifiedCount = (result as any).modifiedCount || 0;
    if (modifiedCount > 0) {
      console.log(`Deactivated ${modifiedCount} old worker(s) with IP: ${ipAddress}`);
    }
    return modifiedCount;
  }

  /**
   * Register new worker connection
   */
  async registerWorker(data: {
    socketId: string;
    type: string;
    username: string;
    ipAddress: string;
    authMethod: string;
    metadata?: any;
  }): Promise<Worker> {
    // Deactivate any existing workers from same IP
    await this.deactivateWorkersByIP(data.ipAddress);

    const worker = this.workerRepository.create({
      ...data,
      connectedAt: new Date(),
      isActive: true,
    });

    await this.workerRepository.save(worker);
    console.log(`Worker registered in DB: ${worker.id}`);
    return worker;
  }

  /**
   * Mark worker as disconnected
   */
  async disconnectWorker(socketId: string): Promise<void> {
    await this.workerRepository.updateOne(
      { socketId } as any,
      {
        $set: {
          isActive: false,
          disconnectedAt: new Date(),
        },
      },
    );
    console.log(`Worker disconnected in DB: ${socketId}`);
  }

  /**
   * Get all active workers
   */
  async getActiveWorkers(): Promise<Worker[]> {
    return this.workerRepository.find({
      where: { isActive: true } as any,
    });
  }

  /**
   * Get worker by socket ID
   */
  async getWorkerBySocketId(socketId: string): Promise<Worker | null> {
    return this.workerRepository.findOne({
      where: { socketId } as any,
    });
  }

  /**
   * Clean up old disconnected workers (optional)
   */
  async cleanupOldWorkers(olderThanHours: number = 24): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

    await this.workerRepository.deleteMany({
      isActive: false,
      disconnectedAt: { $lt: cutoffDate },
    } as any);
  }
}
