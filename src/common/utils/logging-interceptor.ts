import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as amqp from 'amqplib';
import { SLM_Patterns } from '../enums/patterns/slm';
import { QueueNames } from '../enums/queues';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: async (response) => {
          try {
            const patternData = {
              pattern: SLM_Patterns.SEND_LOG,
              data: {
                user: {
                  roles: request.user.roles,
                  userId: request.user.userId,
                  orgId: request.user.orgId,
                  refOrgId: request.user.refOrgId,
                },
                contexts: request.contexts,
                preData: request.user.preData,
                postData: {
                  query: request.query,
                  param: request.params,
                  body: request.body,
                },
              },
            };
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            const queueName = QueueNames.LOG_SERVICE;

            await channel.assertQueue(queueName, { durable: false });

            const logMessage = { ...patternData, response };
            await channel.sendToQueue(
              queueName,
              Buffer.from(JSON.stringify(logMessage)),
              { persistent: true },
            );
            console.log('Message sent to the log queue successfully.');

            await channel.close();
            await connection.close();
          } catch (error) {
            console.error('Failed to send message to RabbitMQ:', error);
          }
        },
        error: (error) => {
          console.error('Error in API response:');
        },
      }),
    );
  }
}
