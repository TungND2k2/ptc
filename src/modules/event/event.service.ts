import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor() {
  }

  /**
   * Send message to RabbitMQ queue (for external AI workers)
   * Then save to Redis queue for persistence and failover
   * Returns true if sent successfully
   */
  async sendToQueue(queueName: string, pattern: string, data: any): Promise<boolean> {
    if (!queueName) {
      console.error('❌ Error sending to queue: queueName is required');
      return false;
    }

    if (!process.env.RABBITMQ_URL) {
      console.error('❌ Error sending to queue: RABBITMQ_URL is not set');
      return false;
    }

    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${process.env.RABBITMQ_URL}`],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });

    try {
      // 1. Publish to RabbitMQ queue
      await client.connect();
      await firstValueFrom(client.emit(pattern, data));
      console.log(`Sent via RabbitMQ - Pattern: ${pattern}, Queue: ${queueName}`);

      return true;
    } catch (error) {
      const message = error?.message || String(error);
      console.error(`❌ Error sending to queue: ${message}`);
      console.error(error);
      return false;
    } finally {
      client.close();
    }
  }

  /**
   * Send message to RabbitMQ queue (legacy method)
   */
  async sendToRabbitMQ(queueName: any, pattern: string, data: any) {
    const clientOptions = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${process.env.RABBITMQ_URL}`],
        queue: `${queueName}`,
        queueOptions: {
          durable: false,
        },
      },
    });
    await clientOptions.send(pattern, data).toPromise();
  }
}
