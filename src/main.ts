import {
  INestApplicationContext,
  ValidationPipe,
  VersioningType,
  Logger,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { urlencoded, json } from 'express';
import { AppModule } from './app.module';
import { AppMicroserviceModule } from './app-microservice.module';
import { AppCronModule } from './app-cron.module';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkerSendEvent } from './workers/queue-send-event.worker';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let worker = undefined;
let standAloneApp: INestApplicationContext;
const handleProcessKilled = async function (code) {
  console.log(`Process is killing by ${code}...`);
  if (worker) {
    await worker.terminate();
  }
  if (standAloneApp) {
    standAloneApp.close();
  }
  process.exit(0);
};

async function bootstrap() {
  const appType = process.env.APP_TYPE || 'api';
  const apiPort = process.env.API_PORT || 3000;
  const workerType = process.env.WORKER_TYPE || '';

  console.log(`App is starting in type '${appType}'`);
  console.log('Environment Variables Check:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- MONGODB_URL: ${process.env.MONGODB_URL ? '✓ Set' : '✗ Not Set'}`);
  console.log(`- EKYC_MANAGER_BASE_URL: ${process.env.EKYC_MANAGER_BASE_URL || '✗ Not Set'}`);
  console.log(`- EKYC_MANAGER_API_KEY: ${process.env.EKYC_MANAGER_API_KEY ? '✓ Set (***hidden***)' : '✗ Not Set'}`);
  console.log(`- REDIS_URL: ${process.env.REDIS_URL ? '✓ Set' : '✗ Not Set'}`);
  switch (appType) {
    case 'microservice-redis': {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppMicroserviceModule,
        {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:123zXc_-@192.168.1.211:5672'],
            queue: 'ekyc-service',
            noAck: false,
            queueOptions: {
              durable: true,
            },
          },
        },
      );
      await app.listen();
      console.log('Redis microservice is listening on redis_queue...');
      break;
    }
    case 'microservice': {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppMicroserviceModule,
        {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'ekyc-service',
            queueOptions: {
              durable: true,
            },
          },
        },
      );
      app.listen();
      console.log(' microservice is listening on ekyc-service...');
      break;
    }
    case 'cron': {
      await NestFactory.createApplicationContext(AppCronModule);
      console.log('Cron app is running...');
      break;
    }
    case 'worker': {
      console.log(`Worker Type '${workerType}'`);
      standAloneApp = await NestFactory.createApplicationContext(AppModule);
      switch (workerType) {
        case 'worker-send-event': {
          // Khởi tạo WorkerSendEvent với tham chiếu đến TaskService
          worker = new WorkerSendEvent();
          break;
        }
        default:
          break;
      }

      process.once('SIGINT', async function (code) {
        console.log('SIGINT received...');
        await handleProcessKilled(code);
      });

      process.once('SIGTERM', async function (code) {
        console.log('SIGTERM received...');
        await handleProcessKilled(code);
      });

      process.once('SIGABRT', async function (code) {
        console.log('SIGABRT received...');
        await handleProcessKilled(code);
      });

      process.on('uncaughtException', async (err) => {
        console.log(`Uncaught Exception: ${err.message}`);
        await handleProcessKilled(err.message);
      });

      await worker.init();
      break;
    }
    case 'api':
    default: {
      const app = await NestFactory.create(AppModule);

      // Enable CORS for frontend access
      app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });

      app.use(json({ limit: '50mb' }));
      app.use(urlencoded({ extended: true, limit: '50mb' }));
      app.useGlobalPipes(new ValidationPipe());

      // Swagger Configuration
      const config = new DocumentBuilder()
        .setTitle('PTC API')
        .setDescription('API Documentation for PTC - Web Nghe Truyện')
        .setVersion('1.0')
        .addTag('Auth', 'Đăng ký, Đăng nhập, OAuth')
        .addTag('Categories', 'Quản lý danh mục truyện')
        .addTag('Stories', 'Quản lý truyện')
        .addTag('Chapters', 'Quản lý chương truyện')
        .addTag('Upload', 'Upload file (S3 Presigned URL)')
        .addTag('Purchases', 'Mua chương truyện')
        .addTag('Transactions', 'Ví & Giao dịch')
        .addTag('UserProfiles', 'Hồ sơ người dùng')
        .addTag('StoryReviews', 'Đánh giá truyện')
        .addTag('Bookmarks', 'Bookmark truyện')
        .addTag('ListeningHistory', 'Lịch sử nghe')
        .addTag('Comments', 'Bình luận')
        .addTag('Banners', 'Banner quảng cáo')
        .addTag('Notifications', 'Thông báo')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
        },
      });

      console.log(`Swagger documentation available at http://localhost:${apiPort}/api-docs`);

      await app.listen(apiPort);
      break;
    }
  }
}
bootstrap();
