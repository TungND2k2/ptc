# eKYC Backend API

Backend API service cho hệ thống eKYC (Electronic Know Your Customer) được xây dựng trên NestJS framework.

## 📚 Documentation

- **📖 [API Documentation](./API-DOCUMENTATION.md)** - Tài liệu API đầy đủ, chi tiết từng endpoint
- **🚀 [Quick Start Guide](./docs/QUICK_START.md)** - Hướng dẫn bắt đầu nhanh với curl examples
- **🔧 [Swagger UI](http://localhost:3000/api-docs)** - Interactive API documentation (sau khi start server)
- **📮 [Postman Collection](./postman/eKYC-API-Collection.json)** - Import vào Postman để test
- **🎨 [Frontend Test UI](./frontend/index.html)** - Giao diện test workflow hoàn chỉnh

## Mô tả

Dịch vụ backend cung cấp các API để quản lý quy trình xác thực danh tính điện tử (eKYC), bao gồm quản lý phiên làm việc, tài liệu, công việc xử lý AI, kết quả xác minh, quyết định, đánh giá và theo dõi audit.

## Công nghệ

- **Framework**: NestJS v10.4.15
- **Database**: MongoDB 6.11.0 với Mongoose
- **Message Queue**: RabbitMQ (amqplib)
- **Cache**: Redis (ioredis)
- **Documentation**: Swagger/OpenAPI v8.0.7
- **Storage**: AWS S3 với presigned URLs
- **Language**: TypeScript 5.7.2
- **Auth**: JWT, Passport, Keycloak
- **WebSocket**: Socket.IO v4.8.1

## Cấu trúc Modules

### Core Modules
- **Session**: Quản lý phiên eKYC (tạo, cập nhật, theo dõi)
- **Artifact**: Quản lý tài liệu/file (upload S3, presigned URLs)
- **Job**: Quản lý công việc AI (OCR, Liveness, Face Match)
- **JobResult**: Lưu trữ kết quả xử lý từ AI tasks
- **Decision**: Đánh giá tự động và quyết định phê duyệt/từ chối
- **Review**: Quản lý đánh giá thủ công (manual review)
- **AuditEvent**: Audit log và event tracking
- **Event**: WebSocket real-time events

### Utility Modules
- **Utils**: Các tiện ích chung
- **Report**: Báo cáo và thống kê
- **Worker**: Background workers cho AI processing
- **Redis**: Cache management

## API Documentation

### Swagger UI
Interactive API documentation có sẵn tại:

```
http://localhost:3000/api-docs
```

Swagger UI cung cấp:
- ✅ Chi tiết đầy đủ về các endpoints với examples
- ✅ Request/Response schemas tự động từ DTOs
- ✅ Bearer token authentication
- ✅ Try-it-out functionality
- ✅ Mô tả chi tiết workflow bằng tiếng Việt

### Tài liệu đầy đủ
Xem file [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) để có:
- 📋 Workflow hoàn chỉnh từng bước
- 📝 Ví dụ request/response cho mọi endpoint
- 🔐 Authentication guide
- ❌ Error codes và handling
- 💡 Best practices

## Tính năng chính

### 1. S3 Presigned URL Upload
- Generate presigned URLs để upload file trực tiếp lên S3
- Xác thực upload completion
- Quản lý metadata file (mime type, size, checksum)

### 2. AI Task Processing
- Submit tasks đến AI/ML services
- Polling kết quả xử lý
- Lưu trữ structured results

### 3. Decision Engine
- Tự động evaluate decisions dựa trên business rules
- Manual override capability
- Risk scoring và reason codes

### 4. Audit Tracing
- Full audit trail cho mọi session
- Event tracking (actor, action, payload)
- Compliance reporting

## Cài đặt

```bash
$ npm install
```

## Cấu hình Environment Variables

Tạo file `.env` với các biến sau:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ekyc

# AWS S3
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_END_POINT=https://s3.amazonaws.com
S3_BUCKET=your-bucket-name
S3_REGION=ap-southeast-1

# Server
PORT=3000
NODE_ENV=development
```

## Chạy ứng dụng

```bash
# Development mode
$ npm run start

# Watch mode (auto-reload)
$ npm run start:dev

# Production mode
$ npm run start:prod

# Worker mode
$ npm run start-worker:dev 

# API mode
$ npm run start-api:dev 

# Microservice mode
$ npm run start-mic:dev
```

## Build

```bash
# Build production
$ npm run build

# Format code
$ npm run format

# Lint code
$ npm run lint
```

## API Endpoints

### Sessions
- `POST /sessions` - Tạo session mới
- `GET /sessions/:id` - Lấy thông tin session
- `PATCH /sessions/:id` - Cập nhật session
- `DELETE /sessions/:id` - Xóa session
- `POST /sessions/:sessionId/events` - Log events cho session

### Artifacts
- `POST /artifacts` - Tạo artifact record
- `PATCH /artifacts/:id` - Cập nhật artifact
- `DELETE /artifacts/:id` - Xóa artifact
- `POST /artifacts/presign` - Generate presigned upload URL
- `POST /artifacts/complete` - Xác nhận upload hoàn tất
- `GET /artifacts/session/:sessionId` - Lấy artifacts theo session

### Jobs
- `POST /jobs` - Tạo job mới
- `GET /jobs/:id` - Lấy thông tin job
- `PATCH /jobs/:id` - Cập nhật job
- `DELETE /jobs/:id` - Xóa job
- `POST /jobs/tasks/:taskType` - Submit AI task
- `GET /jobs/tasks/:taskId` - Kiểm tra trạng thái task

### Decisions
- `POST /decisions` - Tạo decision
- `GET /decisions/:id` - Lấy thông tin decision
- `PATCH /decisions/:id` - Cập nhật decision
- `POST /decisions/evaluate/:sessionId` - Auto evaluate decision
- `POST /decisions/override/:sessionId` - Manual override decision

### Reviews
- `POST /reviews` - Tạo review mới
- `GET /reviews/:id` - Lấy thông tin review
- `PATCH /reviews/:id` - Cập nhật review

### Audit Events
- `POST /audit-events` - Tạo audit event
- `GET /audit-events/:id` - Lấy thông tin event
- `GET /audit-events/trace/:sessionId` - Lấy full audit trail

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# Build container
$ ./build-container.sh

# Build với PM2
$ ./build-pm2.sh
```

## Workflow eKYC

1. **Khởi tạo**: Tạo Session mới
2. **Upload**: Generate presigned URL và upload artifacts (documents, selfies)
3. **Xử lý**: Submit AI tasks để verify documents và face matching
4. **Đánh giá**: Hệ thống tự động evaluate hoặc route đến manual review
5. **Quyết định**: Approve/Reject session dựa trên kết quả
6. **Audit**: Track toàn bộ quá trình trong audit events

## License

MIT licensed.
